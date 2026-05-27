/**
 * WebHomePage.jsx — Bibliothèques de Bordeaux
 * Homepage web desktop (≥ 1024px) → Tablet (768px) → Mobile (375px)
 *
 * Design system : tokens.css (--primary-*, --neutral-*, --secondary-*, etc.)
 * Stack         : React + Tailwind v4 + Framer Motion + Tabler Icons
 *
 * Sections :
 *   A) Header sticky (80px)
 *   B) Hero (320px)
 *   C) Actualité — "À ne pas manquer" (340px)
 *   D) Accès rapides — grille 1×4 (320px)
 *   E) Pour vous — book carousel (450px)
 *   F) Footer (200px)
 */

import { useState } from 'react'
import { motion }    from 'framer-motion'
import {
  IconBuildingBridge2,
  IconSearch,
  IconUser,
  IconArrowRight,
  IconCalendarEvent,
  IconBook2,
  IconDeviceMobile,
  IconInfoCircle,
  IconChevronRight,
} from '@tabler/icons-react'

import Button  from '../components/ui/Button'
import Badge   from '../components/ui/Badge'
import { BOOKS } from '../data/books'

/* ─────────────────────────────────────────────────────────────
   SHADOWS — valeurs exactes depuis le DS Figma
   ───────────────────────────────────────────────────────────── */
const SHADOW_HEADER =
  '0px 18px 7px 0px var(--alpha-grey-01), 0px 10px 6px 0px var(--alpha-grey-05), ' +
  '0px 4px 4px 0px var(--alpha-grey-09), 0px 1px 2px 0px var(--alpha-grey-10)'

const SHADOW_CARD =
  '0px 18px 7px 0px var(--alpha-grey-01), 0px 10px 6px 0px var(--alpha-grey-05), ' +
  '0px 4px 4px 0px var(--alpha-grey-09), 0px 1px 2px 0px var(--alpha-grey-10)'

const SHADOW_COVER =
  '0px 16px 9px 0px var(--alpha-grey-05), 0px 7px 7px 0px var(--alpha-grey-09), ' +
  '0px 2px 4px 0px var(--alpha-grey-10)'

/* ─────────────────────────────────────────────────────────────
   CONTAINER — max-width 1440px, padding horizontal adaptatif
   ───────────────────────────────────────────────────────────── */
function Container({ children, className = '', style = {} }) {
  return (
    <div
      className={`w-full mx-auto px-[var(--layout-3)] md:px-[var(--layout-6)] lg:px-[var(--layout-9)] xl:px-[var(--layout-10)] ${className}`}
      style={{ maxWidth: '1440px', ...style }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION TITLE — Lora Bold, heading-sm (24px), color-text-brand
   ───────────────────────────────────────────────────────────── */
function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-brand)',
        fontWeight: 700,
        fontSize:   'var(--text-heading-sm)',   /* 24px */
        lineHeight: 1.3,
        color:      'var(--color-text-brand)',
        margin:     0,
      }}
    >
      {children}
    </h2>
  )
}


/* ══════════════════════════════════════════════════════════════
   A) HEADER — sticky, 80px, logo + search + connexion
   ══════════════════════════════════════════════════════════════ */
