import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IconArrowLeft,
  IconX,
  IconArrowsSort,
  IconAdjustmentsHorizontal,
  IconCalendarTime,
  IconStarFilled,
  IconChevronDown,
} from '@tabler/icons-react';

import { BottomNavigation }  from '../components/ui/BottomNavigation';
import Badge from '../components/ui/Badge';
import FilterBottomSheet          from '../components/ui/FilterBottomSheet';
import SortBottomSheet            from '../components/ui/SortBottomSheet';
import BibliothequeBottomSheet    from '../components/ui/BibliothequeBottomSheet';
import GenreThematiqueBottomSheet, { DOC_SECTIONS } from '../components/ui/GenreThematiqueBottomSheet';
import BookCover from '../components/BookCover';
import { searchBooks, filterByGenre, BOOKS as ALL_BOOKS } from '../data/books';
import { searchGoogleBooks } from '../services/googleBooks';

/* ════════════════════════════════════════════════════
   FILTER HELPERS
   ════════════════════════════════════════════════════ */

// Map des labels de filtre UI vers les genres (français + anglais Google Books)
const GENRE_BOOK_MAP = {
  'Fantaisie':       ['Fantasy', 'Fantastique', 'Fantasy fiction', 'Epic fantasy', 'High fantasy'],
  'BD':              ['Bande dessinée', 'BD', 'Comics', 'Graphic novels', 'Comic books'],
  'Manga':           ['Manga'],
  'Roman':           ['Roman', 'Fiction', 'Literary fiction', 'General fiction'],
  'Biographie':      ['Biographie', 'Autobiographie', 'Témoignage', 'Biography', 'Autobiography', 'Biography & Autobiography'],
  'Autobiographie':  ['Autobiographie', 'Autobiography', 'Biography & Autobiography'],
  'Science-fiction': ['Science-fiction', 'Dystopie', 'Science fiction', 'Dystopian fiction', 'Sci-fi', 'Science Fiction'],
  'Aventure':        ['Aventure', 'Action', 'Adventure', 'Adventure stories', 'Action & Adventure', 'Adventure fiction'],
  'Policier':        ['Policier', 'Mystery', 'Crime', 'Detective', 'Mystery & Detective'],
  'Thriller':        ['Thriller', 'Suspense', 'Psychological thriller', 'Crime thriller'],
  'Horreur':         ['Horreur', 'Horror', 'Horror fiction'],
  'Jeunesse':        ['Jeunesse', 'Young adult', "Children's fiction", 'Juvenile fiction', 'Young Adult Fiction'],
  'Romance':         ['Romance', 'Love stories', 'Romantic fiction'],
  'Drame historique':['Historical fiction', 'Historical drama', 'Drame historique'],
  'Humour':          ['Humour', 'Comedy', 'Humor'],
  'Conte':           ['Conte', 'Tale', 'Fairy tale', 'Short stories'],
};

const DOC_PARENT_MAP = {
  histoire: ['Histoire', 'History', 'Géographie', 'Geography', 'Voyage', 'Travel', 'Historical'],
  sciences: ['Mathématiques', 'Mathematics', 'Physique', 'Chimie', 'Physics', 'Chemistry', 'Biologie', 'Biology', 'Astronomie', 'Astronomy', 'Technologie', 'Technology', 'Science'],
  nature:   ['Jardinage', 'Gardening', 'Santé', 'Médecine', 'Health', 'Medicine', 'Sport', 'Nature', 'Environment', 'Environnement'],
  philo:    ['Philosophie', 'Philosophy', 'Psychologie', 'Psychology', 'Spiritualité', 'Religion', 'Spirituality'],
  societe:  ['Sociologie', 'Sociology', 'Politique', 'Politics', 'Droit', 'Law', 'Économie', 'Economics', 'Langues', 'Languages', 'Social'],
  arts:     ['Art', 'Architecture', 'Musique', 'Music', 'Cinéma', 'Cinema', 'Film', 'Cuisine', 'Cooking', 'Gastronomie', 'Culture'],
};

