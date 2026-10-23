# CLAUDE.md — Prepaxia Website (site vitrine, Next.js 14)

Le README documente les sources de données et le déploiement ; ce fichier
documente les règles et les pièges.

## Règles

- **Aucune donnée en dur qui devrait venir de l'API.** Les textes viennent de
  `GET /site/contenu` (éditables dans l'admin → Site web), les chiffres de
  `GET /site/stats` (réels), les liens de téléchargement de
  `GET /app/version` (`url_android`, `url_ios`, `url_web_app`), l'e-mail, le
  WhatsApp et la chaîne de `GET /parametres-app`. Un texte ajouté ici plutôt que dans
  `CONTENU_DEFAUT` (API, `site_web.py`) ne serait plus modifiable par l'équipe.
- **Jamais de chiffre inventé** (inscrits, taux de réussite…). La section
  témoignages reste masquée tant qu'aucun témoignage réel n'est saisi.
- Un nouveau champ de contenu se déclare à TROIS endroits : `CONTENU_DEFAUT`
  (API — les clés inconnues sont rejetées à l'écriture), `ContenuSite`
  (`lib/api.ts` ici) et `ContenuSite` + formulaire (admin, `app/site-web`).
- Toute lecture passe par `lib/api.ts` (cache 5 min + repli). Un `fetch`
  direct sans repli ferait tomber la page entière si l'API ne répond pas.
- **Le site n'écrit JAMAIS en base** : ni les liens de l'app, ni « Contact et liens de
  partage », ni la version annoncée (vraies informations de l'exploitant). Il lit seulement.
- Français simple, aucun tiret long. Même charte que l'app (2026-10-23, voir plus bas) :
  rôles de couleur, Poppins, boutons « 3D » (`.bouton`), thème sombre par défaut.
- Noms exacts des outils : **Prepaxia AI**, **Prepaxia Corrector** (jamais « Snap Correct »),
  **Prepaxia Generator**.

## Pièges

- **Thème** : le script inline de `app/layout.tsx` pose la classe `dark`
  AVANT l'hydratation — sans lui, la page clignote en clair.
- `API_URL` sans `/api/v1` (`lib/api.ts` retire le suffixe s'il est présent).
- Le `Dockerfile` passe `API_URL` / `SITE_URL` en `ARG` : sur Railway, les
  variables du service sont disponibles au build, nécessaire au pré-rendu.
- Les visuels de `public/visuels/` viennent des images des stores de la 1.17.49 (refonte) ;
  les régénérer quand l'exploitant envoie de nouvelles images (voir « Visuels » plus bas).

## 2026-10-05
- Page `/a-propos` (« À propos de nous ») : texte `a_propos` / `a_propos_titre` de `/site/contenu`, modifiable dans
  l'admin (Site web). Lien dans le pied de page et le plan du site. `TexteLong` gère `**gras**` (texte React).
- Lien API par défaut : le lien définitif (`prepaxia-api-production`), plus aucun lien de secours par défaut.
- E-mail du site et de l'app : assistanceprepaxia@gmail.com (par défaut partout : /site/contenu contact_email, /parametres-app email_contact, pied de page du site).

## 2026-10-17
- Page **`/supprimer-mon-compte`** exigée par Google Play (sécurité des données) : étapes dans l'app (Profil →
  Sécurité → Supprimer mon compte), demande par e-mail, données supprimées et conservées. Texte
  `suppression_compte` de `/site/contenu` (éditable dans l'admin → Site web), repli local si l'API ne le renvoie pas.
  Ajoutée au plan du site (`sitemap.ts`).
- CGU : section 11 « Chat du concours : signalement et bannissement » (texte de l'API).

## 2026-10-20 : ambassadeurs partenaires
- `/a/[code]` (lien public, rendu à la demande) : code reconnu (casse et tiret libres), visite comptée par l'API
  (IP du visiteur transmise), boutons Play Store (`referrer=amb=CODE`), App Store, web (`?amb=CODE`) ; code à copier
  pour l'iPhone. Non indexée.
- `/devenir-ambassadeur` : règles lues dans `GET /partenaires/config-publique`, formulaire
  (`components/partenaires/FormulaireCandidature.tsx`, champ piège à robots).
- `/ambassadeur/[jeton]` : espace privé (`components/partenaires/EspaceAmbassadeur.tsx`) : charte, lien + QR
  (`qrcode`), règle en vigueur, gains, numéro Mobile Money (demande validée par l'équipe), historique COMPLET des
  commissions (pages + CSV), élèves, versements. `next.config.mjs` : `Referrer-Policy: no-referrer`,
  `Cache-Control: no-store`, `X-Robots-Tag: noindex` sur `/ambassadeur/*` (l'adresse est le secret).
- `app/api/partenaires/[...chemin]/route.ts` : relais vers l'API, **liste blanche** de chemins, corps ≤ 20 Ko,
  `X-Visiteur-Ip`. `API_BASE` exporté par `lib/api.ts`. `robots.ts` : `/a/`, `/ambassadeur/`, `/api/` exclus.
- Lien « Devenir ambassadeur » dans le pied de page et le plan du site.

## 2026-10-22 : tuteurs IA
- Accueil : section `#tuteurs-ia` (« Tuteurs IA ») après les fonctionnalités : `tuteurs_titre`, `tuteurs_sous_titre`,
  cartes `tuteurs_ia` (`points` découpés par ligne en liste cochée), `tuteurs_note` ; masquée si la liste est vide.
  Lien « Tuteurs IA » dans l'en-tête. Appel final : l'essai est décrit justement (7 jours, une fois par appareil,
  tous les concours et examens) ; plus de « Premium offerts à l'inscription ».

## 2026-10-23 : refonte du site (charte de l'app, images des stores, vrais tarifs)

**Charte** (`Charte-graphique-Prepaxia.pdf`, comme l'app refondue 1.17.49)
- Couleurs en RÔLES (`tailwind.config.ts`) : `fond`, `surface`, `releve`, `filet`, `ink` (`doux`,
  `discret`), `marque` (#2F5BEA), `lien`, `ambre` (accent, 10 % au plus), `pilier-apprendre / entrainer /
  ia / communaute`. Valeurs sombres et claires en canaux RVB dans `app/globals.css` (`.dark`). Aucune
  couleur en dur dans les pages. Anciens noms `bleu-*` gardés pour les pages ambassadeurs.
- **Thème sombre par défaut** : `<html class="dark">` au rendu, le script inline ne retire `dark` que si
  l'élève a choisi le clair (`localStorage.theme = 'light'`). Il pose aussi la classe `js`.
- Polices : Poppins (interface), Atkinson Hyperlegible (`--lecture`, longs textes de `TexteLong`).
- Verre (`.verre`), tuile de pilier (`.tuile`, couleur du pilier à 16 %), `.pastille`, `.chapo`, `.section`.

**Visuels** (`public/visuels/`, `components/Visuel.tsx`)
- Fichiers `<nom>-<sombre|clair>-<largeur>.webp` : `heros` (images « duo » 02 + 03 assemblées),
  `tel-*` (iPhone 6,9 pouces), `tab-*` (iPad 13 pouces). `Visuel` rend les deux thèmes ; le CSS
  (`.visuel-sombre` / `.visuel-clair`) n'affiche que celui du thème choisi.
- Régénérer : extraire `Prepaxia-Stores.zip` dans un dossier neuf, puis
  `python -I outils/visuels_stores.py <dossier extrait> public/visuels` et
  `python -I outils/icones_stores.py <dossier extrait> .` (logo, `app/icon.png`, `app/apple-icon.png`,
  `app/opengraph-image.jpg` = graphique de présentation Play Store). Anciennes images (`ecrans/`,
  `eleve_*.jpg`) supprimées.
- Les visuels contiennent déjà leur titre : jamais de texte posé dessus, légende en dessous.

**Badges de téléchargement** (`components/BadgesStores.tsx`, styles `.badge-store`)
- « Disponible sur Google Play », « Télécharger dans l'App Store », « Ouvrir sur Web / PC » : fond
  noir, liseré #A6A6A6, logos officiels (couleurs d'origine), même hauteur. Mentions des marques dans
  le pied de page.
- Liens : `liensTelechargement()` (`lib/api.ts`) = `GET /app/version`, sinon `LIENS_DEMO` (Play Store
  `com.prepaxia.app`, page App Store, app web). L'exploitant pose les vrais liens dans l'admin (Contact
  et liens de partage / Mise à jour de l'application) : le site les prend au plus tard 5 min après.
- Utilisés dans l'en-tête (menu mobile), le héros, l'appel final, le pied de page et `/a/[code]`
  (lien Play Store avec `referrer` et lien web `?amb=` de l'API quand le code est valide).

**Tarifs** (`lib/tarifs.ts`, `components/Tarifs.tsx`)
- Prix : `GET /site/plans` (prix payé, formule standard). Contenu de chaque formule :
  `GET /subscriptions/grille?concours_id=…` → `avantages_reels` (calculés par l'API) ; un onglet
  « Concours » (grille du premier concours hors BAC) et un onglet « BAC » (grille du BAC, formules `bac…`).
- **Ne jamais afficher `avantages` ni `description` des plans** : saisis à la main, en partie
  périmés (« SnapCorrect illimité », économies fausses). Économie calculée depuis `prix_mensuel_fcfa`
  (arrondie vers le bas), mise en avant seulement si l'admin coche « populaire ».
- Ce qui est commun à toutes les formules payantes est montré une fois ; comparatif détaillé
  (`categories` de la grille) dans un volet ; essai gratuit lu dans le plan de 7 jours.
- Note « Au BAC : Prepaxia AI seulement » tirée de la grille du BAC (outils IA présents).

**Accueil** (`app/page.tsx`) : héros, bande des fonctions (noms des fonctions de l'app), chiffres
réels animés (`Compteur`), concours, fonctionnalités, interfaces (`GalerieInterfaces` : téléphone /
tablette, défilement au doigt, flèches au-dessus des images), tuteurs IA (visuel de chaque outil),
étapes, témoignages (si réels), tarifs, journal (si articles), FAQ (+ WhatsApp et e-mail de
l'assistance), appel final « Télécharger ». « Journal » n'apparaît dans l'en-tête et le pied de page
que s'il y a des articles.

**Animations** (`components/Animations.tsx`, `app/globals.css`) : `.apparition` (révélée au défilement
par `ObservateurApparition`, seulement avec la classe `js`), flottement, halo, bande défilante,
entrée des cartes au changement d'onglet. Toutes coupées par « Réduire les animations ». Ne pas
mettre `.apparition` dans un composant client qui se redessine (React effacerait la classe `vu`).

**Pièges**
- Bande défilante : son conteneur DOIT rester `overflow-hidden`, sinon la page déborde (5 000 px) et
  le téléphone dézoome.
- `nomPropre()` nettoie les noms de l'admin à l'affichage (« ENSEA(ISE  Maths) » → « ENSEA (ISE Maths) »).
- Repli de `/supprimer-mon-compte` à jour de la refonte : Moi → Paramètres → Sécurité.
- Vérifié à 360, 768 et 1 280 px : aucun débordement horizontal, aucun texte superposé (contrôle des
  rectangles de tous les textes dans le navigateur).

**Infos fausses repérées dans l'admin (Site web), à corriger par l'exploitant**
- `hero_sous_titre` cite INPHB, ESATIC et ENS, qui ne sont pas préparés (seuls : BAC, ENSEA ISECL/AS,
  ISE Économie, ISE Maths).
- `suppression_compte` : « onglet Profil, puis Sécurité » → depuis la 1.17.49 : Moi → Paramètres → Sécurité.
- Plans (admin, Modèle économique) : `avantages` « SnapCorrect illimité », « Économie de 17 % vs mensuel »
  (vraies économies : −8 % trimestriel, −17 % annuel), essai « Tout Quelques avantages Premium 7 jours » ;
  descriptions « économisez 7,7 % » et « 8,33 % ». Le site ne les affiche plus.
- Matières : « MATHEMATIQUES » en capitales (ISE Maths), doublons « Mathématiques » au BAC.
- Variable Railway `SITE_URL` = `https://prepaxiawebsite-production.up.railway.app` alors que le
  domaine est `www.prepaxia.com` (Open Graph, plan du site) : à passer à `https://www.prepaxia.com`.

