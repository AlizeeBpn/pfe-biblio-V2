import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSettings,
  IconQrcode,
  IconCalendarTime,
  IconCalendarEvent,
  IconMessageCircle,
  IconMessageCircleUser,
  IconMessageChatbot,
  IconShoppingBagCheck,
  IconChevronRight,
  IconBookmark,
  IconHistory,
  IconX,
  IconDotsVertical,
  IconArrowLeft,
  IconPencil,
  IconTrash,
  IconStar,
  IconMinus,
  IconCalendarCheck,
} from '@tabler/icons-react';
import { BottomNavigation } from '../components/ui/BottomNavigation';
import Badge from '../components/ui/Badge';
import { TabList } from '../components/ui/Tab';
import { BookListPage } from '../components/BookListPage';
import { BOOKS as ALL_BOOKS } from '../data/books';

const RESERVED_BOOKS = ALL_BOOKS.slice(0, 4);
const BORROWED_BOOKS = [
  ALL_BOOKS.find(b => b.id === 7),  // Naruto — 24 juin 2026
  ALL_BOOKS.find(b => b.id === 6),  // Seigneur des Anneaux — 24 juin 2026
  ALL_BOOKS.find(b => b.id === 5),  // Harry Potter — 12 juillet 2026 (dernier)
].map((b) => ({
  ...b,
  returnDate: b.id === 5 ? '12 juillet 2026' : '24 juin 2026',
}));

/* ════════════════════════════════════════════════════
   SHADOWS
   ════════════════════════════════════════════════════ */
const SHADOW_CARD =   '0px 1px 2px 0px var(--alpha-grey-10), 0px 4px 4px 0px var(--alpha-grey-09), 0px 10px 6px 0px var(--alpha-grey-05), 0px 18px 7px 0px var(--alpha-grey-01)';
const SHADOW_BTN  =   '0px 1px 2px 0px var(--alpha-primary-25), 0px 4px 4px 0px var(--alpha-primary-25), 0px 10px 6px 0px var(--alpha-primary-25), 0px 18px 7px 0px var(--alpha-primary-08)';
const SHADOW_LIST =   '0px 1px 2px 0px var(--alpha-grey-10), 0px 4px 4px 0px var(--alpha-grey-09), 0px 10px 6px 0px var(--alpha-grey-05), 0px 18px 7px 0px var(--alpha-grey-01)';
const SHADOW_BOOK_CARD = '0px 1px 2px 0px var(--alpha-grey-10), 0px 4px 4px 0px var(--alpha-grey-09), 0px 10px 6px 0px var(--alpha-grey-05), 0px 18px 7px 0px var(--alpha-grey-01)';
const SHADOW_DROPDOWN = '0px 10px 20px 0px var(--alpha-grey-20), 0px 2px 8px 0px var(--alpha-grey-20)';


/* ════════════════════════════════════════════════════
   INFO CARD — v2
   ════════════════════════════════════════════════════ */
const BADGE_ICON_COLOR = { success: 'var(--success-11)', default: 'var(--secondary-11)', info: 'var(--info-11)' };

function InfoCard({ category, count, typeLabel, badge, badgeIcon: BadgeIcon, badgeVariant = 'default', onClick }) {
  const iconColor = BADGE_ICON_COLOR[badgeVariant] ?? 'var(--secondary-11)';
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col cursor-pointer"
      style={{
        flex:            '1 0 0',
        minWidth:         0,
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-3)',
        borderRadius:    '12px',
        boxShadow:       SHADOW_LIST,
        padding:         '8px',
        gap:             '12px',
        overflow:        'hidden',
        justifyContent:  'flex-end',
      }}
    >
      {/* Info container */}
      <div className="flex flex-col w-full" style={{ gap: '8px' }}>
        {/* Badge — haut, compact */}
        <div className="flex shrink-0">
          <Badge
            variant={badgeVariant}
            size="large"
            icon={BadgeIcon && <BadgeIcon size={16} strokeWidth={2} color={iconColor} />}
          >
            {badge}
          </Badge>
        </div>

        {/* Catégorie — centré */}
        <p style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-brand)', margin: 0, textAlign: 'center', width: '100%' }}>
          {category}
        </p>

        {/* Compteur centré */}
        <div className="flex items-center justify-center w-full" style={{ gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-brand)', fontSize: '24px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text-title)' }}>
            {count}
          </span>
          <span style={{ fontFamily: 'var(--font-brand)', fontSize: '16px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text-title)' }}>
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Bouton Voir détail — la carte parente gère le clic */}
      <div
        className="flex items-center justify-center w-full pointer-events-none"
        style={{ height: '32px', backgroundColor: 'var(--primary-3)', borderRadius: '6px' }}
      >
        <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.5, color: 'var(--primary-11)' }}>
          Voir détail
        </span>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   ROW ITEM
   ════════════════════════════════════════════════════ */
