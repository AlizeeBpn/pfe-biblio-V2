import { motion } from 'framer-motion'
import { IconStarFilled, IconDotsVertical } from '@tabler/icons-react'
import Badge from './Badge'
import BookCover from '../BookCover'

/**
 * BookCard — Figma node 356:7052
 *
 * Strictly the same component used across all book lists.
 * Badge content (variant/label/icon) is passed explicitly by the parent.
 *
 * cover        : string (image URL)
 * title        : string
 * author       : string
 * genres       : string — "Roman, Science-fiction, ..."
 * badgeVariant : Badge variant string
 * badgeLabel   : string — badge text
 * badgeIcon    : ReactNode — icon inside the badge
 * rating       : number (optional)
 * onClick      : () => void
 */

const SHADOW_CARD =
  '0px 2px 10px 0px rgba(142,141,143,0.07)'

const SHADOW_COVER =
  '0px 28px 8px 0px rgba(125,120,120,0),' +
  '0px 18px 7px 0px rgba(125,120,120,0.01),' +
  '0px 10px 6px 0px rgba(125,120,120,0.05),' +
  '0px 4px 4px 0px rgba(125,120,120,0.09),' +
  '0px 1px 2px 0px rgba(125,120,120,0.1)'

export default function BookCard({
  cover,
  title,
  author,
  genres,
  badgeVariant = 'success',
  badgeLabel   = 'Disponible',
  badgeIcon,
  rating,
  onClick,
  onMenuClick,
  className = '',
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}${author ? ` par ${author}` : ''}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      className={`flex items-stretch overflow-hidden cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:outline-none ${className}`}
      style={{
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-3)',
        borderRadius:    'var(--br-lg)',
        boxShadow:       SHADOW_CARD,
        paddingTop:      '8px',
        paddingLeft:     '8px',
        paddingRight:    '8px',
        paddingBottom:   0,
        gap:             'var(--gap-2md)', /* 12px */
        height:          '141px',
      }}
    >
      {/* Cover */}
      <BookCover
        cover={cover}
        title={title}
        style={{
          width:                   '127px',
          alignSelf:               'stretch',
          borderTopLeftRadius:     'var(--br-sm)',
          borderTopRightRadius:    'var(--br-sm)',
          borderBottomLeftRadius:  0,
          borderBottomRightRadius: 0,
          boxShadow:               SHADOW_COVER,
          flexShrink:              0,
        }}
      />

      {/* Content */}
      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ gap: 'var(--gap-md)', paddingBottom: '12px' }}
      >
        {/* Badge + Rating/Menu row */}
        <div className="flex items-center" style={{ gap: '8px', minWidth: 0 }}>
          <Badge variant={badgeVariant} size="large" icon={badgeIcon}>
            {badgeLabel}
          </Badge>

          <div className="flex-1" />

          {onMenuClick ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={e => { e.stopPropagation(); onMenuClick(e); }}
              aria-label={`Plus d'options pour ${title}`}
              className="focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:rounded-full"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', margin: '-8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <IconDotsVertical size={18} strokeWidth={2} color="var(--color-text-subtle)" aria-hidden="true" />
            </motion.button>
          ) : rating != null ? (
            <div className="flex items-center shrink-0" style={{ gap: '4px' }} aria-label={`Note ${rating} sur 5`}>
              <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: 1, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
                {rating}/5
              </span>
              <IconStarFilled size={16} color="var(--secondary-11)" aria-hidden="true" />
            </div>
          ) : null}
        </div>

        {/* Text block */}
        <div className="flex flex-col min-w-0" style={{ gap: '2px' }}>
          <p style={{
            fontSize:        '16px',
            fontWeight:      700,
            lineHeight:      1.5,
            color:           'var(--color-text-title)',
            margin:          0,
            overflow:        'hidden',
            textOverflow:    'ellipsis',
            display:         '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {title}
          </p>
          <p style={{
            fontSize:     '14px',
            fontWeight:   500,
            lineHeight:   1.5,
            color:        'var(--color-text-body)',
            margin:       0,
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}>
            {author}
          </p>
          {genres && (
            <p style={{
              fontSize:     '12px',
              fontWeight:   400,
              lineHeight:   1,
              color:        'var(--color-text-subtle)',
              margin:       0,
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}>
              {genres}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