function WebHeader() {
  const [query, setQuery] = useState('')

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        height:          '80px',
        backgroundColor: 'var(--neutral-1)',
        borderBottom:    '1px solid var(--neutral-6)',
        boxShadow:       SHADOW_HEADER,
      }}
    >
      <Container className="h-full flex items-center gap-[var(--gap-2xl)]">

        {/* ── Logo ── */}
        <a
          href="#"
          aria-label="Bibliothèques de Bordeaux — accueil"
          className="flex items-center shrink-0 no-underline focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:rounded"
          style={{ gap: 'var(--gap-2md)', textDecoration: 'none' }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width:           'var(--sz-lg)',   /* 40px */
              height:          'var(--sz-lg)',
              backgroundColor: 'var(--secondary-4)',
              borderRadius:    'var(--br-round)',
              padding:         'var(--pad-sm)',
            }}
            aria-hidden="true"
          >
            <IconBuildingBridge2 size={22} strokeWidth={2} color="var(--secondary-11)" />
          </div>
          <span
            className="hidden sm:block"
            style={{
              fontFamily: 'var(--font-brand)',
              fontWeight: 700,
              fontSize:   'var(--text-body-lg)',   /* 20px */
              lineHeight: 1.3,
              color:      'var(--color-text-brand)',
              whiteSpace: 'nowrap',
            }}
          >
            Bibliothèques de Bordeaux
          </span>
        </a>

        {/* ── Barre de recherche — 380px, centré ── */}
        <div className="flex-1 flex justify-center" style={{ maxWidth: '600px' }}>
          <div
            className="w-full flex items-center"
            style={{
              maxWidth:        '380px',
              height:          'var(--sz-xl)',   /* 48px */
              backgroundColor: 'var(--neutral-2)',
              border:          '1.5px solid var(--neutral-6)',
              borderRadius:    'var(--br-round)',
              padding:         '0 var(--pad-2md)',
              gap:             'var(--gap-md)',
            }}
          >
            <IconSearch size={18} strokeWidth={2} color="var(--neutral-9)" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Chercher un livre…"
              aria-label="Chercher un livre"
              className="flex-1 bg-transparent outline-none border-none"
              style={{
                fontFamily:  'var(--font-body)',
                fontSize:    'var(--text-body-sm)',   /* 14px */
                color:       'var(--color-text-body)',
              }}
            />
          </div>
        </div>

        {/* ── Actions droite ── */}
        <div className="flex items-center shrink-0" style={{ gap: 'var(--gap-2md)', marginLeft: 'auto' }}>
          <Button
            variant="outlined"
            size="sm"
            iconLeft={<IconUser size={16} strokeWidth={2} />}
          >
            <span className="hidden md:inline">Connexion</span>
          </Button>
        </div>

      </Container>
    </header>
  )
}


/* ══════════════════════════════════════════════════════════════
   B) HERO — 320px, fond primary-12, texte blanc
   ══════════════════════════════════════════════════════════════ */
function WebHero() {
  return (
    <section
      className="w-full flex items-center"
      style={{
        minHeight:       '320px',
        backgroundColor: 'var(--primary-12)',   /* #204140 — teal sombre */
        padding:         'var(--layout-7) 0',
      }}
    >
      <Container className="flex flex-col" style={{ gap: 'var(--layout-3)' }}>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-brand)',
            fontWeight: 700,
            fontSize:   'var(--text-heading-lg)',   /* 32px */
            lineHeight: 1.25,
            color:      'var(--color-white)',
            margin:     0,
            maxWidth:   '680px',
          }}
        >
          Explorez, découvrez,<br />
          vivez la culture
        </h1>

        {/* Sous-titre */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-body-lg)',   /* 20px */
            fontWeight: 400,
            lineHeight: 1.5,
            color:      'rgba(255,255,255,0.9)',
            margin:     0,
            maxWidth:   '560px',
          }}
        >
          Accédez à 1,3 million de documents et participez
          à la vie culturelle du réseau des Bibliothèques de Bordeaux.
        </p>

      </Container>
    </section>
  )
}


/* ══════════════════════════════════════════════════════════════
   C) ACTUALITÉ — "À ne pas manquer" — 1 news card horizontale
   ══════════════════════════════════════════════════════════════ */
