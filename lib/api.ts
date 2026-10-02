// lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lecture des données du site depuis l'API Prepaxia, CÔTÉ SERVEUR uniquement.
// Rendu revalidé toutes les 5 minutes : une modification faite dans l'admin
// apparaît sur le site sans redéploiement, et l'API n'est pas sollicitée à
// chaque visite. Si l'API ne répond pas, chaque fonction renvoie une valeur de
// repli : le site reste affichable.
// ─────────────────────────────────────────────────────────────────────────────

const API = (process.env.API_URL || 'https://excellencia-api-production.up.railway.app')
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '')
const V1 = `${API}/api/v1`
const REVALIDATION = 300

async function lire<T>(chemin: string, repli: T): Promise<T> {
  try {
    const r = await fetch(`${V1}${chemin}`, { next: { revalidate: REVALIDATION } })
    if (!r.ok) return repli
    return (await r.json()) as T
  } catch {
    return repli
  }
}

export interface Fonctionnalite { icone: string; titre: string; texte: string }
export interface Etape { titre: string; texte: string }
export interface Temoignage { nom: string; role?: string; texte: string }
export interface QuestionFaq { question: string; reponse: string }

export interface ContenuSite {
  bandeau: string
  hero_titre: string
  hero_titre_accent: string
  hero_sous_titre: string
  url_app_web: string
  fonctionnalites: Fonctionnalite[]
  etapes: Etape[]
  temoignages: Temoignage[]
  faq: QuestionFaq[]
  contact_email: string
  url_youtube: string
  url_tiktok: string
  url_facebook: string
  url_linkedin: string
  cgu: string
  confidentialite: string
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
  nom: string
  prix_fcfa: number
  duree_jours?: number
  avantages?: string[]
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
  contact_email: '',
  url_youtube: '',
  url_tiktok: '',
  url_facebook: '',
  url_linkedin: '',
  cgu: '',
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

/** Lien de téléchargement Android : Play Store s'il existe, sinon l'APK. */
export function lienAndroid(l: Liens): string | null {
  return l.playstore_url || l.apk_url || null
}
