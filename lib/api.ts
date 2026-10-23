// lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lecture des données du site depuis l'API Prepaxia, CÔTÉ SERVEUR uniquement.
// Rendu revalidé toutes les 5 minutes : une modification faite dans l'admin
// apparaît sur le site sans redéploiement, et l'API n'est pas sollicitée à
// chaque visite. Si l'API ne répond pas, chaque fonction renvoie une valeur de
// repli : le site reste affichable.
// ─────────────────────────────────────────────────────────────────────────────

const nettoyer = (u: string) => u.trim().replace(/\/+$/, '').replace(/\/api\/v1$/, '')
// (2026-10-05) Lien DÉFINITIF de l'API, seul lien connu du site.
const API = nettoyer(process.env.API_URL || 'https://prepaxia-api-production.up.railway.app')
// Liens de secours facultatifs (variable API_URLS_SECOURS), aucun par défaut.
const SECOURS = (process.env.API_URLS_SECOURS || '')
  .split(',').map(nettoyer).filter(Boolean)
const BASES = Array.from(new Set([API, ...SECOURS]))
/** (2026-10-20) Base de l'API pour les routes qui relaient le navigateur (app/api/partenaires). */
export const API_BASE = API
const REVALIDATION = 300

async function lire<T>(chemin: string, repli: T): Promise<T> {
  for (const base of BASES) {
    try {
      const r = await fetch(`${base}/api/v1${chemin}`, { next: { revalidate: REVALIDATION } })
      if (r.ok) return (await r.json()) as T
      // 404 « Application not found » de Railway : lien supprimé, on passe au suivant.
      if (r.status !== 404) return repli
    } catch {
      // réseau : lien suivant
    }
  }
  return repli
}

export interface Fonctionnalite { icone: string; titre: string; texte: string }
/** (2026-10-22) Carte « tuteur IA » : `points` = une compétence par ligne. */
export interface TuteurIa { icone: string; titre: string; texte: string; points?: string }
export interface Etape { titre: string; texte: string }
export interface Temoignage { nom: string; role?: string; texte: string; photo?: string }
export interface QuestionFaq { question: string; reponse: string }

export interface ContenuSite {
  bandeau: string
  hero_titre: string
  hero_titre_accent: string
  hero_sous_titre: string
  url_app_web: string
  fonctionnalites: Fonctionnalite[]
  /** (2026-10-22) Section « Tuteurs IA » (Prepaxia AI, Corrector, Generator). */
  tuteurs_titre?: string
  tuteurs_sous_titre?: string
  tuteurs_ia?: TuteurIa[]
  tuteurs_note?: string
  etapes: Etape[]
  temoignages: Temoignage[]
  faq: QuestionFaq[]
  contact_email: string
  url_youtube: string
  url_tiktok: string
  url_facebook: string
  url_linkedin: string
  cgu: string
  a_propos?: string
  a_propos_titre?: string
  confidentialite: string
  /** (2026-10-17) Page « Supprimer mon compte » (Google Play). */
  suppression_compte?: string
}

export interface Stats {
  inscrits: number; concours: number; chapitres: number; ressources: number
  lecons?: number; exercices?: number; annales?: number
  /** Temps total passé dans l'application par les élèves (2026-10-02). */
  heures_utilisation?: number
}

export interface Matiere { id: string; nom: string; symbole?: string | null }
export interface Concours {
  id: string
  slug: string
  nom: string
  description?: string | null
  type: string
  couleur_hex?: string | null
  matieres: Matiere[]
}

export interface Liens {
  email_contact?: string | null
  whatsapp_contact?: string | null
  whatsapp_chaine?: string | null
  apk_url?: string | null
  playstore_url?: string | null
  appstore_url?: string | null
}

export interface Article {
  id: string
  slug: string
  titre: string
  categorie?: string | null
  resume?: string | null
  contenu?: string | null
  image_url?: string | null
  publie_le?: string | null
}

export interface Plan {
  id: string
  code?: string
  nom: string
  prix_fcfa: number
  duree_jours?: number
  avantages?: string[]
  prix_mensuel_fcfa?: number
  populaire?: boolean
  presentation?: { texte_court?: string; badge?: string; mise_en_avant?: boolean }
}