function WebNewsSection() {
  return (
    <section
      className="w-full"
      style={{
        padding:         'var(--layout-7) 0',
        backgroundColor: 'var(--neutral-1)',
      }}
    >
      <Container className="flex flex-col" style={{ gap: 'var(--layout-3)' }}>

        <SectionTitle>À ne pas manquer</SectionTitle>

        {/* News card — horizontale */}
        <motion.a
          href="#evenement-dicker"
          whileHover={{ y: -3, boxShadow: SHADOW_CARD }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="flex overflow-hidden no-underline focus:outline-none focus-visible:ring-2"
          style={{
            backgroundColor: 'var(--neutral-1)',
            border:          '1px solid var(--neutral-3)',
            borderRadius:    'var(--br-lg)',
            boxShadow:       SHADOW_CARD,
            textDecoration:  'none',
            maxWidth:        '900px',
          }}
          aria-label="Rencontre avec Joël Dicker — En savoir plus"
        >

          {/* ── Image placeholder ── */}
          <div
            className="shrink-0 hidden sm:block"
            style={{
              width:           '300px',
              minHeight:       '240px',
              backgroundColor: 'var(--secondary-4)',
              position:        'relative',
              overflow:        'hidden',
            }}
            aria-hidden="true"
          >
            {/* Texture subtile DS */}
            <div
              style={{
                position:        'absolute',
                inset:           0,
                backgroundImage: 'linear-gradient(135deg, var(--secondary-4) 0%, var(--secondary-5) 100%)',
              }}
            />
          </div>

          {/* ── Content ── */}
          <div
            className="flex flex-col justify-center"
            style={{
              padding: 'var(--pad-2md) var(--layout-5)',
              gap:     'var(--gap-lg)',
              flex:    1,
            }}
          >

            {/* Badge */}
            <Badge variant="default" size="large">
              Exposition • Mériadeck
            </Badge>

            {/* Titre */}
            <h3
              style={{
                fontFamily: 'var(--font-brand)',
                fontWeight: 700,
                fontSize:   'var(--text-heading-sm)',   /* 24px */
                lineHeight: 1.3,
                color:      'var(--color-text-title)',
                margin:     0,
              }}
            >
              Rencontre avec Joël Dicker
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize:   'var(--text-body-md)',
                fontWeight: 400,
                lineHeight: 1.5,
                color:      'var(--color-text-body)',
                margin:     0,
              }}
            >
              L'auteur sera à Bordeaux le 15 mars pour dédicaces et une rencontre
              ouverte au public à la Bibliothèque Mériadeck.
            </p>

            {/* CTA link */}
            <a
              href="#evenement-dicker"
              className="inline-flex items-center focus:outline-none focus-visible:underline"
              style={{
                gap:            'var(--gap-xs)',
                fontSize:       'var(--text-body-sm)',
                fontWeight:     600,
                color:          'var(--primary-11)',
                textDecoration: 'none',
              }}
              aria-label="En savoir plus sur la rencontre avec Joël Dicker"
            >
              En savoir plus
              <IconArrowRight size={16} strokeWidth={2} />
            </a>

          </div>
        </motion.a>

      </Container>
    </section>
  )
}


/* ══════════════════════════════════════════════════════════════
   D) ACCÈS RAPIDES — grille 4 colonnes responsive
   ══════════════════════════════════════════════════════════════ */
const QUICK_ACCESS_ITEMS = [
  {
    emoji: '🔍',
    icon:  <IconSearch size={24} strokeWidth={1.8} color="var(--primary-11)" />,
    title: 'Rechercher',
    desc:  'Catalogue en ligne',
    href:  '#catalogue',
  },
  {
    emoji: '📅',
    icon:  <IconCalendarEvent size={24} strokeWidth={1.8} color="var(--secondary-10)" />,
    title: 'Événements',
    desc:  'Agenda culturel',
    href:  '#evenements',
  },
  {
    emoji: '📱',
    icon:  <IconDeviceMobile size={24} strokeWidth={1.8} color="var(--info-11)" />,
    title: 'Ressources numériques',
    desc:  'Lire, écouter, voir',
    href:  '#numerique',
  },
  {
    emoji: 'ℹ️',
    icon:  <IconInfoCircle size={24} strokeWidth={1.8} color="var(--success-11)" />,
    title: 'Infos pratiques',
    desc:  'Horaires & accès',
    href:  '#infos',
  },
]

