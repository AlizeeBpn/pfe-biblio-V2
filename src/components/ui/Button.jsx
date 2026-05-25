import { motion } from 'framer-motion'

/**
 * Button — core interactive element
 *
 * variant : 'primary' | 'secondary' | 'outlined' | 'text' | 'success' | 'error'
 * size    : 'sm' | 'md' | 'lg'
 * iconLeft / iconRight : ReactNode (Tabler icon)
 * iconOnly : bool — square icon-only button
 * disabled : bool
 */

/* Shadow spec (object-depth-color-1) */
const COLOR_SHADOW = '0 -2px 10px 0 var(--alpha-primary-08), 0 2px 10px 0 var(--alpha-primary-08)'
const NEUTRAL_SHADOW = '0 -2px 10px 0 var(--alpha-grey-09), 0 2px 10px 0 var(--alpha-grey-09)'

/*
 * Size tokens — touch mode:
 *   sm → h:var(--sz-lg)=40px   px:var(--pad-2md)=12px  gap:var(--gap-sm)=6px   radius:var(--br-sm)=8px
 *   md → h:var(--sz-xl)=48px   px:var(--pad-lg)=20px   gap:var(--gap-md)=8px   radius:var(--br-md)=10px
 *   lg → h:var(--sz-2xl)=56px  px:var(--pad-xl)=24px   gap:var(--gap-2md)=12px radius:var(--br-lg)=14px
 */
const SIZE = {
  sm: {
    cls: 'h-[var(--sz-lg)] px-[var(--pad-2md)] gap-[var(--gap-sm)] text-[var(--text-body-sm)] rounded-[var(--br-sm)]',
    iconOnly: 'h-[var(--sz-lg)] w-[var(--sz-lg)] rounded-[var(--br-sm)]',
  },
  md: {
    cls: 'h-[var(--sz-xl)] px-[var(--pad-lg)] gap-[var(--gap-md)] text-[var(--text-body-md)] rounded-[var(--br-md)]',
    iconOnly: 'h-[var(--sz-xl)] w-[var(--sz-xl)] rounded-[var(--br-md)]',
  },
  lg: {
    cls: 'h-[var(--sz-2xl)] px-[var(--pad-xl)] gap-[var(--gap-2md)] text-[var(--text-body-lg)] rounded-[var(--br-lg)]',
    iconOnly: 'h-[var(--sz-2xl)] w-[var(--sz-2xl)] rounded-[var(--br-lg)]',
  },
}

const VARIANT = {
  primary: {
    cls: `bg-[var(--primary-10)] text-white active:bg-[var(--primary-11)] disabled:bg-[var(--neutral-4)] disabled:shadow-none`,
    shadow: COLOR_SHADOW,
    style: {},
  },
  secondary: {
    cls: `bg-[var(--primary-3)] active:bg-[var(--primary-4)] disabled:bg-[var(--neutral-4)] disabled:shadow-none`,
    shadow: null,
    style: { color: '#297473' },
  },
  outlined: {
    cls: `bg-[var(--neutral-1)] border-2 border-[var(--neutral-7)] active:bg-[var(--neutral-3)] disabled:border-[var(--neutral-5)]`,
    shadow: null,
    style: { color: 'var(--neutral-11)' },
  },
  text: {
    cls: `bg-transparent active:bg-[var(--primary-3)]`,
    shadow: null,
    style: { color: 'var(--primary-9)' },
  },
  success: {
    cls: `bg-[var(--success-9)] text-white active:bg-[var(--success-10)] disabled:bg-[var(--neutral-4)] disabled:shadow-none`,
    shadow: NEUTRAL_SHADOW,
    style: {},
  },
  error: {
    cls: `bg-[var(--error-3)] active:bg-[var(--error-4)] disabled:bg-[var(--neutral-4)] disabled:shadow-none`,
    shadow: null,
    style: { color: 'var(--error-11)' },
  },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  iconOnly = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}) {
  const { cls: sizeClass, iconOnly: iconOnlyClass } = SIZE[size]
  const { cls: variantClass, shadow, style: variantStyle } = VARIANT[variant]

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95 }}
      style={{
        ...(shadow && !disabled ? { boxShadow: shadow } : {}),
        ...variantStyle,
      }}
      className={`
        inline-flex items-center justify-center
        font-bold
        select-none cursor-pointer
        transition-colors duration-100
        outline-none
        focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        ${iconOnly ? iconOnlyClass : sizeClass}
        ${variantClass}
        ${className}
      `}
    >
      {iconLeft  && <span className="flex items-center">{iconLeft}</span>}
      {!iconOnly && children}
      {iconRight && <span className="flex items-center">{iconRight}</span>}
      {iconOnly  && (iconLeft ?? iconRight ?? children)}
    </motion.button>
  )
}
