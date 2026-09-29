# Prepaxia — site vitrine

Site public de Prepaxia (présentation, concours, tarifs, journal, pages
légales). Next.js 14 (App Router) + Tailwind, clair et sombre, responsive.

Il fait partie d'un ensemble :

| Dépôt | Rôle |
|---|---|
| `ExcellenciaPrepareAPI` | API FastAPI — **source de toutes les données du site** |
| `Dashboard-admin-excellencia` | admin Next.js — page **« Site web »** pour modifier le site |
| `ExcellenciaPrepare` | application Flutter (Android ; branche `web` pour la version web) |
| **`PrepaxiaWebsite`** (ce dépôt) | site vitrine |

## Ce que le site affiche, et d'où ça vient

| Section | Source |
|---|---|
| Titre, sous-titre, bandeau, fonctionnalités, étapes, témoignages, FAQ, CGU, confidentialité, YouTube | `GET /site/contenu` — admin → **Site web** |
| Chiffres (inscrits, concours, chapitres) | `GET /site/stats` — **lus en base**, jamais saisis |
| Concours et matières (avec leurs symboles) | `GET /concours` |
| Tarifs | `GET /site/plans` |
| Journal | `GET /site/articles` — admin → Site web → Journal |
| Liens APK / Play Store / App Store / WhatsApp | `GET /parametres-app` — admin → **Paramètres de l'app** |

Les pages sont régénérées **toutes les 5 minutes** (ISR) : une modification
dans l'admin apparaît sur le site sans redéploiement. Si l'API est
injoignable, chaque section retombe sur une valeur de repli et le site reste
en ligne.

## Développement

```bash
npm install
cp .env.example .env.local     # API_URL, SITE_URL
npm run dev                    # http://localhost:3100
npm run build                  # vérifie aussi les types
```

| Variable | Rôle |
|---|---|
| `API_URL` | URL de l'API **sans** `/api/v1` (lue côté serveur uniquement) |
| `SITE_URL` | URL publique du site (Open Graph, `sitemap.xml`, `robots.txt`) |

## Déploiement Railway (via GitHub)

1. Railway → **New Project → Deploy from GitHub repo** → `PrepaxiaWebsite`
   (branche `main`). Le `Dockerfile` et `railway.json` sont détectés.
2. **Variables** du service : `API_URL=https://excellencia-api-production.up.railway.app`
   et `SITE_URL=https://<ton-domaine>`.
3. **Settings → Networking → Generate Domain** pour une première URL, puis
   **Custom Domain** quand le nom de domaine est validé : ajouter chez le
   registrar l'enregistrement CNAME (ou ALIAS pour la racine) indiqué par
   Railway, puis mettre à jour `SITE_URL` et redéployer.

Le site n'appelle l'API que côté serveur : aucune modification CORS n'est
nécessaire côté API.

## Structure

```
app/            pages (accueil, concours, journal, journal/[slug], cgu,
                confidentialite, sitemap, robots, 404)
components/     en-tête, pied de page, boutons de téléchargement, icônes,
                rendu des textes longs
lib/api.ts      lecture de l'API (cache 5 min, replis)
public/         logo, captures de l'application, photos
```
