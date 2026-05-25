import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconBookmarkPlus,
  IconBookmarkFilled,
  IconBook2,
  IconStarFilled,
  IconCalendarTime,
  IconX,
} from '@tabler/icons-react';
import Badge from './ui/Badge';

const SHADOW_OBJECT =
  '0px 16px 9px 0px rgba(142,141,143,0.05),0px 7px 7px 0px rgba(142,141,143,0.09),0px 2px 4px 0px rgba(142,141,143,0.1),0px -11px 4px 0px rgba(142,141,143,0.01),0px -6px 4px 0px rgba(142,141,143,0.05),0px -3px 3px 0px rgba(142,141,143,0.09),0px -1px 2px 0px rgba(142,141,143,0.1)';

const SHADOW_COLOR_BTN =
  '0px -2px 10px rgba(99,181,180,0.08),0px 2px 10px rgba(99,181,180,0.08)';

/**
 * BookBottomSheet — design node 522:2780
 *
 * Props:
 *   book       — book data object
 *   onClose    — called when X button or backdrop is tapped
 *   onViewBook — called when "Voir la fiche du livre" is pressed
 */
export default function BookBottomSheet({ book, onClose, onViewBook }) {
  const [saved,    setSaved]    = useState(false);
  const [expanded, setExpanded] = useState(false);

  const {
    title    = 'Titre inconnu',
    author   = 'Auteur inconnu',
    cover,
    rating   = null,
    synopsis = '',
    genres   = '',
    available = true,
  } = book || {};

  const genreList = (Array.isArray(genres) ? genres : genres.split(',').filter(Boolean)).slice(0, 2);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-sheet-title"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      style={{
        position:        'fixed',
        bottom:          0,
        left:            0,
        right:           0,
        zIndex:          50,
        backgroundColor: 'var(--color-white)',
        borderRadius:    'var(--br-layout-xl) var(--br-layout-xl) 0 0',
        boxShadow:       SHADOW_OBJECT,
        paddingTop:      'var(--pad-2md)',    /* 16px */
        paddingBottom:   'var(--pad-2xl)',    /* 32px */
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        gap:             'var(--gap-lg)',     /* 16px */
        overflow:        'hidden',
      }}
    >
      {/* ── Drag handle pill ── */}
      <div style={{
        width:           '80px',
        height:          '8px',
        backgroundColor: 'var(--neutral-3)',
        borderRadius:    'var(--br-round)',
        flexShrink:      0,
      }} />

      {/* ── Top bar : Disponible badge + Close button ── */}
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         'var(--gap-lg)',
        padding:     '0 var(--pad-lg)',   /* 0 20px */
        width:       '100%',
        boxSizing:   'border-box',
      }}>
        {/* Disponible badge */}
        <Badge
          variant={available ? 'success' : 'warning'}
          size="large"
          icon={<IconCalendarTime size={16} strokeWidth={2} color={available ? 'var(--success-11)' : 'var(--warning-11)'} />}
        >
          {available ? 'Disponible' : 'Indisponible'}
        </Badge>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Close button — neutral-4 bg, br-round, 36px */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Fermer"
          className="focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
          style={{
            width:           '36px',
            height:          '36px',
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
          <IconX size={20} strokeWidth={2} color="var(--color-text-subtle)" aria-hidden="true" />
        </motion.button>
      </div>

      {/* ── Book details container ── */}
      <div style={{
        width:         '100%',
        display:       'flex',
        flexDirection: 'column',
        gap:           'var(--gap-lg)',
        boxSizing:     'border-box',
      }}>

        {/* Cover + title + author */}
        <div style={{
          display:    'flex',
          gap:        'var(--gap-lg)',
          alignItems: 'flex-start',
          padding:    '0 var(--pad-lg)',
          width:      '100%',
          boxSizing:  'border-box',
        }}>
          {/* Cover — 57×86 */}
          <div style={{
            width:           '57px',
            height:          '86px',
            borderRadius:    'var(--br-sm)',
            backgroundColor: '#af9494',
            overflow:        'hidden',
            flexShrink:      0,
            boxShadow:       SHADOW_OBJECT,
            position:        'relative',
          }}>
            {cover && (
              <img
                src={cover}
                alt={title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            )}
          </div>

          {/* Info */}
          <div style={{
            flex:          '1 0 0',
            display:       'flex',
            flexDirection: 'column',
            gap:           '4px',
            minWidth:      0,
          }}>
            <p id="book-sheet-title" style={{
              fontFamily: 'var(--font-brand)',
              fontSize:   '20px',
              fontWeight: 700,
              lineHeight: 1.5,
              color:      'var(--color-text-title)',
              margin:     0,
            }}>
              {title}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '16px',
              fontWeight: 400,
              lineHeight: 1.5,
              color:      'var(--color-text-body)',
              margin:     0,
            }}>
              {author}
            </p>
          </div>
        </div>

        {/* Rating + tags + synopsis + actions */}
        <div style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           'var(--gap-2xl)',   /* 24px */
          padding:       '0 var(--pad-2md)', /* 0 16px */
          boxSizing:     'border-box',
          width:         '100%',
        }}>

          {/* Rating and Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-sm)' }}>

            {/* Rating + genre badges row */}
            <div style={{ display: 'flex', gap: 'var(--gap-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Rating */}
              {rating != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '32px' }}>
                  <span style={{
                    fontFamily: 'var(--font-brand)',
                    fontSize:   '16px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color:      'var(--color-text-subtle)',
                  }}>
                    {rating}/5
                  </span>
                  <IconStarFilled size={16} color="var(--secondary-9)" />
                </div>
              )}

              {/* Genre badges */}
              {genreList.map((g) => (
                <Badge key={g} variant="default" size="large">{g.trim()}</Badge>
              ))}
            </div>

            {/* Synopsis heading */}
            <p style={{
              fontFamily: 'var(--font-brand)',
              fontSize:   '20px',
              fontWeight: 700,
              lineHeight: 1.5,
              color:      'var(--color-text-brand)',
              margin:     0,
            }}>
              Synopsis
            </p>

            {/* Synopsis text + Voir plus/moins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <p style={{
                fontFamily:      'var(--font-body)',
                fontSize:        '14px',
                fontWeight:      500,
                lineHeight:      1.5,
                color:           'var(--color-text-body)',
                margin:          0,
                overflow:        expanded ? 'visible' : 'hidden',
                display:         expanded ? 'block' : '-webkit-box',
                WebkitLineClamp: expanded ? undefined : 3,
                WebkitBoxOrient: expanded ? undefined : 'vertical',
              }}>
                {synopsis}
              </p>
              {synopsis.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded(e => !e)}
                  style={{
                    all:            'unset',
                    fontSize:       '14px',
                    fontWeight:     500,
                    color:          'var(--primary-11)',
                    textDecoration: 'underline',
                    cursor:         'pointer',
                    alignSelf:      'flex-start',
                  }}
                >
                  {expanded ? 'Voir moins' : 'Voir plus'}
                </button>
              )}
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', gap: 'var(--gap-md)', alignItems: 'center' }}>
            {/* Liste — secondary button avec texte */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => setSaved(s => !s)}
              aria-pressed={saved}
              aria-label={saved ? 'Retirer de la liste' : 'Ajouter à la liste'}
              className="focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
              style={{
                height:          '48px',
                padding:         '0 16px',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '8px',
                backgroundColor: saved ? 'var(--primary-4)' : 'var(--primary-3)',
                borderRadius:    'var(--br-md)',
                border:          'none',
                outline:         'none',
                cursor:          'pointer',
                flexShrink:      0,
              }}
            >
              {saved
                ? <IconBookmarkFilled size={18} color="var(--primary-11)" aria-hidden="true" />
                : <IconBookmarkPlus   size={18} strokeWidth={2} color="var(--primary-11)" aria-hidden="true" />
              }
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-11)', whiteSpace: 'nowrap' }}>
                Liste
              </span>
            </motion.button>

            {/* Voir la fiche — flex-1, h-48, primary-10 bg, br-md (10px) */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onViewBook}
              className="focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:ring-offset-2"
              style={{
                flex:            1,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                height:          '48px',
                backgroundColor: 'var(--primary-10)',
                borderRadius:    'var(--br-md)',
                border:          'none',
                outline:         'none',
                cursor:          'pointer',
                boxShadow:       SHADOW_COLOR_BTN,
                gap:             'var(--gap-md)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '16px',
                fontWeight: 700,
                lineHeight: 1.5,
                color:      'var(--neutral-1)',
                whiteSpace: 'nowrap',
              }}>
                Voir la fiche du livre
              </span>
              <IconBook2 size={20} strokeWidth={2} color="var(--neutral-1)" aria-hidden="true" />
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
