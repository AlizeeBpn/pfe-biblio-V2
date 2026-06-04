import { useState, useRef, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
  IconSearch,
  IconArrowLeft,
  IconMicrophone,
  IconScan,
  IconX,
  IconArrowRight,
  IconCalendarTime,
  IconStarFilled,
  IconArrowsSort,
  IconAdjustmentsHorizontal,
  IconChevronDown,
} from '@tabler/icons-react';

import { BottomNavigation }  from '../components/ui/BottomNavigation';
import Badge from '../components/ui/Badge';
import FilterBottomSheet            from '../components/ui/FilterBottomSheet';
import SortBottomSheet              from '../components/ui/SortBottomSheet';
import BibliothequeBottomSheet      from '../components/ui/BibliothequeBottomSheet';
import GenreThematiqueBottomSheet   from '../components/ui/GenreThematiqueBottomSheet';
import {
  BOOKS as ALL_BOOKS,
  GENRES,
  GENRE_COVERS,
  SUGGESTION_GROUPS,
  NOUVEAUTES_IDS,
} from '../data/books';
import BookCover from '../components/BookCover';
import { searchGoogleBooks } from '../services/googleBooks';

/* ════════════════════════════════════════════════════
   SHADOWS
   ════════════════════════════════════════════════════ */
const SHADOW_OBJECT =
  '0px 16px 9px 0px var(--alpha-grey-05), 0px 7px 7px 0px var(--alpha-grey-09), 0px 2px 4px 0px var(--alpha-grey-10), 0px -11px 4px 0px var(--alpha-grey-01), 0px -6px 4px 0px var(--alpha-grey-05), 0px -3px 3px 0px var(--alpha-grey-09), 0px -1px 2px 0px var(--alpha-grey-10)';

const SHADOW_CATEGORY =
  '0px -2px 10px 0px var(--alpha-primary-08), 0px 2px 10px 0px var(--alpha-primary-08)';

const SHADOW_CARD = '0px 2px 10px 0px var(--alpha-grey-07)';

const SHADOW_BOOK =
  '0px 28px 8px rgba(125,120,120,0), 0px 18px 7px rgba(125,120,120,0.01), 0px 10px 6px rgba(125,120,120,0.05), 0px 4px 4px rgba(125,120,120,0.09), 0px 1px 2px rgba(125,120,120,0.1)';

/* ════════════════════════════════════════════════════
   RESULT CARD  (vertical list in search mode)
   ════════════════════════════════════════════════════ */
