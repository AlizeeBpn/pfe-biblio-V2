/**
 * Fonction serverless Vercel - recupere le VRAI texte d'un classique du
 * domaine public via Project Gutenberg (Gutendex), cote serveur (pas de CORS).
 *
 * GET /api/book-text?title=...&author=...
 *   -> 200 { title, text, truncated }   texte nettoye, plafonne
 *   -> 404 { error }                    aucun livre feuilletable trouve
 */

const START_RE = /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG[^*]*\*\*\*/i;
const END_RE   = /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG[^*]*\*\*\*/i;
const CAP = 45000; // ~50-70 pages de lecture, suffisant pour feuilleter

const norm = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function cleanGutenberg(raw) {
  let text = raw.replace(/\r\n/g, '\n');

  const s = text.search(START_RE);
  if (s !== -1) text = text.slice(text.indexOf('\n', s) + 1);
  const e = text.search(END_RE);
  if (e !== -1) text = text.slice(0, e);

  // Gutenberg coupe les lignes "en dur". On recolle les lignes d'un meme
  // paragraphe (ligne vide = separateur de paragraphe).
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').replace(/[ \t]{2,}/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

  const title  = (req.query.title  || '').toString().trim();
  const author = (req.query.author || '').toString().trim();
  if (!title) { res.status(400).json({ error: 'title requis' }); return; }

  try {
    const q = encodeURIComponent(`${title} ${author}`.trim());
    const gx = await fetch(`https://gutendex.com/books/?search=${q}&languages=fr`);
    if (!gx.ok) { res.status(502).json({ error: 'gutendex indisponible' }); return; }

    const { results = [] } = await gx.json();
    const withText = results.filter((b) =>
      Object.keys(b.formats || {}).some((k) => k.startsWith('text/plain'))
    );
    if (!withText.length) { res.status(404).json({ error: 'introuvable' }); return; }

    // Choisit le resultat dont le titre recouvre le mieux le titre demande,
    // puis (a egalite) l'edition la plus telechargee — souvent la plus propre /
    // le 1er tome.
    const wanted = norm(title).split(/\s+/).filter((w) => w.length > 2);
    const tomeNum = (t) => {
      // alternation ordonnée (plus longs d'abord) sinon « iv » serait lu « i »
      const m = norm(t).match(/tome\s+([0-9]+|viii|vii|iii|vi|iv|ix|ii|v|x|i)\b/);
      if (!m) return 0;
      const map = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
      return map[m[1]] ?? (parseInt(m[1], 10) || 0);
    };
    const best = withText
      .map((b) => ({ b, score: wanted.filter((w) => norm(b.title).includes(w)).length }))
      .sort((a, b) =>
        (b.score - a.score) ||
        (tomeNum(a.b.title) - tomeNum(b.b.title)) ||          // privilégie le tome I
        ((b.b.download_count || 0) - (a.b.download_count || 0))
      )[0].b;

    const txtUrl = Object.entries(best.formats)
      .find(([k]) => k.startsWith('text/plain'))[1]
      .replace(/^http:/, 'https:');

    const tr = await fetch(txtUrl);
    if (!tr.ok) { res.status(502).json({ error: 'texte indisponible' }); return; }

    const cleaned = cleanGutenberg(await tr.text());
    let text = cleaned.slice(0, CAP);
    if (cleaned.length > CAP) text = text.slice(0, text.lastIndexOf(' '));

    res.status(200).json({ title: best.title, text, truncated: cleaned.length > CAP });
  } catch {
    res.status(500).json({ error: 'erreur serveur' });
  }
}
