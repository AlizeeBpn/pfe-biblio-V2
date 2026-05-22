/**
 * Catalogue de livres de la bibliothèque
 * Couvertures : Open Library (https://covers.openlibrary.org)
 * Format : /b/isbn/{ISBN-13}-L.jpg
 */

const cover = (isbn) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;


export const BOOKS = [
  {
    id: 1,
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    cover: cover('9782070408504'),
    genres: ['Jeunesse', 'Classique', 'Roman'],
    synopsis:
      "Dans le désert du Sahara, un aviateur tombe en panne et rencontre un mystérieux enfant venu d'une autre planète. Chef-d'œuvre poétique et philosophique, cette fable sur l'essentiel de la vie a conquis le monde entier.",
    rating: 4.8,
    pages: '96',
    isbn: '9782070408504',
    publisher: 'Gallimard, 1943',
    available: true,
  },
  {
    id: 2,
    title: "L'Étranger",
    author: 'Albert Camus',
    cover: cover('9782070360024'),
    genres: ['Roman', 'Classique'],
    synopsis:
      "Meursault, un Français vivant en Algérie, apprend la mort de sa mère et tue un Arabe sur une plage. Un roman phare de l'absurdisme qui explore l'indifférence au monde.",
    rating: 4.2,
    pages: '186',
    isbn: '9782070360024',
    publisher: 'Gallimard, 1942',
    available: true,
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    cover: cover('9782070368228'),
    genres: ['Science-fiction', 'Dystopie', 'Classique'],
    synopsis:
      "Dans l'État totalitaire d'Océania, Winston Smith remet en question l'omnipotent Parti. Un roman visionnaire sur la surveillance de masse, la manipulation et la résistance individuelle.",
    rating: 4.7,
    pages: '438',
    isbn: '9782070368228',
    publisher: 'Gallimard, 1950',
    available: true,
  },
  {
    id: 4,
    title: 'Dune',
    author: 'Frank Herbert',
    cover: '/covers/dune.jpg',
    genres: ['Science-fiction', 'Aventure', 'Fantastique'],
    synopsis:
      "Sur la planète désertique Arrakis, source de la précieuse Épice, le jeune Paul Atréides affronte trahison et guerre pour son destin. L'épopée de science-fiction la plus vendue de l'histoire.",
    rating: 4.6,
    pages: '896',
    isbn: '9782266320948',
    publisher: 'Pocket, 1965',
    available: false,
    returnDate: '15 avr.',
  },
  {
    id: 5,
    title: "Harry Potter à l'École des Sorciers",
    author: 'J.K. Rowling',
    cover: cover('9782070541270'),
    genres: ['Fantastique', 'Jeunesse', 'Aventure'],
    synopsis:
      "Le jeune Harry Potter découvre le jour de ses 11 ans qu'il est sorcier et entre à Poudlard. Le début d'une saga qui a marqué toute une génération de lecteurs à travers le monde.",
    rating: 4.9,
    pages: '309',
    isbn: '9782070541270',
    publisher: 'Gallimard Jeunesse, 1997',
    available: true,
  },
  {
    id: 6,
    title: 'Le Seigneur des Anneaux — La Communauté de l\'Anneau',
    author: 'J.R.R. Tolkien',
    cover: '/covers/seigneur-des-anneaux.jpg',
    genres: ['Fantastique', 'Aventure', 'Classique'],
    synopsis:
      "Le jeune hobbit Frodon Sacquet hérite d'un anneau unique aux pouvoirs terrifiants. Accompagné d'une communauté de nains, d'elfes, d'hommes et d'un magicien, il entame une quête désespérée vers la Montagne du Destin pour détruire l'artefact avant que Sauron ne s'en empare.",
    rating: 4.9,
    pages: '520',
    isbn: '9782266283038',
    publisher: 'Christian Bourgois, 1954',
    available: true,
  },
  {
    id: 7,
    title: 'Naruto — Tome 1',
    author: 'Masashi Kishimoto',
    cover: '/covers/naruto.jpg',
    genres: ['Manga', 'Action', 'Aventure'],
    synopsis:
      "Dans le village de Konoha, Naruto, un jeune orphelin cancre et garnement, rêve de devenir Hokage, le plus grand chef ninja. Porteur d'un lourd secret lié au Démon Renard à neuf queues scellé en lui, il doit prouver sa valeur à travers des épreuves périlleuses et des liens d'amitié indéfectibles.",
    rating: 4.8,
    pages: '192',
    isbn: '9782871294146',
    publisher: 'Kana, 2002',
    available: true,
  },
  {
    id: 8,
    title: 'One Piece — Tome 1',
    author: 'Eiichiro Oda',
    cover: '/covers/one-piece.jpg',
    genres: ['Manga', 'Aventure', 'Action'],
    synopsis:
      "Monkey D. Luffy, au corps élastique grâce à un fruit du démon, part en mer pour devenir Roi des Pirates et trouver le légendaire trésor One Piece. Le manga le plus vendu de l'histoire.",
    rating: 4.7,
    pages: '216',
    isbn: '9782723449786',
    publisher: 'Glénat, 1997',
    available: true,
  },
  {
    id: 9,
    title: 'Les Misérables',
    author: 'Victor Hugo',
    cover: cover('9782070409228'),
    genres: ['Roman', 'Classique', 'Aventure'],
    synopsis:
      "Jean Valjean, ancien forçat, cherche à se racheter dans une France du XIXe siècle marquée par la misère sociale. Le grand roman humaniste de Victor Hugo, fresque épique et bouleversante.",
    rating: 4.6,
    pages: '1900',
    isbn: '9782070409228',
    publisher: 'Gallimard, 1862',
    available: true,
  },
  {
    id: 10,
    title: 'Vingt Mille Lieues Sous Les Mers',
    author: 'Jules Verne',
    cover: '/covers/vingt-mille-lieues.jpg',
    genres: ['Aventure', 'Classique', 'Science-fiction'],
    synopsis:
      "Le professeur Aronnax part à la poursuite d'un mystérieux monstre marin et se retrouve prisonnier du capitaine Nemo à bord du Nautilus. Un chef-d'œuvre d'anticipation scientifique.",
    rating: 4.5,
    pages: '500',
    isbn: '9782070360246',
    publisher: 'Gallimard, 1869',
    available: true,
  },
  {
    id: 11,
    title: 'Le Da Vinci Code',
    author: 'Dan Brown',
    cover: '/covers/da-vinci-code.jpg',
    genres: ['Policier', 'Thriller', 'Roman'],
    synopsis:
      "Le professeur Robert Langdon est appelé au Louvre où un conservateur a été retrouvé mort, laissant un message crypté. Une course contre la montre à travers les secrets millénaires de l'Église.",
    rating: 4.1,
    pages: '574',
    isbn: '9782709626088',
    publisher: 'Jean-Claude Lattès, 2003',
    available: false,
    returnDate: '22 avr.',
  },
  {
    id: 12,
    title: 'Millénium — Les Hommes qui n\'aimaient pas les femmes',
    author: 'Stieg Larsson',
    cover: cover('9782742765072'),
    genres: ['Policier', 'Thriller'],
    synopsis:
      "Lisbeth Salander, hackeuse solitaire, et Mikael Blomkvist, journaliste, enquêtent sur la disparition d'une héritière il y a 40 ans. Un polar haletant, profondément humain et féministe.",
    rating: 4.4,
    pages: '672',
    isbn: '9782742765072',
    publisher: 'Actes Sud, 2005',
    available: true,
  },
  {
    id: 13,
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    cover: '/covers/fahrenheit-451.jpg',
    genres: ['Science-fiction', 'Dystopie'],
    synopsis:
      "Dans un futur où les livres sont interdits et brûlés, Guy Montag est pompier. Mais une rencontre éveille en lui le doute. Un cri d'alarme visionnaire contre la censure et l'abêtissement.",
    rating: 4.3,
    pages: '213',
    isbn: '9782070364336',
    publisher: 'Gallimard, 1953',
    available: true,
  },
  {
    id: 14,
    title: "Journal d'Anne Frank",
    author: 'Anne Frank',
    cover: cover('9782070407521'),
    genres: ['Biographie', 'Témoignage', 'Classique'],
    synopsis:
      "Entre 1942 et 1944, Anne Frank tient son journal, cachée avec sa famille à Amsterdam. Le témoignage poignant et lumineux d'une jeune fille de 13 ans face à l'horreur nazie.",
    rating: 4.7,
    pages: '283',
    isbn: '9782070407521',
    publisher: 'Gallimard, 1947',
    available: true,
  },
  {
    id: 15,
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    cover: null,
    genres: ['Biographie', 'Non-fiction'],
    synopsis:
      "La biographie définitive du co-fondateur d'Apple, basée sur des dizaines d'interviews exclusives. La vie d'un génie visionnaire, perfectionniste et impitoyable qui a révolutionné la tech.",
    rating: 4.3,
    pages: '656',
    isbn: '9782709638876',
    publisher: 'Jean-Claude Lattès, 2011',
    available: true,
  },
  {
    id: 16,
    title: 'Hunger Games — Tome 1',
    author: 'Suzanne Collins',
    cover: '/covers/hunger-games.jpg',
    genres: ['Science-fiction', 'Dystopie', 'Jeunesse', 'Aventure'],
    synopsis:
      "Dans Panem, la jeune Katniss se porte volontaire pour les Hunger Games : un combat à mort télévisé. Une dystopie haletante et politique sur le pouvoir des médias et la résistance.",
    rating: 4.5,
    pages: '390',
    isbn: '9782266179119',
    publisher: 'Pocket Jeunesse, 2008',
    available: true,
  },
  {
    id: 17,
    title: 'Orgueil et Préjugés',
    author: 'Jane Austen',
    cover: '/covers/orgueil-prejuges.jpg',
    genres: ['Romance', 'Classique', 'Roman'],
    synopsis:
      "Elizabeth Bennet et Mr Darcy s'affrontent entre préjugés sociaux et orgueil dans l'Angleterre du XIXe siècle. Le roman romantique de Jane Austen, vif, intelligent et indémodable.",
    rating: 4.6,
    pages: '448',
    isbn: '9782070413522',
    publisher: 'Gallimard, 1813',
    available: false,
    returnDate: '8 avr.',
  },
  {
    id: 18,
    title: 'Le Comte de Monte-Cristo',
    author: 'Alexandre Dumas',
    cover: '/covers/monte-cristo.jpg',
    genres: ['Aventure', 'Classique', 'Roman'],
    synopsis:
      "Edmond Dantès, injustement emprisonné, s'évade et revient sous une nouvelle identité pour se venger de ceux qui l'ont trahi. Le roman d'aventures et de vengeance d'Alexandre Dumas.",
    rating: 4.7,
    pages: '1243',
    isbn: '9782070409518',
    publisher: 'Gallimard, 1844',
    available: true,
  },
  {
    id: 19,
    title: 'Astérix le Gaulois',
    author: 'Goscinny & Uderzo',
    cover: cover('9782012101425'),
    genres: ['Bande dessinée', 'Jeunesse', 'Humour'],
    synopsis:
      "En 50 avant J.-C., un village gaulois résiste à l'envahisseur romain grâce à la potion magique de Panoramix. Astérix et Obélix vivent leur première grande aventure dans cet album fondateur.",
    rating: 4.6,
    pages: '48',
    isbn: '9782012101425',
    publisher: 'Hachette, 1961',
    available: true,
  },
  {
    id: 20,
    title: 'Tintin au Tibet',
    author: 'Hergé',
    cover: cover('9782203001084'),
    genres: ['Bande dessinée', 'Jeunesse', 'Aventure'],
    synopsis:
      "Tintin part au Tibet à la recherche de son ami Tchang, seul survivant d'un accident d'avion dans l'Himalaya. L'album le plus personnel d'Hergé, empreint d'amitié et de spiritualité.",
    rating: 4.8,
    pages: '62',
    isbn: '9782203001084',
    publisher: 'Casterman, 1960',
    available: true,
  },
  {
    id: 21,
    title: 'Le Meilleur des Mondes',
    author: 'Aldous Huxley',
    cover: cover('9782266126526'),
    genres: ['Science-fiction', 'Dystopie'],
    synopsis:
      "Dans un futur où la société est stabilisée grâce au conditionnement génétique et au bonheur chimique, Bernard Marx remet en question le bonheur artificiel imposé par l'État. Un chef-d'œuvre prophétique sur la liberté et le contrôle social.",
    rating: 4.5,
    pages: '288',
    isbn: '9782266126526',
    publisher: 'Pocket, 1932',
    available: true,
  },
  {
    id: 22,
    title: 'Crime et Châtiment',
    author: 'Fiodor Dostoïevski',
    cover: cover('9782070360277'),
    genres: ['Classique', 'Roman', 'Policier'],
    synopsis:
      "Raskolnikov, un jeune étudiant de Saint-Pétersbourg, convaincu d'être supérieur aux lois ordinaires, commet un meurtre et est rongé par la culpabilité. Le roman psychologique le plus intense de la littérature russe.",
    rating: 4.6,
    pages: '672',
    isbn: '9782070360277',
    publisher: 'Gallimard, 1866',
    available: true,
  },
  {
    id: 23,
    title: "L'Alchimiste",
    author: 'Paulo Coelho',
    cover: cover('9782290004449'),
    genres: ['Roman', 'Aventure'],
    synopsis:
      "Santiago, un jeune berger andalou, part en quête de son trésor personnel jusqu'aux pyramides d'Égypte. Une fable universelle sur le courage de suivre ses rêves et d'écouter l'âme du monde.",
    rating: 4.3,
    pages: '256',
    isbn: '9782290004449',
    publisher: "J'ai Lu, 1988",
    available: true,
  },
  {
    id: 24,
    title: 'Les Trois Mousquetaires',
    author: 'Alexandre Dumas',
    cover: '/covers/trois-mousquetaires.jpg',
    genres: ['Aventure', 'Classique', 'Roman'],
    synopsis:
      "D'Artagnan monte à Paris rejoindre les mousquetaires du roi et se lie d'amitié avec Athos, Porthos et Aramis. Tous pour un, un pour tous : le roman d'aventures et de cape et d'épée d'Alexandre Dumas.",
    rating: 4.7,
    pages: '752',
    isbn: '9782070413812',
    publisher: 'Gallimard, 1844',
    available: false,
    returnDate: '20 avr.',
  },
  {
    id: 25,
    title: 'La Métamorphose',
    author: 'Franz Kafka',
    cover: cover('9782070362493'),
    genres: ['Classique', 'Roman'],
    synopsis:
      "Gregor Samsa se réveille un matin transformé en insecte gigantesque. La famille doit faire face à cette transformation incompréhensible. Le chef-d'œuvre de l'absurde kafkaïen, court et inoubliable.",
    rating: 4.2,
    pages: '128',
    isbn: '9782070362493',
    publisher: 'Gallimard, 1915',
    available: true,
  },
  {
    id: 26,
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    cover: '/covers/madame-bovary.jpg',
    genres: ['Classique', 'Roman', 'Romance'],
    synopsis:
      "Emma Bovary, femme d'un médecin de province, rêve d'une vie romanesque et se noie dans des aventures et des dettes qui la mèneront à sa perte. Le roman réaliste de Flaubert, indémodable et bouleversant.",
    rating: 4.3,
    pages: '464',
    isbn: '9782070360451',
    publisher: 'Gallimard, 1857',
    available: true,
  },
  {
    id: 27,
    title: 'Le Meurtre de Roger Ackroyd',
    author: 'Agatha Christie',
    cover: '/covers/roger-ackroyd.jpg',
    genres: ['Policier', 'Thriller', 'Classique'],
    synopsis:
      "Hercule Poirot, retiré dans un village anglais, est mêlé à l'affaire du meurtre de Roger Ackroyd. Un roman policier au dénouement si surprenant qu'il a révolutionné le genre. Le chef-d'œuvre d'Agatha Christie.",
    rating: 4.6,
    pages: '288',
    isbn: '9782253006381',
    publisher: 'Le Livre de Poche, 1926',
    available: true,
  },
  {
    id: 28,
    title: 'Dragon Ball — Tome 1',
    author: 'Akira Toriyama',
    cover: '/covers/dragon-ball.jpg',
    genres: ['Manga', 'Aventure', 'Action'],
    synopsis:
      "Le jeune Son Goku, doté d'une force surhumaine, rencontre Bulma et part à la recherche des sept Dragon Balls. Le manga culte d'Akira Toriyama qui a marqué des générations de lecteurs à travers le monde.",
    rating: 4.8,
    pages: '192',
    isbn: '9782723407809',
    publisher: 'Glénat, 1984',
    available: true,
  },
  {
    id: 29,
    title: 'Divergente — Tome 1',
    author: 'Veronica Roth',
    cover: '/covers/divergente.jpg',
    genres: ['Science-fiction', 'Dystopie', 'Jeunesse', 'Aventure'],
    synopsis:
      "Dans un Chicago dystopique divisé en factions, Tris Prior découvre qu'elle est Divergente et ne peut appartenir à aucune faction. Une dystopie haletante pour jeunes adultes sur l'identité et la rébellion.",
    rating: 4.2,
    pages: '416',
    isbn: '9782092528396',
    publisher: 'Nathan, 2011',
    available: true,
  },
  {
    id: 30,
    title: 'Les Aventures de Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    cover: cover('9782070408481'),
    genres: ['Policier', 'Thriller', 'Classique', 'Aventure'],
    synopsis:
      "Douze enquêtes du célèbre détective de Baker Street et de son fidèle Watson. Du scandale de Bohême au ruban moucheté, des affaires aussi complexes que fascinantes résolues par la plus grande intelligence policière de la fiction.",
    rating: 4.7,
    pages: '336',
    isbn: '9782070408481',
    publisher: 'Gallimard, 1892',
    available: false,
    returnDate: '30 avr.',
  },
  {
    id: 31,
    title: 'Le Tour du Monde en 80 Jours',
    author: 'Jules Verne',
    cover: '/covers/tour-du-monde.jpg',
    genres: ['Aventure', 'Classique', 'Roman'],
    synopsis:
      "Phileas Fogg parie qu'il peut faire le tour du monde en 80 jours. Accompagné de son valet Passepartout et poursuivi par l'inspecteur Fix, il traverse l'Inde, le Japon et l'Amérique dans une course effrénée.",
    rating: 4.5,
    pages: '336',
    isbn: '9782070412426',
    publisher: 'Gallimard, 1872',
    available: true,
  },
  {
    id: 32,
    title: 'La Princesse de Clèves',
    author: 'Madame de La Fayette',
    cover: cover('9782070408030'),
    genres: ['Classique', 'Romance', 'Roman'],
    synopsis:
      "À la cour d'Henri II, une jeune femme mariée tombe amoureuse du duc de Nemours mais refuse de céder à sa passion par vertu et fidélité. Premier roman psychologique de la littérature française.",
    rating: 4.0,
    pages: '224',
    isbn: '9782070408030',
    publisher: 'Gallimard, 1678',
    available: true,
  },
  {
    id: 33,
    title: 'Le Monde de Sophie',
    author: 'Jostein Gaarder',
    cover: cover('9782070531424'),
    genres: ['Roman', 'Jeunesse'],
    synopsis:
      "Sophie, 14 ans, reçoit des lettres d'un mystérieux professeur de philosophie. Un roman initiatique qui parcourt toute l'histoire de la philosophie occidentale, passionnant et accessible pour tous.",
    rating: 4.4,
    pages: '588',
    isbn: '9782070531424',
    publisher: 'Gallimard Jeunesse, 1991',
    available: true,
  },
  {
    id: 34,
    title: 'Attack on Titan — Tome 1',
    author: 'Hajime Isayama',
    cover: '/covers/attack-on-titan.jpg',
    genres: ['Manga', 'Action', 'Science-fiction'],
    synopsis:
      "Humanity survives behind enormous walls, threatened by man-eating Titans. When the walls are breached, Eren Yeager vows to exterminate all Titans. Le manga dark fantasy devenu phénomène mondial.",
    rating: 4.6,
    pages: '192',
    isbn: '9782811605070',
    publisher: 'Pika, 2009',
    available: true,
  },
  {
    id: 35,
    title: 'Le Rouge et le Noir',
    author: 'Stendhal',
    cover: cover('9782070360475'),
    genres: ['Classique', 'Roman', 'Romance'],
    synopsis:
      "Julien Sorel, fils de charpentier ambitieux, gravit les échelons de la société française sous la Restauration en jouant de son charme. Le roman stendhalien par excellence sur l'ambition, l'amour et l'hypocrisie sociale.",
    rating: 4.3,
    pages: '576',
    isbn: '9782070360475',
    publisher: 'Gallimard, 1830',
    available: true,
  },
  {
    id: 36,
    title: 'La Chronique des Bridgerton — Tome 1',
    author: 'Julia Quinn',
    cover: '/covers/bridgerton.jpg',
    genres: ['Romance'],
    synopsis:
      "Dans la haute société londonienne de la Régence, Daphne Bridgerton doit trouver un époux. Elle conclut un pacte avec le séduisant Duc de Hastings : simuler un attachement pour éloigner les prétendants. Mais entre le faux semblant et les vrais sentiments, la frontière est mince.",
    rating: 4.4,
    pages: '440',
    isbn: '9782290253571',
    publisher: "J'ai Lu, 2000",
    available: true,
  },
  {
    id: 37,
    title: 'Red Rising — Tome 1',
    author: 'Pierce Brown',
    cover: '/covers/red-rising.jpg',
    genres: ['Science-fiction', 'Dystopie', 'Aventure'],
    synopsis:
      "Sur une Mars colonisée, la société est divisée par une hiérarchie de couleurs. Darrow, un mineur Rouge exploité, découvre la vérité et se transforme pour infiltrer l'élite dorée et détruire le système de l'intérieur. Un thriller de science-fiction au rythme implacable.",
    rating: 4.7,
    pages: '480',
    isbn: '9782017080114',
    publisher: 'Bragelonne, 2014',
    available: true,
  },
  {
    id: 38,
    title: 'The Conditions of Will',
    author: 'Jessa Hastings',
    cover: '/covers/conditions-of-will.jpg',
    genres: ['Romance', 'Roman'],
    synopsis:
      "Georgia Carter, étudiante en psychologie clinique à Cambridge, se voit contrainte de retourner dans sa famille toxique pour les funérailles de son père. Face à une fratrie au bord de l'implosion et aux fantômes du passé, secrets et non-dits menacent de tout faire éclater. Une exploration poignante de la santé mentale et des liens familiaux.",
    rating: 4.7,
    pages: '432',
    isbn: '9791042904005',
    publisher: 'Hugo New Romance, 2026',
    available: true,
  },
  {
    id: 39,
    title: "Tout s'effondre",
    author: 'Chinua Achebe',
    cover: '/covers/tout-seffondre.jpg',
    genres: ['Classique', 'Roman', 'Littérature africaine'],
    synopsis:
      "À travers le destin tragique d'Okonkwo, valeureux guerrier de la tribu Igbo, Chinua Achebe livre une plongée magistrale dans l'Afrique précoloniale. Face à l'arrivée des missionnaires et de l'administration britannique au Nigeria, les coutumes ancestrales se heurtent à la modernité occidentale. Une œuvre incontournable qui renverse les perspectives de l'histoire coloniale.",
    rating: 4.9,
    pages: '228',
    isbn: '9782330070403',
    publisher: 'Actes Sud, 1958',
    available: false,
    returnDate: '12 avr.',
  },
  {
    id: 40,
    title: 'Les petites mains du grand magasin',
    author: 'Ruth Kvarnström-Jones',
    cover: '/covers/petites-mains.jpg',
    genres: ['Roman historique', 'Roman'],
    synopsis:
      "Stockholm, 1913. Alors que l'Europe est au bord de la Première Guerre mondiale, le plus grand magasin de la ville ouvre ses portes, révolutionnant la société suédoise. La jeune Märta y trouve une place inespérée, mais sa joie est assombrie par le départ imminent de son fiancé pour le front. Entre les rayonnages, un lien de sororité indissoluble se tisse entre les employées.",
    rating: 4.5,
    pages: '384',
    isbn: '9782824626444',
    publisher: 'City Éditions, 2026',
    available: true,
  },
];