function RowItem({ icon: Icon, label, isFirst, isLast }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex items-center cursor-pointer"
      style={{
        gap: '12px', padding: '0 12px', height: '64px',
        backgroundColor: 'var(--neutral-1)',
        borderLeft: '1px solid var(--neutral-6)', borderRight: '1px solid var(--neutral-6)',
        borderTop: '1px solid var(--neutral-6)', borderBottom: isLast ? '1px solid var(--neutral-6)' : 'none',
        borderTopLeftRadius: isFirst ? '20px' : 0, borderTopRightRadius: isFirst ? '20px' : 0,
        borderBottomLeftRadius: isLast ? '20px' : 0, borderBottomRightRadius: isLast ? '20px' : 0,
      }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--br-round)', backgroundColor: 'var(--primary-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} strokeWidth={1.8} color="var(--primary-10)" />
      </div>
      <span style={{ flex: '1 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--color-text-title)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <IconChevronRight size={20} strokeWidth={2} color="var(--color-text-subtle)" />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   QR MODAL
   ════════════════════════════════════════════════════ */
function QRModal({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 38 }} onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: 'var(--neutral-1)', borderRadius: '24px', padding: '32px 24px', width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
      >
        <div className="flex items-center justify-between w-full">
          <p style={{ fontFamily: 'var(--font-brand)', fontSize: '18px', fontWeight: 700, color: 'var(--color-text-brand)', margin: 0 }}>Carte d'adhérente</p>
          <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ width: '36px', height: '36px', borderRadius: 'var(--br-round)', backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconX size={18} strokeWidth={2} color="var(--color-text-subtle)" />
          </motion.button>
        </div>
        <div style={{ width: '200px', height: '200px', borderRadius: '12px', backgroundColor: 'var(--neutral-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconQrcode size={120} strokeWidth={1} color="var(--primary-11)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', margin: '0 0 4px' }}>Amélie Dupont</p>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-subtle)', margin: 0 }}>N° 21909006791443</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════ */
function EmptyState({ icon: Icon, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '64px 32px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: 'var(--br-round)', backgroundColor: 'var(--primary-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={36} strokeWidth={1.5} color="var(--primary-10)" />
      </div>
      <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-subtle)', textAlign: 'center', margin: 0 }}>{label}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   LIST THUMBNAIL — grille 1+2 couvertures
   ════════════════════════════════════════════════════ */
function ListThumbnail({ books, size = 90 }) {
  const pad   = size > 60 ? 4 : 3;
  const gap   = 2;
  const inner = size - pad * 2;
  const halfW = Math.floor((inner - gap) / 2);
  const br    = size > 60 ? 8 : 6;
  const covers = [...books.slice(0, 3), null, null, null].slice(0, 3);

  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, flexShrink: 0,
      backgroundColor: 'var(--secondary-3)', borderRadius: `${size > 60 ? 12 : 10}px`,
      padding: `${pad}px`, display: 'flex', gap: `${gap}px`,
      boxShadow: '0px 2px 10px rgba(142,141,143,0.07)',
    }}>
      <div style={{ width: `${halfW}px`, height: '100%', borderRadius: `${br}px 0 0 ${br}px`, overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--secondary-4)' }}>
        {covers[0]?.cover && <img src={covers[0].cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
        <div style={{ flex: 1, borderRadius: `0 ${br}px 0 0`, overflow: 'hidden', backgroundColor: 'var(--secondary-5)' }}>
          {covers[1]?.cover && <img src={covers[1].cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div style={{ flex: 1, borderRadius: `0 0 ${br}px 0`, overflow: 'hidden', backgroundColor: 'var(--secondary-5)' }}>
          {covers[2]?.cover && <img src={covers[2].cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   DROPDOWN MENU — Renommer / Supprimer
   ════════════════════════════════════════════════════ */
function Dropdown({ onRename, onDelete, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -4 }}
      transition={{ duration: 0.12 }}
      style={{
        position: 'absolute', top: '28px', right: 0, zIndex: 100,
        backgroundColor: 'var(--neutral-1)', borderRadius: '8px',
        boxShadow: SHADOW_DROPDOWN, padding: '6px',
        display: 'flex', flexDirection: 'column', gap: '4px',
        minWidth: '180px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Renommer */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => { onRename(); onClose(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px', borderRadius: '4px', cursor: 'pointer', border: 'none',
          backgroundColor: 'var(--primary-3)', width: '100%', textAlign: 'left',
        }}
      >
        <IconPencil size={20} strokeWidth={1.8} color="var(--color-text-brand)" />
        <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--color-text-brand)', lineHeight: 1.5 }}>Renommer</span>
      </motion.button>

      {/* Supprimer la liste */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => { onDelete(); onClose(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px', borderRadius: '4px', cursor: 'pointer', border: 'none',
          backgroundColor: 'transparent', width: '100%', textAlign: 'left',
        }}
      >
        <IconTrash size={20} strokeWidth={1.8} color="var(--color-text-body)" />
        <span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--color-text-body)', lineHeight: 1.5 }}>Supprimer la liste</span>
      </motion.button>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   LIST ITEM CARD
   ════════════════════════════════════════════════════ */
function ListItemCard({ list, onSelect, onRename, onDelete }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="flex items-start cursor-pointer"
      style={{
        gap: '16px', padding: '12px',
        backgroundColor: 'var(--neutral-1)', border: '1px solid var(--neutral-5)',
        borderRadius: '20px', boxShadow: SHADOW_LIST, width: '100%', position: 'relative',
      }}
      onClick={onSelect}
    >
      <ListThumbnail books={list.books} size={90} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'stretch' }}>
        <p style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-brand)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {list.name}
        </p>
        <p style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text-body)', margin: 0 }}>
          {list.books.length} titre{list.books.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Dots button + dropdown */}
      <div style={{ position: 'relative', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setDropdownOpen((v) => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IconDotsVertical size={20} strokeWidth={2} color="var(--color-text-subtle)" />
        </motion.button>

        <AnimatePresence>
          {dropdownOpen && (
            <Dropdown
              onRename={onRename}
              onDelete={onDelete}
              onClose={() => setDropdownOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   CREATE / RENAME LIST MODAL (bottom sheet)
   ════════════════════════════════════════════════════ */
function ListNameModal({ title, confirmLabel = 'Créer la liste', initialValue = '', onClose, onConfirm }) {
  const [name, setName] = useState(initialValue);

  const handleConfirm = () => {
    if (name.trim()) { onConfirm(name.trim()); onClose(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', backgroundColor: 'white', borderRadius: '32px 32px 0 0', padding: '16px 0 32px', boxShadow: '0px -4px 24px rgba(0,0,0,0.12)' }}
      >
        <div style={{ width: '80px', height: '8px', backgroundColor: 'var(--neutral-5)', borderRadius: '9999px', margin: '0 auto 16px' }} />
        <div className="flex items-center" style={{ padding: '0 20px 2px', gap: '4px' }}>
          <p style={{ flex: '1 0 0', fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', margin: 0 }}>{title}</p>
          <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ width: '36px', height: '36px', borderRadius: '9999px', backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconX size={18} strokeWidth={2} color="var(--color-text-subtle)" />
          </motion.button>
        </div>
        <div style={{ padding: '24px 20px 0' }}>
          <label style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-subtle)', display: 'block', marginBottom: '8px' }}>Nom de la liste</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            placeholder="Entré le nom de la liste"
            style={{ width: '100%', height: '48px', padding: '0 16px', border: '1px solid var(--neutral-6)', borderRadius: '10px', backgroundColor: 'var(--neutral-1)', fontSize: '16px', outline: 'none', boxSizing: 'border-box', color: 'var(--color-text-title)' }}
          />
        </div>
        <div className="flex" style={{ gap: '10px', padding: '24px 16px 0' }}>
          <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onClose}
            style={{ flex: 1, height: '48px', backgroundColor: 'white', border: '2px solid var(--neutral-7)', borderRadius: '10px', fontSize: '16px', fontWeight: 700, color: 'var(--color-text-subtle)', cursor: 'pointer' }}>
            Annuler
          </motion.button>
          <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={handleConfirm}
            style={{ flex: 1, height: '48px', backgroundColor: 'var(--primary-10)', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: SHADOW_BTN }}>
            {confirmLabel}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   LIST BOOK CARD — carte livre dans le détail de liste
   ════════════════════════════════════════════════════ */
function ListBookCard({ book, removeMode, onRemove, onSelect }) {
  return (
    <motion.div
      whileTap={!removeMode ? { scale: 0.99 } : {}}
      onClick={() => !removeMode && onSelect(book)}
      style={{
        height: '156px', position: 'relative', cursor: removeMode ? 'default' : 'pointer',
        backgroundColor: 'var(--neutral-1)', border: '1px solid var(--neutral-5)',
        borderRadius: '14px', boxShadow: SHADOW_BOOK_CARD,
        display: 'flex', gap: 0, padding: '12px 12px 0', overflow: 'hidden',
      }}
    >
      {/* Cover */}
      <div style={{ width: '127px', height: '100%', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
        {book.cover
          ? <img src={book.cover} alt={book.title} style={{ width: '127px', height: '144px', objectFit: 'cover', borderRadius: '6px' }} />
          : <div style={{ width: '127px', height: '144px', backgroundColor: 'var(--neutral-3)', borderRadius: '6px' }} />
        }
      </div>

      {/* Remove button (remove mode) */}
      <AnimatePresence>
        {removeMode && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(book.id); }}
            style={{
              position: 'absolute', top: '8px', left: '8px', zIndex: 10,
              width: '26px', height: '26px', borderRadius: '50%',
              backgroundColor: '#e53935', border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconMinus size={14} strokeWidth={2.5} color="white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 0 16px 12px' }}>

        {/* Availability + Rating row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Badge disponibilité */}
          <Badge
            variant={book.available !== false ? 'success' : 'default'}
            size="large"
            icon={<IconCalendarCheck size={16} strokeWidth={1.8} color={book.available !== false ? 'var(--success-11)' : 'var(--secondary-11)'} />}
          >
            {book.available !== false ? 'Disponible' : 'Indisponible'}
          </Badge>

          {/* Rating */}
          {book.rating && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>{book.rating}/5</span>
              <IconStar size={16} strokeWidth={0} fill="var(--warning-9)" color="var(--warning-9)" />
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <p style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-title)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.title}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5, color: 'var(--color-text-body)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.author}
          </p>
          {book.genres && (
            <p style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1, color: 'var(--color-text-subtle)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {book.genres.join(', ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   LIST DETAIL SCREEN
   ════════════════════════════════════════════════════ */
function ListDetailScreen({ list, onBack, onRemoveBook, onBookSelect }) {
  const [removeMode, setRemoveMode] = useState(false);

  if (!list) return null;

  return (
    <div
      className="min-h-dvh font-sans flex flex-col"
      style={{ background: 'linear-gradient(180deg, var(--primary-2) 0%, var(--neutral-2) 49%), var(--neutral-2)', paddingBottom: '100px' }}
    >
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--primary-1)', padding: '16px 20px',
        boxShadow: '0px -2px 10px rgba(99,181,180,0.08), 0px 2px 10px rgba(99,181,180,0.08)',
        display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
      }}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{ width: '40px', height: '40px', borderRadius: '9999px', backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-title)" />
        </motion.button>
        <div style={{ flex: 1, minWidth: 0 }} />
      </div>

      {/* Body */}
      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Title + count + Retirer button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-brand)', margin: 0 }}>
              {list.name}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text-body)', margin: 0 }}>
              {list.books.length} titre{list.books.length !== 1 ? 's' : ''}
            </p>
          </div>
          {list.books.length > 0 && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setRemoveMode((v) => !v)}
              style={{
                height: '40px', padding: '0 16px', flexShrink: 0,
                backgroundColor: 'var(--neutral-1)',
                border: removeMode ? '2px solid var(--primary-8)' : '2px solid var(--neutral-7)',
                borderRadius: '8px', fontSize: '14px', fontWeight: 700,
                color: removeMode ? 'var(--primary-11)' : 'var(--color-text-subtle)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {removeMode ? 'Terminer' : 'Retirer de la liste'}
            </motion.button>
          )}
        </div>

        {/* Book cards */}
        {list.books.length === 0
          ? <EmptyState icon={IconBookmark} label="Cette liste est vide." />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {list.books.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 20 }}
                >
                  <ListBookCard
                    book={book}
                    removeMode={removeMode}
                    onRemove={(bookId) => onRemoveBook(list.id, bookId)}
                    onSelect={onBookSelect}
                  />
                </motion.div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════ */
const NAV_TABS = ['Mon activité', 'Mes listes', 'Historique'];

export default function MonEspacePage({
  activeTab: activeTabProp,
  onTabChange,
  lists = [],
  onCreateList,
  onRenameList,
  onDeleteList,
  onRemoveBookFromList,
  onBookSelect,
  initialSheet = null,
}) {
  const [activeTabInternal, setActiveTabInternal] = useState('Mon Espace');
  const activeTab    = activeTabProp ?? activeTabInternal;
  const setActiveTab = onTabChange   ?? setActiveTabInternal;

  const [currentTabIdx,  setCurrentTabIdx]  = useState(0);
  const [tabDir,         setTabDir]         = useState(0);

  const changeTab = (newIdx) => {
    setTabDir(newIdx > currentTabIdx ? 1 : -1);
    setCurrentTabIdx(newIdx);
  };
  const [qrOpen,           setQrOpen]           = useState(false);
  const [createListOpen,   setCreateListOpen]   = useState(false);
  const [renameTarget,     setRenameTarget]     = useState(null);
  const [selectedListId,   setSelectedListId]   = useState(null);
  const [reservationSheet, setReservationSheet] = useState(initialSheet); // null | 'reservations' | 'emprunts'

  const selectedList = selectedListId !== null ? lists.find((l) => l.id === selectedListId) ?? null : null;

  /* ── Reservation / Emprunts page ────────────────────── */
  if (reservationSheet === 'reservations') {
    return (
      <BookListPage
        title="Mes réservations"
        count={RESERVED_BOOKS.length}
        books={RESERVED_BOOKS}
        cardAvailability="reserved"
        pageActionLabel="Annuler la réservation"
        pageActionVariant="outlined"
        onPageAction={() => {}}
        onBack={() => setReservationSheet(null)}
        onBookSelect={onBookSelect}
      />
    );
  }

  if (reservationSheet === 'emprunts') {
    return (
      <BookListPage
        title="Mes emprunts"
        count={BORROWED_BOOKS.length}
        books={BORROWED_BOOKS}
        cardAvailability="borrowed"
        pageActionLabel="Prolonger"
        pageActionVariant="secondary"
        onPageAction={() => {}}
        onBack={() => setReservationSheet(null)}
        onBookSelect={onBookSelect}
      />
    );
  }

  /* ── List detail screen ───────────────────────────── */
  if (selectedList) {
    return (
      <>
        <ListDetailScreen
          list={selectedList}
          onBack={() => setSelectedListId(null)}
          onRemoveBook={(listId, bookId) => onRemoveBookFromList?.(listId, bookId)}
          onBookSelect={(book) => { setSelectedListId(null); onBookSelect?.(book); }}
        />
        <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />

        <AnimatePresence>
          {renameTarget && (
            <ListNameModal
              title="Renommer la liste"
              initialValue={renameTarget.name}
              onClose={() => setRenameTarget(null)}
              onConfirm={(name) => { onRenameList?.(renameTarget.id, name); setRenameTarget(null); }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div
      className="min-h-dvh font-sans flex flex-col relative"
      style={{ background: 'linear-gradient(180deg, var(--primary-2) 0%, var(--neutral-2) 49%), var(--neutral-2)', paddingBottom: 'var(--layout-12)' }}
    >

      {/* ══ HEADER ══════════════════════════════════════ */}
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex justify-end">
          <motion.button type="button" whileTap={{ scale: 0.9 }}
            style={{ width: '40px', height: '40px', borderRadius: 'var(--br-round)', backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconSettings size={24} strokeWidth={1.8} color="var(--neutral-11)" />
          </motion.button>
        </div>

        <div className="flex items-center" style={{ gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--br-round)', backgroundColor: 'var(--secondary-9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'white', lineHeight: 1.5 }}>AD</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0" style={{ gap: '0px' }}>
            <p style={{ fontFamily: 'var(--font-brand)', fontSize: '24px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text-title)', margin: 0 }}>Amélie Dupont</p>
            <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.5, color: 'var(--color-text-body)', margin: 0 }}>
              <span style={{ fontWeight: 500 }}>N° de lecteur : </span>21909006791443
            </p>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ════════════════════════════════ */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* CTA — Afficher ma carte */}
          <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => setQrOpen(true)}
            className="flex items-center justify-center w-full outline-none cursor-pointer"
            style={{ gap: "8px", height: "48px", padding: "0 20px", backgroundColor: "var(--primary-10)", borderRadius: "var(--br-md)", border: "none", boxShadow: SHADOW_BTN }}>
            <IconQrcode size={20} strokeWidth={2} color="var(--neutral-1)" />
            <span style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.5, color: "var(--neutral-1)", whiteSpace: "nowrap" }}>Afficher ma carte d\"adhérente</span>
          </motion.button>

        {/* Tabs */}
        <TabList tabs={NAV_TABS} value={currentTabIdx} onChange={changeTab} />

        {/* ── Tab content (swipeable + directional slide) ── */}
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentTabIdx}
          initial={{ opacity: 0, x: tabDir * 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -tabDir * 28 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 && currentTabIdx < NAV_TABS.length - 1) changeTab(currentTabIdx + 1);
            else if (info.offset.x > 50 && currentTabIdx > 0) changeTab(currentTabIdx - 1);
          }}
          style={{ touchAction: 'pan-y', cursor: 'grab' }}
        >

        {/* ── Réservations tab ── */}
        {currentTabIdx === 0 && (
          <div className="flex flex-col" style={{ gap: '32px' }}>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <p style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-brand)', margin: 0 }}>Réservation et prêt</p>
              <div className="flex" style={{ gap: '6px' }}>
                <motion.div style={{ flex: '1 0 0', minWidth: 0 }} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04, type: 'spring', stiffness: 260, damping: 20 }}>
                  <InfoCard category="Réservations" count="4" typeLabel="Titres" badge="Disponible à Mériadeck" badgeIcon={IconShoppingBagCheck} badgeVariant="success" onClick={() => setReservationSheet('reservations')} />
                </motion.div>
                <motion.div style={{ flex: '1 0 0', minWidth: 0 }} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, type: 'spring', stiffness: 260, damping: 20 }}>
                  <InfoCard category="Services" count="1" typeLabel="Salle d'étude" badge="12 janv. (9h - 12h)" badgeIcon={IconCalendarEvent} badgeVariant="info" />
                </motion.div>
              </div>
              <div className="flex" style={{ gap: '6px' }}>
                <motion.div style={{ flex: '1 0 0', minWidth: 0 }} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, type: 'spring', stiffness: 260, damping: 20 }}>
                  <InfoCard category="Prêt bibliothèque" count="3" typeLabel="Emprunts" badge="24 juin 2026" badgeIcon={IconCalendarTime} badgeVariant="info" onClick={() => setReservationSheet('emprunts')} />
                </motion.div>
                <motion.div style={{ flex: '1 0 0', minWidth: 0 }} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, type: 'spring', stiffness: 260, damping: 20 }}>
                  <InfoCard category="Prêt numérique" count="1" typeLabel="Emprunts" badge="12 janv. 2026" badgeIcon={IconCalendarTime} badgeVariant="info" onClick={() => setReservationSheet('emprunts')} />
                </motion.div>
              </div>
            </div>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <p style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-brand)', margin: 0 }}>Échanges</p>
              <div className="flex flex-col">
                {[
                  { icon: IconMessageCircle,     label: 'Messages de la bibliothèque', isFirst: true,  isLast: false },
                  { icon: IconMessageCircleUser, label: 'Mes avis laissés',             isFirst: false, isLast: false },
                  { icon: IconMessageChatbot,    label: 'Communication sur place',      isFirst: false, isLast: true  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <RowItem icon={item.icon} label={item.label} isFirst={item.isFirst} isLast={item.isLast} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Mes listes tab ── */}
        {currentTabIdx === 1 && (
          <div className="flex flex-col" style={{ gap: '20px' }}>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <p style={{ flex: '1 0 0', fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-brand)', margin: 0 }}>
                {lists.length} liste{lists.length > 1 ? 's' : ''} créée{lists.length > 1 ? 's' : ''}
              </p>
              <motion.button type="button" whileTap={{ scale: 0.96 }} onClick={() => setCreateListOpen(true)}
                style={{ height: '40px', padding: '0 16px', backgroundColor: 'var(--primary-3)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--primary-11)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Créer une liste
              </motion.button>
            </div>

            {lists.length === 0
              ? <EmptyState icon={IconBookmark} label="Vous n'avez pas encore de liste de lecture." />
              : (
                <div className="flex flex-col" style={{ gap: '16px' }}>
                  {lists.map((list, i) => (
                    <motion.div
                      key={list.id}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 20 }}
                    >
                      <ListItemCard
                        list={list}
                        onSelect={() => setSelectedListId(list.id)}
                        onRename={() => setRenameTarget({ id: list.id, name: list.name })}
                        onDelete={() => onDeleteList?.(list.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ── Historique tab ── */}
        {currentTabIdx === 2 && (
          <EmptyState icon={IconHistory} label="Votre historique de lecture est vide." />
        )}

        </motion.div>
        </AnimatePresence>
      </div>

      {/* ══ BOTTOM NAV ══════════════════════════════════ */}
      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />

      {/* ══ QR MODAL ════════════════════════════════════ */}
      <AnimatePresence>
        {qrOpen && <QRModal onClose={() => setQrOpen(false)} />}
      </AnimatePresence>

      {/* ══ CREATE LIST MODAL ═══════════════════════════ */}
      <AnimatePresence>
        {createListOpen && (
          <ListNameModal
            title="Créer une liste"
            confirmLabel="Créer la liste"
            onClose={() => setCreateListOpen(false)}
            onConfirm={(name) => { onCreateList?.(name); setCreateListOpen(false); }}
          />
        )}
      </AnimatePresence>

      {/* ══ RENAME MODAL ════════════════════════════════ */}
      <AnimatePresence>
        {renameTarget && (
          <ListNameModal
            title="Renommer la liste"
            confirmLabel="Renommer"
            initialValue={renameTarget.name}
            onClose={() => setRenameTarget(null)}
            onConfirm={(name) => { onRenameList?.(renameTarget.id, name); setRenameTarget(null); }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
