const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Transforme un volume Google Books en format livre compatible avec l'app.
 */
function toBook(item) {
  const info = item.volumeInfo || {};
  const isbn =
    info.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ||
    info.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier ||
    null;

  return {
    id: `gb_${item.id}`,
    title: info.title || 'Titre inconnu',
    author: info.authors?.join(', ') || 'Auteur inconnu',
    cover:
      info.imageLinks?.thumbnail?.replace('http://', 'https://') ||
      info.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
      null,
    genres: info.categories || [],
    synopsis: info.description || '',
    rating: info.averageRating ?? null,
    pages: info.pageCount ? String(info.pageCount) : null,
    isbn,
    publisher: [info.publisher, info.publishedDate?.slice(0, 4)].filter(Boolean).join(', '),
    available: null,
    _source: 'google',
  };
}

/**
 * Recherche des livres via l'API Google Books.
 * @param {string} query
 * @param {number} maxResults
 * @returns {Promise<Array>}
 */
export async function searchGoogleBooks(query, maxResults = 10) {
  if (!query?.trim()) return [];

  const params = new URLSearchParams({ q: query, maxResults });
  if (API_KEY) params.set('key', API_KEY);

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);

  const data = await res.json();
  return (data.items || []).map(toBook);
}

/**
 * Vérifie si un livre peut être feuilleté via l'Embedded Viewer Google Books.
 * @param {string} isbn
 * @returns {Promise<{ embeddable: boolean, viewability: string, volumeId: string|null }|null>}
 */
export async function checkPreviewAvailability(isbn) {
  if (!isbn) return null;
  const clean = String(isbn).replace(/[^0-9Xx]/g, '');
  if (!clean) return null;

  const params = new URLSearchParams({ q: `isbn:${clean}`, maxResults: '1' });
  if (API_KEY) params.set('key', API_KEY);

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) return null;

  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;

  const access = item.accessInfo || {};
  return {
    embeddable:  !!access.embeddable,
    viewability: access.viewability || 'UNKNOWN',
    volumeId:    item.id || null,
  };
}

/**
 * Récupère les détails d'un volume par son ID Google Books.
 * @param {string} volumeId
 * @returns {Promise<Object>}
 */
export async function getGoogleBook(volumeId) {
  const params = new URLSearchParams();
  if (API_KEY) params.set('key', API_KEY);
  const res = await fetch(`${BASE_URL}/${volumeId}?${params}`);
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);
  const item = await res.json();
  return toBook(item);
}
