import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconSearch, IconX, IconAdjustmentsHorizontal } from '@tabler/icons-react'

/**
 * SearchInput — search field with left search icon, right clear + filter icons
 *
 * size       : 'sm' | 'md' | 'lg'
 * value      : string (controlled)
 * onChange   : (value: string) => void
 * onFilter   : () => void — called when filter icon tapped (optional)
 * placeholder: string
 * disabled   : bool
 */
export default function SearchInput({
  size = 'md',
  value,
  onChange,
  onFilter,
  placeholder = 'Un titre, un auteur, ISBN…',
  disabled = false,
  className = '',
}) {
  const [internalValue, setInternalValue] = useState('')

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value)
    onChange?.(e.target.value)
  }

  const handleClear = () => {
    if (!isControlled) setInternalValue('')
    onChange?.('')
  }

  const sizeMap = {
    sm: { height: 'h-[32px]', iconSize: 16, text: 'text-[var(--text-body-sm)]', px: 'px-[var(--pad-sm)]', gap: 'gap-[var(--gap-xs)]' },
    md: { height: 'h-[40px]', iconSize: 20, text: 'text-[var(--text-body-sm)]', px: 'px-[var(--pad-md)]', gap: 'gap-[var(--gap-sm)]' },
    lg: { height: 'h-[48px]', iconSize: 20, text: 'text-[var(--text-body-md)]', px: 'px-[var(--pad-2md)]', gap: 'gap-[var(--gap-md)]' },
  }

  const { height, iconSize, text, px, gap } = sizeMap[size]

  return (
    <div
      className={`
        flex items-center ${height} ${px} ${gap}
        bg-white border border-[var(--neutral-5)]
        rounded-[var(--br-round)]
        transition-colors duration-150
        focus-within:border-[var(--primary-8)] focus-within:ring-2 focus-within:ring-[var(--primary-4)]
        ${disabled ? 'opacity-40 pointer-events-none bg-[var(--neutral-2)]' : ''}
        ${className}
      `}
    >
      {/* left icon */}
      <IconSearch
        size={iconSize}
        strokeWidth={1.5}
        className="shrink-0 text-[var(--color-icon-info)]"
        aria-hidden="true"
      />

      {/* input */}
      <input
        type="search"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        className={`
          flex-1 bg-transparent outline-none border-none
          ${text} text-[var(--color-text-body)]
          placeholder:text-[var(--color-text-placeholder)]
          font-['Plus_Jakarta_Sans']
        `}
      />

      {/* clear button — shown when there is text */}
      {currentValue.length > 0 && (
        <motion.button
          type="button"
          onTap={handleClear}
          whileTap={{ scale: 0.9 }}
          aria-label="Effacer la recherche"
          className="shrink-0 flex items-center text-[var(--color-icon-action)] focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:rounded-full"
        >
          <IconX size={iconSize} strokeWidth={1.5} aria-hidden="true" />
        </motion.button>
      )}

      {/* filter icon — shown when no text typed */}
      {currentValue.length === 0 && onFilter && (
        <motion.button
          type="button"
          onTap={onFilter}
          whileTap={{ scale: 0.9 }}
          aria-label="Filtres"
          className="shrink-0 flex items-center text-[var(--color-icon-action)] focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:rounded-full"
        >
          <IconAdjustmentsHorizontal size={iconSize} strokeWidth={1.5} aria-hidden="true" />
        </motion.button>
      )}
    </div>
  )
}
