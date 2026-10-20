// app/devenir-ambassadeur/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// (2026-10-20) Programme Ambassadeur partenaire : règles lues dans l'API
// (réglables dans l'admin → Ambassadeurs partenaires), puis candidature.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import FormulaireCandidature from '@/components/partenaires/FormulaireCandidature'
import { API_BASE } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Deviens ambassadeur Prepaxia',
  description: 'Fais découvrir Prepaxia aux élèves autour de toi et sois rémunéré pour chaque abonnement.',
}

interface ConfigPublique {
  candidatures_ouvertes: boolean; regle: string; duree_mois: number; seuil_versement_fcfa: number
  delai_validation_jours: number; paliers: { abonnes: number; bonus_fcfa: number }[]; charte: string
}

async function lireConfig(): Promise<ConfigPublique | null> {
  try {
    const r = await fetch(`${API_BASE}/api/v1/partenaires/config-publique`, { next: { revalidate: 300 } })
    return r.ok ? ((await r.json()) as ConfigPublique) : null
  } catch {
    return null
  }
}

const fcfa = (n: number) => `${n.toLocaleString('fr-FR')} XOF`

export default async function DevenirAmbassadeur() {
  const c = await lireConfig()
  return (
    <section className="conteneur max-w-3xl py-14 sm:py-20 space-y-8">
      <div>
        <p className="surtitre">Programme Ambassadeur</p>
        <h1 className="titre-section">Fais découvrir Prepaxia et sois rémunéré</h1>
        <p className="texte-doux mt-3">
          Enseignant, étudiant, responsable d’un groupe ou d’une page : partage ton lien, les élèves s’inscrivent avec ton code,
          et tu gagnes une commission sur chaque abonnement payé.
        </p>
      </div>
      {c ? (
        <div className="carte p-6 sm:p-8 space-y-2">
          <p className="font-bold text-lg">Comment tu es rémunéré</p>
          <p>• {c.regle}, pendant {c.duree_mois} mois après l’inscription de chaque élève.</p>
          <p>• Chaque gain est validé après {c.delai_validation_jours} jours, puis versé par Mobile Money dès {fcfa(c.seuil_versement_fcfa)}.</p>
          {c.paliers.map((p) => <p key={p.abonnes}>• Bonus de {fcfa(p.bonus_fcfa)} à {p.abonnes} abonnés.</p>)}
          <p>• Tu suis tes inscrits, tes gains et tes versements dans ton espace ambassadeur.</p>
        </div>
      ) : null}
      {c?.candidatures_ouvertes === false ? (
        <div className="carte p-7 text-center texte-doux">Les candidatures sont fermées pour le moment. Reviens bientôt.</div>
      ) : c ? (
        <FormulaireCandidature charte={c.charte} />
      ) : (
        <div className="carte p-7 text-center texte-doux">Page momentanément indisponible. Réessaie dans un instant.</div>
      )}
    </section>
  )
}
