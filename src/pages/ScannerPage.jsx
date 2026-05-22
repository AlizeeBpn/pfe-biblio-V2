import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserMultiFormatOneDReader, BarcodeFormat } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import { IconArrowLeft, IconCamera, IconCameraOff, IconLoader2 } from '@tabler/icons-react';
import BookBottomSheet from '../components/BookBottomSheet';
import { BOOKS } from '../data/books';

/* ── Fallback si l'API ne trouve rien ── */
const FALLBACK_BOOK = {
  title:     'Livre non trouvé',
  author:    'Auteur inconnu',
  cover:     null,
  genres:    '',
  available: true,
  rating:    null,
  pages:     '',
  synopsis:  "Ce livre n'a pas été trouvé dans notre base de données.",
  isbn:      '',
  publisher: '',
};

/* ── Fetch book info from Google Books API (no key needed) ── */
async function fetchBookByISBN(isbn) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`;
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const data = await resp.json();
  if (!data.totalItems || !data.items?.length) return null;

  const info = data.items[0].volumeInfo;

  /* Cover — prefer larger image, force HTTPS */
  const rawCover =
    info.imageLinks?.extraLarge ??
    info.imageLinks?.large ??
    info.imageLinks?.medium ??
    info.imageLinks?.thumbnail ??
    null;
  const cover = rawCover
    ? rawCover.replace(/^http:/, 'https:').replace('&edge=curl', '')
    : null;

  /* Publisher + date */
  const pubParts = [info.publisher, info.publishedDate].filter(Boolean);

  return {
    title:     info.title ?? 'Titre inconnu',
    author:    info.authors?.join(', ') ?? 'Auteur inconnu',
    cover,
    genres:    info.categories?.join(',') ?? '',
    available: true,
    rating:    info.averageRating ?? null,
    pages:     info.pageCount?.toString() ?? '',
    synopsis:  info.description ?? '',
    isbn,
    publisher: pubParts.join(', '),
  };
}

/* ── Corner marker (L-shaped) for the scan viewfinder ── */
function Corner({ pos }) {
  const base = {
    position:    'absolute',
    width:       '24px',
    height:      '24px',
    borderColor: 'var(--primary-8)',
    borderStyle: 'solid',
  };
  const corners = {
    tl: { top: -2, left: -2,    borderWidth: '3px 0 0 3px', borderRadius: '4px 0 0 0' },
    tr: { top: -2, right: -2,   borderWidth: '3px 3px 0 0', borderRadius: '0 4px 0 0' },
    bl: { bottom: -2, left: -2, borderWidth: '0 0 3px 3px', borderRadius: '0 0 0 4px' },
    br: { bottom: -2, right: -2,borderWidth: '0 3px 3px 0', borderRadius: '0 0 4px 0' },
  };
  return <div style={{ ...base, ...corners[pos] }} />;
}

/*
 * States:
 *   'idle'       — waiting for user to tap "Autoriser"
 *   'requesting' — getUserMedia in flight
 *   'scanning'   — camera active, reading barcodes
 *   'fetching'   — barcode found, API call in progress
 *   'scanned'    — book data ready, sheet is open
 *   'denied'     — permission refused
 *   'error'      — other camera error
 */
export default function ScannerPage({ onBack, onBookSelect }) {
  /* getUserMedia requires a secure context (HTTPS or localhost).
     On mobile via local IP (HTTP), we show a clear message instead of crashing. */
  if (!window.isSecureContext) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(180deg, var(--secondary-2) 0%, var(--neutral-2) 49.04%), linear-gradient(180deg, #F4FBFB 0%, #F9F9FA 49%, #F9F9FA 100%), var(--secondary-12)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          backgroundColor: 'var(--color-white)', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px',
        }}>
          <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onBack}
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'var(--neutral-4)', borderRadius: 'var(--br-round)', border: 'none', outline: 'none', cursor: 'pointer' }}>
            <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-title)" />
          </motion.button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: 'var(--color-text-title)' }}>
            Recherche par scan
          </span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '32px' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: 'var(--br-round)', backgroundColor: 'var(--warning-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCameraOff size={44} strokeWidth={1.5} color="var(--warning-10)" />
          </div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', margin: 0 }}>
              Scanner indisponible
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-body)', margin: 0, maxWidth: '280px' }}>
              La caméra requiert une connexion sécurisée. Sur mobile, accède au site via{' '}
              <strong>localhost</strong> ou connecte ton téléphone en USB avec le port-forwarding Chrome.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const videoRef        = useRef(null);
  const streamRef       = useRef(null);   // holds the MediaStream — reused by ZXing
  const controlsRef     = useRef(null);
  const isProcessingRef = useRef(false);  // debounce — prevents multi-fire from ZXing
  const [phase,       setPhase]       = useState('idle');
  const [scannedBook, setScannedBook] = useState(null);

  /* ── Full cleanup: stop ZXing controls + kill camera tracks ── */
  const stopAll = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopAll(), [stopAll]);

  /* ── Request permission AND start scanner in one shot ──────────
     Key insight: we keep the stream open (no .stop()) and pass it
     directly to ZXing via decodeFromStream — one camera open only. */
  const handleRequestPermission = async () => {
    setPhase('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
      });
      streamRef.current = stream;
      setPhase('scanning'); // triggers useEffect below
    } catch (err) {
      const name = err?.name ?? '';
      setPhase(
        name === 'NotAllowedError' || name === 'PermissionDeniedError'
          ? 'denied'
          : 'error'
      );
    }
  };

  /* ── Start ZXing reader once phase = 'scanning' ── */
  useEffect(() => {
    if (phase !== 'scanning') return;
    if (!videoRef.current || !streamRef.current) return;

    let mounted = true;

    /* EAN-13 / EAN-8 only — avoids testing 15+ formats per frame */
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
    ]);
    const reader = new BrowserMultiFormatOneDReader(hints);

    /* Reset debounce flag each time we (re)start scanning */
    isProcessingRef.current = false;

    /* decodeFromStream reuses the existing MediaStream — no second getUserMedia */
    reader
      .decodeFromStream(
        streamRef.current,
        videoRef.current,
        (result, _err, controls) => {
          /* ① Debounce — ZXing fires callback repeatedly; ignore if already processing */
          if (!mounted || !result) return;
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;

          /* ② Stop scanner immediately so it stops reading barcodes */
          controls.stop();

          const isbn = result.getText();

          /* ③ Enter loading state */
          setPhase('fetching');

          /* ④ 800ms mock — look up book locally first, fallback to FALLBACK_BOOK */
         /* ④ 800ms mock — Recherche ultra-simplifiée */
          /* ④ 800ms mock — Mode Démonstration Infailible */
          setTimeout(() => {
            // 1. On nettoie l'ISBN scanné
            const cleanScannedIsbn = isbn.replace(/\D/g, '').trim();

            // 2. On cherche dans ton fichier BOOKS.js
            const localBook = BOOKS.find(b => {
              const cleanLocalIsbn = b.isbn?.toString().replace(/\D/g, '').trim();
              return cleanLocalIsbn === cleanScannedIsbn;
            });

            if (localBook) {
              // SCÉNARIO A : C'est un des livres de ta liste
              setScannedBook(localBook);
            } else {
              // SCÉNARIO B : Livre inconnu -> On "force" l'affichage du Petit Prince (ID: 1)
              // Cela permet de montrer que ton interface de fiche livre fonctionne à chaque fois !
              const demoBook = BOOKS.find(b => b.id === 1); 
              setScannedBook(demoBook);
              
              // Optionnel : Tu peux modifier le titre pour dire que c'est une démo
              // setScannedBook({ ...demoBook, title: "[Démo] " + demoBook.title });
            }

            setPhase('scanned');
          }, 800);
        }
      )
      .then((controls) => { if (mounted) controlsRef.current = controls; })
      .catch(() => { if (mounted) setPhase('error'); });

    return () => { mounted = false; };
  }, [phase]);

  const handleViewBook = () => {
    setPhase('idle');
    onBookSelect?.(scannedBook ?? FALLBACK_BOOK);
  };

  /* ── Shared header ── */
  const Header = (
    <div
      style={{
        backgroundColor: 'var(--color-white)',
        flexShrink:      0,
        display:         'flex',
        alignItems:      'center',
        gap:             '12px',
        padding:         '16px 20px',
        zIndex:          10,
      }}
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        style={{
          width:           '40px',
          height:          '40px',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          backgroundColor: 'var(--neutral-4)',
          borderRadius:    'var(--br-round)',
          border:          'none',
          outline:         'none',
          cursor:          'pointer',
          flexShrink:      0,
        }}
      >
        <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-title)" />
      </motion.button>

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize:   '16px',
        fontWeight: 700,
        lineHeight: 1.5,
        color:      'var(--color-text-title)',
      }}>
        Recherche par scan
      </span>
    </div>
  );

  /* ══════════════════════════════════════════════════
     PERMISSION REQUEST SCREEN  (idle | requesting)
  ══════════════════════════════════════════════════ */
  if (phase === 'idle' || phase === 'requesting') {
    return (
      <div style={{
        position:        'fixed',
        inset:           0,
        background: 'linear-gradient(180deg, var(--secondary-2) 0%, var(--neutral-2) 49.04%), linear-gradient(180deg, #F4FBFB 0%, #F9F9FA 49%, #F9F9FA 100%), var(--secondary-12)',
        display:         'flex',
        flexDirection:   'column',
      }}>
        {Header}

        <div style={{
          flex:           1,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '24px',
          padding:        '32px',
        }}>
          {/* Camera icon */}
          <div style={{
            width:           '88px',
            height:          '88px',
            borderRadius:    'var(--br-round)',
            backgroundColor: 'var(--primary-3)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}>
            <IconCamera size={44} strokeWidth={1.5} color="var(--primary-10)" />
          </div>

          {/* Text */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{
              fontFamily: 'var(--font-brand)',
              fontSize:   '20px',
              fontWeight: 700,
              lineHeight: 1.4,
              color:      'var(--color-text-title)',
              margin:     0,
            }}>
              Accès à la caméra requis
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '14px',
              fontWeight: 400,
              lineHeight: 1.6,
              color:      'var(--color-text-body)',
              margin:     0,
              maxWidth:   '280px',
            }}>
              Pour scanner le code-barres ISBN d'un livre, l'application a besoin d'accéder à votre caméra.
            </p>
          </div>

          {/* CTA button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleRequestPermission}
            disabled={phase === 'requesting'}
            style={{
              width:           '100%',
              maxWidth:        '320px',
              height:          '52px',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             '10px',
              backgroundColor: phase === 'requesting' ? 'var(--primary-7)' : 'var(--primary-10)',
              borderRadius:    'var(--br-md)',
              border:          'none',
              outline:         'none',
              cursor:          phase === 'requesting' ? 'default' : 'pointer',
              boxShadow:       '0px -2px 10px rgba(99,181,180,0.08),0px 2px 10px rgba(99,181,180,0.08)',
            }}
          >
            <IconCamera size={20} strokeWidth={2} color="var(--neutral-1)" />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '16px',
              fontWeight: 700,
              color:      'var(--neutral-1)',
            }}>
              {phase === 'requesting' ? 'Autorisation en cours…' : 'Autoriser l\'accès à la caméra'}
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     DENIED SCREEN
  ══════════════════════════════════════════════════ */
  if (phase === 'denied') {
    return (
      <div style={{
        position:        'fixed',
        inset:           0,
        background: 'linear-gradient(180deg, var(--secondary-2) 0%, var(--neutral-2) 49.04%), linear-gradient(180deg, #F4FBFB 0%, #F9F9FA 49%, #F9F9FA 100%), var(--secondary-12)',
        display:         'flex',
        flexDirection:   'column',
      }}>
        {Header}

        <div style={{
          flex:           1,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '24px',
          padding:        '32px',
        }}>
          <div style={{
            width:           '88px',
            height:          '88px',
            borderRadius:    'var(--br-round)',
            backgroundColor: 'var(--warning-3)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}>
            <IconCameraOff size={44} strokeWidth={1.5} color="var(--warning-10)" />
          </div>

          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{
              fontFamily: 'var(--font-brand)',
              fontSize:   '20px',
              fontWeight: 700,
              color:      'var(--color-text-title)',
              margin:     0,
            }}>
              Accès refusé
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '14px',
              fontWeight: 400,
              lineHeight: 1.6,
              color:      'var(--color-text-body)',
              margin:     0,
              maxWidth:   '280px',
            }}>
              La caméra a été refusée. Pour l'activer, allez dans{' '}
              <strong>Réglages → Safari / Chrome → Caméra</strong> et autorisez l'accès.
            </p>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('idle')}
            style={{
              width:           '100%',
              maxWidth:        '320px',
              height:          '52px',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              backgroundColor: 'var(--neutral-4)',
              borderRadius:    'var(--br-md)',
              border:          'none',
              outline:         'none',
              cursor:          'pointer',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '16px',
              fontWeight: 700,
              color:      'var(--color-text-title)',
            }}>
              Réessayer
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     SCANNER + ERROR SCREEN  (scanning | scanned | error)
  ══════════════════════════════════════════════════ */
  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      backgroundColor: '#000',
      display:         'flex',
      flexDirection:   'column',
      overflow:        'hidden',
    }}>
      {Header}

      {/* Camera area */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {/* Video feed */}
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            position:  'absolute',
            inset:     0,
            width:     '100%',
            height:    '100%',
            objectFit: 'cover',
          }}
        />

        {/* Fetching — spinner overlay */}
        {phase === 'fetching' && (
          <div style={{
            position:        'absolute',
            inset:           0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             '16px',
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <IconLoader2 size={40} strokeWidth={2} color="var(--primary-6)" />
            </motion.div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '14px',
              fontWeight: 500,
              color:      'rgba(255,255,255,0.9)',
              margin:     0,
            }}>
              Recherche du livre…
            </p>
          </div>
        )}

        {/* Generic error */}
        {phase === 'error' && (
          <div style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '32px',
          }}>
            <p style={{
              color:      'rgba(255,255,255,0.9)',
              textAlign:  'center',
              fontSize:   '14px',
              fontWeight: 500,
            }}>
              Une erreur est survenue avec la caméra.{'\n'}Veuillez réessayer.
            </p>
          </div>
        )}

        {/* Viewfinder overlay */}
        {(phase === 'scanning' || phase === 'fetching') && (
          <div style={{
            position:       'absolute',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '24px',
            pointerEvents:  'none',
          }}>
            {/* Scan box */}
            <div style={{
              position:     'relative',
              width:        '280px',
              height:       '160px',
              boxShadow:    '0 0 0 9999px rgba(0,0,0,0.55)',
              borderRadius: '8px',
            }}>
              <Corner pos="tl" />
              <Corner pos="tr" />
              <Corner pos="bl" />
              <Corner pos="br" />

              {/* Animated scan line */}
              <motion.div
                animate={{ top: ['8%', '84%', '8%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                style={{
                  position:     'absolute',
                  left:         '4px',
                  right:        '4px',
                  height:       '2px',
                  background:   'linear-gradient(90deg, transparent, var(--primary-8), transparent)',
                  borderRadius: '1px',
                  opacity:      0.9,
                }}
              />
            </div>

            <p style={{
              fontFamily:  'var(--font-body)',
              fontSize:    '14px',
              fontWeight:  500,
              color:       'rgba(255,255,255,0.92)',
              textAlign:   'center',
              maxWidth:    '240px',
              margin:      0,
              textShadow:  '0 1px 6px rgba(0,0,0,0.6)',
            }}>
              Scannez le code-barres ISBN d'un livre
            </p>
          </div>
        )}
      </div>

      {/* Bottom sheet + backdrop */}
      <AnimatePresence>
        {phase === 'scanned' && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onBack}
              style={{
                position:        'fixed',
                inset:           0,
                backgroundColor: 'rgba(0,0,0,0.45)',
                zIndex:          40,
              }}
            />
           <BookBottomSheet
              key="sheet"
              book={scannedBook}
              onClose={() => {
                 setPhase('scanning'); // ✅ On dit au scanner de se relancer
                 setScannedBook(null); // ✅ On vide le livre actuel
               }}
               onViewBook={handleViewBook}
             />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