function QuickAccessCard({ emoji, title, desc, href }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      className="flex flex-col items-center justify-center no-underline focus:outline-none focus-visible:ring-2"
      style={{
        height:          '220px',
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-3)',
        borderRadius:    'var(--br-lg)',
        boxShadow:       SHADOW_CARD,
        textDecoration:  'none',
        cursor:          'pointer',
        gap:             'var(--gap-lg)',
        padding:         'var(--pad-2md)',
        transition:      'box-shadow 200ms ease',
      }}
      aria-label={title}
    >
      <span
        role="img"
        aria-hidden="true"
        style={{ fontSize: '44px', lineHeight: 1 }}
      >
        {emoji}
      </span>
      <div className="flex flex-col items-center" style={{ gap: 'var(--gap-xs)' }}>
        <p
          style={{
            fontSize:   'var(--text-body-md)',   /* 16px */
            fontWeight: 600,
            lineHeight: 1.4,
            color:      'var(--color-text-title)',
            margin:     0,
            textAlign:  'center',
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize:   'var(--text-body-sm)',   /* 14px */
            fontWeight: 400,
            lineHeight: 1.4,
            color:      'var(--color-text-subtle)',
            margin:     0,
            textAlign:  'center',
          }}
        >
          {desc}
        </p>
      </div>
      <IconChevronRight size={18} strokeWidth={2} color="var(--neutral-9)" aria-hidden="true" />
    </motion.a>
  )
}