const DOC_ITEM_MAP = {
  'Histoire':                    ['Histoire', 'History', 'Historical'],
  'Géographie':                  ['Géographie', 'Geography'],
  'Voyage':                      ['Voyage', 'Travel', 'Guide'],
  'Mathématiques':               ['Mathématiques', 'Mathematics', 'Math'],
  'Physique & Chimie':           ['Physique', 'Chimie', 'Physics', 'Chemistry'],
  'Biologie & Sciences naturelles': ['Biologie', 'Biology', 'Sciences naturelles', 'Natural sciences', 'Nature'],
  'Astronomie & Espace':         ['Astronomie', 'Astronomy', 'Espace', 'Space'],
  'Technologie & Numérique':     ['Technologie', 'Technology', 'Numérique', 'Digital', 'Informatique'],
  'Jardinage & Nature':          ['Jardinage', 'Gardening', 'Nature'],
  'Santé & Médecine':            ['Santé', 'Health', 'Médecine', 'Medicine'],
  'Sport & Loisirs':             ['Sport', 'Sports', 'Loisirs'],
  'Philosophie':                 ['Philosophie', 'Philosophy'],
  'Psychologie':                 ['Psychologie', 'Psychology'],
  'Spiritualité & Religion':     ['Spiritualité', 'Religion', 'Spirituality'],
  'Sociologie':                  ['Sociologie', 'Sociology', 'Social sciences'],
  'Politique':                   ['Politique', 'Politics', 'Political'],
  'Droit':                       ['Droit', 'Law', 'Legal'],
  'Économie':                    ['Économie', 'Economics', 'Business'],
  'Langues':                     ['Langues', 'Languages', 'Linguistics', 'Linguistique'],
  'Art & Architecture':          ['Art', 'Architecture'],
  'Musique':                     ['Musique', 'Music'],
  'Cinéma':                      ['Cinéma', 'Cinema', 'Film', 'Movies'],
  'Activités créatives':         ['Activités créatives', 'Creative', 'DIY', 'Craft'],
  'Cuisine & Art de vivre':      ['Cuisine', 'Cooking', 'Gastronomie', 'Art de vivre'],
};

function matchGenre(bookGenres, filterGenre) {
  const mapped = GENRE_BOOK_MAP[filterGenre] || [filterGenre];
  return bookGenres.some(bg =>
    mapped.some(m => bg.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(bg.toLowerCase()))
  );
}

function extractYear(publisher) {
  const match = publisher?.match(/\b(\d{4})\b/);
  return match ? parseInt(match[1]) : null;
}

const YEAR_RANGES = {
  'Avant 1800':  [0,    1799],
  '1800–1900':   [1800, 1900],
  '1900–1950':   [1901, 1950],
  '1950–1980':   [1951, 1980],
  '1980–2000':   [1981, 2000],
  '2000–2010':   [2001, 2010],
  '2010–2015':   [2011, 2015],
  '2015–2020':   [2016, 2020],
  'Après 2020':  [2021, 9999],
};

function applyAdvancedFilters(books, selections) {
  let res = books;

  // Année de publication (vient de "Plus de filtres")
  const selectedYears = Object.entries(selections.annee || {}).filter(([, v]) => v).map(([k]) => k);
  if (selectedYears.length > 0) {
    res = res.filter(b => {
      const y = extractYear(b.publisher);
      if (!y) return false;
      return selectedYears.some(range => {
        const [min, max] = YEAR_RANGES[range] || [0, 9999];
        return y >= min && y <= max;
      });
    });
  }

  return res;
}

function matchDocItem(bookGenres, itemLabel) {
  const keywords = DOC_ITEM_MAP[itemLabel] || [itemLabel];
  return bookGenres.some(bg =>
    keywords.some(k => bg.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(bg.toLowerCase()))
  );
}

function matchDocParent(bookGenres, parentId) {
  const keywords = DOC_PARENT_MAP[parentId] || [];
  return bookGenres.some(bg =>
    keywords.some(k => bg.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(bg.toLowerCase()))
  );
}

