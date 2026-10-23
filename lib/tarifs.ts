// lib/tarifs.ts
// ─────────────────────────────────────────────────────────────────────────────
// (2026-10-23) Section Tarifs : prix de `GET /site/plans` (prix payé, formule standard) et
// contenu EXACT de chaque formule tiré de `GET /subscriptions/grille?concours_id=…`
// (`avantages_reels`, calculés par l'API depuis le modèle économique, par cible).
// Les champs `avantages` et `description` des plans ne sont PAS affichés : saisis à la main
// dans l'admin, ils sont en partie périmés (ancien nom d'outil, économies fausses).
// ─────────────────────────────────────────────────────────────────────────────
import type { Grille, Plan } from './api'

export interface PlanAffiche {
  code: string
  nom: string
  prix: number
  duree: string
  mensuel?: number
  economie?: number
  propres: string[]
  enAvant: boolean
  badge?: string
}

export interface LigneComparatif { libelle: string; detail?: string; gratuit: string; payant: string }

export interface OngletTarifs {
  cle: string
  libelle: string
  plans: PlanAffiche[]
  communs: string[]
  gratuit: { nom: string; avantages: string[] } | null
  comparatif: { titre: string; lignes: LigneComparatif[] }[]
  creditsEnPlus?: string
}

/** Retire l'émoji de tête des libellés de la grille (« 🤖 Prepaxia AI » → « Prepaxia AI »). */
export const sansEmoji = (t: string) => (t || '').replace(/^[\p{Extended_Pictographic}️‍\s]+/u, '').trim()

export function dureeTexte(jours?: number): string {
  const d = jours ?? 0
  if (d >= 360 && d <= 366) return '1 an'
  if (d >= 30 && d % 30 === 0) return `${d / 30} mois`
  return `${d} jours`
}

export const estPayant = (p: Plan) => (p.prix_fcfa || 0) > 0
export const estPlanBac = (p: Plan) => (p.code || '').toLowerCase().startsWith('bac')

/** Construit un onglet (« Concours » ou « BAC ») à partir de ses plans et de sa grille. */
export function construireOnglet(cle: string, libelle: string, plans: Plan[], grille: Grille, gratuit?: Plan): OngletTarifs {
  const reels = grille.avantages_reels || {}
  const ref = plans.find((p) => p.code === 'mensuel') ?? plans.find((p) => p.duree_jours === 30)
  const listes = plans.map((p) => reels[p.code || ''] || [])
  const avecListe = listes.filter((l) => l.length > 0)
  // Ce qui est commun à toutes les formules payantes est montré une seule fois.
  const communs = plans.length > 1 && avecListe.length === plans.length
    ? avecListe[0].filter((a) => avecListe.every((l) => l.includes(a)))
    : []

  const affiches: PlanAffiche[] = plans.map((p, i) => {
    const mensuel = (p.duree_jours ?? 0) > 31 ? p.prix_mensuel_fcfa : undefined
    let economie: number | undefined
    if (ref && ref !== p && mensuel && ref.prix_mensuel_fcfa && (p.duree_jours ?? 0) > (ref.duree_jours ?? 0)) {
      const e = Math.floor((1 - mensuel / ref.prix_mensuel_fcfa) * 100)
      if (e >= 1) economie = e
    }
    const pres = p.presentation || {}
    return {
      code: p.code || p.id,
      nom: p.nom,
      prix: p.prix_fcfa,
      duree: dureeTexte(p.duree_jours),
      mensuel,
      economie,
      propres: listes[i].filter((a) => !communs.includes(a)),
      enAvant: Boolean(p.populaire),
      badge: (pres.badge || '').trim() || undefined,
    }
  })

  const comparatif = (grille.categories || []).map((c) => ({
    titre: c.titre,
    lignes: c.lignes.map((l) => {
      const valeurs = plans.map((p) => [p.nom, (l.par_plan || {})[p.code || ''] || l.premium] as const)
      const distinctes = Array.from(new Set(valeurs.map(([, v]) => v)))
      const payant = distinctes.length <= 1
        ? (distinctes[0] ?? l.premium)
        : valeurs.map(([n, v]) => `${n} : ${v}`).join(' · ')
      return { libelle: sansEmoji(l.libelle), detail: l.detail, gratuit: l.gratuit, payant }
    }),
  })).filter((c) => c.lignes.length > 0)

  const auDela = (grille.categories || []).flatMap((c) => c.lignes).find((l) => /au-del/i.test(l.libelle))
  const avantagesGratuit = grille.formule_gratuite?.avantages?.length
    ? grille.formule_gratuite.avantages
    : (reels.gratuit || [])

  return {
    cle,
    libelle,
    plans: affiches,
    communs,
    gratuit: gratuit ? { nom: gratuit.nom, avantages: avantagesGratuit } : null,
    comparatif,
    creditsEnPlus: (auDela?.detail || '').match(/dès\s*[\d\s ]+\s*(XOF|FCFA)/i)?.[0].replace(/XOF/i, 'FCFA') || undefined,
  }
}
