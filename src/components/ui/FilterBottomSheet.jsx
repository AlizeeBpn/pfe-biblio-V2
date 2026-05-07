import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronDown, IconChevronUp, IconX } from '@tabler/icons-react';
import { ToggleButton } from './ToggleButton';

/* ── Shadows ── */
const SHADOW_SHEET =
  '0px 16px 9px 0px rgba(142,141,143,0.05), 0px 7px 7px 0px rgba(142,141,143,0.09), 0px 2px 4px 0px rgba(142,141,143,0.10), 0px -11px 4px 0px rgba(142,141,143,0.01), 0px -6px 4px 0px rgba(142,141,143,0.05), 0px -3px 3px 0px rgba(142,141,143,0.09), 0px -1px 2px 0px rgba(142,141,143,0.10)';
const SHADOW_CTA =
  '0px -2px 10px 0px rgba(99,181,180,0.08), 0px 2px 10px 0px rgba(99,181,180,0.08)';


/* ═══════════════════════════════════════════════════════════════
   CHECKBOX ROW — "Disponible maintenant"
   border-b + border-t / h=56px / px=20 / gap=12
   checkbox : 24×24 / border 2.5px / radius 2px (br-2xs)
   ═══════════════════════════════════════════════════════════════ */
function CheckboxRow({ label, checked, onChange }) {
  return (
    <motion.div
      whileTap={{ opacity: 0.7 }}
      onClick={() => onChange(!checked)}
      className="flex items-center cursor-pointer w-full"
      style={{
        height:        '56px',
        paddingLeft:   '20px',
        paddingRight:  '20px',
        gap:           '12px',
        borderTop:     '1px solid var(--neutral-4)',
        borderBottom:  '1px solid var(--neutral-4)',
      }}
    >
      <span className="flex-1" style={{
        fontSize:   '16px',
        fontWeight: 600,
        lineHeight: 1.5,
        color:      'var(--color-text-title)',
      }}>
        {label}
      </span>
      <div style={{
        width:           '24px',
        height:          '24px',
        borderRadius:    '2px',
        border:          checked
          ? '2.5px solid var(--primary-9)'
          : '2.5px solid var(--neutral-10)',
        backgroundColor: checked ? 'var(--primary-9)' : 'transparent',
        flexShrink:      0,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        transition:      'background-color 0.15s, border-color 0.15s',
      }}>
        {checked && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACCORDION — pixel-exact Figma node 368:2052
   fermé  : h=56px / border-b neutral-4 / pl=20 pr=12
   ouvert : border-b / py=12 / wrap toggle buttons px=16 gap=8
   ═══════════════════════════════════════════════════════════════ */
function FilterAccordion({ title, options, selections, onToggle, permanentOption, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  const selectedCount = Object.values(selections).filter(Boolean).length;

  return (
    <div
      className="w-full"
      style={{ borderBottom: '1px solid var(--neutral-4)' }}
    >
      {/* Header */}
      <motion.button
        type="button"
        whileTap={{ opacity: 0.7 }}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center outline-none border-none bg-transparent cursor-pointer"
        style={{
          minHeight:     '56px',
          paddingLeft:   '20px',
          paddingRight:  '12px',
          paddingTop:    open ? '12px' : '0',
          paddingBottom: '0',
          gap:           '12px',
        }}
      >
        {/* Title + count badge */}
        <div className="flex-1 flex items-center" style={{ gap: '8px', minWidth: 0 }}>
          <span className="text-left" style={{
            fontSize:   '16px',
            fontWeight: 600,
            lineHeight: 1.5,
            color:      'var(--color-text-title)',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
          {selectedCount > 0 && (
            <div style={{
              width:           '16px',
              height:          '16px',
              borderRadius:    '9999px',
              backgroundColor: 'var(--primary-10)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              flexShrink:      0,
            }}>
              <span style={{ fontSize: '10px', fontWeight: 500, lineHeight: 1, color: 'var(--primary-1)' }}>
                {selectedCount}
              </span>
            </div>
          )}
        </div>
        <span className="shrink-0 flex items-center" style={{ width: '24px', height: '24px' }}>
          {open
            ? <IconChevronUp   size={24} strokeWidth={2} color="var(--neutral-10)" />
            : <IconChevronDown size={24} strokeWidth={2} color="var(--neutral-10)" />
          }
        </span>
      </motion.button>

      {/* Toggle buttons body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="flex flex-wrap"
              style={{ gap: '8px', padding: '4px 16px 14px 16px' }}
            >
              {permanentOption && (
                <ToggleButton
                  size="medium"
                  selected={!!selections[permanentOption]}
                  onChange={val => onToggle(permanentOption, val)}
                >
                  {permanentOption}
                </ToggleButton>
              )}
              {options.map(opt => (
                <ToggleButton
                  key={opt}
                  size="medium"
                  selected={!!selections[opt]}
                  onChange={val => onToggle(opt, val)}
                >
                  {opt}
                </ToggleButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DONNÉES — catégories avec options enrichies
   ═══════════════════════════════════════════════════════════════ */
const FILTER_SECTIONS = [
  {
    id:      'genre',
    title:   'Genre',
    options: [
      'Roman', 'Science-fiction', 'Policier', 'Thriller', 'Fantasy', 'Aventure',
      'Horreur', 'Romance', 'Biographie', 'Autobiographie', 'Essai', 'Poésie',
      'Théâtre', 'Conte', 'Humour', 'BD & Manga', 'Jeunesse', 'Drame historique',
    ],
  },
  {
    id:      'type',
    title:   'Type de document',
    options: [
      'Roman', 'Thèse', 'Magazine', 'BD', 'Livre documentaire', 'eBook',
    ],
  },
  {
    id:      'domaine',
    title:   "Domaine d'étude",
    options: [
      'Littérature', 'Sciences', 'Histoire', 'Géographie', 'Philosophie', 'Art',
      'Musique', 'Cinéma', 'Droit', 'Économie', 'Informatique', 'Mathématiques',
      'Médecine', 'Psychologie', 'Sociologie', 'Linguistique', 'Religion', 'Sport',
    ],
  },
  {
    id:              'bibliotheque',
    title:           'Bibliothèque',
    permanentOption: 'Mériadeck',
    options: [
      'Grand Parc', 'Bacalan', 'Saint-Michel', 'Bordeaux-Lac',
      'Sainte-Croix', 'Bordeaux-Maritime', 'Chartrons', 'Bordeaux-Sud',
    ],
  },
  {
    id:      'annee',
    title:   'Année de publication',
    options: [
      'Avant 1800', '1800–1900', '1900–1950', '1950–1980',
      '1980–2000', '2000–2010', '2010–2015', '2015–2020', 'Après 2020',
    ],
  },
  {
    id:      'public',
    title:   'Public',
    options: [
      'Enfant', 'Ados', 'Adulte',
    ],
  },
  {
    id:      'langue',
    title:   'Langue',
    options: [
      'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais',
      'Arabe', 'Mandarin', 'Japonais', 'Russe', 'Polonais', 'Néerlandais',
    ],
  },
  {
    id:      'accessible',
    title:   'Accessibilité',
    options: [
      'Accès handicap', 'Braille', 'Grands caractères', 'FALC',
      'LSF (Langue des Signes)', 'Audio-description',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   FILTER BOTTOM SHEET
   Props:
     open               — bool
     onClose            — () => void
     onApply            — (filters: { disponible, selections }) => void
     externalSelections — object (synced when sheet opens)
     externalDisponible — bool   (synced when sheet opens)
   ═══════════════════════════════════════════════════════════════ */
export default function FilterBottomSheet({
  open,
  onClose,
  onApply,
  externalSelections,
  externalDisponible,
}) {
  const [disponible, setDisponible] = useState(externalDisponible ?? false);
  const [selections, setSelections] = useState(
    externalSelections ?? { bibliotheque: { 'Mériadeck': true } }
  );

  /* Sync internal state from parent when sheet opens */
  useEffect(() => {
    if (open) {
      setSelections(externalSelections ?? { bibliotheque: { 'Mériadeck': true } });
      setDisponible(externalDisponible ?? false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleOption = (sectionId, option, val) => {
    setSelections(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), [option]: val },
    }));
  };

  /* Compte les filtres actifs */
  const activeCount = Object.values(selections).reduce(
    (acc, section) => acc + Object.values(section).filter(Boolean).length,
    0
  ) + (disponible ? 1 : 0);

  const handleReset = () => {
    setSelections({ bibliotheque: { 'Mériadeck': true } });
    setDisponible(false);
  };

  const handleApply = () => {
    onApply?.({ disponible, selections });
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
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(34,33,35,0.45)' }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
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
              maxHeight:            '90dvh',
              maxWidth:             '430px',
              margin:               '0 auto',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center" style={{ paddingTop: '16px', paddingBottom: '4px', flexShrink: 0 }}>
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
              style={{ padding: '8px 20px 8px', gap: '4px' }}
            >
              <div className="flex-1 flex items-center" style={{ gap: '8px', minWidth: 0 }}>
                <span style={{
                  fontFamily: 'Lora, serif',
                  fontSize:   '20px',
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color:      'var(--color-text-title)',
                  whiteSpace: 'nowrap',
                }}>
                  Filtrer
                </span>
                {activeCount > 0 && (
                  <div style={{
                    width:           '20px',
                    height:          '20px',
                    borderRadius:    '9999px',
                    backgroundColor: 'var(--primary-10)',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    flexShrink:      0,
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, lineHeight: 1, color: 'var(--primary-1)' }}>
                      {activeCount}
                    </span>
                  </div>
                )}
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="shrink-0 flex items-center justify-center outline-none border-none cursor-pointer"
                style={{
                  padding:         '8px',
                  borderRadius:    '9999px',
                  backgroundColor: 'var(--neutral-4)',
                }}
              >
                <IconX size={20} strokeWidth={2} color="var(--neutral-11)" />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div
              className="flex flex-col overflow-y-auto flex-1"
              style={{ paddingTop: '16px' }}
            >
              <div style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                <CheckboxRow
                  label="Disponible maintenant"
                  checked={disponible}
                  onChange={setDisponible}
                />

                {FILTER_SECTIONS.map((section, i) => (
                  <FilterAccordion
                    key={section.id}
                    title={section.title}
                    options={section.options}
                    permanentOption={section.permanentOption}
                    selections={selections[section.id] || {}}
                    onToggle={(opt, val) => toggleOption(section.id, opt, val)}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>

              <div style={{ height: '8px', flexShrink: 0 }} />
            </div>

            {/* Footer */}
            <div
              className="flex items-center shrink-0"
              style={{ padding: '16px 16px 32px', gap: '10px' }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="flex-1 flex items-center justify-center outline-none cursor-pointer"
                style={{
                  height:          '48px',
                  borderRadius:    'var(--br-md)',
                  border:          '2px solid var(--neutral-7)',
                  backgroundColor: 'var(--neutral-1)',
                  color:           'var(--neutral-11)',
                  fontSize:        '16px',
                  fontWeight:      700,
                  lineHeight:      1.5,
                }}
              >
                Annuler
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleApply}
                className="flex-1 flex items-center justify-center outline-none cursor-pointer"
                style={{
                  height:          '48px',
                  borderRadius:    'var(--br-md)',
                  border:          'none',
                  backgroundColor: 'var(--primary-10)',
                  color:           'var(--neutral-1)',
                  fontSize:        '16px',
                  fontWeight:      700,
                  lineHeight:      1.5,
                  boxShadow:       SHADOW_CTA,
                  whiteSpace:      'nowrap',
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
