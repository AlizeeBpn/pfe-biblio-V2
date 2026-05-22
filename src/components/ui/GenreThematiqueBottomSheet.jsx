import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronDown, IconChevronUp, IconX } from '@tabler/icons-react';
import { ToggleButton } from './ToggleButton';

const SHADOW_SHEET =
  '0px 16px 9px 0px rgba(142,141,143,0.05), 0px 7px 7px 0px rgba(142,141,143,0.09), 0px 2px 4px 0px rgba(142,141,143,0.10), 0px -11px 4px 0px rgba(142,141,143,0.01), 0px -6px 4px 0px rgba(142,141,143,0.05), 0px -3px 3px 0px rgba(142,141,143,0.09), 0px -1px 2px 0px rgba(142,141,143,0.10)';
const SHADOW_CTA =
  '0px -2px 10px 0px rgba(99,181,180,0.08), 0px 2px 10px 0px rgba(99,181,180,0.08)';

const FICTION_TYPES  = ['Roman', 'BD', 'Manga'];
const FICTION_GENRES = [
  'Thriller', 'Romance', 'Science-fiction', 'Policier', 'Fantaisie',
  'Aventure', 'Horreur', 'Drame historique', 'Humour', 'Conte', 'Jeunesse',
];

export const DOC_SECTIONS = [
  { id: 'histoire', label: 'Histoire & Géographie',    items: ['Histoire', 'Géographie', 'Voyage'] },
  { id: 'sciences', label: 'Sciences',                  items: ['Mathématiques', 'Physique & Chimie', 'Biologie & Sciences naturelles', 'Astronomie & Espace', 'Technologie & Numérique'] },
  { id: 'nature',   label: 'Nature & Santé',            items: ['Jardinage & Nature', 'Santé & Médecine', 'Sport & Loisirs'] },
  { id: 'philo',    label: 'Philosophie & Psychologie', items: ['Philosophie', 'Psychologie', 'Spiritualité & Religion'] },
  { id: 'societe',  label: 'Société',                   items: ['Sociologie', 'Politique', 'Droit', 'Économie', 'Langues'] },
  { id: 'arts',     label: 'Arts & Culture',            items: ['Art & Architecture', 'Musique', 'Cinéma', 'Activités créatives', 'Cuisine & Art de vivre'] },
];

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-brand)',
      fontSize:   '16px',
      fontWeight: 700,
      lineHeight: 1.4,
      color:      'var(--color-text-body)',
      margin:     0,
    }}>
      {children}
    </p>
  );
}

function CountBadge({ count, size = 16 }) {
  if (!count) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '9999px',
      backgroundColor: 'var(--primary-10)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontSize: '10px', fontWeight: 500, lineHeight: 1, color: 'var(--primary-1)' }}>
        {count}
      </span>
    </div>
  );
}

