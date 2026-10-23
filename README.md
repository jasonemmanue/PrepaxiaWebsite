# Prepaxia — site vitrine

Site public de Prepaxia (présentation, interfaces de l'app, concours, tarifs,
journal, pages légales). Next.js 14 (App Router) + Tailwind, sombre par défaut
et clair, responsive (vérifié à 360, 768 et 1 280 px). Charte de l'app
(`Charte-graphique-Prepaxia.pdf`) ; images tirées des visuels des stores.

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
| Tarifs | prix : `GET /site/plans` ; contenu exact de chaque formule : `GET /subscriptions/grille?concours_id=…` (`avantages_reels`) |
| Journal | `GET /site/articles` — admin → Site web → Journal |
| Boutons Google Play / App Store / Web / PC | `GET /app/version` (`url_android`, `url_ios`, `url_web_app`) — admin → **Contact et liens de partage**. Lien vide : lien de démonstration (`LIENS_DEMO`, `lib/api.ts`) |
| E-mail, WhatsApp, chaîne WhatsApp | `GET /parametres-app` (lus seulement) |
| Images (héros, interfaces, tuteurs IA, logo) | `public/visuels/`, générées depuis les visuels des stores (`outils/`) |

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

## Déploiement Railway

Projet Railway **« Prepaxia Website »**, service **`PrepaxiaWebsite`**, domaine
**https://www.prepaxia.com**. Le dossier est lié au service (`railway status`).

```bash
npm run build                  # vérifie avant d'envoyer
railway up --detach            # construit le Dockerfile sur Railway
railway deployment list --json # attendre SUCCESS
git push origin main           # garder GitHub à jour
```

- **Variables** du service : `API_URL=https://prepaxia-api-production.up.railway.app`
  (sans `/api/v1`) et `SITE_URL=https://www.prepaxia.com`.
- Domaine : **Settings → Networking → Custom Domain** (CNAME chez le registrar),
  puis mettre à jour `SITE_URL` et redéployer.

Le site n'appelle l'API que côté serveur : aucune modification CORS n'est
nécessaire côté API.

## Structure

```
app/            pages (accueil, concours, journal, journal/[slug], cgu,
                confidentialite, sitemap, robots, 404)
components/     en-tête, pied de page, badges des stores, galerie des
                interfaces, tarifs, animations, visuels, textes longs
lib/api.ts      lecture de l'API (cache 5 min, replis), liens de l'app
lib/tarifs.ts   construction des onglets de tarifs (plans + grille)
outils/         scripts Python : visuels WebP et icônes depuis les stores
public/         logo, visuels de l'app (sombre et clair)
```