function ResultCard({ book, onClick }) {
  const genreLabel = Array.isArray(book.genres)
    ? book.genres.join(', ')
    : book.genres;

  return (
    <m.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-stretch"
      style={{
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-3)',
        borderRadius:    '12px',
        boxShadow:       SHADOW_CARD,
        paddingTop:      '8px',
        paddingLeft:     '8px',
        paddingRight:    '8px',
        paddingBottom:   0,
        gap:             '12px',
        cursor:          'pointer',
        overflow:        'hidden',
      }}
    >
      {/* Book cover */}
      <BookCover
        cover={book.cover}
        title={book.title}
        style={{ width: '100px', height: '136px', borderRadius: '6px', boxShadow: SHADOW_BOOK, flexShrink: 0 }}
      />

      {/* Content */}
      <div className="flex flex-col flex-1" style={{ gap: '8px', paddingBottom: '12px', minWidth: 0 }}>
        {/* Availability + Rating */}
        <div className="flex items-center" style={{ gap: '8px' }}>
          <Badge
            variant={book.available ? 'success' : 'warning'}
            size="medium"
            icon={<IconCalendarTime size={14} strokeWidth={2} color={book.available ? 'var(--success-11)' : 'var(--warning-11)'} />}
          >
            {book.available ? 'Disponible' : 'Indisponible'}
          </Badge>
          {book.rating != null && (
            <div className="flex-1 flex items-center justify-end" style={{ gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
                {book.rating}/5
              </span>
              <IconStarFilled size={14} color="var(--secondary-11)" />
            </div>
          )}
        </div>

        {/* Title / Author / Genres */}
        <div className="flex flex-col" style={{ gap: '2px', minWidth: 0 }}>
          <p style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text-title)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.title}
          </p>
          <p style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4, color: 'var(--color-text-body)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.author}
          </p>
          <p style={{ fontSize: '11px', fontWeight: 400, color: 'var(--color-text-subtle)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {genreLabel}
          </p>
        </div>
      </div>
    </m.div>
  );
}

/* ════════════════════════════════════════════════════
   BIBLIOTHÈQUE BUTTON — label adaptatif
   0 sélection  → "Bibliothèque ▼"
   1 sélection  → nom de la bibliothèque
   2+ sélections → premier nom + badge "+N"
   ════════════════════════════════════════════════════ */
function BibliothequeBtn({ selectedLibraries, onClick }) {
  const entries = Object.entries(selectedLibraries).filter(([, v]) => v);
  const count     = entries.length;
  const isActive  = count > 0;
  const firstName = count > 0 ? entries[0][0] : null;
  const extra     = count > 1 ? count - 1 : 0;

  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={count > 0 ? `Bibliothèque (${count} sélectionnée${count > 1 ? 's' : ''})` : 'Bibliothèque'}
      className="inline-flex items-center shrink-0 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
      style={{
        gap:             '6px',
        height:          '40px',
        padding:         '0 14px',
        backgroundColor: isActive ? 'var(--primary-3)' : 'var(--neutral-1)',
        border:          isActive ? '1px solid var(--primary-8)' : '2px solid var(--neutral-7)',
        borderRadius:    'var(--br-md)',
        color:           isActive ? 'var(--primary-11)' : 'var(--neutral-11)',
        fontSize:        '14px',
        fontWeight:      700,
        whiteSpace:      'nowrap',
      }}
    >
      {count === 0 && <span>Bibliothèque</span>}
      {count === 1 && <span>{firstName}</span>}
      {count > 1 && (
        <>
          <span>{firstName}</span>
          <span style={{
            minWidth:        '20px',
            height:          '20px',
            borderRadius:    '9999px',
            backgroundColor: 'var(--primary-10)',
            display:         'inline-flex',
            alignItems:      'center',
            justifyContent:  'center',
            padding:         '0 4px',
            fontSize:        '11px',
            fontWeight:      700,
            color:           'var(--primary-1)',
          }}>
            +{extra}
          </span>
        </>
      )}
      <IconChevronDown size={16} strokeWidth={2} color={isActive ? 'var(--primary-11)' : 'var(--neutral-10)'} />
    </m.button>
  );
}

/* ════════════════════════════════════════════════════
   SORT / FILTER BUTTON
   activeLabel — remplace le label quand actif (tri)
   count       — badge numérique quand actif (filtres)
   ════════════════════════════════════════════════════ */
function SortFilterBtn({ label, activeLabel, count, Icon, onClick }) {
  const isActive     = !!activeLabel || count > 0;
  const displayLabel = activeLabel || label;

  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={count > 0 ? `${label} (${count} actif${count > 1 ? 's' : ''})` : label}
      className="inline-flex items-center outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
      style={{
        gap:             '6px',
        height:          '40px',
        padding:         '0 14px',
        backgroundColor: isActive ? 'var(--primary-3)' : 'var(--neutral-1)',
        border:          isActive ? '1px solid var(--primary-8)' : '2px solid var(--neutral-7)',
        borderRadius:    'var(--br-md)',
        color:           isActive ? 'var(--primary-11)' : 'var(--neutral-11)',
        fontSize:        '14px',
        fontWeight:      700,
        whiteSpace:      'nowrap',
      }}
    >
      {displayLabel}
      {count > 0 && (
        <span style={{
          minWidth:        '20px',
          height:          '20px',
          borderRadius:    '9999px',
          backgroundColor: 'var(--primary-10)',
          display:         'inline-flex',
          alignItems:      'center',
          justifyContent:  'center',
          padding:         '0 4px',
          fontSize:        '11px',
          fontWeight:      700,
          color:           'var(--primary-1)',
        }}>
          {count}
        </span>
      )}
      {Icon && <Icon size={16} strokeWidth={2} color={isActive ? 'var(--primary-11)' : 'var(--neutral-10)'} />}
    </m.button>
  );
}

/* ── Section heading ── */
function SectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily:  'var(--font-body)',
      fontWeight:  700,
      fontSize:    '16px',
      lineHeight:  1.5,
      color:       'var(--color-text-body)',
      margin:      0,
    }}>
      {children}
    </h3>
  );
}

