# E. Spécifications fonctionnelles

## E.1. Liste des fonctionnalités

### 1. Page d'accueil

L'accueil offre un aperçu synthétique de l'activité de l'utilisateur en bibliothèque.

**Header**
- Carte « Bibliothèque Mériadeck » indiquant le statut d'ouverture (Ouvert / Ferme à 20h00). Cliquable vers les détails de l'établissement (*à venir*).

**Onglets de contenu** (BarButton segmented)
- **Raccourcis** (par défaut) — résumé de l'activité personnelle.
- **Actualités** — flux d'actualités du réseau (*à venir*).

**Sections sous l'onglet Raccourcis**
- **Réservations** — carte agrégeant le nombre d'ouvrages réservés, avec un raccourci direct vers le détail dans Mon Espace.
- **Livre numérique emprunté** — carte « reprise de lecture » avec couverture, progression (barre + pourcentage de pages lues) et date limite de retour.
- **Emprunts en cours** — carte présentant le prochain emprunt à rendre, avec date de retour et lien vers la liste complète des emprunts.
- **Prochain service réservé** — carte indiquant la prochaine réservation de service (date, heure, type d'activité).

---

### 2. Recherche – Catalogue

Accès aux ressources du réseau via la page Catalogue.

**Barre de recherche** (en haut de la page)
- Saisie textuelle libre (titre, auteur, ISBN).
- Icône microphone décorative (recherche vocale *à venir*).
- Bouton **Scan ISBN** intégré à la barre de recherche.

**Mode exploration (catalogue par défaut)**
- Carousel horizontal de **catégories** (chips de genres) : Nouveauté, Roman, Science-fiction, Fantastique, Jeunesse, Manga, Policier, Classique, Biographie, Aventure, Bande dessinée, Dystopie, Romance. Affordance de swipe assurée par un débordement visuel sur le bord droit.
- Section **Suggestions personnalisées** — plusieurs carrousels horizontaux thématiques de livres recommandés.
- Section **Nouveauté Mériadeck** — carousel des nouvelles acquisitions de la bibliothèque favorite.

**Mode recherche active**
Quand l'utilisateur tape, la liste fusionne le catalogue local et les résultats Google Books (mock pour le PFE).

**Page des résultats de recherche**
- Barre de recherche conservée en haut, éditable + bouton retour, bouton retour catalogue, bouton effacer.
- Rangée de **filtres rapides** : *Trier* / *Bibliothèque* / *Genre & Thématique* / *Plus de filtres* (détaillés en E.3).
- Chips de filtres actifs avec bouton de retrait individuel.
- Compteur de résultats annoncé en `aria-live` (« X résultats pour … »).
- Liste verticale de cartes-livre : couverture, titre, auteur, badge de disponibilité, note (X/5).
- Tap sur une carte → page de détail du livre.

**Page d'une ressource (BookDetailPage)**
- Bouton retour + bouton « Ajouter aux favoris » (ouvre la sélection de liste).
- Couverture grande + titre `<h1>` + auteur.
- Indicateurs clés : note `X/5`, nombre de pages, badge de disponibilité.
- 3 onglets swipables :
  - **À propos** : synopsis (voir plus / voir moins), badges de genres, info auteur, carrousels « D'autres livres de l'auteur » et « D'autres titres similaires ».
  - **Avis** : note moyenne + barres par étoile + cartes de critiques individuelles (déroulable).
  - **Détails du livre** : édition, ISBN/EAN, éditeur, date de publication.

---

### 3. Scanner ISBN

Page dédiée accessible via le FAB « Scan ISBN » de la navigation.

- Flux caméra plein écran (bibliothèque ZXing) + viseur de cadrage.
- Décodage de codes-barres EAN-13 / EAN-8 / UPC.
- États gérés (annoncés au lecteur d'écran) :
  - **Scanning** — viseur visible, attente d'un code.
  - **Fetching** — recherche du livre (catalogue local puis Google Books) avec spinner et message « Recherche du livre… ».
  - **Scanned** — livre trouvé : ouverture d'une bottom-sheet de prévisualisation (couverture, titre, auteur, synopsis, badge dispo, boutons « Liste » et « Voir la fiche du livre »).
  - **Not found** — alerte « Livre non trouvé » + bouton « Scanner à nouveau ».
  - **Denied / Error** — message d'erreur en `role="alert"`.

---

### 4. Services

Page listant les services proposés par les bibliothèques (statique pour l'instant — pas de moteur de réservation interactif).

**Services présentés**
- Demander à un·e bibliothécaire (badge « Sur place »).
- Réservation de salle (badge « Disponible »).
- Prêt entre bibliothèques (badge « Sur demande »).
- Animations culturelles (badge « À venir »).
- Impression & Numérisation (badge « Sur place »).
- Ateliers & Formations (badge « Inscription requise »).

**À venir** : choix de créneau, confirmation et suivi.

---

### 5. Mon Espace

Section regroupant les informations et actions personnelles de l'utilisateur. Organisée en 3 onglets.

**Header personnel**
- Avatar + nom complet (`<h1>`) + numéro de lecteur + bouton « Carte d'adhérente » (ouvre un modal plein écran avec le code-barres pour scan en borne ; *augmentation automatique de la luminosité à venir*).

**Onglet 1 — Mon activité**
- **Réservation et prêt** : 2 cartes synthétiques (Réservations en cours / Prêt numérique) avec badge de date limite. Tap → ouverture d'une bottom-sheet listant le détail.
- **Échanges** : 3 lignes accordéon (Messages de la bibliothèque, Mes avis laissés, Communication sur place — détails *à venir*).

**Onglet 2 — Mes favoris**
- Création de listes personnalisées (nom libre).
- Liste des listes créées (ListItemCard avec nombre de titres + menu Renommer / Supprimer).
- Tap sur une liste → vue détaillée avec ses livres et bouton « Retirer un livre » (mode édition).

**Onglet 3 — Historique** *(à venir)*

---

### 6. Bouton flottant (FAB)

Bouton **Scan ISBN** ancré au-dessus de la BottomNavigation, accessible sur les écrans principaux. Une seule action : ouverture du scanner.

> *Note : la spec initiale prévoyait un menu flottant à 3 outils (Carte adhérent + Scan + …). Dans la version actuelle, seul le Scan est en FAB. La Carte adhérente est accessible depuis l'onglet Mon Espace.*

---

## E.3. Système de filtrage et de tri

### 1. Options de Tri (SortBottomSheet)

Bottom-sheet déclenchée par le bouton « Trier ». Une seule option active à la fois (radio).

- **Pertinence** *(par défaut)* — basé sur la correspondance des mots-clés.
- **Les mieux notées** — basé sur les notes des utilisateurs (décroissant).
- **Les plus empruntés** — basé sur le nombre d'emprunts (décroissant).
- **Par auteur (A-Z)** — ordre alphabétique des noms d'auteurs.
- **Par titre (A-Z)** — ordre alphabétique des titres.

*Options envisagées pour V2* : « Disponibles en premier », « Nouveautés ».

### 2. Filtres rapides (barre toujours visible)

Quatre boutons accessibles directement sous la barre de recherche. Chacun ouvre une bottom-sheet dédiée, avec compteur visuel du nombre de filtres actifs.

- **Trier** — voir ci-dessus.
- **Bibliothèque** — choix de localisation.
- **Genre & Thématique** — structuré en deux familles (fiction + documentaire).
- **Plus de filtres** — public, langue, accessibilité, année, disponibilité immédiate.

### 3. Filtre Bibliothèque

Sélection multiple parmi les 9 bibliothèques du réseau bordelais, plus une option exclusive **« Titre numérique »** (qui désactive les sélections physiques) :

Mériadeck · Grand Parc · Bacalan · Saint-Michel · Bordeaux-Lac · Sainte-Croix · Bordeaux-Maritime · Chartrons · Bordeaux-Sud.

### 4. Filtre Genre & Thématique

Bottom-sheet en deux sections.

**Fiction**
- *Types* (multi-select) : Roman · BD · Manga.
- *Genres* (multi-select) : Policier · Thriller · Science-fiction · Fantastique · Romance · Aventure · Historique · Horreur · Humour · Classique.

**Documentaire** (accordéons dépliables, chaque catégorie permet une sélection complète ou par sous-thème)
- Histoire & Géographie (Histoire, Géographie, Voyage).
- Sciences (Mathématiques, Physique & Chimie, Biologie & Sciences naturelles, Astronomie & Espace, Technologie & Numérique).
- Nature & Santé (Jardinage & Nature, Santé & Médecine, Sport & Loisirs).
- Philosophie & Psychologie (Philosophie, Psychologie, Spiritualité & Religion).
- Société (Sociologie, Politique, Droit, Économie, Langues).
- Arts & Culture (Art & Architecture, Musique, Cinéma, Activités créatives, Cuisine & Art de vivre).

### 5. Filtre « Plus de filtres »

Bottom-sheet avec accordéons + une case à cocher principale.

- **Disponible maintenant** *(checkbox en tête)* — masque les ressources empruntées ou en attente.
- **Public** : Enfant · Ados · Adulte.
- **Langue** : Français · Anglais · Espagnol · Allemand · Italien · Portugais · Arabe · Mandarin · Japonais · Russe · Polonais · Néerlandais.
- **Accessibilité** : Grands caractères · Braille · Facile à lire (FALC) · Langue des signes (LSF) · Audio-description.
- **Année de publication** : Avant 1800 · 1800–1900 · 1900–1950 · 1950–1980 · 1980–2000 · 2000–2010 · 2010–2015 · 2015–2020 · Après 2020.

*Filtres envisagés pour V2* : Sélections éditoriales (coup de cœur, sélection du mois), Type de support (physique / numérique séparé du filtre Bibliothèque).

---

# G. Spécifications techniques

## G.1. Accessibilité

### Site web (WebHomePage)

Démarche RGAA appliquée sur les éléments suivants :
- **Structure sémantique** : `<header>`, `<main id="main-content">`, `<nav aria-label>`, `<footer>` ; hiérarchie `<h1>` (Hero) → `<h2>` (sections) → `<h3>` (cartes).
- **Skip-link** « Aller au contenu » visible au focus clavier, ciblant `#main-content`.
- **Alternatives textuelles** : `aria-label` sur le logo, l'input de recherche, les liens d'accès rapide ; `aria-hidden` sur les icônes et décors purs.
- **Navigation clavier** : focus visible (anneau teal) sur toutes les zones interactives via `:focus-visible`.
- **Carrousel** annoncé en `role="list"` / `role="listitem"`.

### Application mobile (PWA)

- **Compatibilité lecteur d'écran** (VoiceOver, TalkBack, NVDA) :
  - `role="dialog"` + `aria-modal="true"` + `aria-labelledby` sur les 6 bottom-sheets.
  - `aria-current="page"` sur l'onglet actif de la BottomNavigation.
  - `aria-label` sur tous les boutons icon-only (retour, fermer, menu, scan, effacer, chevrons d'accordéon, etc.).
  - `aria-pressed` sur les toggles (favoris, segmented controls).
  - `aria-haspopup="dialog"` sur les boutons de filtre.
  - `aria-live="polite"` sur le compteur de résultats de recherche ; `role="alert"` sur les erreurs du scanner.
  - `role="button"` + `tabIndex` + clavier Entrée/Espace sur les cartes-livre, cartes-liste et cartes-genre.
- **Zones tactiles** : ≥ 40×40 px sur tous les éléments interactifs (conforme WCAG 2.2 AA — cible minimale 24×24 px ; les 44×44 px Apple HIG / 48 dp Material sont approchés sans être systématiques).
- **Headings sémantiques** : chaque page possède un `<h1>` (visible ou `sr-only` quand le design n'inclut pas de titre visuel) et une hiérarchie cohérente.
- **Contrastes** : `text-title` (15:1) et `text-body` (5.9:1) ✅ AA. `text-subtle` (3.86:1) conservé volontairement pour la hiérarchie visuelle — écart documenté.

**Limitations connues** *(à traiter en V2)*
- Les tokens typographiques sont en `px` fixe : la taille du texte n'est pas ajustable via les paramètres OS. Conversion `px → rem` prévue.
- Focus trap dans les bottom-sheets et fermeture clavier `Échap` non implémentées.

---

## G.2. SEO *(site web uniquement)*

- Balises `<title>` et `<meta name="description">` renseignées.
- Open Graph configuré (`og:title`, `og:description`, `og:type`).
- Lang `fr` déclaré sur `<html>`.
- Hiérarchie de titres `<h1>` / `<h2>` / `<h3>` cohérente.
- Images servies avec `loading="lazy"` + `alt` explicite.

**À approfondir en V2** : compression d'images, structured data (`schema.org/LocalBusiness` pour les horaires, `schema.org/Book` pour les fiches), sitemap XML.

---

## G.3. RGPD *(site + app)*

Cadre prévu pour la production (non implémenté dans le prototype) :
- Collecte minimale : nom, email, numéro de lecteur, préférences (bibliothèque favorite, langues).
- Bandeau de consentement cookies côté web (Tarteaucitron ou équivalent).
- Possibilité de consulter, modifier et supprimer son compte depuis Mon Espace > Paramètres *(à venir)*.
- Chiffrement TLS pour toutes les communications.
- Hash des mots de passe (argon2 / bcrypt) + double authentification optionnelle.

---

## G.4. Compatibilité

### Site web
- Navigateurs cibles : Chrome, Firefox, Safari, Edge (deux dernières versions majeures).
- Stack : Vite 8, React 19, Tailwind v4.
- Approche **mobile-first** avec breakpoints `sm` (640px) / `md` (768px) / `lg` (1024px) / `xl` (1280px).
- Max-width du contenu : 1440px.

### Application mobile (PWA)
- Manifest et meta PWA configurés (`apple-mobile-web-app-capable`, `theme-color`, icône).
- Optimisée pour viewport ≤ 430 px (largeur fixe en mode mobile).
- Bibliothèques natives : Framer Motion (animations), ZXing (scan ISBN), Tabler Icons.
- **Pas de wrapper natif** dans le prototype actuel : c'est une PWA pure servie via Vite (à packager via Capacitor ou PWA Builder pour publication stores en V2).