/* ════════════════════════════════════════════════
   Profils auteurs — photo Wikimedia Commons + bio
   ════════════════════════════════════════════════ */
const wp = (file) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=200`;

export const AUTHORS = {
  'Antoine de Saint-Exupéry': {
    photo: wp('Antoine_de_Saint-Exupéry_en_1935.jpg'),
    bio: "Antoine de Saint-Exupéry (1900-1944) était un écrivain, poète et aviateur français. Auteur du Petit Prince (1943), l'un des livres les plus traduits de l'histoire, il disparut lors d'une mission de reconnaissance au-dessus de la Méditerranée.",
  },
  'Albert Camus': {
    photo: wp('Albert_Camus,_gagnant_de_prix_Nobel,_portrait_en_buste,_posé_au_bureau,_faisant_face_à_gauche,_cigarette_de_tabagisme.jpg'),
    bio: "Albert Camus (1913-1960) était un romancier, dramaturge et philosophe franco-algérien. Figure majeure de l'existentialisme et de l'absurdisme, il a reçu le prix Nobel de littérature en 1957 pour une œuvre qui « illumine les problèmes de la conscience humaine ».",
  },
  'George Orwell': {
    photo: wp('George_Orwell_press_photo.jpg'),
    bio: "George Orwell, de son vrai nom Eric Arthur Blair (1903-1950), était un romancier et essayiste britannique. Ses romans 1984 et La Ferme des Animaux, critiques acerbes du totalitarisme, sont devenus des classiques politiques incontournables.",
  },
  'Frank Herbert': {
    photo: wp('Frank_Herbert.jpg'),
    bio: "Frank Herbert (1920-1986) était un romancier américain de science-fiction. Sa saga Dune (1965), considérée comme le roman de SF le plus vendu de l'histoire, mêle politique, écologie et mysticisme dans un univers d'une richesse inégalée.",
  },
  'J.K. Rowling': {
    photo: wp('J._K._Rowling_2010.jpg'),
    bio: "J.K. Rowling (née en 1965) est une romancière britannique. Sa série Harry Potter, publiée entre 1997 et 2007, s'est vendue à plus de 500 millions d'exemplaires dans le monde et a inspiré une franchise cinématographique phénomène.",
  },
  'J.R.R. Tolkien': {
    photo: wp('Tolkien_1916.jpg'),
    bio: "J.R.R. Tolkien (1892-1973) était un écrivain, poète et philologue britannique. Créateur de la Terre du Milieu, il a révolutionné la fantasy avec Le Hobbit (1937) et Le Seigneur des Anneaux (1954-1955), œuvres fondatrices du genre.",
  },
  'Victor Hugo': {
    photo: wp('Victor_Hugo_by_Étienne_Carjat_1876.jpg'),
    bio: "Victor Hugo (1802-1885) était un poète, romancier et dramaturge français. Figure majeure du romantisme, auteur des Misérables et de Notre-Dame de Paris, il fut aussi un homme politique engagé contre la peine de mort et pour la liberté de la presse.",
  },
  'Jules Verne': {
    photo: wp('Nadar_-_Félix_Tournachon_-_Jules_Verne_2.jpg'),
    bio: "Jules Verne (1828-1905) était un romancier français, pionnier de la science-fiction et de la littérature d'anticipation. Ses Voyages Extraordinaires, comprenant plus de 60 romans, ont inspiré des générations d'explorateurs et d'ingénieurs.",
  },
  'Dan Brown': {
    photo: wp('Dan_Brown_bookjacket.jpg'),
    bio: "Dan Brown (né en 1964) est un romancier américain spécialisé dans le thriller ésotérique. Son roman Da Vinci Code (2003) s'est vendu à plus de 80 millions d'exemplaires, devenant l'un des livres les plus lus du XXIe siècle.",
  },
  'Stieg Larsson': {
    photo: wp('Stieg_Larsson.jpg'),
    bio: "Stieg Larsson (1954-2004) était un journaliste et romancier suédois. Sa trilogie Millénium, publiée à titre posthume, s'est vendue à plus de 100 millions d'exemplaires dans le monde et a relancé l'intérêt mondial pour le polar nordique.",
  },
  'Ray Bradbury': {
    photo: wp('Ray_Bradbury_(1975)_-cropped-.jpg'),
    bio: "Ray Bradbury (1920-2012) était un auteur américain de science-fiction et de fantastique. Fahrenheit 451 (1953), son œuvre maîtresse, est un avertissement visionnaire contre la censure et la tyrannie de la pensée unique qui reste d'une actualité brûlante.",
  },
  'Anne Frank': {
    photo: wp('Anne_Frank_passport_photo,_May_1942.jpg'),
    bio: "Anne Frank (1929-1945) était une jeune fille juive allemande réfugiée aux Pays-Bas pendant la Seconde Guerre mondiale. Son Journal, rédigé durant deux ans de clandestinité à Amsterdam, est l'un des témoignages les plus poignants sur la Shoah.",
  },
  'Walter Isaacson': {
    photo: wp('Walter_Isaacson_2012_Shankbone.jpg'),
    bio: "Walter Isaacson (né en 1952) est un biographe et journaliste américain, ancien directeur de CNN et rédacteur en chef de Time Magazine. Ses biographies de Steve Jobs, Einstein et Leonardo da Vinci sont des références dans le genre.",
  },
  'Suzanne Collins': {
    photo: wp('Suzanne_Collins.jpg'),
    bio: "Suzanne Collins (née en 1962) est une romancière américaine de littérature jeunesse. Sa trilogie Hunger Games (2008-2010), dystopie haletante pour adolescents, a été adaptée en franchise cinématographique à succès mondial.",
  },
  'Jane Austen': {
    photo: wp('Jane_Austen_coloured_version.jpg'),
    bio: "Jane Austen (1775-1817) était une romancière britannique. Ses six romans, dont Orgueil et Préjugés (1813) et Emma (1815), sont des chef-d'œuvres d'ironie sociale qui dépeignent la vie de la gentry anglaise avec une finesse psychologique inégalée.",
  },
  'Alexandre Dumas': {
    photo: wp('Dumas_Alexandre_(père)_by_Nadar_ca._1855_2.jpg'),
    bio: "Alexandre Dumas père (1802-1870) était un romancier et dramaturge français. Auteur prolifique, il est célèbre pour ses romans de cape et d'épée : Les Trois Mousquetaires (1844) et Le Comte de Monte-Cristo (1844-1846), deux monuments de la littérature d'aventures.",
  },
  'Goscinny & Uderzo': {
    photo: wp('René_Goscinny.jpg'),
    bio: "René Goscinny (1926-1977) et Albert Uderzo (1927-2020) sont les créateurs d'Astérix. Goscinny rédigeait les scénarios avec un humour irrésistible tandis qu'Uderzo donnait vie aux personnages par son dessin expressif. La série compte 40 albums, traduits en plus de 110 langues.",
  },
  'Hergé': {
    photo: wp('Hergé.jpg'),
    bio: "Hergé, de son vrai nom Georges Remi (1907-1983), était un auteur de bande dessinée belge, créateur de Tintin. Ses 24 albums, traduits en 70 langues, ont défini le style « ligne claire » de la bande dessinée européenne.",
  },
  'Aldous Huxley': {
    photo: wp('Aldous_Huxley_smoking.jpg'),
    bio: "Aldous Huxley (1894-1963) était un romancier et essayiste britannique. Le Meilleur des Mondes (1932), sa dystopie la plus célèbre, anticipe avec une lucidité troublante les dérives d'une société gouvernée par le conditionnement et le bonheur artificiel.",
  },
  'Fiodor Dostoïevski': {
    photo: wp('Fyodor_Dostoyevsky_1876.jpg'),
    bio: "Fiodor Dostoïevski (1821-1881) était un romancier russe, l'un des plus grands de la littérature mondiale. Ses œuvres majeures — Crime et Châtiment, L'Idiot, Les Frères Karamazov — explorent avec une profondeur unique la psychologie humaine et les questions morales.",
  },
  'Paulo Coelho': {
    photo: wp('Paulo_Coelho_2010.jpg'),
    bio: "Paulo Coelho (né en 1947) est un romancier brésilien. L'Alchimiste (1988), son roman le plus célèbre, s'est vendu à plus de 65 millions d'exemplaires dans le monde, ce qui en fait l'un des livres les plus lus de l'histoire.",
  },
  'Franz Kafka': {
    photo: wp('Franz_Kafka,_1923.jpg'),
    bio: "Franz Kafka (1883-1924) était un romancier de langue allemande originaire de Prague. Son œuvre, imprégnée d'angoisse et d'absurde, a donné naissance à l'adjectif « kafkaïen » pour désigner des situations bureaucratiques oppressantes et incompréhensibles.",
  },
  'Gustave Flaubert': {
    photo: wp('Gustave_Flaubert.jpg'),
    bio: "Gustave Flaubert (1821-1880) était un romancier français, figure majeure du réalisme littéraire. Madame Bovary (1857), son premier roman publié, lui a valu un procès pour immoralité avant de devenir un chef-d'œuvre de la littérature mondiale.",
  },
  'Agatha Christie': {
    photo: wp('Agatha_Christie.png'),
    bio: "Agatha Christie (1890-1976) était une romancière britannique, reine incontestée du roman policier. Auteure de 66 romans policiers et de 14 recueils de nouvelles, elle reste l'écrivain de langue anglaise la plus vendue de l'histoire après Shakespeare et la Bible.",
  },
  'Stendhal': {
    photo: wp('Henri-Beyle-Stendhal.jpg'),
    bio: "Stendhal, de son vrai nom Henri Beyle (1783-1842), était un romancier français. Ses deux grands romans — Le Rouge et le Noir (1830) et La Chartreuse de Parme (1839) — sont des analyses psychologiques profondes de l'ambition et de l'amour dans la France post-napoléonienne.",
  },
  'Arthur Conan Doyle': {
    photo: wp('Arthur_Conan_Doyle_by_Walter_Benington,_1914.png'),
    bio: "Arthur Conan Doyle (1859-1930) était un romancier et médecin britannique, créateur de Sherlock Holmes. Ses nouvelles policières ont révolutionné le genre en popularisant la méthode déductive. Holmes est devenu le personnage de fiction le plus adapté de l'histoire.",
  },
  'Veronica Roth': {
    photo: wp('Veronica_Roth_(7758709592).jpg'),
    bio: "Veronica Roth (née en 1988) est une romancière américaine. Sa trilogie Divergente (2011-2013), dystopie pour jeunes adultes dans un Chicago futuriste, s'est vendue à plus de 35 millions d'exemplaires dans le monde.",
  },
  'Madame de La Fayette': {
    photo: wp('Marie-Madeleine_de_La_Fayette.jpg'),
    bio: "Madame de La Fayette (1634-1693) était une romancière française. La Princesse de Clèves (1678), considéré comme le premier roman psychologique français, reste une œuvre fondatrice de la littérature française classique.",
  },
  'Jostein Gaarder': {
    photo: wp('Jostein_Gaarder_2009.jpg'),
    bio: "Jostein Gaarder (né en 1952) est un romancier norvégien. Le Monde de Sophie (1991), son roman phénomène vendu à plus de 40 millions d'exemplaires, initie le lecteur à l'histoire de la philosophie à travers une intrigue romanesque captivante.",
  },
  'Masashi Kishimoto': {
    photo: null,
    bio: "Masashi Kishimoto (né en 1974) est un mangaka japonais, créateur de la série Naruto. Publiée de 1999 à 2014 dans le Weekly Shōnen Jump, cette saga de 72 tomes s'est vendue à plus de 250 millions d'exemplaires dans le monde.",
  },
  'Eiichiro Oda': {
    photo: null,
    bio: "Eiichiro Oda (né en 1975) est un mangaka japonais, créateur de One Piece. Publiée depuis 1997 dans le Weekly Shōnen Jump, cette série est le manga le plus vendu de l'histoire avec plus de 516 millions d'exemplaires écoulés.",
  },
  'Akira Toriyama': {
    photo: null,
    bio: "Akira Toriyama (1955-2024) était un mangaka et character designer japonais. Dragon Ball, sa série phare publiée de 1984 à 1995, a révolutionné le manga d'action et demeure l'une des franchises les plus lucratives de l'histoire.",
  },
  'Hajime Isayama': {
    photo: null,
    bio: "Hajime Isayama (né en 1986) est un mangaka japonais, créateur d'Attack on Titan. Publiée de 2009 à 2021 dans le Bessatsu Shōnen Magazine, cette série de dark fantasy a connu un succès mondial avec plus de 110 millions d'exemplaires vendus.",
  },
  'Julia Quinn': {
    photo: wp('Julia_Quinn_(cropped).jpg'),
    bio: "Julia Quinn, de son vrai nom Julie Pottinger (née en 1970), est une romancière américaine spécialisée dans la romance historique. Sa série La Chronique des Bridgerton (2000-2006) a été adaptée en série Netflix à succès mondial, renouvelant l'engouement pour le genre.",
  },
  'Pierce Brown': {
    photo: wp('Pierce_Brown_by_Gage_Skidmore.jpg'),
    bio: "Pierce Brown (né en 1988) est un romancier américain de science-fiction. Sa trilogie Red Rising (2014-2016), dystopie épique sur une Mars colonisée, s'est vendue à plus de 5 millions d'exemplaires dans le monde et a été saluée pour son mélange de politique, d'action et d'émotion.",
  },
  'Jessa Hastings': {
    photo: null,
    bio: "La nouvelle voix de la « Gen Z » littéraire. Connue pour sa saga phénoménale Magnolia Parks, elle dépeint avec une esthétique glamour et mélancolique les amours complexes de la jeunesse dorée londonienne.",
  },
  'Chinua Achebe': {
    photo: wp('Chinua_Achebe_(1.2).png'),
    bio: "Le père de la littérature africaine moderne. À travers son chef-d'œuvre Tout s'effondre, cet auteur nigérian a marqué l'histoire en racontant le choc des cultures et la résilience coloniale avec une puissance inégalée.",
  },
  'Ruth Kvarnström-Jones': {
    photo: null,
    bio: "La reine du « Feel-Good » anglo-suédois. Spécialiste des ambiances chaleureuses (Hygge), elle transporte ses lecteurs dans des paysages scandinaves pour des histoires de renouveau, d'amitié et de douceurs sucrées.",
  },
};

/* Genres uniques pour les filtres */
export const GENRES = [
  'Nouveauté',
  'Roman',
  'Science-fiction',
  'Fantastique',
  'Jeunesse',
  'Manga',
  'Policier',
  'Classique',
  'Biographie',
  'Aventure',
  'Bande dessinée',
  'Dystopie',
  'Romance',
];

/*
 * Groupes de suggestions — curation éditoriale.
 * bookIds référencent les id des livres ci-dessus.
 */
export const SUGGESTION_GROUPS = [
  {
    title: 'Parce que vous avez lu Jules Verne…',
    bookIds: [4, 5, 6, 24, 23, 37, 13, 16, 29, 31],
    linkedGenre: 'Aventure',
  },
  {
    title: 'Vous semblez aimer les livres frissonnants…',
    bookIds: [12, 11, 27, 30, 22, 18, 34, 37, 3, 21],
    linkedGenre: 'Policier',
  },
  {
    title: "Un peu d'humour pour se détendre",
    bookIds: [19, 20, 28, 8, 7, 1, 33],
    linkedGenre: 'Humour',
  },
  {
    title: 'Les grands romans sentimentaux',
    bookIds: [36, 17, 26, 32, 35, 23],
    linkedGenre: 'Romance',
  },
  {
    title: 'Destins hors du commun',
    bookIds: [14, 15, 2, 22, 9],
    linkedGenre: 'Biographie',
  },
];

/* Choix éditorial : quel livre illustre chaque catégorie dans les cards */
export const GENRE_COVERS = {
  'Nouveauté':      38,  // The Conditions of Will
  'Aventure':       6,   // LOTR — Seigneur des Anneaux
  'Romance':       36,   // Bridgerton
  'Science-fiction': 4,  // Dune
  'Fantastique':    5,   // Harry Potter
  'Manga':          7,   // Naruto
  'Policier':      12,   // Millénium
  'Thriller':      11,   // Da Vinci Code
  'Classique':     18,   // Comte de Monte-Cristo
  'Roman':          2,   // L'Étranger
  'Dystopie':       3,   // 1984
  'Jeunesse':       5,   // Harry Potter
  'Biographie':    14,   // Journal d'Anne Frank
  'Non-fiction':   15,   // Steve Jobs
  'Bande dessinée': 19,  // Astérix
  'Humour':        19,   // Astérix
  'Action':        28,   // Dragon Ball
  'Témoignage':    14,   // Journal d'Anne Frank
};

/* Ids des livres mis en avant pour "Nouveautés Mériadeck" */
export const NOUVEAUTES_IDS = [38, 39, 40, 36, 37];

/** Filtre les livres selon un genre (ou renvoie tout si genre = null) */
export function filterByGenre(genre) {
  if (!genre) return BOOKS;
  if (genre === 'Nouveauté') return BOOKS.filter(b => NOUVEAUTES_IDS.includes(b.id));
  return BOOKS.filter((b) => b.genres.includes(genre));
}

/** Filtre les livres selon une requête texte (titre ou auteur) */
export function searchBooks(query) {
  if (!query?.trim()) return BOOKS;
  const q = query.toLowerCase();
  return BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genres.some((g) => g.toLowerCase().includes(q))
  );
}