/* ── Category card ── */
function CategoryCard({ label, onClick }) {
  const preferredId = GENRE_COVERS[label];
  const representativeBook = preferredId
    ? ALL_BOOKS.find(b => b.id === preferredId)
    : ALL_BOOKS.filter(b => b.genres.includes(label)).sort((a, b) => a.genres.length - b.genres.length)[0];

  return (
    <m.div
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Voir le genre ${label}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      className="relative shrink-0 flex items-center justify-end overflow-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:outline-none"
      style={{
        height:        '59px',
        paddingLeft:   'var(--layout-8)',
        paddingRight:  'var(--pad-2md)',
        paddingTop:    '16px',
        paddingBottom: '16px',
        borderRadius:  '8px',
        border:        '1px solid var(--primary-6)',
        background:    'linear-gradient(245.5deg, var(--primary-1) 6.5%, var(--primary-3) 85%)',
        boxShadow:     SHADOW_CATEGORY,
        cursor:        'pointer',
        gap:           '8px',
      }}
    >
      {/* Rotated mini book cover */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: '-10.27px', top: '0.87px', width: '69.833px', height: '91.071px' }}
      >
        <div style={{ transform: 'rotate(13.81deg)', flexShrink: 0 }}>
          <div
            className="relative overflow-hidden"
            style={{
              width:           '52px',
              height:          '81px',
              borderRadius:    '6px',
              backgroundColor: '#af9494',
              boxShadow:       SHADOW_OBJECT,
            }}
          >
            {representativeBook && (
              <BookCover
                cover={representativeBook.cover}
                title={representativeBook.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 0 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{ paddingLeft: '12px' }}>
        <p style={{
          fontFamily: 'var(--font-brand)',
          fontWeight: 700,
          fontSize:   '16px',
          lineHeight: 1.2,
          color:      'var(--primary-11)',
          margin:     0,
          whiteSpace: 'nowrap',
        }}>
          {label}
        </p>
      </div>
    </m.div>
  );
}

/* ── Single book (carousel) ── */
function BookItem({ title, author, cover, onClick }) {
  return (
    <m.div
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}${author ? ` par ${author}` : ''}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      className="flex flex-col shrink-0 items-start focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:outline-none"
      style={{ gap: '6px', width: '120px', cursor: 'pointer' }}
    >
      <BookCover
        cover={cover}
        title={title}
        style={{ width: '120px', height: '186px', borderRadius: '6px', boxShadow: SHADOW_OBJECT, flexShrink: 0 }}
      />
      <p style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1, color: 'var(--neutral-12)', margin: 0, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {title}
      </p>
      <p style={{ fontSize: '10px', fontWeight: 500, lineHeight: 1, color: 'var(--neutral-11)', margin: 0, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {author}
      </p>
    </m.div>
  );
}

/* ── Suggestion section ── */
function SuggestionSection({ title, books, onBookSelect, onSeeAll }) {
  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      {title && <SectionLabel>{title}</SectionLabel>}

      {/* Carousel : déborde à droite hors du padding du <main> (20px)
          pour suggérer visuellement le swipe horizontal */}
      <div style={{ marginRight: '-20px' }}>
        <div className="flex overflow-x-auto" style={{ gap: '16px', paddingBottom: '4px', paddingRight: '20px', scrollbarWidth: 'none' }}>
          {books.map((b, i) => (
            <BookItem key={i} title={b.title} author={b.author} cover={b.cover} onClick={() => onBookSelect?.(b)} />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <m.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onSeeAll}
          className="inline-flex items-center outline-none"
          style={{
            gap: '6px', height: '40px', padding: '0 12px',
            borderRadius: '6px', background: 'var(--primary-3)',
            color: 'var(--primary-11)', fontSize: '14px', fontWeight: 700,
            lineHeight: 1.5, border: 'none', cursor: 'pointer',
          }}
        >
          Voir tout
          <IconArrowRight size={16} strokeWidth={2} color="var(--primary-11)" />
        </m.button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */
export default function CataloguePage({
  activeTab: activeTabProp,
  onTabChange,
  onSearch,
  onBookSelect,
  onScanOpen,
  onGenreFilter,
  onCriteriaSearch,
  onGenreThematique,
}) {
  const [activeTabInternal, setActiveTabInternal] = useState('Catalogue');
  const activeTab    = activeTabProp ?? activeTabInternal;
  const setActiveTab = onTabChange   ?? setActiveTabInternal;

  /* ── Search state ── */
  const [isSearching,  setIsSearching]  = useState(false);
  const [searchValue,  setSearchValue]  = useState('');
  const inputRef = useRef(null);

  /* ── Filter/sort state (active in search mode) ── */
  const [disponible,         setDisponible]         = useState(false);
  const [filterOpen,         setFilterOpen]         = useState(false);
  const [sortOpen,           setSortOpen]           = useState(false);
  const [libSheetOpen,       setLibSheetOpen]       = useState(false);
  const [gtOpen,             setGtOpen]             = useState(false);
  const [sortBy,             setSortBy]             = useState('pertinence');
  const [selections,         setSelections]         = useState({});
  const [selectedLibraries,  setSelectedLibraries]  = useState({});
  const [gtState,            setGtState]            = useState({ types: {}, genres: {}, docParents: {}, docItems: {} });
  const [googleResults, setGoogleResults] = useState([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState(null);

  const SORT_LABELS = {
    pertinence:     null,
    mieux_notes:    'Les mieux notées',
    plus_empruntes: 'Les plus empruntés',
    auteur_az:      'Par auteur (A-Z)',
    titre_az:       'Par titre (A-Z)',
  };

  const filterActiveCount = Object.values(selections).reduce(
    (acc, section) => acc + Object.values(section).filter(Boolean).length, 0
  ) + (disponible ? 1 : 0);

  const gtActiveCount =
    Object.values(gtState.types).filter(Boolean).length +
    Object.values(gtState.genres).filter(Boolean).length +
    Object.values(gtState.docParents).filter(Boolean).length +
    Object.values(gtState.docItems).filter(Boolean).length;

  const handleApplyFilter = ({ disponible: d, selections: s }) => {
    setSelections(s);
    setDisponible(d);
    if (!isSearching) {
      onCriteriaSearch?.({ disponible: d, selections: s });
    }
  };

  const handleApplyGenreThematique = (newGtState) => {
    setGtState(newGtState);
    // En mode navigation (pas en recherche), naviguer vers les résultats
    const hasActiveFilters =
      Object.values(newGtState.types).filter(Boolean).length > 0 ||
      Object.values(newGtState.genres).filter(Boolean).length > 0 ||
      Object.values(newGtState.docParents).filter(Boolean).length > 0 ||
      Object.values(newGtState.docItems).filter(Boolean).length > 0;
    if (!isSearching && hasActiveFilters) {
      onGenreThematique?.(newGtState);
    }
  };

  /* Auto-focus input when entering search mode */
  useEffect(() => {
    if (isSearching) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isSearching]);

  const handleEnterSearch = () => setIsSearching(true);
  const handleBackFromSearch = () => {
    setIsSearching(false);
    setSearchValue('');
    inputRef.current?.blur();
  };
  const handleClearText = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      onSearch?.(searchValue.trim());
    }
    if (e.key === 'Escape') handleBackFromSearch();
  };

  /* Google Books live search — debounced 400ms */
  useEffect(() => {
    const q = searchValue.trim();
    if (!q) { setGoogleResults([]); setGoogleError(null); return; }

    let cancelled = false;
    const timer = setTimeout(() => {
      setGoogleLoading(true);
      setGoogleError(null);
      searchGoogleBooks(q, 15)
        .then(res  => { if (!cancelled) { setGoogleResults(res); } })
        .catch(err => { if (!cancelled) { setGoogleResults([]); setGoogleError(err.message); } })
        .finally(() => { if (!cancelled) setGoogleLoading(false); });
    }, 400);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchValue]);

  /* Live search results — title + author only, case-insensitive */
  let results = [];
  if (searchValue.trim()) {
    const q = searchValue.toLowerCase().trim();
    results = ALL_BOOKS.filter(
      b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }
  if (disponible) results = results.filter(b => b.available);

  /* Editorial data */
  const byId = Object.fromEntries(ALL_BOOKS.map(b => [b.id, b]));
  const suggestions = SUGGESTION_GROUPS.map(g => ({
    title:       g.title,
    books:       g.bookIds.map(id => byId[id]).filter(Boolean),
    linkedGenre: g.linkedGenre,
  }));
  const nouveautes = NOUVEAUTES_IDS.map(id => byId[id]).filter(Boolean);

  return (
    <div
      className="min-h-dvh font-sans flex flex-col"
      style={{ background: 'var(--neutral-2)', paddingBottom: 'var(--layout-12)' }}
    >
      <main className="flex flex-col" style={{ padding: '28px 20px 0', gap: '16px' }}>
        <h1 className="sr-only">Catalogue</h1>

        {/* ══ SEARCH BAR — transforms between default ↔ search mode ══ */}
        <div
          className="flex items-center"
          style={{
            height:          '48px',
            borderRadius:    'var(--br-round)',
            paddingLeft:     '16px',
            paddingRight:    '4px',
            gap:             '12px',
            backgroundColor: 'var(--neutral-1)',
            border:          isSearching ? '2px solid var(--primary-8)' : '1px solid var(--neutral-6)',
            transition:      'border 0.15s',
          }}
          onClick={!isSearching ? handleEnterSearch : undefined}
        >
          {/* Left icon */}
          <div className="shrink-0 flex items-center" style={{ cursor: isSearching ? 'pointer' : 'default' }}>
            {isSearching ? (
              <m.div
                whileTap={{ scale: 0.9 }}
                onClick={handleBackFromSearch}
                role="button"
                tabIndex={0}
                aria-label="Retour"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBackFromSearch(); } }}
              >
                <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-subtle)" aria-hidden="true" />
              </m.div>
            ) : (
              <IconSearch size={24} strokeWidth={2} color="var(--color-text-subtle)" aria-hidden="true" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onFocus={handleEnterSearch}
            onKeyDown={handleKeyDown}
            placeholder="Un titre, un auteur, ISBN…"
            className="flex-1 outline-none bg-transparent font-sans"
            style={{
              fontSize:   '16px',
              fontWeight: 400,
              lineHeight: 1.5,
              color:      'var(--primary-12)',
              border:     'none',
              minWidth:   0,
              cursor:     isSearching ? 'text' : 'pointer',
            }}
          />

          {/* Right icons */}
          <div className="flex items-center shrink-0" style={{ gap: '4px' }}>
            {isSearching ? (
              searchValue.length > 0 && (
                <m.div
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center cursor-pointer"
                  style={{ width: '40px', height: '40px', padding: '8px', backgroundColor: 'var(--neutral-4)', borderRadius: 'var(--br-round)' }}
                  onClick={handleClearText}
                  role="button"
                  tabIndex={0}
                  aria-label="Effacer la recherche"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClearText(); } }}
                >
                  <IconX size={24} strokeWidth={2} color="var(--secondary-11)" aria-hidden="true" />
                </m.div>
              )
            ) : (
              <>
                <div className="flex items-center justify-center"
                  style={{ width: '32px', height: '32px', padding: '6px', backgroundColor: 'var(--neutral-4)', borderRadius: 'var(--br-round)' }}
                  aria-hidden="true">
                  <IconMicrophone size={20} strokeWidth={2} color="var(--color-text-subtle)" />
                </div>
                <m.div
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center cursor-pointer"
                  style={{ width: '40px', height: '40px', padding: '8px', backgroundColor: 'var(--secondary-4)', borderRadius: 'var(--br-round)' }}
                  onClick={e => { e.stopPropagation(); onScanOpen?.(); }}
                  role="button"
                  tabIndex={0}
                  aria-label="Scanner un ISBN"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onScanOpen?.(); } }}
                >
                  <IconScan size={24} strokeWidth={2} color="var(--secondary-11)" aria-hidden="true" />
                </m.div>
              </>
            )}
          </div>
        </div>

        {/* ══ CONDITIONAL CONTENT ══ */}
        <AnimatePresence mode="wait" initial={false}>

          {/* ── SEARCH MODE ── */}
          {isSearching && (
            <m.div
              key="search-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col"
              style={{ gap: '16px' }}
            >
              {/* Filter row — search mode */}
              <div
                className="flex items-center"
                style={{ gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingRight: '20px' }}
              >
                <SortFilterBtn label="Trier"             activeLabel={SORT_LABELS[sortBy]} Icon={IconArrowsSort}            onClick={() => setSortOpen(true)} />
                <BibliothequeBtn selectedLibraries={selectedLibraries}                                                      onClick={() => setLibSheetOpen(true)} />
                <SortFilterBtn label="Genre & Thématique" count={gtActiveCount}            Icon={IconChevronDown}          onClick={() => setGtOpen(true)} />
                <SortFilterBtn label="Plus de filtres"   count={filterActiveCount}         Icon={IconAdjustmentsHorizontal} onClick={() => setFilterOpen(true)} />
              </div>

              {/* Results — catalogue local + Google Books fusionnés */}
              {searchValue.trim() ? (
                <>
                  {(() => {
                    const merged = [
                      ...results,
                      ...googleResults.map(b => ({ ...b, available: true })),
                    ];
                    return (
                      <>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-subtle)', margin: 0 }}>
                          {googleLoading
                            ? 'Recherche en cours…'
                            : merged.length > 0
                              ? `${merged.length} résultat${merged.length !== 1 ? 's' : ''} pour votre recherche`
                              : 'Aucun livre trouvé pour cette recherche.'
                          }
                        </p>
                        <div className="flex flex-col" style={{ gap: '12px' }}>
                          {merged.map(book => (
                            <ResultCard key={book.id} book={book} onClick={() => onBookSelect?.(book)} />
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : null}
            </m.div>
          )}

          {/* ── BROWSE MODE ── */}
          {!isSearching && (
            <m.div
              key="browse-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
              style={{ gap: '32px' }}
            >
              {/* Filter row — browse mode */}
              <div
                className="flex items-center"
                style={{ gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingRight: '20px' }}
              >
                <BibliothequeBtn selectedLibraries={selectedLibraries}                                                      onClick={() => setLibSheetOpen(true)} />
                <SortFilterBtn label="Genre & Thématique" count={gtActiveCount}            Icon={IconChevronDown}          onClick={() => setGtOpen(true)} />
                <SortFilterBtn label="Plus de filtres"   count={filterActiveCount}         Icon={IconAdjustmentsHorizontal} onClick={() => setFilterOpen(true)} />
              </div>

              {/* Categories — déborde à droite pour suggérer le swipe */}
              <div style={{ marginRight: '-20px' }}>
                <div className="flex overflow-x-auto" style={{ gap: '6px', paddingBottom: '4px', paddingRight: '20px', scrollbarWidth: 'none' }}>
                  {GENRES.map(genre => (
                    <CategoryCard key={genre} label={genre} onClick={() => onGenreFilter?.(genre)} />
                  ))}
                </div>
              </div>

              {/* Suggestions personnalisées */}
              <div className="flex flex-col" style={{ gap: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-brand)', fontWeight: 700, fontSize: '24px', lineHeight: 1.2, color: 'var(--primary-12)', margin: 0 }}>
                  Suggestions personnalisées
                </h2>
                <div className="flex flex-col" style={{ gap: '32px' }}>
                  {suggestions.map(s => (
                    <SuggestionSection
                      key={s.title}
                      title={s.title}
                      books={s.books}
                      onBookSelect={onBookSelect}
                      onSeeAll={s.linkedGenre ? () => onGenreFilter?.(s.linkedGenre) : undefined}
                    />
                  ))}
                </div>
              </div>

              {/* Livre mis en avant + Nouveautés Mériadeck */}
              <div className="flex flex-col" style={{ gap: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-brand)', fontWeight: 700, fontSize: '24px', lineHeight: 1.2, margin: 0 }}>
                  <span style={{ color: 'var(--primary-12)' }}>Nouveauté </span>
                  <span style={{ color: 'var(--secondary-11)' }}>Mériadeck</span>
                </h2>
                <SuggestionSection title="" books={nouveautes} onBookSelect={onBookSelect} />
              </div>
            </m.div>
          )}

        </AnimatePresence>
      </main>

      <BottomNavigation activeTab={activeTab} onChange={setActiveTab} onScan={onScanOpen} />

      <FilterBottomSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilter}
        externalSelections={selections}
        externalDisponible={disponible}
      />
      <SortBottomSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={sortBy}
        onChange={setSortBy}
      />
      <BibliothequeBottomSheet
        open={libSheetOpen}
        onClose={() => setLibSheetOpen(false)}
        onApply={setSelectedLibraries}
        selectedLibraries={selectedLibraries}
      />
      <GenreThematiqueBottomSheet
        open={gtOpen}
        onClose={() => setGtOpen(false)}
        onApply={handleApplyGenreThematique}
        externalState={gtState}
      />
    </div>
  );
}