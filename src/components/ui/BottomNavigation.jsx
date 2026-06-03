import { motion } from 'framer-motion';
import { IconHome, IconLayoutGrid, IconBooks, IconUser, IconScan } from '@tabler/icons-react';

/**
 * BottomNavigation — floating pill, 366px wide, bottom-6
 *
 * activeTab : 'Accueil' | 'Services' | 'Catalogue' | 'Mon espace'
 * onChange  : (tabId: string) => void
 */

const PILL_SHADOW = [
  '0px 16px 9px 0px var(--alpha-grey-05)',
  '0px 7px 7px 0px var(--alpha-grey-09)',
  '0px 2px 4px 0px var(--alpha-grey-10)',
  '0px -11px 4px 0px var(--alpha-grey-01)',
  '0px -6px 4px 0px var(--alpha-grey-05)',
  '0px -3px 3px 0px var(--alpha-grey-09)',
  '0px -1px 2px 0px var(--alpha-grey-10)',
].join(', ');

const TABS = [
  { id: 'Accueil',    label: 'Accueil',    Icon: IconHome        },
  { id: 'Services',   label: 'Services',   Icon: IconLayoutGrid  },
  { id: 'Catalogue',  label: 'Catalogue',  Icon: IconBooks       },
  { id: 'Mon Espace', label: 'Mon Espace', Icon: IconUser        },
];

export const BottomNavigation = ({ activeTab = 'Accueil', onChange, onScan }) => {
  return (
    <div
      className="fixed bottom-[22px] left-1/2 -translate-x-1/2 z-50 w-full max-w-[366px] px-0 flex flex-col items-end"
      style={{ gap: '6px' }}
    >
      {/* FAB Scan — pill custom */}
      {onScan && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onScan}
          className="flex items-center outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
          style={{
            gap:             '6px',
            height:          '44px',
            padding:         '0 20px 0 14px',
            borderRadius:    '9999px',
            backgroundColor: 'var(--neutral-1)',
            border:          '1px solid var(--neutral-5)',
            boxShadow:       '0px 10px 6px 0px rgba(142,141,143,0.05), 0px 4px 4px 0px rgba(142,141,143,0.09), 0px 1px 2px 0px rgba(142,141,143,0.10)',
          }}
        >
          <IconScan size={18} strokeWidth={2} color="var(--neutral-10)" aria-hidden="true" />
          <span style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1, color: 'var(--neutral-11)', whiteSpace: 'nowrap' }}>
            Scanner un livre
          </span>
        </motion.button>
      )}

      <nav
        aria-label="Navigation principale"
        style={{
          display:        'flex',
          width:          '100%',
          padding:        'var(--pad-sm)',
          justifyContent: 'space-between',
          alignItems:     'center',
          borderRadius:   'var(--br-round)',
          border:         '1px solid var(--neutral-6)',
          background:     'var(--color-grey-0)',
          boxShadow:      PILL_SHADOW,
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onChange?.(id)}
              whileTap={{ scale: 0.92 }}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
              style={{
                gap:             'var(--gap-xs)',    // 4px
                padding:         'var(--pad-md) var(--pad-lg)', // 12px 20px
                borderRadius:    'var(--br-round)',
                backgroundColor: isActive ? 'var(--primary-3)' : 'transparent',
              }}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2 : 1.5}
                color={isActive ? 'var(--primary-11)' : 'var(--neutral-10)'}
                aria-hidden="true"
              />
              <span
                style={{
                  fontSize:   '10px',
                  fontWeight: 600,
                  lineHeight: 1,
                  color:      isActive ? 'var(--primary-11)' : 'var(--neutral-11)',
                }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
