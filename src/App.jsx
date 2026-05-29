import { useState, useEffect } from 'react';
import HomePage          from './pages/HomePage';
import CataloguePage     from './pages/CataloguePage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookDetailPage    from './pages/BookDetailPage';
import ScannerPage       from './pages/ScannerPage';
import MonEspacePage     from './pages/MonEspacePage';
import ServicesPage      from './pages/ServicesPage';

const INITIAL_LISTS = [
  { id: 1, name: 'À lire plus tard', books: [] },
];


export default function App() {
  const [activeTab,      setActiveTab]      = useState('Accueil');
  const [searchQuery,    setSearchQuery]    = useState(null);
  const [genreFilter,    setGenreFilter]    = useState(null);
  const [activeFilters,  setActiveFilters]  = useState(null);
  const [selectedBook,   setSelectedBook]   = useState(null);
  const [scannerOpen,    setScannerOpen]    = useState(false);
  const [lists,          setLists]          = useState(INITIAL_LISTS);
  const [moEspaceSheet,  setMonEspaceSheet] = useState(null);

  /* ── Lists API ─────────────────────────────────── */
  const createList = (name) => {
    const id = Date.now();
    setLists(prev => [...prev, { id, name, books: [] }]);
    return id;
  };

  const addBookToList = (listId, book) => {
    setLists(prev => prev.map(list =>
      list.id === listId
        ? { ...list, books: list.books.some(b => b.id === book.id) ? list.books : [...list.books, book] }
        : list,
    ));
  };

  const removeBookFromList = (listId, bookId) => {
    setLists(prev => prev.map(list =>
      list.id === listId ? { ...list, books: list.books.filter(b => b.id !== bookId) } : list,
    ));
  };

  const renameList = (listId, newName) => {
    setLists(prev => prev.map(list => list.id === listId ? { ...list, name: newName } : list));
  };

  const deleteList = (listId) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  /* ── Navigation helpers ─────────────────────────── */
  const handleSearch         = (query)   => { setSearchQuery(query);    setGenreFilter(null);  setSelectedBook(null); setActiveFilters(null); };
  const handleGenreFilter    = (genre)   => { setGenreFilter(genre);    setSearchQuery(null);  setSelectedBook(null); setActiveFilters(null); };
  const handleCriteriaSearch = (filters) => { setActiveFilters(filters); setSearchQuery('');  setGenreFilter(null);  setSelectedBook(null); };
  const handleBack           = ()        => { setSearchQuery(null);     setGenreFilter(null);  setActiveFilters(null); };
  const handleBookSelect     = (book)    => { setScannerOpen(false);    setSelectedBook(book); };
  const handleBookBack       = ()        => setSelectedBook(null);
  const handleScanOpen       = ()        => setScannerOpen(true);
  const handleScanBack       = ()        => setScannerOpen(false);

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab, searchQuery, genreFilter, selectedBook, scannerOpen]);

  /* ── Compute page key + content ─────────────────── */
  let pageContent;

  if (scannerOpen) {
    pageContent = <ScannerPage onBack={handleScanBack} onBookSelect={handleBookSelect} />;
  } else if (selectedBook) {
    pageContent = (
      <BookDetailPage
        book={selectedBook}
        activeTab={activeTab}
        onTabChange={(tab) => { setSelectedBook(null); setSearchQuery(null); setActiveTab(tab); }}
        onBack={handleBookBack}
        onBookSelect={handleBookSelect}
        lists={lists}
        onCreateList={createList}
        onAddToList={addBookToList}
      />
    );
  } else if (searchQuery !== null || genreFilter) {
    pageContent = (
      <SearchResultsPage
        query={searchQuery ?? ''}
        genre={genreFilter}
        initialFilters={activeFilters}
        activeTab={activeTab}
        onTabChange={(tab) => { setSearchQuery(null); setGenreFilter(null); setActiveFilters(null); setActiveTab(tab); }}
        onBack={handleBack}
        onSearch={handleSearch}
        onBookSelect={handleBookSelect}
        onGenreFilter={handleGenreFilter}
      />
    );
  } else if (activeTab === 'Mon Espace') {
    pageContent = (
      <MonEspacePage
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lists={lists}
        onCreateList={createList}
        onRenameList={renameList}
        onDeleteList={deleteList}
        onRemoveBookFromList={removeBookFromList}
        onBookSelect={handleBookSelect}
        initialSheet={moEspaceSheet}
        key={moEspaceSheet}
      />
    );
  } else if (activeTab === 'Catalogue') {
    pageContent = (
      <CataloguePage
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={handleSearch}
        onBookSelect={handleBookSelect}
        onScanOpen={handleScanOpen}
        onGenreFilter={handleGenreFilter}
        onCriteriaSearch={handleCriteriaSearch}
      />
    );
  } else if (activeTab === 'Services') {
    pageContent = <ServicesPage activeTab={activeTab} onTabChange={setActiveTab} />;
  } else {
    pageContent = (
      <HomePage
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onScanOpen={handleScanOpen}
        onShowEmprunts={() => { setMonEspaceSheet('emprunts'); setActiveTab('Mon Espace'); }}
        onShowNumerique={() => { setMonEspaceSheet('numerique'); setActiveTab('Mon Espace'); }}
      />
    );
  }

  return pageContent;
}
