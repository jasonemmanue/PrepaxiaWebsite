'use client'
// (2026-10-20) Candidature au programme Ambassadeur partenaire. Envoyée au
// relais du site (/api/partenaires/candidature), validée ensuite par l'équipe.
import { useState } from 'react'
import { Send } from 'lucide-react'

const PAYS: [string, string][] = [
  ['CIV', 'Côte d’Ivoire'], ['SEN', 'Sénégal'], ['MLI', 'Mali'], ['BFA', 'Burkina Faso'], ['BEN', 'Bénin'],
  ['TGO', 'Togo'], ['NER', 'Niger'], ['GIN', 'Guinée'], ['CMR', 'Cameroun'], ['GAB', 'Gabon'], ['COG', 'Congo'],
  ['COD', 'RD Congo'], ['TCD', 'Tchad'], ['CAF', 'Centrafrique'], ['MRT', 'Mauritanie'], ['GNB', 'Guinée-Bissau'],
]

export default function FormulaireCandidature({ charte }: { charte: string }) {
  const [f, setF] = useState({ nom: '', telephone: '', email: '', pays_code: 'CIV', ville: '', reseau: '', motivation: '', site_web: '' })
  const [accepte, setAccepte] = useState(false)
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'envoye'>('saisie')
  const [erreur, setErreur] = useState('')

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault()
    setErreur('')
    if (f.nom.trim().length < 2) return setErreur('Indique ton nom complet.')
    if (f.telephone.replace(/\D/g, '').length < 8) return setErreur('Indique ton numéro WhatsApp avec l’indicatif du pays (+225…).')
    if (!accepte) return setErreur('Lis et accepte la charte de l’ambassadeur.')
    setEtat('envoi')
    try {
      const r = await fetch('/api/partenaires/candidature', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, email: f.email.trim() || null, accepte_charte: true }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        const detail = typeof d.detail === 'string' ? d.detail : 'Vérifie les informations saisies.'
        setErreur(r.status === 429 ? 'Trop de tentatives : réessaie dans une heure.' : detail)
        setEtat('saisie')
        return
      }
      setEtat('envoye')
    } catch {
      setErreur('Connexion impossible : réessaie dans un instant.')
      setEtat('saisie')
    }
  }

  if (etat === 'envoye') {
    return (
      <div className="carte p-7 text-center">
        <p className="text-2xl font-extrabold">Candidature envoyée</p>
        <p className="texte-doux mt-2">L’équipe Prepaxia l’étudie et te contacte sur WhatsApp avec ton code et ton espace ambassadeur.</p>
      </div>
    )
  }
  const champ = 'mt-1 w-full rounded-xl border bord bg-transparent px-4 py-3 outline-none focus:border-bleu'
  return (
    <form onSubmit={envoyer} className="carte p-6 sm:p-8 space-y-4" noValidate>
      <label className="block text-sm font-semibold">Nom complet
        <input className={champ} value={f.nom} maxLength={120} autoComplete="name" onChange={(e) => setF({ ...f, nom: e.target.value })} />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-semibold">Numéro WhatsApp
          <input className={champ} value={f.telephone} maxLength={30} inputMode="tel" autoComplete="tel" placeholder="+225 07 00 00 00 00"
            onChange={(e) => setF({ ...f, telephone: e.target.value })} />
        </label>
        <label className="block text-sm font-semibold">Email (facultatif)
          <input className={champ} type="email" value={f.email} maxLength={255} autoComplete="email" onChange={(e) => setF({ ...f, email: e.target.value })} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm font-semibold">Pays
          <select className={champ} value={f.pays_code} onChange={(e) => setF({ ...f, pays_code: e.target.value })}>
            {PAYS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">Ville
          <input className={champ} value={f.ville} maxLength={100} onChange={(e) => setF({ ...f, ville: e.target.value })} />
        </label>
      </div>
      <label className="block text-sm font-semibold">Ton réseau (lycée, école, groupe, page…)
        <input className={champ} value={f.reseau} maxLength={1000} onChange={(e) => setF({ ...f, reseau: e.target.value })} />
      </label>
      <label className="block text-sm font-semibold">Comment comptes-tu faire connaître Prepaxia ?
        <textarea className={`${champ} min-h-[110px]`} value={f.motivation} maxLength={2000} onChange={(e) => setF({ ...f, motivation: e.target.value })} />
      </label>
      {/* Piège à robots : invisible pour une personne, rempli par un robot. */}
      <input type="text" name="site_web" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.site_web}
        onChange={(e) => setF({ ...f, site_web: e.target.value })} style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }} />
      <details className="rounded-xl border bord p-4">
        <summary className="cursor-pointer font-semibold">Charte de l’ambassadeur</summary>
        <p className="mt-3 whitespace-pre-line text-sm texte-doux">{charte}</p>
      </details>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1" checked={accepte} onChange={(e) => setAccepte(e.target.checked)} />
        <span>J’ai lu la charte et je m’engage à la respecter.</span>
      </label>
      {erreur && <p className="text-sm font-semibold text-red-500" role="alert">{erreur}</p>}
      <button type="submit" disabled={etat === 'envoi'} className="bouton w-full disabled:opacity-60">
        <Send size={18} /> {etat === 'envoi' ? 'Envoi…' : 'Envoyer ma candidature'}
      </button>
    </form>
  )
}
