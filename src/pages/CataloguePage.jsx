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
} from '@tabler/icons-react';

import { BottomNavigation }  from '../components/ui/BottomNavigation';
import Badge from '../components/ui/Badge';
import FilterBottomSheet     from '../components/ui/FilterBottomSheet';
import SortBottomSheet       from '../components/ui/SortBottomSheet';
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
   MÉRIADECK TOGGLE
   ════════════════════════════════════════════════════ */
function MeriadeckToggle({ active, onToggle }) {
  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(!active)}
      className="inline-flex items-center justify-center shrink-0 outline-none cursor-pointer overflow-hidden"
      style={{
        height:          '40px',
        padding:         '0 14px',
        gap:             '6px',
        borderRadius:    'var(--br-md)',
        border:          active ? '1px solid var(--primary-8)' : '1px solid var(--neutral-6)',
        backgroundColor: active ? 'var(--primary-3)' : 'var(--neutral-2)',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 700, color: active ? 'var(--primary-11)' : 'var(--neutral-11)', whiteSpace: 'nowrap' }}>
        Mériadeck
      </span>
      {active && <IconX size={16} strokeWidth={2} color="var(--primary-11)" />}
    </m.button>
  );
}

/* ════════════════════════════════════════════════════
   SORT / FILTER BUTTON
   ════════════════════════════════════════════════════ */
function SortFilterBtn({ label, Icon, onClick }) {
  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="inline-flex items-center outline-none cursor-pointer"
      style={{
        gap:             '6px',
        height:          '40px',
        padding:         '0 14px',
        backgroundColor: 'var(--neutral-1)',
        border:          '2px solid var(--neutral-7)',
        borderRadius:    'var(--br-md)',
        color:           'var(--neutral-11)',
        fontSize:        '14px',
        fontWeight:      700,
        whiteSpace:      'nowrap',
      }}
    >
      {label}
      {Icon && <Icon size={16} strokeWidth={2} color="var(--neutral-10)" />}
    </m.button>
  );
}

/* ── Section heading ── */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily:  'var(--font-body)',
      fontWeight:  700,
      fontSize:    '16px',
      lineHeight:  1.5,
      color:       'var(--color-text-body)',
      margin:      0,
    }}>
      {children}
    </p>
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
      className="relative shrink-0 flex items-center justify-end overflow-hidden"
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
      className="flex flex-col shrink-0 items-start"
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

      <div className="flex overflow-x-auto" style={{ gap: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {books.map((b, i) => (
          <BookItem key={i} title={b.title} author={b.author} cover={b.cover} onClick={() => onBookSelect?.(b)} />
        ))}
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
}) {
  const [activeTabInternal, setActiveTabInternal] = useState('Catalogue');
  const activeTab    = activeTabProp ?? activeTabInternal;
  const setActiveTab = onTabChange   ?? setActiveTabInternal;

  /* ── Search state ── */
  const [isSearching,  setIsSearching]  = useState(false);
  const [searchValue,  setSearchValue]  = useState('');
  const inputRef = useRef(null);

  /* ── Filter/sort state (active in search mode) ── */
  const [disponible,   setDisponible]   = useState(false);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [sortOpen,     setSortOpen]     = useState(false);
  const [sortBy,       setSortBy]       = useState('pertinence');
  const [selections,   setSelections]   = useState({});
  const [googleResults, setGoogleResults] = useState([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState(null);

  const meriadeckActive = selections.bibliotheque?.['Mériadeck'] ?? true;
  const toggleMeriadeck = (val) =>
    setSelections(prev => ({ ...prev, bibliotheque: { ...(prev.bibliotheque || {}), 'Mériadeck': val } }));

  const handleApplyFilter = ({ disponible: d, selections: s }) => {
    setSelections(s);
    setDisponible(d);
    if (!isSearching) {
      onCriteriaSearch?.({ disponible: d, selections: s });
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
      searchGoogleBooks(q, 6)
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
              <m.div whileTap={{ scale: 0.9 }} onClick={handleBackFromSearch}>
                <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-subtle)" />
              </m.div>
            ) : (
              <IconSearch size={24} strokeWidth={2} color="var(--color-text-subtle)" />
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
                >
                  <IconX size={24} strokeWidth={2} color="var(--secondary-11)" />
                </m.div>
              )
            ) : (
              <>
                <div className="flex items-center justify-center"
                  style={{ width: '32px', height: '32px', padding: '6px', backgroundColor: 'var(--neutral-4)', borderRadius: 'var(--br-round)' }}>
                  <IconMicrophone size={20} strokeWidth={2} color="var(--color-text-subtle)" />
                </div>
                <m.div
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center cursor-pointer"
                  style={{ width: '40px', height: '40px', padding: '8px', backgroundColor: 'var(--secondary-4)', borderRadius: 'var(--br-round)' }}
                  onClick={e => { e.stopPropagation(); onScanOpen?.(); }}
                >
                  <IconScan size={24} strokeWidth={2} color="var(--secondary-11)" />
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
              {/* Filter row */}
              <div className="flex items-center" style={{ gap: '8px' }}>
                <MeriadeckToggle active={meriadeckActive} onToggle={toggleMeriadeck} />
                <div className="flex-1 flex items-center justify-end" style={{ gap: '8px' }}>
                  <SortFilterBtn label="Trier"   Icon={IconArrowsSort}            onClick={() => setSortOpen(true)} />
                  <SortFilterBtn label="Filtrer" Icon={IconAdjustmentsHorizontal} onClick={() => setFilterOpen(true)} />
                </div>
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
              {/* Bouton Recherche par critères + Catégories — gap 12px entre eux */}
              <div className="flex flex-col" style={{ gap: '12px' }}>
                <div className="flex justify-end">
                  <m.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterOpen(true)}
                    className="inline-flex items-center outline-none cursor-pointer"
                    style={{
                      gap:             '6px',
                      height:          '40px',
                      padding:         '0 14px',
                      backgroundColor: 'var(--neutral-1)',
                      border:          '2px solid var(--neutral-7)',
                      borderRadius:    'var(--br-md)',
                      color:           'var(--neutral-11)',
                      fontSize:        '14px',
                      fontWeight:      700,
                      whiteSpace:      'nowrap',
                    }}
                  >
                    <IconAdjustmentsHorizontal size={16} strokeWidth={2} color="var(--neutral-10)" />
                    Filtrer
                  </m.button>
                </div>

                {/* Categories */}
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  <SectionLabel>Catégories</SectionLabel>
                  <div className="flex overflow-x-auto" style={{ gap: '6px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                    {GENRES.map(genre => (
                      <CategoryCard key={genre} label={genre} onClick={() => onGenreFilter?.(genre)} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions personnalisées */}
              <div className="flex flex-col" style={{ gap: '20px' }}>
                <p style={{ fontFamily: 'var(--font-brand)', fontWeight: 700, fontSize: '24px', lineHeight: 1.2, color: 'var(--primary-12)', margin: 0 }}>
                  Suggestions personnalisées
                </p>
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

              {/* Nouveautés Mériadeck */}
              <div className="flex flex-col" style={{ gap: '20px' }}>
                <p style={{ fontFamily: 'var(--font-brand)', fontWeight: 700, fontSize: '24px', lineHeight: 1.2, margin: 0 }}>
                  <span style={{ color: 'var(--primary-12)' }}>Nouveauté </span>
                  <span style={{ color: 'var(--secondary-11)' }}>Mériadeck</span>
                </p>
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
    </div>
  );
}
