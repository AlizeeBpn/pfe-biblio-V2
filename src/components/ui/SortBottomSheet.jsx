import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';

/* ── Shadows ── */
const SHADOW_SHEET =
  '0px 16px 9px 0px rgba(142,141,143,0.05), 0px 7px 7px 0px rgba(142,141,143,0.09), 0px 2px 4px 0px rgba(142,141,143,0.10), 0px -11px 4px 0px rgba(142,141,143,0.01), 0px -6px 4px 0px rgba(142,141,143,0.05), 0px -3px 3px 0px rgba(142,141,143,0.09), 0px -1px 2px 0px rgba(142,141,143,0.10)';

/* ═══════════════════════════════════════════════════
   OPTIONS — Figma 379:5670
   ═══════════════════════════════════════════════════ */
const SORT_OPTIONS = [
  { id: 'pertinence',      label: 'Pertinence' },
  { id: 'mieux_notes',     label: 'Les mieux notées' },
  { id: 'plus_empruntes',  label: 'Les plus empruntés' },
  { id: 'auteur_az',       label: 'Par auteur (A-Z)' },
  { id: 'titre_az',        label: 'Par titre (A-Z)' },
];

/* ═══════════════════════════════════════════════════
   RADIO ROW
   row h=40 / radio 24×24 / border 2.5px / gap-sm=8px
   ═══════════════════════════════════════════════════ */
function RadioRow({ label, checked, onSelect }) {
  return (
    <motion.div
      whileTap={{ opacity: 0.7 }}
      onClick={onSelect}
      role="radio"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(); } }}
      className="flex items-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:rounded"
      style={{ height: '40px', gap: '8px' }}
    >
      {/* Radio icon container 32×40 */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: '32px', height: '40px' }}
      >
        {/* Outer circle 24×24 */}
        <div style={{
          width:           '24px',
          height:          '24px',
          borderRadius:    '9999px',
          border:          checked
            ? '2.5px solid var(--primary-10)'
            : '2.5px solid var(--neutral-10)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
          transition:      'border-color 0.15s',
        }}>
          {/* Inner dot when checked */}
          {checked && (
            <div style={{
              width:           '12px',
              height:          '12px',
              borderRadius:    '9999px',
              backgroundColor: 'var(--primary-8)',
            }} />
          )}
        </div>
      </div>

      {/* Label */}
      <span style={{
        fontSize:   '14px',
        fontWeight: 700,
        lineHeight: 1.5,
        color:      'var(--neutral-11)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   SORT BOTTOM SHEET — Figma 379:5670
   Props:
     open      — bool
     onClose   — () => void
     value     — string (sort option id)
     onChange  — (id: string) => void
   ═══════════════════════════════════════════════════ */
export default function SortBottomSheet({ open, onClose, value = 'pertinence', onChange }) {
  const [selected, setSelected] = useState(value);

  /* Sync from parent when opening */
  useEffect(() => {
    if (open) setSelected(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (id) => {
    setSelected(id);
    onChange?.(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(34,33,35,0.45)' }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sort-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
            style={{
              backgroundColor:      'white',
              borderTopLeftRadius:  '32px',
              borderTopRightRadius: '32px',
              boxShadow:            SHADOW_SHEET,
              maxWidth:             '430px',
              margin:               '0 auto',
              paddingTop:           '16px',
              paddingBottom:        '32px',
              gap:                  '16px',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center" style={{ flexShrink: 0 }}>
              <div style={{
                width:           '80px',
                height:          '8px',
                borderRadius:    '9999px',
                backgroundColor: 'var(--neutral-3)',
              }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center shrink-0"
              style={{ padding: '0 20px', gap: '4px' }}
            >
              <div className="flex-1 flex items-center" style={{ gap: '8px' }}>
                <span id="sort-title" style={{
                  fontFamily: 'Lora, serif',
                  fontSize:   '20px',
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color:      'var(--color-text-title)',
                }}>
                  Trier
                </span>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Fermer"
                className="shrink-0 flex items-center justify-center outline-none border-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
                style={{
                  padding:         '8px',
                  borderRadius:    '9999px',
                  backgroundColor: 'var(--neutral-4)',
                }}
              >
                <IconX size={20} strokeWidth={2} color="var(--neutral-11)" aria-hidden="true" />
              </motion.button>
            </div>

            {/* Radio list */}
            <div
              role="radiogroup"
              aria-labelledby="sort-title"
              className="flex flex-col"
              style={{ padding: '0 12px', gap: '4px' }}
            >
              {SORT_OPTIONS.map(opt => (
                <RadioRow
                  key={opt.id}
                  label={opt.label}
                  checked={selected === opt.id}
                  onSelect={() => handleSelect(opt.id)}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