const CHECKMARK = (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
    <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Accordion documentaire ── */
function DocAccordion({ section, parentSelected, onParentToggle, itemSelections, onItemToggle, expanded, onExpandToggle }) {
  const selectedChildCount = Object.values(itemSelections).filter(Boolean).length;
  const badgeCount = (parentSelected ? 1 : 0) + selectedChildCount;

  return (
    <div style={{ borderBottom: '1px solid var(--neutral-4)' }}>
      {/* Header row */}
      <div className="flex items-center" style={{ minHeight: '56px', paddingRight: '12px', gap: '8px' }}>

        {/* Zone gauche : checkbox + label → sélectionne la catégorie */}
        <motion.div
          whileTap={{ opacity: 0.7 }}
          onClick={onParentToggle}
          className="flex-1 flex items-center cursor-pointer"
          style={{ gap: '12px', paddingLeft: '20px', paddingTop: '14px', paddingBottom: '14px' }}
        >
          <div style={{
            width: '24px', height: '24px', borderRadius: '2px', flexShrink: 0,
            border: parentSelected ? '2.5px solid var(--primary-9)' : '2.5px solid var(--neutral-10)',
            backgroundColor: parentSelected ? 'var(--primary-9)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}>
            {parentSelected && CHECKMARK}
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text-title)' }}>
            {section.label}
          </span>
          <CountBadge count={badgeCount} />
        </motion.div>

        {/* Chevron expand/collapse — indépendant */}
        <motion.button
          type="button"
          whileTap={{ opacity: 0.7 }}
          onClick={onExpandToggle}
          className="shrink-0 flex items-center justify-center outline-none border-none bg-transparent cursor-pointer"
          style={{ width: '32px', height: '32px' }}
        >
          {expanded
            ? <IconChevronUp   size={24} strokeWidth={2} color="var(--neutral-10)" />
            : <IconChevronDown size={24} strokeWidth={2} color="var(--neutral-10)" />
          }
        </motion.button>
      </div>

      {/* Sub-items */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="flex flex-wrap" style={{ gap: '8px', padding: '4px 16px 14px 20px' }}>
              {section.items.map(item => (
                <ToggleButton
                  key={item}
                  size="medium"
                  selected={parentSelected || !!itemSelections[item]}
                  onChange={() => {
                    if (parentSelected) {
                      onParentToggle();
                      section.items.filter(i => i !== item).forEach(i => onItemToggle(i, true));
                    } else {
                      onItemToggle(item, !itemSelections[item]);
                    }
                  }}
                >
                  {item}
                </ToggleButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GENRE & THÉMATIQUE BOTTOM SHEET
   Props:
     open           — bool
     onClose        — () => void
     onApply        — (state) => void
     externalState  — { types, genres, docParents, docItems }
   ═══════════════════════════════════════════════════ */
export default function GenreThematiqueBottomSheet({ open, onClose, onApply, externalState }) {
  const [types,           setTypes]           = useState(externalState?.types      ?? {});
  const [genres,          setGenres]          = useState(externalState?.genres     ?? {});
  const [docParents,      setDocParents]      = useState(externalState?.docParents ?? {});
  const [docItems,        setDocItems]        = useState(externalState?.docItems   ?? {});
  const [expanded,        setExpanded]        = useState({});

  useEffect(() => {
    if (open) {
      setTypes(externalState?.types           ?? {});
      setGenres(externalState?.genres         ?? {});
      setDocParents(externalState?.docParents ?? {});
      setDocItems(externalState?.docItems     ?? {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleType   = (key, val) => setTypes(p => ({ ...p, [key]: val }));
  const toggleGenre  = (key, val) => setGenres(p => ({ ...p, [key]: val }));
  const toggleParent = (id)       => setDocParents(p => ({ ...p, [id]: !p[id] }));
  const toggleItem   = (item, val) => setDocItems(p => ({ ...p, [item]: val }));
  const toggleExpand = (id)       => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const totalCount =
    Object.values(types).filter(Boolean).length +
    Object.values(genres).filter(Boolean).length +
    Object.values(docParents).filter(Boolean).length +
    Object.values(docItems).filter(Boolean).length;

  const handleReset = () => {
    setTypes({});
    setGenres({});
    setDocParents({});
    setDocItems({});
  };

  const handleApply = () => {
    onApply?.({ types, genres, docParents, docItems });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(34,33,35,0.45)' }}
          />

          <motion.div
            key="sheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
            style={{
              backgroundColor:      'white',
              borderTopLeftRadius:  '32px',
              borderTopRightRadius: '32px',
              boxShadow:            SHADOW_SHEET,
              maxHeight:            '90dvh',
              maxWidth:             '430px',
              margin:               '0 auto',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center" style={{ paddingTop: '16px', paddingBottom: '4px', flexShrink: 0 }}>
              <div style={{ width: '80px', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--neutral-3)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center shrink-0" style={{ padding: '8px 20px', gap: '4px' }}>
              <div className="flex-1 flex items-center" style={{ gap: '8px', minWidth: 0 }}>
                <span style={{
                  fontFamily: 'Lora, serif', fontSize: '20px', fontWeight: 700,
                  lineHeight: 1.5, color: 'var(--color-text-title)', whiteSpace: 'nowrap',
                }}>
                  Genre & Thématique
                </span>
                <CountBadge count={totalCount} size={20} />
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="shrink-0 flex items-center justify-center outline-none border-none cursor-pointer"
                style={{ padding: '8px', borderRadius: '9999px', backgroundColor: 'var(--neutral-4)' }}
              >
                <IconX size={20} strokeWidth={2} color="var(--neutral-11)" />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div className="flex flex-col overflow-y-auto flex-1" style={{ paddingBottom: '8px', minHeight: 0, WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

              {/* ── FICTION ── */}
              <div style={{ borderBottom: '1px solid var(--neutral-4)', padding: '16px 20px' }}>
                <div className="flex items-center" style={{ marginBottom: '12px' }}>
                  <span className="flex-1" style={{ fontFamily: 'var(--font-brand)', fontSize: '16px', fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text-body)' }}>
                    Fiction
                  </span>
                  <CountBadge count={Object.values(types).filter(Boolean).length + Object.values(genres).filter(Boolean).length} />
                </div>
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <div className="flex flex-wrap" style={{ gap: '8px' }}>
                    {FICTION_TYPES.map(t => (
                      <ToggleButton key={t} size="medium" selected={!!types[t]} onChange={val => toggleType(t, val)}>{t}</ToggleButton>
                    ))}
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'var(--neutral-3)' }} />
                  <div className="flex flex-wrap" style={{ gap: '8px' }}>
                    {FICTION_GENRES.map(g => (
                      <ToggleButton key={g} size="medium" selected={!!genres[g]} onChange={val => toggleGenre(g, val)}>{g}</ToggleButton>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── DOCUMENTAIRE ── */}
              <div style={{ padding: '16px 20px 0' }}>
                <div className="flex items-center" style={{ marginBottom: '4px' }}>
                  <span className="flex-1" style={{ fontFamily: 'var(--font-brand)', fontSize: '16px', fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text-body)' }}>
                    Documentaire
                  </span>
                  <CountBadge count={Object.values(docParents).filter(Boolean).length + Object.values(docItems).filter(Boolean).length} />
                </div>
              </div>
              {DOC_SECTIONS.map(section => (
                <DocAccordion
                  key={section.id}
                  section={section}
                  parentSelected={!!docParents[section.id]}
                  onParentToggle={() => toggleParent(section.id)}
                  itemSelections={Object.fromEntries(section.items.map(item => [item, !!docItems[item]]))}
                  onItemToggle={toggleItem}
                  expanded={!!expanded[section.id]}
                  onExpandToggle={() => toggleExpand(section.id)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center shrink-0" style={{ padding: '16px 16px 32px', gap: '10px' }}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="flex-1 flex items-center justify-center outline-none cursor-pointer"
                style={{
                  height: '48px', borderRadius: 'var(--br-md)',
                  border: '2px solid var(--neutral-7)', backgroundColor: 'var(--neutral-1)',
                  color: 'var(--neutral-11)', fontSize: '16px', fontWeight: 700, lineHeight: 1.5,
                }}
              >
                Réinitialiser
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleApply}
                className="flex-1 flex items-center justify-center outline-none cursor-pointer"
                style={{
                  height: '48px', borderRadius: 'var(--br-md)', border: 'none',
                  backgroundColor: 'var(--primary-10)', color: 'var(--neutral-1)',
                  fontSize: '16px', fontWeight: 700, lineHeight: 1.5,
                  boxShadow: SHADOW_CTA, whiteSpace: 'nowrap',
                }}
              >
                Valider la sélection
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
