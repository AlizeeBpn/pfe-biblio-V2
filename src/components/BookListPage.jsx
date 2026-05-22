import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowLeft, IconCalendarTime, IconShoppingBagCheck, IconX, IconArrowRight, IconBan, IconCalendarPlus, IconCalendarEvent, IconBook, IconStarFilled } from '@tabler/icons-react';
import Badge from './ui/Badge';
import BookCard  from './ui/BookCard';
import BookCover from './BookCover';
import Button    from './ui/Button';

const SHADOW_HEADER  = '0px -2px 10px rgba(99,181,180,0.08), 0px 2px 10px rgba(99,181,180,0.08)';
const SHADOW_SHEET   = '0px 16px 9px 0px rgba(142,141,143,0.05), 0px 7px 7px 0px rgba(142,141,143,0.09), 0px 2px 4px 0px rgba(142,141,143,0.10)';
const SHADOW_BTN_CTA = '0px -2px 10px rgba(99,181,180,0.08), 0px 2px 10px rgba(99,181,180,0.08)';

/* ── Infos et actions contextuelles par type ── */
const CONTEXT = {
  reserved: {
    detail:  'Prêt à Mériadeck',
    actions: [
      { label: 'Réserver pour plus tard', variant: 'secondary', Icon: IconCalendarEvent },
      { label: 'Annuler la réservation',  variant: 'error',     Icon: IconBan        },
    ],
  },
  borrowed: {
    detail:  (book) => `Retour : ${book.returnDate ?? 'bientôt'}`,
    actions: [
      { label: "Prolonger l'emprunt", variant: 'primary', Icon: IconCalendarPlus },
    ],
  },
};

/* ════════════════════════════════════════════════════
   BOOK CONTEXT SHEET — inspiré de la modal scanner
   ════════════════════════════════════════════════════ */
function BookContextSheet({ book, type, onClose, onBookSelect }) {
  const ctx = CONTEXT[type];
  if (!ctx) return null;

  const detail    = typeof ctx.detail === 'function' ? ctx.detail(book) : ctx.detail;
  const genreList = Array.isArray(book.genres) ? book.genres : [];
  const badgeCfg  = type === 'reserved'
    ? { variant: 'success', label: 'Prêt à Mériadeck', Icon: IconShoppingBagCheck }
    : { variant: 'info',    label: detail,               Icon: IconCalendarTime     };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(34,33,35,0.45)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '430px', margin: '0 auto', backgroundColor: 'white', borderRadius: '32px 32px 0 0', boxShadow: SHADOW_SHEET, display: 'flex', flexDirection: 'column' }}
      >
        {/* Handle */}
        <div style={{ width: 80, height: 8, backgroundColor: 'var(--neutral-3)', borderRadius: 9999, margin: '16px auto 0', flexShrink: 0 }} />

        <div style={{ padding: '16px 20px 0' }}>
          {/* Badge + X */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Badge
              variant={badgeCfg.variant}
              size="large"
              icon={<badgeCfg.Icon size={16} strokeWidth={2} color={badgeCfg.variant === 'success' ? 'var(--success-11)' : 'var(--info-11)'} />}
            >
              {badgeCfg.label}
            </Badge>
            <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onClose}
              style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconX size={18} strokeWidth={2} color="var(--color-text-subtle)" />
            </motion.button>
          </div>

          {/* Cover + infos */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <BookCover cover={book.cover} title={book.title} style={{ width: 72, height: 104, borderRadius: 6, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ fontFamily: 'var(--font-brand)', fontSize: '18px', fontWeight: 700, lineHeight: 1.3, color: 'var(--color-text-title)', margin: 0 }}>
                {book.title}
              </p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-body)', margin: 0 }}>
                {book.author}
              </p>
              {/* Rating + genres — sous l'auteur */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {book.rating != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-subtle)' }}>{book.rating}/5</span>
                    <IconStarFilled size={14} color="var(--secondary-11)" />
                  </div>
                )}
                {genreList.map(g => (
                  <Badge key={g} variant="default" size="small">{g}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ctx.actions.map(({ label, variant, Icon }) => (
            <Button key={label} variant={variant} size="md" className="w-full" iconRight={Icon && <Icon size={18} strokeWidth={2} />} onClick={onClose}>
              {label}
            </Button>
          ))}

          {/* Lien "Voir la fiche du livre" — style link design system */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => { onClose(); onBookSelect?.(book); }}
            style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: 'var(--primary-11)', padding: '8px 0' }}
          >
            Voir la fiche du livre
            <IconArrowRight size={16} strokeWidth={2} color="var(--primary-11)" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/*
 * Badge config per availability type.
 * label() receives the book so it can use the return date.
 */
