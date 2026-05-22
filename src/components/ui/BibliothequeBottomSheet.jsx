import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@tabler/icons-react';

const SHADOW_SHEET =
  '0px 16px 9px 0px rgba(142,141,143,0.05), 0px 7px 7px 0px rgba(142,141,143,0.09), 0px 2px 4px 0px rgba(142,141,143,0.10), 0px -11px 4px 0px rgba(142,141,143,0.01), 0px -6px 4px 0px rgba(142,141,143,0.05), 0px -3px 3px 0px rgba(142,141,143,0.09), 0px -1px 2px 0px rgba(142,141,143,0.10)';
const SHADOW_CTA =
  '0px -2px 10px 0px rgba(99,181,180,0.08), 0px 2px 10px 0px rgba(99,181,180,0.08)';

export const BORDEAUX_LIBRARIES = [
  'Mériadeck',
  'Grand Parc',
  'Bacalan',
  'Saint-Michel',
  'Bordeaux-Lac',
  'Sainte-Croix',
  'Bordeaux-Maritime',
  'Chartrons',
  'Bordeaux-Sud',
];

function LibraryRow({ name, checked, onChange }) {
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
        borderBottom:  '1px solid var(--neutral-4)',
      }}
    >
      <span className="flex-1" style={{
        fontSize:   '16px',
        fontWeight: 600,
        lineHeight: 1.5,
        color:      'var(--color-text-title)',
      }}>
        {name}
      </span>
      <div style={{
        width:           '24px',
        height:          '24px',
        borderRadius:    '2px',
        border:          checked ? '2.5px solid var(--primary-9)' : '2.5px solid var(--neutral-10)',
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

export default function BibliothequeBottomSheet({ open, onClose, onApply, selectedLibraries = {} }) {
  const [localSelected, setLocalSelected] = useState(selectedLibraries);

  useEffect(() => {
    if (open) setLocalSelected(selectedLibraries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (name) =>
    setLocalSelected(prev => ({ ...prev, [name]: !prev[name] }));

  const handleReset = () => {
    if (selectedCount === 0) {
      onClose();
    } else {
      setLocalSelected({});
      onApply?.({});
      onClose();
    }
  };

  const handleApply = () => {
    onApply?.(localSelected);
    onClose();
  };

  const selectedCount = Object.values(localSelected).filter(Boolean).length;

  return (
    <AnimatePresence>
      {open && (
        <>
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
              maxHeight:            '80dvh',
              maxWidth:             '430px',
              margin:               '0 auto',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center" style={{ paddingTop: '16px', paddingBottom: '4px', flexShrink: 0 }}>
              <div style={{ width: '80px', height: '8px', borderRadius: '9999px', backgroundColor: 'var(--neutral-3)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center shrink-0" style={{ padding: '8px 20px 8px', gap: '4px' }}>
              <div className="flex-1 flex items-center" style={{ gap: '8px', minWidth: 0 }}>
                <span style={{
                  fontFamily: 'Lora, serif',
                  fontSize:   '20px',
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color:      'var(--color-text-title)',
                  whiteSpace: 'nowrap',
                }}>
                  Bibliothèque
                </span>
                {selectedCount > 0 && (
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
                      {selectedCount}
                    </span>
                  </div>
                )}
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

            {/* Library list */}
            <div
              className="flex flex-col overflow-y-auto flex-1"
              style={{ paddingTop: '8px', paddingLeft: '12px', paddingRight: '12px' }}
            >
              {BORDEAUX_LIBRARIES.map(lib => (
                <LibraryRow
                  key={lib}
                  name={lib}
                  checked={!!localSelected[lib]}
                  onChange={() => toggle(lib)}
                />
              ))}
              <div style={{ height: '8px', flexShrink: 0 }} />
            </div>

            {/* Footer */}
            <div className="flex items-center shrink-0" style={{ padding: '16px 16px 32px', gap: '10px' }}>
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
                {selectedCount === 0 ? 'Annuler' : 'Vider la sélection'}
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