function WebQuickAccessSection() {
  return (
    <section
      className="w-full"
      style={{
        padding:         'var(--layout-7) 0',
        backgroundColor: 'var(--neutral-2)',
      }}
    >
      <Container className="flex flex-col" style={{ gap: 'var(--layout-3)' }}>

        <SectionTitle>Accès rapides</SectionTitle>

        {/* Grille : 1 col → 2 col → 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--gap-lg)' }}>
          {QUICK_ACCESS_ITEMS.map(item => (
            <QuickAccessCard key={item.href} {...item} />
          ))}
        </div>

      </Container>
    </section>
  )
}


/* ══════════════════════════════════════════════════════════════
   E) POUR VOUS — carrousel horizontal de 5 livres
   ══════════════════════════════════════════════════════════════ */
const RECOMMENDED_BOOKS = BOOKS.slice(0, 5)

const BOOK_COVER_COLORS = [
  'var(--secondary-4)',
  'var(--primary-4)',
  'var(--info-3)',
  'var(--warning-3)',
  'var(--success-3)',
]

function WebRecommendationsSection() {
  return (
    <section
      className="w-full"
      style={{
        padding:         'var(--layout-7) 0',
        backgroundColor: 'var(--neutral-1)',
      }}
    >
      {/* Title dans le container standard */}
      <Container className="flex flex-col" style={{ gap: 'var(--layout-3)' }}>
        <SectionTitle>Pour vous</SectionTitle>
      </Container>

      {/* Carrousel — scroll dépasse le container sur mobile */}
      <Container>
        <div
          className="flex overflow-x-auto"
          style={{
            gap:           'var(--gap-lg)',
            paddingBottom: 'var(--pad-md)',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',       /* Firefox */
            msOverflowStyle: 'none',      /* IE */
            /* Webkit scrollbar hidden via CSS global (voir web.css) */
          }}
          role="list"
          aria-label="Suggestions de livres"
        >
          {RECOMMENDED_BOOKS.map((book, i) => (
            <motion.div
              key={book.id}
              role="listitem"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="flex flex-col shrink-0 cursor-pointer focus:outline-none"
              tabIndex={0}
              aria-label={`${book.title} par ${book.author}`}
              style={{
                width:           '220px',
                backgroundColor: 'var(--neutral-1)',
                border:          '1px solid var(--neutral-3)',
                borderRadius:    'var(--br-lg)',
                boxShadow:       SHADOW_CARD,
                overflow:        'hidden',
              }}
            >
              {/* Cover — 220×160px placeholder couleur */}
              <div
                style={{
                  height:          '160px',
                  backgroundColor: BOOK_COVER_COLORS[i % BOOK_COVER_COLORS.length],
                  overflow:        'hidden',
                  flexShrink:      0,
                  boxShadow:       SHADOW_COVER,
                }}
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  loading="lazy"
                  style={{
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'cover',
                    display:    'block',
                  }}
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>

              {/* Texte */}
              <div
                className="flex flex-col"
                style={{
                  padding: 'var(--pad-md)',
                  gap:     'var(--gap-xs)',
                  flex:    1,
                }}
              >
                <p
                  style={{
                    fontSize:              'var(--text-body-sm)',   /* 14px */
                    fontWeight:            700,
                    lineHeight:            1.4,
                    color:                 'var(--color-text-title)',
                    margin:                0,
                    display:               '-webkit-box',
                    WebkitLineClamp:       2,
                    WebkitBoxOrient:       'vertical',
                    overflow:              'hidden',
                  }}
                >
                  {book.title}
                </p>
                <p
                  style={{
                    fontSize:      'var(--text-caption-sm)',   /* 12px */
                    fontWeight:    500,
                    color:         'var(--color-text-subtle)',
                    margin:        0,
                    whiteSpace:    'nowrap',
                    overflow:      'hidden',
                    textOverflow:  'ellipsis',
                  }}
                >
                  {book.author}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>

    </section>
  )
}


/* ══════════════════════════════════════════════════════════════
   F) FOOTER — 200px, neutral-2, navigation + copyright
   ══════════════════════════════════════════════════════════════ */
const FOOTER_LINKS = [
  { label: 'Horaires',         href: '#horaires'       },
  { label: 'Nous rejoindre',   href: '#rejoindre'      },
  { label: 'Contact',          href: '#contact'        },
  { label: 'Mentions légales', href: '#mentions-legales' },
  { label: 'Accessibilité',   href: '#accessibilite'  },
]

function WebFooter() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: 'var(--neutral-2)',
        borderTop:       '1px solid var(--neutral-6)',
        minHeight:       '200px',
        padding:         'var(--layout-6) 0',
      }}
    >
      <Container className="flex flex-col" style={{ gap: 'var(--layout-3)' }}>

        {/* Logo row */}
        <div className="flex items-center" style={{ gap: 'var(--gap-2md)' }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width:           '36px',
              height:          '36px',
              backgroundColor: 'var(--secondary-4)',
              borderRadius:    'var(--br-round)',
              padding:         '7px',
            }}
          >
            <IconBuildingBridge2 size={20} strokeWidth={2} color="var(--secondary-11)" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-brand)',
              fontWeight: 700,
              fontSize:   'var(--text-body-md)',
              color:      'var(--color-text-brand)',
            }}
          >
            Bibliothèques de Bordeaux
          </span>
        </div>

        {/* Navigation footer */}
        <nav aria-label="Navigation secondaire">
          <ul
            className="flex flex-wrap list-none m-0 p-0"
            style={{ gap: 'var(--gap-2xl)' }}
          >
            {FOOTER_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="no-underline hover:underline focus:outline-none focus-visible:underline"
                  style={{
                    fontSize:   'var(--text-body-sm)',   /* 14px */
                    fontWeight: 500,
                    color:      'var(--color-text-body)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div
          style={{
            height:          '1px',
            backgroundColor: 'var(--neutral-6)',
          }}
          aria-hidden="true"
        />

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--text-caption-sm)',   /* 12px */
            fontWeight: 400,
            lineHeight: 1.5,
            color:      'var(--color-text-subtle)',
            margin:     0,
          }}
        >
          © 2026 Bibliothèques de Bordeaux&nbsp;•&nbsp;Horaires : Lun-Ven 12h–20h, Sam 10h–18h
        </p>

      </Container>
    </footer>
  )
}


/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT — WebHomePage
   ══════════════════════════════════════════════════════════════ */
export default function WebHomePage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        fontFamily:      'var(--font-body)',
        backgroundColor: 'var(--neutral-2)',
        color:           'var(--color-text-body)',
      }}
    >
      {/* Skip-link — invisible jusqu'au focus clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--primary-10)] focus:text-white focus:font-bold focus:no-underline"
      >
        Aller au contenu
      </a>

      <WebHeader />

      <main id="main-content">
        <WebHero />
        <WebNewsSection />
        <WebQuickAccessSection />
        <WebRecommendationsSection />
      </main>

      <WebFooter />
    </div>
  )
}