/** (2026-10-23) Liens de l'application réglés dans l'admin (Contact et liens de partage /
 *  Mise à jour de l'application), lus dans `GET /app/version`. Jamais écrits par le site. */
export interface VersionApp {
  derniere_version?: string
  url_android?: string
  url_ios?: string
  url_web_app?: string
  url_site?: string
}

/** (2026-10-23) Grille des forfaits (`GET /subscriptions/grille`), calculée par l'API depuis
 *  le modèle économique : `avantages_reels` = liste exacte de chaque formule, par cible. */
export interface LigneGrille { libelle: string; detail?: string; gratuit: string; premium: string; par_plan?: Record<string, string> }
export interface Grille {
  titre?: string
  sous_titre?: string
  note?: string
  categories: { titre: string; lignes: LigneGrille[] }[]
  formule_gratuite?: { nom?: string; avantages?: string[] } | null
  avantages_reels?: Record<string, string[]>
}

export const CONTENU_VIDE: ContenuSite = {
  bandeau: '',
  hero_titre: 'Prépare ton concours',
  hero_titre_accent: 'avec méthode.',
  hero_sous_titre: '',
  url_app_web: '',
  fonctionnalites: [],
  etapes: [],
  temoignages: [],
  faq: [],
  contact_email: 'assistanceprepaxia@gmail.com',
  url_youtube: '',
  url_tiktok: '',
  url_facebook: '',
  url_linkedin: '',
  cgu: '',
  a_propos: '',
  a_propos_titre: 'À propos de nous',
  confidentialite: '',
}

export const lireContenu = () => lire<ContenuSite>('/site/contenu', CONTENU_VIDE)
export const lireStats = () =>
  lire<Stats>('/site/stats', { inscrits: 0, concours: 0, chapitres: 0, ressources: 0 })
export const lireConcours = () => lire<Concours[]>('/concours', [])
export const lireLiens = () => lire<Liens>('/parametres-app', {})
export const lireArticles = (limite = 20) => lire<Article[]>(`/site/articles?limite=${limite}`, [])
export const lireArticle = (slug: string) =>
  lire<Article | null>(`/site/articles/${encodeURIComponent(slug)}`, null)
export const lirePlans = () => lire<Plan[]>('/site/plans', [])
export const lireVersion = () => lire<VersionApp>('/app/version', {})
export const lireGrille = (concoursId?: string) =>
  lire<Grille>(`/subscriptions/grille${concoursId ? `?concours_id=${encodeURIComponent(concoursId)}` : ''}`,
    { categories: [] })

/** (2026-10-23) Liens de DÉMONSTRATION, affichés tant que l'exploitant n'a pas posé le vrai
 *  lien dans l'admin (Contact et liens de partage). Le site ne les écrit jamais en base. */
export const LIENS_DEMO = {
  android: 'https://play.google.com/store/apps/details?id=com.prepaxia.app',
  ios: 'https://apps.apple.com/',
  web: 'https://www.webapp.prepaxia.com/',
}

export interface LiensTelechargement { android: string; ios: string; web: string }

/** Les trois boutons de téléchargement : liens de `/app/version`, sinon démonstration. */
export function liensTelechargement(v: VersionApp, urlAppWeb?: string): LiensTelechargement {
  const propre = (u?: string | null) => (u || '').trim()
  return {
    android: propre(v.url_android) || LIENS_DEMO.android,
    ios: propre(v.url_ios) || LIENS_DEMO.ios,
    web: propre(v.url_web_app) || propre(urlAppWeb) || LIENS_DEMO.web,
  }
}

/** Nom saisi dans l'admin, rendu propre à l'affichage : espaces doublés, « _ », « ENSEA(ISE) ». */
export function nomPropre(t: string): string {
  return (t || '').replace(/_/g, '-').replace(/(\S)\(/g, '$1 (').replace(/\s+/g, ' ').trim()
}

/** Le BAC (règles à part : formules `bac…`, pas de Corrector ni de Generator). */
export const estBac = (c: Concours) => c.slug.toLowerCase() === 'bac' || /^bac(\s|$)/i.test(c.nom.trim())
