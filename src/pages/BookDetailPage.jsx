import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconArrowLeft,
  IconCalendarTime,
  IconStarFilled,
  IconBookmarkPlus,
  IconBookmarkFilled,
  IconCircleArrowUpRight,
  IconBook2,
  IconMessageChatbot,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import { BOOKS as ALL_BOOKS, AUTHORS } from '../data/books';
import Badge from '../components/ui/Badge';
import { TabList } from '../components/ui/Tab';
import BookCover from '../components/BookCover';
import { searchGoogleBooks } from '../services/googleBooks';

/* ════════════════════════════════════════════════════
   SHADOWS (exact Figma values)
   ════════════════════════════════════════════════════ */
const SHADOW_BOOK =
  '0px 16px 9px 0px rgba(142,141,143,0.05),0px 7px 7px 0px rgba(142,141,143,0.09),0px 2px 4px 0px rgba(142,141,143,0.1),0px -11px 4px 0px rgba(142,141,143,0.01),0px -6px 4px 0px rgba(142,141,143,0.05),0px -3px 3px 0px rgba(142,141,143,0.09),0px -1px 2px 0px rgba(142,141,143,0.1)';

const SHADOW_CARD =
  '0px 2px 10px 0px rgba(142,141,143,0.07)';

const SHADOW_HEAD =
  '0px -2px 10px 0px rgba(142,141,143,0.04),0px 2px 10px 0px rgba(142,141,143,0.07)';

const SHADOW_BOTTOM =
  '0px 10px 20px 0px rgba(142,141,143,0.2),0px 10px 38px 0px rgba(142,141,143,0.35)';

const SHADOW_RESERV =
  '0px -2px 10px 0px rgba(99,181,180,0.08),0px 2px 10px 0px rgba(99,181,180,0.08)';


/* ════════════════════════════════════════════════════
   MINI BOOK CARD — suggestions (120×186)
   ════════════════════════════════════════════════════ */
function MiniBookCard({ book, onSelect }) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect?.(book)}
      className="flex flex-col shrink-0 items-start"
      style={{ gap: '6px', width: '120px', cursor: 'pointer' }}
    >
      <BookCover
        cover={book.cover}
        title={book.title}
        style={{ width: '120px', height: '186px', borderRadius: '6px', boxShadow: SHADOW_BOOK, flexShrink: 0 }}
      />
      {/* Title — SemiBold 12px, text-title */}
      <p style={{
        fontSize:     '12px',
        fontWeight:   600,
        lineHeight:   1,
        color:        'var(--color-text-title)',
        margin:       0,
        width:        '100%',
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        whiteSpace:   'nowrap',
      }}>
        {book.title}
      </p>
      {/* Author — Medium 10px, text-body */}
      <p style={{
        fontSize:     '10px',
        fontWeight:   500,
        lineHeight:   1,
        color:        'var(--color-text-body)',
        margin:       0,
        width:        '100%',
        overflow:     'hidden',
        textOverflow: 'ellipsis',
        whiteSpace:   'nowrap',
      }}>
        {book.author}
      </p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   LOCATION CARD — "Où le trouver ?"
   Figma node 427:4362
   ════════════════════════════════════════════════════ */
const SHADOW_DEPTH2 =
  '0px 1px 2px rgba(142,141,143,0.1),0px 4px 4px rgba(142,141,143,0.09),0px 10px 6px rgba(142,141,143,0.05),0px 18px 7px rgba(142,141,143,0.01)';

const SHADOW_COLOR_BTN =
  '0px -2px 10px rgba(99,181,180,0.08),0px 2px 10px rgba(99,181,180,0.08)';

