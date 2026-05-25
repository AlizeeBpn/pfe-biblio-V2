import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * BarButton — Segmented Control
 *
 * tabs    : string[] | { label: string, icon?: ComponentType }[]
 * size    : 'small' | 'medium' | 'large'
 * value   : number — controlled active index
 * onChange: (index: number) => void
 */

const configs = {
  small: {
    containerPad:    'var(--pad-2xs)',  // 4px
    containerGap:    'var(--gap-2xs)', // 2px
    containerRadius: 'var(--br-sm)',   // 8px
    height:          '32px',
    px:              'var(--pad-md)',   // 12px
    gap:             'var(--gap-sm)',   // 6px
    btnRadius:       'var(--br-xs)',   // 6px
    fontSize:        'var(--text-body-sm)',
    fontWeight:      700,
    iconSize:        16,
  },
  medium: {
    containerPad:    'var(--pad-xs)',  // 6px
    containerGap:    'var(--gap-xs)', // 4px
    containerRadius: '12px',
    height:          '40px',
    px:              'var(--pad-2md)', // 16px
    gap:             'var(--gap-md)',  // 8px
    btnRadius:       'var(--br-sm)',  // 8px
    fontSize:        'var(--text-body-md)',
    fontWeight:      700,
    iconSize:        20,
  },
  large: {
    containerPad:    'var(--pad-sm)',  // 8px
    containerGap:    'var(--gap-sm)', // 6px
    containerRadius: '16px',
    height:          '48px',
    px:              'var(--pad-lg)',  // 20px
    gap:             'var(--gap-2md)',// 12px
    btnRadius:       '12px',
    fontSize:        'var(--text-body-lg)',
    fontWeight:      600,
    iconSize:        24,
  },
};

export const BarButton = ({
  tabs = ['Bouton', 'Bouton'],
  size = 'medium',
  value,
  onChange,
}) => {
  const [internalActive, setInternalActive] = useState(0);
  const isControlled = value !== undefined;
  const activeIndex  = isControlled ? value : internalActive;

  const handleClick = (index) => {
    if (!isControlled) setInternalActive(index);
    onChange?.(index);
  };

  const c = configs[size];

  return (
    <div
      className="flex items-center w-full"
      style={{
        backgroundColor: 'var(--neutral-3)',
        padding:         c.containerPad,
        gap:             c.containerGap,
        borderRadius:    c.containerRadius,
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index;
        const label    = typeof tab === 'string' ? tab : tab.label;
        const Icon     = typeof tab === 'string' ? null : tab.icon;

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            whileTap={{ scale: 0.96 }}
            aria-pressed={isActive}
            className="flex-1 flex items-center justify-center font-sans transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
            style={{
              height:          c.height,
              fontSize:        c.fontSize,
              fontWeight:      c.fontWeight,
              gap:             c.gap,
              borderRadius:    c.btnRadius,
              paddingLeft:     c.px,
              paddingRight:    c.px,
              backgroundColor: isActive ? 'var(--neutral-1)' : 'transparent',
              color:           'var(--neutral-11)',
              border:          isActive ? '2px solid var(--neutral-7)' : '2px solid transparent',
            }}
          >
            {Icon && <Icon size={c.iconSize} strokeWidth={2} color="var(--neutral-10)" aria-hidden="true" />}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
};

export default BarButton;