function applyGtFilters(books, gtState) {
  const { types = {}, genres = {}, docParents = {}, docItems = {} } = gtState;

  const activeTypes      = Object.entries(types).filter(([, v]) => v).map(([k]) => k);
  const activeGenres     = Object.entries(genres).filter(([, v]) => v).map(([k]) => k);
  const activeDocParents = Object.entries(docParents).filter(([, v]) => v).map(([k]) => k);
  const activeDocItems   = Object.entries(docItems).filter(([, v]) => v).map(([k]) => k);

  const hasFilter = activeTypes.length + activeGenres.length + activeDocParents.length + activeDocItems.length > 0;
  if (!hasFilter) return books;

  return books.filter(b => {
    const bg = b.genres || [];
    if (activeTypes.length      > 0 && activeTypes.some(t      => matchGenre(bg, t)))       return true;
    if (activeGenres.length     > 0 && activeGenres.some(g     => matchGenre(bg, g)))       return true;
    if (activeDocParents.length > 0 && activeDocParents.some(p => matchDocParent(bg, p)))   return true;
    if (activeDocItems.length   > 0 && activeDocItems.some(i   => matchDocItem(bg, i)))     return true;
    return false;
  });
}

/* ── Shadows ── */
const SHADOW_CARD =
  '0px 2px 10px 0px rgba(142,141,143,0.07)';
const SHADOW_BOOK =
  '0px 28px 8px rgba(125,120,120,0), 0px 18px 7px rgba(125,120,120,0.01), 0px 10px 6px rgba(125,120,120,0.05), 0px 4px 4px rgba(125,120,120,0.09), 0px 1px 2px rgba(125,120,120,0.1)';

/* ════════════════════════════════════════════════════
   RESULT CARD — Figma node 356:7052
   ════════════════════════════════════════════════════ */