/* One exemplaire section inside the card */
function LocationSection({ library, available, returnDate, fonds, cote, isLast }) {
  return (
    <>
      <div
        className="flex flex-col"
        style={{ gap: '12px', padding: '8px' }}
      >
        {/* Library name + badge */}
        <div className="flex flex-col" style={{ gap: '6px' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span style={{
              fontSize:   '16px',
              fontWeight: 700,
              lineHeight: 1.5,
              color:      'var(--color-text-title)',
              whiteSpace: 'nowrap',
              overflow:   'hidden',
              textOverflow: 'ellipsis',
            }}>
              {library}
            </span>

            {/* Tiny badge h-20px */}
            <Badge
              variant={available ? 'success' : 'warning'}
              size="large"
              icon={<IconCalendarTime size={14} strokeWidth={2} color={available ? 'var(--success-11)' : 'var(--warning-11)'} />}
            >
              {available ? 'Disponible' : `Retour ${returnDate || 'bientôt'}`}
            </Badge>
          </div>

          {/* Description Container */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            {/* Fonds description */}
            <p style={{
              fontSize:   '14px',
              fontWeight: 400,
              lineHeight: 1.5,
              color:      'var(--color-text-body)',
              margin:     0,
            }}>
              {fonds}
            </p>

            {/* Cote with book icon */}
            <div className="flex items-center" style={{ gap: '6px' }}>
              <IconBook2 size={20} strokeWidth={2} color="var(--color-text-subtle)" style={{ flexShrink: 0 }} />
              <span style={{
                fontSize:   '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color:      'var(--color-text-body)',
              }}>
                {cote}
              </span>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center outline-none border-none cursor-pointer"
          style={{
            height:          '32px',
            padding:         '0 12px',
            gap:             '6px',
            backgroundColor: 'var(--primary-10)',
            borderRadius:    'var(--br-sm)',
            boxShadow:       SHADOW_COLOR_BTN,
          }}
        >
          <IconMessageChatbot size={16} strokeWidth={2} color="var(--neutral-1)" />
          <span style={{
            fontSize:   '14px',
            fontWeight: 700,
            lineHeight: 1.5,
            color:      'var(--neutral-1)',
            whiteSpace: 'nowrap',
          }}>
            Demande de communication sur place
          </span>
        </motion.button>
      </div>

      {/* Divider between sections */}
      {!isLast && (
        <div style={{ height: '1px', backgroundColor: 'var(--primary-4)', margin: '0' }} />
      )}
    </>
  );
}

const LOCATION_DATA = [
  {
    library:   'Mériadeck',
    available: true,
    fonds:     'RLIT - Réserve Littérature - Livre consultable sur place ou empruntable',
    cote:      'Cote : R BIO',
  },
  {
    library:   'Mériadeck',
    available: true,
    fonds:     'RLIT - Réserve Littérature - Livre consultable sur place ou empruntable',
    cote:      'Cote : R BIO',
  },
];

function LocationCard() {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        border:       '1px solid var(--primary-3)',
        borderRadius: 'var(--br-lg)',
        boxShadow:    SHADOW_DEPTH2,
        background:   'linear-gradient(259deg, var(--primary-1) 6.5%, var(--primary-2) 85%)',
        overflow:     'hidden',
      }}
    >
      {/* Header — "Où le trouver ?" */}
      <div className="flex items-center" style={{ gap: '6px', padding: '8px' }}>
        <IconCircleArrowUpRight size={24} strokeWidth={2} color="var(--primary-11)" style={{ flexShrink: 0 }} />
        <span style={{
          fontSize:     '16px',
          fontWeight:   700,
          lineHeight:   1.5,
          color:        'var(--primary-11)',
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
        }}>
          Où le trouver ?
        </span>
      </div>

      {/* Content sections */}
      <div className="flex flex-col w-full">
        {LOCATION_DATA.map((loc, i) => (
          <LocationSection
            key={i}
            {...loc}
            isLast={i === LOCATION_DATA.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SECTION HEADING (used in tab content)
   Lora Bold 20px, text-brand
   ════════════════════════════════════════════════════ */
function SectionHeading({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-brand)',
      fontSize:   '20px',
      fontWeight: 700,
      lineHeight: 1.5,
      color:      'var(--color-text-brand)',
      margin:     0,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </p>
  );
}

/* ════════════════════════════════════════════════════
   AUTHOR AVATAR — avec fallback vert clair si pas de photo
   ════════════════════════════════════════════════════ */
function AuthorAvatar({ photo, name }) {
  const [error, setError] = useState(false);
  const showImg = photo && !error;
  return showImg ? (
    <div
      className="shrink-0 relative overflow-hidden"
      style={{ width: '72px', height: '72px', borderRadius: 'var(--br-round)', boxShadow: SHADOW_CARD, backgroundColor: 'var(--success-3)' }}
    >
      <img
        src={photo}
        alt={name}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        onError={() => setError(true)}
      />
    </div>
  ) : (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: '72px', height: '72px', borderRadius: 'var(--br-round)', backgroundColor: 'var(--success-3)', boxShadow: SHADOW_CARD }}
    >
      <IconUser size={32} strokeWidth={1.5} color="var(--success-11)" />
    </div>
  );
}

/* ════════════════════════════════════════════════════
   TAB: À PROPOS
   ════════════════════════════════════════════════════ */
function TabPropos({ book, onBookSelect }) {
  const { synopsis, author, genres } = book;
  const genreList = Array.isArray(genres) ? genres : (genres ?? '').split(',').map(g => g.trim()).filter(Boolean);

  /* Local books by same author / similar genre */
  const localAuthorBooks = ALL_BOOKS.filter(b => b.id !== book.id && b.author === author);
  const localSimilarBooks = ALL_BOOKS.filter(
    b => b.id !== book.id && b.author !== author && b.genres.some(g => genreList.includes(g))
  ).slice(0, 8);

  /* Google Books enrichment */
  const [googleAuthorBooks,  setGoogleAuthorBooks]  = useState([]);
  const [googleSimilarBooks, setGoogleSimilarBooks] = useState([]);

  useEffect(() => {
    if (!author) return;
    searchGoogleBooks(`inauthor:"${author}"`, 8)
      .then(res => setGoogleAuthorBooks(
        res.filter(b => b.title.toLowerCase() !== book.title.toLowerCase())
      ))
      .catch(() => setGoogleAuthorBooks([]));
  }, [author, book.title]);

  useEffect(() => {
    const genre = genreList[0];
    if (!genre) return;
    searchGoogleBooks(`subject:${genre}`, 10)
      .then(res => setGoogleSimilarBooks(
        res.filter(b => b.title.toLowerCase() !== book.title.toLowerCase() && b.author !== author)
      ))
      .catch(() => setGoogleSimilarBooks([]));
  }, [book.title, author]);

  /* Merge local + Google Books, deduplicate by title */
  const seen = new Set();
  const autresDuMemeAuteur = [...localAuthorBooks, ...googleAuthorBooks].filter(b => {
    const key = b.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const seen2 = new Set();
  const titresSimilaires = [...localSimilarBooks, ...googleSimilarBooks].filter(b => {
    const key = b.title.toLowerCase();
    if (seen2.has(key)) return false;
    seen2.add(key);
    return true;
  }).slice(0, 12);

  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>

      {/* Synopsis */}
      <div className="flex flex-col" style={{ gap: '12px' }}>
        <SectionHeading>Synopsis</SectionHeading>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   '14px',
          fontWeight: 500,
          lineHeight: 1.5,
          color:      'var(--color-text-body)',
          margin:     0,
        }}>
          {synopsis}
        </p>
      </div>

      {/* L'auteur */}
      {(() => {
        const authorData = AUTHORS[author];
        return (
          <div className="flex flex-col" style={{ gap: '12px' }}>
            <SectionHeading>L'auteur</SectionHeading>
            <div
              className="flex flex-col"
              style={{
                backgroundColor: 'var(--neutral-1)',
                border:          '1px solid var(--neutral-4)',
                borderRadius:    'var(--br-lg)',
                padding:         '12px',
                boxShadow:       SHADOW_CARD,
                gap:             '12px',
              }}
            >
              {/* Photo + name row */}
              <div className="flex items-center" style={{ gap: '12px' }}>
                <AuthorAvatar photo={authorData?.photo} name={author} />

                <div className="flex flex-col flex-1 min-w-0" style={{ gap: '2px' }}>
                  <p style={{
                    fontSize:     '16px',
                    fontWeight:   700,
                    lineHeight:   1.5,
                    color:        'var(--color-text-title)',
                    margin:       0,
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:   'nowrap',
                  }}>
                    {author}
                  </p>
                  {!authorData?.bio && (
                    <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: 'var(--color-text-subtle)', margin: 0 }}>
                      Auteur de &laquo;&nbsp;{book.title}&nbsp;&raquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {authorData?.bio && (
                <p style={{
                  fontSize:   '14px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color:      'var(--color-text-body)',
                  margin:     0,
                }}>
                  {authorData.bio}
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* Où le trouver — Location card */}
      <LocationCard />

      {/* D'autres livres de l'auteur */}
      {autresDuMemeAuteur.length > 0 && (
        <div className="flex flex-col" style={{ gap: '12px' }}>
          <SectionHeading>D'autres livres de l'auteur</SectionHeading>
          <div
            className="flex overflow-x-auto"
            style={{ gap: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}
          >
            {autresDuMemeAuteur.map((b) => (
              <MiniBookCard key={b.id} book={b} onSelect={onBookSelect} />
            ))}
          </div>
        </div>
      )}

      {/* D'autres titres similaires */}
      {titresSimilaires.length > 0 && (
        <div className="flex flex-col" style={{ gap: '12px' }}>
          <SectionHeading>D'autres titres similaires</SectionHeading>
          <div
            className="flex overflow-x-auto"
            style={{ gap: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}
          >
            {titresSimilaires.map((b) => (
              <MiniBookCard key={b.id} book={b} onSelect={onBookSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   TAB: AVIS — avis personnalisés par livre
   ════════════════════════════════════════════════════ */
const BOOK_REVIEWS = {
  1: [
    { title: 'Un trésor universel', rating: 5.0, text: "Ce livre m'a touché comme rarement une lecture peut le faire. En quelques pages, Saint-Exupéry capture l'essentiel de ce qui donne du sens à la vie. Une fable poétique à lire à tout âge.", reviewer: 'Lucie M.', date: '10 fév. 2025' },
    { title: 'Profond et délicat', rating: 4.8, text: "Le Petit Prince aborde des thèmes universels avec une légèreté désarmante. La relation entre l'aviateur et l'enfant est touchante. Les rencontres sur les astéroïdes sont à la fois drôles et mélancoliques.", reviewer: 'Raphaël T.', date: '3 nov. 2024' },
    { title: 'Lu à 8 ans, relu à 30', rating: 5.0, text: "Ce livre grandit avec vous. La phrase « on ne voit bien qu'avec le cœur » prend tout son sens avec l'expérience. Un chef-d'œuvre absolu à partager sans modération.", reviewer: 'Clara B.', date: '22 juil. 2024' },
  ],
  2: [
    { title: "L'absurde à l'état pur", rating: 4.5, text: "Camus réussit à créer un personnage à la fois déconcertant et fascinant. L'écriture épurée renforce le sentiment d'étrangeté de Meursault face au monde. Dense et inoubliable.", reviewer: 'Antoine D.', date: '5 mars 2025' },
    { title: 'Déroutant mais marquant', rating: 4.0, text: "L'Étranger met mal à l'aise, et c'est exactement l'effet voulu. L'indifférence de Meursault face à tout — la mort de sa mère, le meurtre, son procès — est troublante. Une lecture qui reste longtemps en tête.", reviewer: 'Sophie F.', date: '18 jan. 2025' },
    { title: 'Court mais percutant', rating: 4.2, text: "Camus condense toute sa philosophie de l'absurde dans ce récit minimaliste. La plage, le soleil, la gâchette : des symboles d'une efficacité redoutable. Indispensable.", reviewer: 'Pierre L.', date: '9 oct. 2024' },
  ],
  3: [
    { title: 'Toujours aussi glaçant', rating: 5.0, text: "1984 est une œuvre prophétique d'une actualité effrayante. La surveillance de masse, la propagande, la réécriture de l'histoire… Orwell avait tout prévu. Un roman que tout citoyen devrait lire.", reviewer: 'Mathieu R.', date: '14 avr. 2025' },
    { title: 'Big Brother vous regarde', rating: 4.8, text: "La novlangue, le Ministère de la Vérité, les deux minutes de haine… Orwell crée un univers cauchemardesque d'une cohérence redoutable. Une dystopie magistrale qui marque à jamais.", reviewer: 'Emma G.', date: '2 fév. 2025' },
    { title: 'Un classique indispensable', rating: 4.5, text: "Lu en terminale puis relu vingt ans plus tard. La deuxième lecture est encore plus angoissante car on reconnaît des éléments du monde réel. La fin reste l'une des plus désespérées de la littérature.", reviewer: 'Julien P.', date: '30 nov. 2024' },
  ],
  4: [
    { title: 'Un monument de SF', rating: 4.8, text: "Dune est une épopée politique, écologique et philosophique d'une ambition rare. Herbert a créé un univers d'une richesse incroyable, avec ses épices, ses Fremen et ses intrigues de pouvoir. Incontournable.", reviewer: 'Nicolas C.', date: '8 mai 2025' },
    { title: 'Dense mais fascinant', rating: 4.5, text: "Les premiers chapitres demandent un effort, mais une fois dans l'univers d'Arrakis, on ne peut plus le quitter. L'intrigue politique est aussi captivante que l'aspect SF.", reviewer: 'Amandine H.', date: '12 mars 2025' },
  ],
  5: [
    { title: 'La magie opère toujours !', rating: 5.0, text: "Vingt ans après ma première lecture, Poudlard me fait toujours autant rêver. J.K. Rowling a créé un monde magique d'une richesse inégalée. Le premier tome pose des bases exceptionnelles.", reviewer: 'Léa M.', date: '20 jan. 2025' },
    { title: 'Mon livre de chevet', rating: 4.9, text: "Ce livre m'a donné l'amour de la lecture. La découverte du monde des sorciers aux côtés d'Harry est une expérience inoubliable. Les personnages sont attachants, le rythme parfait.", reviewer: 'Victor D.', date: '5 déc. 2024' },
    { title: 'Magie et émerveillement', rating: 4.8, text: "Chaque page transpire l'enthousiasme de Rowling. On sent la liberté créative et l'amour de l'écriture. Ce premier tome est un enchantement du début à la fin.", reviewer: 'Inès R.', date: '16 sep. 2024' },
  ],
  6: [
    { title: "L'œuvre de toute une vie", rating: 5.0, text: "Tolkien n'a pas écrit un roman, il a créé un monde. La richesse des langues, des peuples, de l'histoire de la Terre du Milieu est stupéfiante. La Communauté de l'Anneau pose les bases d'une épopée unique.", reviewer: 'Étienne P.', date: '1 mars 2025' },
    { title: 'Fondateur du genre', rating: 4.9, text: "Sa façon de décrire les paysages, les personnages, les enjeux est d'une majesté incomparable. Parfois lent, mais chaque page est une richesse. À lire dans une traduction soignée.", reviewer: 'Camille D.', date: '22 nov. 2024' },
  ],
  7: [
    { title: 'Le début d\'une légende', rating: 4.9, text: "Naruto, c'est bien plus qu'un manga de ninjas. C'est une histoire d'amitié, de dépassement de soi et de résilience. Le premier tome pose magnifiquement les bases du personnage.", reviewer: 'Kevin T.', date: '15 avr. 2025' },
    { title: 'Un classique du manga', rating: 4.8, text: "Kishimoto crée un protagoniste immédiatement attachant malgré ses défauts. Les bases du monde des ninjas sont posées avec clarté et enthousiasme. Impossible de s'arrêter.", reviewer: 'Yuki L.', date: '8 jan. 2025' },
  ],
  8: [
    { title: 'Le meilleur manga de l\'histoire', rating: 4.9, text: "One Piece, ce n'est pas un manga, c'est une aventure humaine totale. Oda nous emmène dans un voyage extraordinaire de liberté, d'amitié et de rêve. Luffy est le personnage le plus inspirant de la fiction moderne.", reviewer: 'Tom B.', date: '25 fév. 2025' },
    { title: 'Un univers infini', rating: 4.8, text: "Chaque page transpire l'enthousiasme d'Eiichiro Oda. On sent dès le départ la liberté créative. Le monde des pirates n'a jamais été aussi exaltant.", reviewer: 'Marie O.', date: '10 oct. 2024' },
  ],
  9: [
    { title: 'Un monument humaniste', rating: 4.8, text: "Les Misérables est bien plus qu'un roman : c'est un manifeste. Hugo tisse misère sociale, justice, amour et rédemption avec une maestria inégalée. Jean Valjean est l'un des plus grands personnages de la littérature mondiale.", reviewer: 'Hélène C.', date: '3 mai 2025' },
    { title: 'Fresque épique', rating: 4.6, text: "Certes c'est long, certes Hugo fait des digressions, mais l'essentiel est là : une humanité profonde, des personnages inoubliables et une force narrative qui emporte sur 1900 pages.", reviewer: 'François D.', date: '17 fév. 2025' },
  ],
  10: [
    { title: 'Un chef-d\'œuvre intemporel', rating: 5.0, text: "Jules Verne nous transporte dans un univers sous-marin époustouflant. La richesse des descriptions et la précision scientifique font de ce roman une lecture absolument captivante. Le capitaine Nemo reste fascinant.", reviewer: 'Sophie L.', date: '14 jan. 2025' },
    { title: 'Voyage inoubliable', rating: 4.5, text: "Une aventure palpitante ! Les descriptions des fonds marins et la personnalité mystérieuse du capitaine Nemo m'ont happé. Un monument de la littérature d'aventure.", reviewer: 'Thomas B.', date: '3 sep. 2024' },
    { title: 'Science et poésie réunies', rating: 4.8, text: "Verne mêle brillamment imagination scientifique et beauté littéraire. Les images que ce livre procure sont extraordinaires. Une lecture que je recommande à tout le monde.", reviewer: 'Camille D.', date: '22 mars 2024' },
  ],
  11: [
    { title: 'Thriller haletant', rating: 4.2, text: "Dan Brown maîtrise l'art du page-turner. Les révélations s'enchaînent à un rythme effréné, le Da Vinci Code est une mécanique parfaite. On ne pose pas le livre avant la dernière page.", reviewer: 'Marie P.', date: '6 mars 2025' },
    { title: 'Divertissant et instructif', rating: 4.0, text: "Un mélange réussi de thriller et d'histoire de l'art. Les détails sur le Louvre et les symboles sont fascinants, même si certaines ficelles sont un peu grosses. Une lecture plaisir.", reviewer: 'Julien R.', date: '20 jan. 2025' },
  ],
  12: [
    { title: 'Profondément humain', rating: 4.5, text: "Lisbeth Salander est l'un des personnages les plus marquants de la littérature policière. Larsson traite de sujets difficiles avec une humanité rare. Un polar féministe et haletant.", reviewer: 'Nathalie D.', date: '11 avr. 2025' },
    { title: 'Impossible à poser', rating: 4.4, text: "L'intrigue prend le temps de s'installer mais une fois lancée, impossible de s'arrêter. Le duo Lisbeth-Mikael fonctionne à merveille. Premier tome d'une trilogie exceptionnelle.", reviewer: 'Bernard H.', date: '28 fév. 2025' },
  ],
  13: [
    { title: 'Visionnaire et urgent', rating: 4.5, text: "Bradbury a écrit ce roman en 1953 et il résonne encore aujourd'hui comme un cri d'alarme. Une société qui brûle les livres est-elle si éloignée de la nôtre ? Une lecture indispensable.", reviewer: 'Claire M.', date: '18 mars 2025' },
    { title: 'Court et percutant', rating: 4.2, text: "La force de Fahrenheit 451 est sa concision. En 200 pages, Bradbury dit tout ce qu'il y a à dire sur la censure et l'abrutissement de masse. Le personnage de Clarisse est inoubliable.", reviewer: 'Paul T.', date: '5 jan. 2025' },
  ],
  14: [
    { title: 'Bouleversant et lumineux', rating: 4.8, text: "Comment une jeune fille peut-elle garder autant de lumière dans des conditions aussi terribles ? Le journal d'Anne Frank est à la fois un témoignage historique et une leçon de vie. À lire absolument.", reviewer: 'Isabelle C.', date: '27 jan. 2025' },
    { title: 'Une voix qui traverse le temps', rating: 4.7, text: "La fraîcheur et l'intelligence d'Anne Frank contrastent avec l'horreur de la situation. Ce journal est un trésor humain que chaque génération doit découvrir.", reviewer: 'Thomas L.', date: '9 nov. 2024' },
  ],
  15: [
    { title: 'Portrait d\'un génie imparfait', rating: 4.4, text: "Isaacson brosse le portrait nuancé d'un homme visionnaire et impossible. Jobs était à la fois inspirant et cruel. Une biographie honnête qui ne cache rien de ses défauts.", reviewer: 'Alexandre D.', date: '3 avr. 2025' },
    { title: 'Fascinant et instructif', rating: 4.2, text: "Qu'on aime ou déteste Jobs, cette biographie est captivante. Les anecdotes sur la création d'Apple sont fascinantes. Idéal pour comprendre ce qui fait les grands entrepreneurs.", reviewer: 'Sophie V.', date: '14 fév. 2025' },
  ],
  16: [
    { title: 'Dystopie haletante', rating: 4.6, text: "Katniss est une héroïne moderne parfaite : courageuse, imparfaite, humaine. L'univers de Panem est effrayant de réalisme. Collins signe une dystopie YA qui parle aussi aux adultes.", reviewer: 'Emma R.', date: '10 mai 2025' },
    { title: 'Impossible à lâcher', rating: 4.5, text: "J'ai lu ce livre d'une traite. Les Hunger Games posent des questions profondes sur les médias et le pouvoir sous couvert de divertissement. Le premier tome est le meilleur.", reviewer: 'Lucas B.', date: '23 fév. 2025' },
  ],
  17: [
    { title: 'Vif, intelligent, intemporel', rating: 4.7, text: "Austen dépeint avec une ironie acérée les travers de la société anglaise du XIXe siècle. La relation entre Elizabeth et Darcy est l'une des plus belles de la littérature. Un roman à lire et relire.", reviewer: 'Charlotte P.', date: '7 avr. 2025' },
    { title: 'Une romance qui transcende son époque', rating: 4.6, text: "Ce qui est remarquable chez Austen, c'est sa modernité. Elizabeth Bennet pourrait être une femme d'aujourd'hui dans sa façon de penser. Un pur plaisir de lecture.", reviewer: 'Marie D.', date: '1 déc. 2024' },
  ],
  18: [
    { title: 'Le roman de la vengeance absolue', rating: 4.8, text: "Dumas construit une intrigue d'une perfection rare. Chaque fil narratif se noue et se dénoue avec une maestria époustouflante. Edmond Dantès est l'archétype du héros romantique.", reviewer: 'Henri M.', date: '16 mars 2025' },
    { title: 'Un souffle épique', rating: 4.7, text: "1243 pages qui filent comme l'éclair. L'évasion du château d'If, la découverte du trésor, les vengeances élaborées... Dumas n'a pas son pareil pour tenir en haleine.", reviewer: 'Françoise G.', date: '4 jan. 2025' },
  ],
  19: [
    { title: 'Un classique indétrônable', rating: 4.7, text: "Cinquante ans plus tard, Astérix fait toujours rire. L'humour est universel, les jeux de mots sont savoureux et les personnages sont devenus de vraies icônes culturelles. Premier de cordée !", reviewer: 'Jean-Paul L.', date: '22 avr. 2025' },
    { title: 'Toujours aussi hilarant', rating: 4.6, text: "Relire Astérix en adulte révèle une seconde lecture pleine d'humour politique et culturel. Goscinny était un génie. Ce premier album est fondateur d'un vrai art de la BD.", reviewer: 'Martine B.', date: '15 déc. 2024' },
  ],
  20: [
    { title: "L'album le plus émouvant d'Hergé", rating: 4.9, text: "Tintin au Tibet est l'œuvre la plus personnelle et la plus émouvante d'Hergé. L'amitié entre Tintin et Tchang transcende toutes les frontières. Un chef-d'œuvre de la BD mondiale.", reviewer: 'Alain D.', date: '28 mars 2025' },
    { title: 'Spirituel et universel', rating: 4.8, text: "Au-delà de l'aventure, Hergé traite ici de l'amitié, du sacrifice et de la spiritualité tibétaine avec un respect admirable. L'un des plus beaux albums jamais dessinés.", reviewer: 'Patricia M.', date: '10 jan. 2025' },
  ],
  21: [
    { title: 'Un cauchemar prophétique', rating: 4.6, text: "Huxley décrit un monde « heureux » et c'est ça le plus terrifiant. Le bonheur chimique, le conditionnement, l'absence de liberté choisie librement... Glaçant et indispensable.", reviewer: 'Sylvie P.', date: '5 avr. 2025' },
    { title: 'Complémentaire à 1984', rating: 4.4, text: "Là où Orwell mise sur la terreur, Huxley mise sur le confort. Les deux visions sont terrifiantes à leur façon. Le Meilleur des Mondes mérite amplement sa place au panthéon des dystopies.", reviewer: 'Marc T.', date: '19 fév. 2025' },
  ],
  22: [
    { title: 'Une plongée dans le crime et la culpabilité', rating: 4.7, text: "Crime et Châtiment est le roman psychologique le plus intense que j'aie jamais lu. La descente dans la culpabilité de Raskolnikov est décrite avec une précision clinique et une profondeur humaine bouleversante.", reviewer: 'Vera K.', date: '12 mars 2025' },
    { title: 'Dostoïevski au sommet', rating: 4.6, text: "Raskolnikov est l'un des personnages les plus complexes de la littérature. Sa théorie du « droit au crime » et son effondrement intérieur sont d'une richesse psychologique inégalée.", reviewer: 'Olivier M.', date: '6 déc. 2024' },
  ],
  23: [
    { title: 'Une fable sur l\'essentiel', rating: 4.4, text: "L'Alchimiste est un livre qui arrive au bon moment dans une vie. Simple mais profond, il invite à écouter les signes et à poursuivre sa Légende Personnelle. Un beau cadeau à se faire.", reviewer: 'Isabelle F.', date: '8 mai 2025' },
    { title: 'Universel et inspirant', rating: 4.3, text: "Paulo Coelho a écrit une fable universelle qui traverse les cultures et les âges. Certains trouveront ça naïf, mais la sincérité du propos emporte tout. Une lecture qui laisse une marque.", reviewer: 'David R.', date: '2 mars 2025' },
  ],
  24: [
    { title: 'Cape et épée au sommet', rating: 4.8, text: "Dumas n'a pas son pareil pour l'action, les rebondissements et les personnages. Athos, Porthos, Aramis et D'Artagnan forment l'une des plus belles fraternités de la littérature. Un pur régal.", reviewer: 'Antoine P.', date: '30 avr. 2025' },
    { title: 'Tous pour un !', rating: 4.7, text: "Ce roman devrait être prescrit à tous. L'amitié virile, l'honneur, le sens de la répartie... Dumas incarne tout ce que l'aventure a de plus noble. Inoubliable.", reviewer: 'Christophe D.', date: '14 jan. 2025' },
  ],
  25: [
    { title: "L'absurde incarné", rating: 4.3, text: "Kafka condense en 128 pages tout l'absurde de la condition humaine. La transformation de Gregor en insecte est une métaphore puissante de l'aliénation et du regard des autres. Court, dense, inoubliable.", reviewer: 'Anne-Marie L.', date: '20 mars 2025' },
    { title: 'Un court-circuit dans la tête', rating: 4.2, text: "On rit, on frissonne, on reste sans voix. La Métamorphose est un texte qui dérange et qui reste. La réaction de la famille face à la transformation est plus effrayante que la transformation elle-même.", reviewer: 'Sébastien T.', date: '7 nov. 2024' },
  ],
  26: [
    { title: 'Madame Bovary, c\'est moi', rating: 4.4, text: "Flaubert crée un personnage féminin d'une complexité rare pour l'époque. Emma est à la fois agaçante et touchante. Le style est d'une précision chirurgicale. Un roman qui mérite sa réputation de chef-d'œuvre.", reviewer: 'Céline B.', date: '25 mars 2025' },
    { title: 'Réalisme magistral', rating: 4.3, text: "L'écriture de Flaubert est d'une maîtrise absolue. Chaque mot est à sa place. La description de la province normande est à la fois banale et poétique. Un monument du réalisme littéraire.", reviewer: 'Laurent D.', date: '12 oct. 2024' },
  ],
};

/* Rating bar — 5 rows for ratings 5,4,3,2,1 */
const BAR_WIDTHS = ['75%', '50%', '20%', '10%', '5%']; // approximate from Figma

function ReviewCard({ title, rating, text, reviewer, date }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="flex flex-col items-end"
      style={{
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-4)',
        borderRadius:    'var(--br-lg)',
        padding:         '20px',
        boxShadow:       SHADOW_CARD,
        gap:             '6px',
        width:           '100%',
      }}
    >
      {/* Card Content */}
      <div className="flex flex-col w-full" style={{ gap: '8px' }}>
        {/* Title + rating */}
        <div className="flex items-center w-full" style={{ gap: '6px' }}>
          <p style={{
            flex:       '1 0 0',
            fontFamily: 'var(--font-brand)',
            fontSize:   '20px',
            fontWeight: 700,
            lineHeight: 1.5,
            color:      'var(--color-text-brand)',
            margin:     0,
          }}>
            {title}
          </p>
          <div className="flex items-center shrink-0" style={{ gap: '4px' }}>
            <IconStarFilled size={24} color="var(--secondary-11)" />
            <span style={{
              fontSize:   '16px',
              fontWeight: 600,
              lineHeight: 1.5,
              color:      'var(--secondary-11)',
            }}>
              {rating}
            </span>
          </div>
        </div>

        {/* Review text + Voir plus/moins */}
        <div className="flex flex-col" style={{ gap: '2px' }}>
          <p style={{
            fontSize:        '16px',
            fontWeight:      400,
            lineHeight:      1.5,
            color:           'var(--color-text-subtle)',
            margin:          0,
            overflow:        expanded ? 'visible' : 'hidden',
            display:         expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? undefined : 3,
            WebkitBoxOrient: expanded ? undefined : 'vertical',
          }}>
            {text}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            style={{
              all:            'unset',
              fontSize:       '14px',
              fontWeight:     500,
              lineHeight:     1.5,
              color:          'var(--primary-11)',
              textDecoration: 'underline',
              cursor:         'pointer',
              alignSelf:      'flex-start',
            }}
          >
            {expanded ? 'Voir moins' : 'Voir plus'}
          </button>
        </div>
      </div>

      {/* Reviewer info + Signaler */}
      <div className="flex items-center w-full" style={{ gap: '8px' }}>
        <div className="flex flex-1 items-end min-w-0" style={{ gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
            {reviewer}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
            {date}
          </span>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="shrink-0 outline-none border-none bg-transparent cursor-pointer"
          style={{
            height:       '32px',
            padding:      '0 12px',
            borderRadius: 'var(--br-sm)',
            fontSize:     '14px',
            fontWeight:   700,
            lineHeight:   1.5,
            color:        'var(--neutral-11)',
          }}
        >
          Signaler
        </motion.button>
      </div>
    </div>
  );
}

function TabAvis({ book }) {
  const reviews = BOOK_REVIEWS[book?.id] ?? [];
  const avgRating = book?.rating ?? (reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null);

  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>

      {/* Notes & Avis header + summary */}
      <div className="flex flex-col" style={{ gap: '6px' }}>
        <SectionHeading>Notes &amp; Avis des lecteurs</SectionHeading>

        {/* Summary box: big rating + bars */}
        <div className="flex" style={{ gap: '24px', height: '84px', alignItems: 'flex-start', marginTop: '6px' }}>
          {/* Big rating */}
          <div className="flex flex-col items-center justify-center self-stretch shrink-0" style={{ gap: '4px' }}>
            <p style={{
              fontFamily: 'var(--font-brand)',
              fontSize:   '40px',
              fontWeight: 700,
              lineHeight: 1.2,
              color:      'var(--primary-11)',
              margin:     0,
            }}>
              {avgRating ?? '—'}
            </p>
            <p style={{
              fontSize:   '14px',
              fontWeight: 500,
              lineHeight: 1.5,
              color:      'var(--primary-10)',
              margin:     0,
            }}>
              sur 5
            </p>
          </div>

          {/* Bars */}
          <div className="flex flex-col flex-1 self-stretch min-w-0" style={{ gap: '6px', justifyContent: 'center' }}>
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="flex items-center" style={{ gap: '12px' }}>
                <div
                  className="flex-1 relative overflow-hidden rounded-[var(--br-round)]"
                  style={{ height: '5px', backgroundColor: 'var(--neutral-3)' }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-[var(--br-round)]"
                    style={{
                      width:           BAR_WIDTHS[i],
                      backgroundColor: 'var(--neutral-10)',
                    }}
                  />
                </div>
                <span style={{
                  fontSize:   '12px',
                  fontWeight: 600,
                  lineHeight: 1,
                  color:      'var(--neutral-11)',
                  width:      '12px',
                  textAlign:  'right',
                  flexShrink: 0,
                }}>
                  {star}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes count */}
        <p style={{
          fontSize:   '14px',
          fontWeight: 500,
          lineHeight: 1.5,
          color:      'var(--color-text-subtle)',
          margin:     0,
          textAlign:  'right',
        }}>
          605 Notes
        </p>
      </div>

      {/* Review cards */}
      <div className="flex flex-col" style={{ gap: '20px' }}>
        {reviews.length > 0
          ? reviews.map((r, i) => <ReviewCard key={i} {...r} />)
          : (
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-subtle)', textAlign: 'center', padding: '32px 0' }}>
              Aucun avis pour ce livre pour le moment.
            </p>
          )
        }
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   TAB: DÉTAILS DU LIVRE
   One white card with field rows
   ════════════════════════════════════════════════════ */
function DetailField({ label, value }) {
  return (
    <div
      className="flex flex-col justify-center"
      style={{ height: '48px', gap: '0px', width: '100%' }}
    >
      <p style={{
        fontSize:   '16px',
        fontWeight: 700,
        lineHeight: 1.5,
        color:      'var(--color-text-brand)',
        margin:     0,
        whiteSpace: 'nowrap',
      }}>
        {label}
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
        {value}
      </p>
    </div>
  );
}

function TabDetails({ title, author, publisher, isbn, ean }) {
  return (
    <div
      className="flex flex-col items-end"
      style={{
        backgroundColor: 'var(--neutral-1)',
        border:          '1px solid var(--neutral-4)',
        borderRadius:    'var(--br-lg)',
        padding:         '20px',
        boxShadow:       SHADOW_CARD,
        gap:             '16px',
        width:           '100%',
      }}
    >
      <div className="flex flex-col items-start w-full" style={{ gap: '16px' }}>
        <DetailField label="Titre complet"         value={title}     />
        <DetailField label="Auteur(s)/Autrice(s)"  value={author}    />
        <DetailField label="Publication"           value={publisher} />
        <DetailField label="ISBN"                  value={isbn}      />
        <DetailField label="EAN"                   value={ean}       />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   LIST THUMBNAIL mini (50×50) — partagé avec modal
   ════════════════════════════════════════════════════ */
function MiniListThumb({ books }) {
  const covers = [...books.slice(0, 3), null, null, null].slice(0, 3);
  return (
    <div style={{ width: 50, height: 50, flexShrink: 0, backgroundColor: 'var(--secondary-3)', borderRadius: 10, padding: 4, display: 'flex', gap: 2, boxShadow: '0px 2px 10px rgba(142,141,143,0.07)' }}>
      <div style={{ width: 19, height: '100%', borderRadius: '6px 0 0 6px', overflow: 'hidden', backgroundColor: 'var(--secondary-4)' }}>
        {covers[0]?.cover && <img src={covers[0].cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ flex: 1, borderRadius: '0 6px 0 0', overflow: 'hidden', backgroundColor: 'var(--secondary-5)' }}>
          {covers[1]?.cover && <img src={covers[1].cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div style={{ flex: 1, borderRadius: '0 0 6px 0', overflow: 'hidden', backgroundColor: 'var(--secondary-5)' }}>
          {covers[2]?.cover && <img src={covers[2].cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
      </div>
    </div>
  );
}

const SHADOW_MODAL_BTN      = '0px -2px 10px rgba(99,181,180,0.08),0px 2px 10px rgba(99,181,180,0.08)';
const SHADOW_MODAL_LIST     = '0px 18px 7px rgba(142,141,143,0.01),0px 10px 6px rgba(142,141,143,0.05),0px 4px 4px rgba(142,141,143,0.09),0px 1px 2px rgba(142,141,143,0.10)';
const SHADOW_MODAL_SELECTED = '0px 18px 7px rgba(99,181,180,0.01),0px 10px 6px rgba(99,181,180,0.05),0px 4px 4px rgba(99,181,180,0.09),0px 1px 2px rgba(99,181,180,0.10)';

/* ════════════════════════════════════════════════════
   ADD TO LIST MODAL (bottom sheet)
   ════════════════════════════════════════════════════ */
function AddToListModal({ book, lists, onAddToList, onCreateList, onClose }) {
  const [view,         setView]         = useState('select'); // 'select' | 'create'
  const [selectedId,   setSelectedId]   = useState(null);
  const [newName,      setNewName]      = useState('');

  const handleValidate = () => {
    if (selectedId !== null) {
      onAddToList(selectedId, book);
      onClose();
    }
  };

  const handleCreate = () => {
    if (newName.trim()) {
      const newId = onCreateList(newName.trim());
      setSelectedId(newId);
      setNewName('');
      setView('select');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 60, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', backgroundColor: 'white', borderRadius: '32px 32px 0 0', padding: '16px 0 32px', boxShadow: '0px -4px 24px rgba(0,0,0,0.12)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Handle */}
        <div style={{ width: 80, height: 8, backgroundColor: 'var(--neutral-5)', borderRadius: 9999, margin: '0 auto 16px', flexShrink: 0 }} />

        {/* Header */}
        <div className="flex items-center" style={{ padding: '0 20px 2px', gap: 4, flexShrink: 0 }}>
          <p style={{ flex: '1 0 0', fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, color: 'var(--color-text-title)', margin: 0 }}>
            {view === 'select' ? 'Ajouter à une liste' : 'Créer une liste'}
          </p>
          <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: 'var(--neutral-4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconX size={18} strokeWidth={2} color="var(--color-text-subtle)" />
          </motion.button>
        </div>

        {view === 'select' ? (
          <>
            {/* List of existing lists */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lists.map(list => {
                const isSelected = selectedId === list.id;
                return (
                  <motion.div
                    key={list.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedId(isSelected ? null : list.id)}
                    style={{
                      display: 'flex', gap: 8, alignItems: 'center',
                      padding: 6, borderRadius: 12, cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--primary-2)' : 'var(--neutral-1)',
                      border: isSelected ? '2px solid var(--primary-8)' : '1px solid var(--neutral-5)',
                      boxShadow: isSelected ? SHADOW_MODAL_SELECTED : SHADOW_MODAL_LIST,
                      transition: 'background-color 0.15s, border 0.15s',
                    }}
                  >
                    <MiniListThumb books={list.books} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-brand)', fontSize: '16px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text-brand)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{list.name}</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-body)', margin: 0 }}>{list.books.length} titre{list.books.length !== 1 ? 's' : ''}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="flex" style={{ gap: 10, padding: '16px 16px 0', flexShrink: 0 }}>
              <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setView('create')}
                style={{ flex: 1, height: 48, backgroundColor: 'var(--primary-3)', border: 'none', borderRadius: 10, fontSize: '16px', fontWeight: 700, color: 'var(--primary-11)', cursor: 'pointer' }}>
                Créer une liste
              </motion.button>
              <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={handleValidate}
                disabled={selectedId === null}
                style={{ flex: 1, height: 48, backgroundColor: selectedId !== null ? 'var(--primary-10)' : 'var(--neutral-5)', border: 'none', borderRadius: 10, fontSize: '16px', fontWeight: 700, color: selectedId !== null ? 'white' : 'var(--neutral-9)', cursor: selectedId !== null ? 'pointer' : 'default', boxShadow: selectedId !== null ? SHADOW_MODAL_BTN : 'none', transition: 'background-color 0.2s' }}>
                Valider la sélection
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* Create form */}
            <div style={{ padding: '24px 20px 0', flex: 1 }}>
              <label style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-subtle)', display: 'block', marginBottom: 8 }}>
                Nom de la liste
              </label>
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Entré le nom de la liste"
                style={{ width: '100%', height: 48, padding: '0 16px', border: '1px solid var(--neutral-6)', borderRadius: 10, backgroundColor: 'var(--neutral-1)', fontSize: '16px', outline: 'none', boxSizing: 'border-box', color: 'var(--color-text-title)' }}
              />
            </div>
            <div className="flex" style={{ gap: 10, padding: '24px 16px 0', flexShrink: 0 }}>
              <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setView('select')}
                style={{ flex: 1, height: 48, backgroundColor: 'white', border: '2px solid var(--neutral-7)', borderRadius: 10, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-subtle)', cursor: 'pointer' }}>
                Annuler
              </motion.button>
              <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={handleCreate}
                style={{ flex: 1, height: 48, backgroundColor: 'var(--primary-10)', border: 'none', borderRadius: 10, fontSize: '16px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: SHADOW_MODAL_BTN }}>
                Créer la liste
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════ */
export default function BookDetailPage({ book, onBack, onBookSelect, lists = [], onCreateList, onAddToList }) {
  const [activeTab,    setActiveTab]    = useState(0);
  const [tabDir,       setTabDir]       = useState(0);
  const [listModalOpen, setListModalOpen] = useState(false);

  const changeTab = (i) => { setTabDir(i > activeTab ? 1 : -1); setActiveTab(i); };

  // Le livre est sauvegardé si présent dans au moins une liste
  const saved = lists.some(l => l.books.some(b => b.id === book?.id));

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const {
    title      = 'Titre inconnu',
    author     = 'Auteur inconnu',
    cover      = null,
    genres     = [],
    available  = true,
    returnDate = null,
    rating     = null,
    pages      = '',
    synopsis   = '',
    isbn       = '',
    ean        = '',
    publisher  = '',
  } = book || {};

  const genreList = Array.isArray(genres)
    ? genres
    : (genres ?? '').split(',').map(g => g.trim()).filter(Boolean);

  const TABS = ['À propos', 'Avis', 'Détails du livre'];

  return (
    <div
      className="min-h-dvh font-sans flex flex-col relative"
      style={{
        /* Figma: secondary-background-2 → neutral-background-2 gradient */
        background: 'linear-gradient(180deg, var(--secondary-2) 0%, var(--neutral-2) 49%), var(--neutral-2)',
      }}
    >

      {/* ══ STICKY HEADER (head_fiche) ══════════════ */}
      <div
        className="sticky top-0 z-30 flex flex-col items-center w-full"
        style={{
          backgroundColor: 'var(--secondary-1)',
          boxShadow:       SHADOW_HEAD,
          padding:         '16px 20px',
        }}
      >
        <div className="relative flex items-center w-full" style={{ minHeight: '40px' }}>
          {/* Back button — round icon */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex items-center justify-center outline-none border-none cursor-pointer shrink-0"
            style={{
              width:           '40px',
              height:          '40px',
              padding:         '8px',
              backgroundColor: 'var(--neutral-4)',
              borderRadius:    'var(--br-round)',
            }}
          >
            <IconArrowLeft size={24} strokeWidth={2} color="var(--color-text-title)" />
          </motion.button>

          <div className="flex-1" />

          {/* Availability badge — right aligned */}
          <Badge
            variant={available ? 'success' : 'warning'}
            size="large"
            icon={<IconCalendarTime size={20} strokeWidth={2} color={available ? 'var(--success-11)' : 'var(--warning-11)'} />}
          >
            {available ? 'Disponible' : `Retour ${returnDate || 'bientôt'}`}
          </Badge>
        </div>
      </div>

      {/* ══ BOOK INFO SECTION ════════════════════════ */}
      <div
        className="flex flex-col items-center w-full"
        style={{ gap: '32px', padding: '32px 16px 0' }}
      >
        {/* head_fiche_livre: cover + title + key_info + badges */}
        <div className="flex flex-col items-center w-full" style={{ gap: '16px' }}>

          {/* Book cover — 155×237 */}
          <BookCover
            cover={cover}
            title={title}
            style={{ width: '155px', height: '237px', borderRadius: '6px', boxShadow: SHADOW_BOOK, flexShrink: 0 }}
          />

          {/* Title — Lora Bold 24px (h1) text-brand */}
          <p style={{
            fontFamily: 'var(--font-brand)',
            fontSize:   '24px',
            fontWeight: 700,
            lineHeight: 1.2,
            color:      'var(--color-text-brand)',
            margin:     0,
            textAlign:  'center',
          }}>
            {title}
          </p>

          {/* key_info: rating + pages — side by side */}
          <div className="flex items-center justify-center" style={{ gap: '16px' }}>
            {/* Rating — Lora Bold 16px text-subtle + star 16px secondary */}
            {rating != null && (
              <div className="flex items-center" style={{ gap: '6px', height: '32px' }}>
                <span style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize:   '16px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color:      'var(--color-text-subtle)',
                }}>
                  {rating}/5
                </span>
                <IconStarFilled size={16} color="var(--secondary-9)" />
              </div>
            )}

            {/* Pages — Lora Medium 16px text-subtle */}
            <div className="flex items-center" style={{ height: '32px' }}>
              <span style={{
                fontFamily: 'var(--font-brand)',
                fontSize:   '16px',
                fontWeight: 500,
                lineHeight: 1.2,
                color:      'var(--color-text-subtle)',
              }}>
                {pages} pages
              </span>
            </div>
          </div>

          {/* Genre badges — secondary colored, wrapping, centered */}
          <div className="flex flex-wrap justify-center w-full" style={{ gap: '8px' }}>
            {genreList.map(g => <Badge key={g} variant="default" size="large">{g}</Badge>)}
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <TabList tabs={TABS} value={activeTab} onChange={changeTab} />
      </div>

      {/* ══ TAB CONTENT ══════════════════════════════ */}
      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: tabDir * 28 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -tabDir * 28 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50 && activeTab < TABS.length - 1) changeTab(activeTab + 1);
          else if (info.offset.x > 50 && activeTab > 0) changeTab(activeTab - 1);
        }}
        style={{ padding: '32px 20px 160px', cursor: 'grab', touchAction: 'pan-y' }}
      >
        {activeTab === 0 && (
          <TabPropos book={book || {}} onBookSelect={onBookSelect} />
        )}
        {activeTab === 1 && <TabAvis book={book} />}
        {activeTab === 2 && (
          <TabDetails
            title={title}
            author={author}
            publisher={publisher}
            isbn={isbn || ean}
            ean={ean || isbn}
          />
        )}
      </motion.div>
      </AnimatePresence>

      {/* ══ FIXED BOTTOM BAR ═════════════════════════ */}
      {/*  bg neutral-1, shadow depth-neutral-3, p-20      */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center"
        style={{
          backgroundColor: 'var(--neutral-1)',
          boxShadow:       SHADOW_BOTTOM,
          padding:         '20px',
          gap:             '12px',
        }}
      >
        {/* Bookmark button — ouvre la modale Ajouter à une liste */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.93 }}
          onClick={() => setListModalOpen(true)}
          className="flex items-center justify-center outline-none border-none cursor-pointer shrink-0"
          style={{
            width:           '48px',
            height:          '48px',
            borderRadius:    'var(--br-md)',
            backgroundColor: saved ? 'var(--primary-4)' : 'var(--primary-3)',
          }}
        >
          {saved
            ? <IconBookmarkFilled size={20} color="var(--primary-10)" />
            : <IconBookmarkPlus   size={20} strokeWidth={2} color="var(--primary-10)" />
          }
        </motion.button>

        {/* ADD TO LIST MODAL */}
        <AnimatePresence>
          {listModalOpen && (
            <AddToListModal
              book={book}
              lists={lists}
              onAddToList={onAddToList}
              onCreateList={onCreateList}
              onClose={() => setListModalOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Réserver — flex-1, primary-10 bg, white text */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center outline-none border-none cursor-pointer"
          style={{
            height:          '48px',
            padding:         '0 20px',
            borderRadius:    'var(--br-md)',
            backgroundColor: 'var(--primary-10)',
            boxShadow:       SHADOW_RESERV,
            fontSize:        '16px',
            fontWeight:      700,
            lineHeight:      1.5,
            color:           'var(--neutral-1)',
            whiteSpace:      'nowrap',
          }}
        >
          Réserver
        </motion.button>
      </div>
    </div>
  );
}
