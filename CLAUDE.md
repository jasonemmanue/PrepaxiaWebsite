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