function ResultCard({ title, author, genres, cover, available = true, returnDate, rating = 4.5, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}${author ? ` par ${author}` : ''}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      className="flex items-stretch focus-visible:ring-2 focus-visible:ring-[var(--primary-9)] focus-visible:outline-none"
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
        height:          '141px',
      }}
    >
      {/* Book cover */}
      <BookCover
        cover={cover}
        title={title}
        style={{
          width:                   '127px',
          alignSelf:               'stretch',
          borderTopLeftRadius:     '6px',
          borderTopRightRadius:    '6px',
          borderBottomLeftRadius:  0,
          borderBottomRightRadius: 0,
          boxShadow:               SHADOW_BOOK,
          flexShrink:              0,
        }}
      />

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0" style={{ gap: '8px', paddingBottom: '12px' }}>
        {/* Availability + Rating */}
        <div className="flex items-center" style={{ gap: '8px', minWidth: 0 }}>
          <Badge
            variant={available ? 'success' : 'warning'}
            size="large"
            icon={<IconCalendarTime size={16} strokeWidth={2} color={available ? 'var(--success-11)' : 'var(--warning-11)'} />}
          >
            {available ? 'Disponible' : `Retour ${returnDate || 'bientôt'}`}
          </Badge>
          <div className="flex-1 flex items-center justify-end shrink-0" style={{ gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: 1, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
              {rating}/5
            </span>
            <IconStarFilled size={16} color="var(--secondary-11)" />
          </div>
        </div>

        {/* Title / Author / Genres */}
        <div className="flex flex-col min-w-0" style={{ gap: '2px' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.5, color: 'var(--color-text-title)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {title}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5, color: 'var(--color-text-body)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {author}
          </p>
          {genres && (
            <p style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1, color: 'var(--color-text-subtle)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {genres}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   ACTIVE FILTER CHIP
   ════════════════════════════════════════════════════ */
function ActiveFilterChip({ label, onRemove }) {
  return (
    <div
      className="inline-flex items-center shrink-0"
      style={{
        height:          '32px',
        padding:         '0 12px',
        gap:             '4px',
        backgroundColor: 'var(--primary-3)',
        border:          '1px solid var(--primary-8)',
        borderRadius:    '8px',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.5, color: 'var(--primary-11)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        aria-label={`Retirer le filtre ${label}`}
        className="flex items-center justify-center outline-none border-none bg-transparent p-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
      >
        <IconX size={16} strokeWidth={2} color="var(--primary-11)" aria-hidden="true" />
      </motion.button>
    </div>
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
    <motion.button
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
          minWidth: '20px', height: '20px', borderRadius: '9999px',
          backgroundColor: 'var(--primary-10)', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', padding: '0 4px',
          fontSize: '11px', fontWeight: 700, color: 'var(--primary-1)',
        }}>
          {count}
        </span>
      )}
      {Icon && <Icon size={16} strokeWidth={2} color={isActive ? 'var(--primary-11)' : 'var(--neutral-10)'} />}
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════
   BIBLIOTHÈQUE BUTTON
   ════════════════════════════════════════════════════ */
function BibliothequeBtn({ selectedLibraries, onClick }) {
  const entries   = Object.entries(selectedLibraries).filter(([, v]) => v);
  const count     = entries.length;
  const isActive  = count > 0;
  const firstName = count > 0 ? entries[0][0] : null;
  const extra     = count > 1 ? count - 1 : 0;

  return (
    <motion.button
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
            minWidth: '20px', height: '20px', borderRadius: '9999px',
            backgroundColor: 'var(--primary-10)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            fontSize: '11px', fontWeight: 700, color: 'var(--primary-1)',
          }}>
            +{extra}
          </span>
        </>
      )}
      <IconChevronDown size={16} strokeWidth={2} color={isActive ? 'var(--primary-11)' : 'var(--neutral-10)'} />
    </motion.button>
  );
}


/* ════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════ */
export default function SearchResultsPage({ query = '', genre = null, initialFilters = null, initialGtState = null, activeTab, onTabChange, onBack, onSearch, onBookSelect, onGenreFilter }) {
  /* Scroll to top on mount */
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  /* ── Google Books results ── */
  const [googleResults, setGoogleResults] = useState([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState(null);

  useEffect(() => {
    const q = query?.trim();
    const searchQuery = genre ? `subject:${genre}` : q;
    if (!searchQuery) { setGoogleResults([]); setGoogleError(null); return; }

    let cancelled = false;
    setGoogleLoading(true);
    setGoogleError(null);
    searchGoogleBooks(searchQuery, 20)
      .then((res) => { if (!cancelled) { setGoogleResults(res); } })
      .catch((err) => { if (!cancelled) { setGoogleResults([]); setGoogleError(err.message); } })
      .finally(() => { if (!cancelled) setGoogleLoading(false); });

    return () => { cancelled = true; };
  }, [query, genre]);

  /* Sync inputValue when query prop changes (nouvelle recherche depuis App) */
  useEffect(() => { setInputValue(query); }, [query]);

  /* ── Sheets ── */
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [sortOpen,      setSortOpen]      = useState(false);
  const [libSheetOpen,  setLibSheetOpen]  = useState(false);
  const [gtOpen,        setGtOpen]        = useState(false);
  const [sortBy,        setSortBy]        = useState('pertinence');
  const [selectedLibraries, setSelectedLibraries] = useState({});
  const [gtState,       setGtState]       = useState(initialGtState ?? { types: {}, genres: {}, docParents: {}, docItems: {} });

  const SORT_LABELS = {
    pertinence:     null,
    mieux_notes:    'Les mieux notées',
    plus_empruntes: 'Les plus empruntés',
    auteur_az:      'Par auteur (A-Z)',
    titre_az:       'Par titre (A-Z)',
  };

  /* ── Search bar ── */
  const [inputValue, setInputValue] = useState(query);
  const [isEditing,  setIsEditing]  = useState(false);
  const inputRef = useRef(null);

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleXClick = () => {
    setInputValue('');
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmed = inputValue.trim();
      if (trimmed) {
        onSearch?.(trimmed);
        setIsEditing(false);
        inputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setInputValue(query);
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      setInputValue(query); // restore previous query
    }
    setIsEditing(false);
  };

  /* ── Filter state — initialisé depuis initialFilters si fourni ── */
  const [selections, setSelections] = useState(initialFilters?.selections ?? {});
  const [disponible, setDisponible] = useState(initialFilters?.disponible ?? false);

  const filterActiveCount = Object.values(selections).reduce(
    (acc, section) => acc + Object.values(section).filter(Boolean).length, 0
  ) + (disponible ? 1 : 0);

  const gtActiveCount =
    Object.values(gtState.types).filter(Boolean).length +
    Object.values(gtState.genres).filter(Boolean).length +
    Object.values(gtState.docParents).filter(Boolean).length +
    Object.values(gtState.docItems).filter(Boolean).length;

  const activeChips = Object.entries(selections).flatMap(([sectionId, opts]) =>
    Object.entries(opts)
      .filter(([, val]) => val)
      .map(([opt]) => ({ sectionId, label: opt }))
  );

  // Chips GT : regroupe tous les filtres actifs de Genre & Thématique
  const gtChips = [
    ...Object.entries(gtState.types || {}).filter(([, v]) => v).map(([label]) => ({ kind: 'types', label })),
    ...Object.entries(gtState.genres || {}).filter(([, v]) => v).map(([label]) => ({ kind: 'genres', label })),
    ...Object.entries(gtState.docParents || {}).filter(([, v]) => v).map(([label]) => ({ kind: 'docParents', label })),
    ...Object.entries(gtState.docItems || {}).filter(([, v]) => v).map(([label]) => ({ kind: 'docItems', label })),
  ];

  const removeChip = (sectionId, label) => {
    setSelections(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), [label]: false },
    }));
  };

  const removeGtChip = (kind, label) => {
    setGtState(prev => ({
      ...prev,
      [kind]: { ...(prev[kind] || {}), [label]: false },
    }));
  };

  const handleApply = ({ disponible: newDisponible, selections: newSelections }) => {
    setSelections(newSelections);
    setDisponible(newDisponible);
  };

  /* ── Results: genre browse, text search, ou filtre par critères ── */
  let results;
  if (genre) {
    results = filterByGenre(genre);
  } else if (inputValue || query) {
    results = searchBooks(inputValue || query);
  } else {
    // Recherche par critères uniquement — on part de tout le catalogue
    results = [...ALL_BOOKS];
  }
  if (disponible) results = results.filter(b => b.available);
  results = applyAdvancedFilters(results, selections);
  results = applyGtFilters(results, gtState);

  return (
    <div
      className="min-h-dvh font-sans flex flex-col"
      style={{ background: 'var(--neutral-2)', paddingBottom: 'var(--layout-12)' }}
    >
      <main className="flex flex-col" style={{ padding: '28px 20px 0', gap: '24px' }}>
        <h1 className="sr-only">Résultats de recherche</h1>

        {/* ══ TOP GROUP ══════════════════════════════ */}
        <div className="flex flex-col" style={{ gap: '12px' }}>

          {/* ── Search bar ── */}
          <div
            className="flex items-center"
            style={{
              height:          '48px',
              backgroundColor: 'var(--neutral-1)',
              border:          isEditing ? '1.5px solid var(--primary-8)' : '1px solid var(--neutral-7)',
              borderRadius:    'var(--br-round)',
              paddingLeft:     '16px',
              paddingRight:    '4px',
              gap:             '8px',
              transition:      'border-color 0.15s',
            }}
          >
            {/* Back arrow — always goes back to catalogue */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              aria-label="Retour"
              className="shrink-0 outline-none border-none bg-transparent p-0 cursor-pointer flex items-center focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
            >
              <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-subtle)" aria-hidden="true" />
            </motion.button>

            {/* Text / input — click to edit */}
            <div className="flex-1 relative" style={{ minWidth: 0 }} onClick={!isEditing ? startEditing : undefined}>
              {/* Hidden input always present for keyboard handling */}
              <input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={() => setIsEditing(true)}
                className="absolute inset-0 w-full bg-transparent outline-none border-none"
                style={{
                  fontSize:    '16px',
                  fontWeight:  400,
                  lineHeight:  1.5,
                  color:       'var(--primary-12)',
                  caretColor:  'var(--primary-10)',
                  opacity:     isEditing ? 1 : 0,
                  pointerEvents: isEditing ? 'auto' : 'none',
                }}
              />
              {/* Display text when not editing */}
              <span
                style={{
                  display:      'block',
                  fontSize:     '16px',
                  fontWeight:   400,
                  lineHeight:   1.5,
                  color:        (inputValue || query) ? 'var(--primary-12)' : 'var(--color-text-placeholder)',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace:   'nowrap',
                  opacity:      isEditing ? 0 : 1,
                  userSelect:   'none',
                  cursor:       'text',
                }}
              >
                {inputValue || query || 'Un titre, un auteur, ISBN…'}
              </span>
            </div>

            {/* X round button — only when there is text */}
            {inputValue.length > 0 && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handleXClick}
                aria-label="Effacer la recherche"
                className="shrink-0 flex items-center justify-center outline-none border-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-9)]"
                style={{
                  width:           '40px',
                  height:          '40px',
                  padding:         '8px',
                  backgroundColor: 'var(--neutral-4)',
                  borderRadius:    'var(--br-round)',
                }}
              >
                <IconX size={24} strokeWidth={2} color="var(--secondary-11)" aria-hidden="true" />
              </motion.button>
            )}
          </div>

          {/* ── Filter row ── */}
          <div className="flex items-center" style={{ gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            <SortFilterBtn label="Trier"              activeLabel={SORT_LABELS[sortBy]} Icon={IconArrowsSort}            onClick={() => setSortOpen(true)} />
            <BibliothequeBtn selectedLibraries={selectedLibraries}                                                       onClick={() => setLibSheetOpen(true)} />
            <SortFilterBtn label="Genre & Thématique" count={gtActiveCount}             Icon={IconChevronDown}           onClick={() => setGtOpen(true)} />
            <SortFilterBtn label="Plus de filtres"    count={filterActiveCount}         Icon={IconAdjustmentsHorizontal} onClick={() => setFilterOpen(true)} />
          </div>

          {/* ── Genre chip (category mode) ── */}
          {genre && (
            <div className="flex flex-wrap" style={{ gap: '6px' }}>
              <ActiveFilterChip label={genre} onRemove={onBack} />
            </div>
          )}

          {/* ── Active filter chips row (search mode) ── */}
          {!genre && activeChips.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: '6px' }}>
              {activeChips.map(({ sectionId, label }) => (
                <ActiveFilterChip
                  key={`${sectionId}-${label}`}
                  label={label}
                  onRemove={() => removeChip(sectionId, label)}
                />
              ))}
            </div>
          )}

          {/* ── GT Chips (Genre & Thématique) ── */}
          {!genre && gtChips.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: '6px' }}>
              {gtChips.map(({ kind, label }) => (
                <ActiveFilterChip
                  key={`gt-${kind}-${label}`}
                  label={label}
                  onRemove={() => removeGtChip(kind, label)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ══ RESULTS (catalogue + Google Books fusionnés) ══════ */}
        {(() => {
          const googleFiltered = applyAdvancedFilters(
            googleResults.map(b => ({ ...b, available: true })),
            selections
          );
          const merged = [...results, ...googleFiltered];
          return (
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <h2
                aria-live="polite"
                aria-busy={googleLoading}
                style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text-subtle)', margin: 0 }}
              >
                {genre
                  ? <>{merged.length} titre{merged.length !== 1 ? 's' : ''} en <span style={{ color: 'var(--primary-11)' }}>{genre}</span></>
                  : googleLoading
                    ? 'Recherche en cours…'
                    : <>{merged.length} résultat{merged.length !== 1 ? 's' : ''} pour &laquo;&nbsp;{inputValue || query}&nbsp;&raquo;</>
                }
              </h2>

              {merged.map((book) => (
                <ResultCard
                  key={book.id}
                  cover={book.cover}
                  title={book.title}
                  author={book.author}
                  genres={Array.isArray(book.genres) ? book.genres.join(', ') : book.genres}
                  available={book.available}
                  returnDate={book.returnDate}
                  rating={book.rating}
                  onClick={() => onBookSelect?.(book)}
                />
              ))}

              {merged.length === 0 && !googleLoading && (
                <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-subtle)', textAlign: 'center', padding: '32px 0' }}>
                  Aucun livre trouvé.
                </p>
              )}
            </div>
          );
        })()}

      </main>

      <BottomNavigation activeTab={activeTab ?? 'Catalogue'} onChange={onTabChange} />

      <FilterBottomSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApply}
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
        onApply={setGtState}
        externalState={gtState}
      />
    </div>
  );
}