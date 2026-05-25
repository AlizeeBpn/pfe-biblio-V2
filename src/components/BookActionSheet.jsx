import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconStar, IconCalendarCheck } from '@tabler/icons-react';
import Badge from './ui/Badge';

const SHADOW_BOOK_CARD = '0px 2px 10px rgba(142,141,143,0.07)';

/* ════════════════════════════════════════════════════
   BOOK ACTION CARD
   ════════════════════════════════════════════════════ */
function BookActionCard({ book, actionLabel, actionBg, actionColor, onAction, onBookSelect }) {
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={() => onBookSelect?.(book)}
      style={{
        position:        'relative',
        cursor:          'pointer',
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-5)',
        borderRadius:    '14px',
        boxShadow:       SHADOW_BOOK_CARD,
        display:         'flex',
        padding:         '12px 12px 0',
        overflow:        'hidden',
        height:          '170px',
      }}
    >
      {/* Cover */}
      <div style={{ width: '127px', flexShrink: 0, borderRadius: '8px 8px 0 0', overflow: 'hidden', position: 'relative' }}>
        {book.cover
          ? <img src={book.cover} alt={book.title} style={{ width: '127px', height: '158px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
          : <div style={{ width: '127px', height: '158px', backgroundColor: 'var(--neutral-3)' }} />
        }
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 0 12px 12px' }}>

        {/* Badge + rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge
            variant={book.available !== false ? 'success' : 'default'}
            size="medium"
            icon={<IconCalendarCheck size={14} strokeWidth={1.8} color={book.available !== false ? 'var(--success-11)' : 'var(--secondary-11)'} />}
          >
            {book.available !== false ? 'Disponible' : 'Indisponible'}
          </Badge>
          {book.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-subtle)' }}>{book.rating}/5</span>
              <IconStar size={13} strokeWidth={0} fill="var(--warning-9)" color="var(--warning-9)" />
            </div>
          )}
        </div>

        {/* Title / author */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text-title)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.title}
          </p>
          <p style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4, color: 'var(--color-text-body)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.author}
          </p>
          {book.genres && (
            <p style={{ fontSize: '11px', fontWeight: 400, lineHeight: 1.3, color: 'var(--color-text-subtle)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {book.genres.join(', ')}
            </p>
          )}
        </div>

        {/* Action button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onAction?.(book); }}
          style={{
            alignSelf:       'flex-end',
            height:          '32px',
            padding:         '0 12px',
            backgroundColor: actionBg ?? 'var(--secondary-3)',
            border:          'none',
            borderRadius:    '6px',
            fontSize:        '12px',
            fontWeight:      700,
            color:           actionColor ?? 'var(--secondary-11)',
            cursor:          'pointer',
            whiteSpace:      'nowrap',
          }}
        >
          {actionLabel}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   BOOK ACTION SHEET
   ════════════════════════════════════════════════════ */
export function BookActionSheet({ title, subtitle, books = [], actionLabel, actionBg, actionColor, onAction, onClose, onBookSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-action-sheet-title"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width:           '100%',
          backgroundColor: 'var(--neutral-1)',
          borderRadius:    '32px 32px 0 0',
          padding:         '16px 0 40px',
          boxShadow:       '0px -4px 24px rgba(0,0,0,0.12)',
          maxHeight:       '82vh',
          display:         'flex',
          flexDirection:   'column',
        }}
      >
        {/* Handle */}
        <div style={{ width: 80, height: 8, backgroundColor: 'var(--neutral-5)', borderRadius: 9999, margin: '0 auto 16px', flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'flex-start', gap: '8px', flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p id="book-action-sheet-title" style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, lineHeight: 1.3, color: 'var(--color-text-title)', margin: '0 0 2px' }}>
              {title}
            </p>
            {subtitle && (
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-subtle)', margin: 0 }}>{subtitle}</p>
            )}
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Fermer"
            className="focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
            style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <IconX size={18} strokeWidth={2} color="var(--color-text-subtle)" aria-hidden="true" />
          </motion.button>
        </div>

        {/* Book list */}
        <div style={{ overflowY: 'auto', padding: '0 20px 8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <BookActionCard
                book={book}
                actionLabel={actionLabel}
                actionBg={actionBg}
                actionColor={actionColor}
                onAction={onAction}
                onBookSelect={onBookSelect}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BookActionSheet;