const BADGE = {
  available: {
    variant:   'success',
    label:     (book) => book.returnDate ? `Retour le ${book.returnDate}` : 'Disponible',
    iconColor: () => 'var(--success-11)',
    Icon:      IconCalendarTime,
  },
  borrowed: {
    variant:   'info',
    label:     (book) => book.returnDate ? `Retour : ${book.returnDate}` : 'En cours de prêt',
    iconColor: () => 'var(--info-11)',
    Icon:      IconCalendarTime,
  },
  reserved: {
    variant:   'success',
    label:     () => 'Prêt à Mériadeck',
    iconColor: () => 'var(--success-11)',
    Icon:      IconShoppingBagCheck,
  },
};

/* ════════════════════════════════════════════════════
   BOOK LIST PAGE
   Props:
     title            : string
     count            : number
     books            : array
     cardAvailability : 'available' | 'borrowed' | 'reserved'
     pageActionLabel  : string (optional)
     pageActionVariant: Button variant
     onPageAction     : () => void
     onBack           : () => void
     onBookSelect     : (book) => void
   ════════════════════════════════════════════════════ */
export function BookListPage({
  title,
  count,
  books = [],
  cardAvailability = 'available',
  onBack,
  onBookSelect,
}) {
  const badge = BADGE[cardAvailability] ?? BADGE.available;
  const [contextBook, setContextBook] = useState(null);

  return (
    <div
      className="min-h-dvh font-sans flex flex-col"
      style={{
        background:    'linear-gradient(180deg, var(--secondary-1) 0%, var(--neutral-2) 49.04%), var(--neutral-2)',
        paddingBottom: '40px',
      }}
    >
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--secondary-1)',
        boxShadow:       SHADOW_HEADER,
        padding:         '16px 20px',
        display:         'flex',
        alignItems:      'center',
        gap:             '12px',
        flexShrink:      0,
      }}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{
            width: '40px', height: '40px', borderRadius: '9999px',
            backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-title)" />
        </motion.button>
      </div>

      {/* Body */}
      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Title + count */}
        <div>
          <p style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-brand)', margin: '0 0 2px' }}>
            {title}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text-body)', margin: 0 }}>
            {count} titre{count !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Book list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <BookCard
                cover={book.cover}
                title={book.title}
                author={book.author}
                genres={Array.isArray(book.genres) ? book.genres.join(', ') : book.genres}
                badgeVariant={badge.variant}
                badgeLabel={badge.label(book)}
                badgeIcon={<badge.Icon size={16} strokeWidth={2} color={badge.iconColor(book)} />}
                rating={book.rating}
                onMenuClick={CONTEXT[cardAvailability] ? () => setContextBook(book) : undefined}
                onClick={CONTEXT[cardAvailability] ? () => setContextBook(book) : () => onBookSelect?.(book)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom sheet contextuel */}
      <AnimatePresence>
        {contextBook && (
          <BookContextSheet
            book={contextBook}
            type={cardAvailability}
            onClose={() => setContextBook(null)}
            onBookSelect={onBookSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default BookListPage;
