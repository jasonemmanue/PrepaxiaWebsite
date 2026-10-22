# CLAUDE.md — Prepaxia Website (site vitrine, Next.js 14)

Le README documente les sources de données et le déploiement ; ce fichier
documente les règles et les pièges.

## Règles

- **Aucune donnée en dur qui devrait venir de l'API.** Les textes viennent de
  `GET /site/contenu` (éditables dans l'admin → Site web), les chiffres de
  `GET /site/stats` (réels), les liens de téléchargement de
  `GET /parametres-app`. Un texte ajouté ici plutôt que dans
  `CONTENU_DEFAUT` (API, `site_web.py`) ne serait plus modifiable par l'équipe.
- **Jamais de chiffre inventé** (inscrits, taux de réussite…). La section
  témoignages reste masquée tant qu'aucun témoignage réel n'est saisi.
- Un nouveau champ de contenu se déclare à TROIS endroits : `CONTENU_DEFAUT`
  (API — les clés inconnues sont rejetées à l'écriture), `ContenuSite`
  (`lib/api.ts` ici) et `ContenuSite` + formulaire (admin, `app/site-web`).
- Toute lecture passe par `lib/api.ts` (cache 5 min + repli). Un `fetch`
  direct sans repli ferait tomber la page entière si l'API ne répond pas.
- Français partout, même charte que l'app : bleu logo `#0F4FE0`, sombre
  `#061446`, Poppins, boutons « 3D » (`.bouton`).

## Pièges

- **Thème** : le script inline de `app/layout.tsx` pose la classe `dark`
  AVANT l'hydratation — sans lui, la page clignote en clair.
- `API_URL` sans `/api/v1` (`lib/api.ts` retire le suffixe s'il est présent).
- Le `Dockerfile` passe `API_URL` / `SITE_URL` en `ARG` : sur Railway, les
  variables du service sont disponibles au build, nécessaire au pré-rendu.
- Les captures d'écran de `public/ecrans/` proviennent de l'app 1.7 ; les
  remplacer quand l'interface change.

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
