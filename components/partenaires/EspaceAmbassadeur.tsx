'use client'
// ─────────────────────────────────────────────────────────────────────────────
// (2026-10-20) Espace privé d'un ambassadeur partenaire (lien secret).
// Données : relais /api/partenaires/espace/{jeton} (API services/ambassadeurs_partenaires.py).
// Affiche : charte à accepter, lien et code à partager (+ QR), règle de
// rémunération en vigueur, inscrits / abonnés, gains, numéro Mobile Money
// (changement validé par l'équipe), historique COMPLET des commissions
// (pages + CSV), versements.
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Download, MessageCircle, ShieldCheck, Wallet } from 'lucide-react'
import CopierCode from './CopierCode'

interface Commission {
  numero: string; type: 'abonnement' | 'palier'; eleve: string | null; plan: string | null
  montant_abonnement_fcfa: number; mode: 'fixe' | 'pourcentage'; taux_pct: number | null; montant_fcfa: number
  statut: string; cree_le: string | null; payee_le: string | null
}
interface Espace {
  nom: string; code: string; statut: 'actif' | 'suspendu'; charte: string; charte_acceptee: boolean
  liens: { public: string; android: string; web: string }
  textes: { whatsapp: string; court: string }
  regle: { mode: 'fixe' | 'pourcentage'; montant_fixe_fcfa: number; pourcentage: number; duree_mois: number; texte: string
    delai_validation_jours: number; seuil_versement_fcfa: number; jour_versement: number; premium_seulement: boolean
    paliers: { abonnes: number; bonus_fcfa: number }[] }
  stats: { visites: number; inscrits: number; abonnes: number }
  gains: { en_validation_fcfa: number; a_payer_fcfa: number; paye_fcfa: number; gele_fcfa: number }
  paiement: { numero: string | null; operateur: string | null; demande_en_cours: boolean }
  filleuls: { nom: string; inscrit_le: string | null; abonne: boolean }[]
  versements: { montant_fcfa: number; reference: string; nb: number; le: string | null }[]
}

const fcfa = (n: number) => `${(n ?? 0).toLocaleString('fr-FR')} XOF`
const date = (s: string | null) => (s ? new Date(s).toLocaleDateString('fr-FR') : '-')
const STATUTS: Record<string, [string, string]> = {
  en_validation: ['En validation', 'text-amber-600'], a_verser: ['À verser', 'text-bleu'], payee: ['Versée', 'text-emerald-600'],
  gelee: ['Gelée', 'texte-doux'], annulee: ['Annulée', 'texte-doux'], test: ['Test (non versée)', 'texte-doux'],
}
const OPERATEURS = [['orange', 'Orange Money'], ['mtn', 'MTN MoMo'], ['moov', 'Moov Money'], ['wave', 'Wave']] as const
const TAILLE = 20

export default function EspaceAmbassadeur({ jeton }: { jeton: string }) {
  const base = `/api/partenaires/espace/${encodeURIComponent(jeton)}`
  const [e, setE] = useState<Espace | null>(null)
  const [erreur, setErreur] = useState('')
  const [qr, setQr] = useState('')
  const [coms, setComs] = useState<Commission[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [paiement, setPaiement] = useState({ numero: '', operateur: 'orange' })
  const [msgPaiement, setMsgPaiement] = useState('')

  const charger = useCallback(async () => {
    try {
      const r = await fetch(base, { cache: 'no-store' })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setErreur(typeof d.detail === 'string' ? d.detail : 'Espace indisponible.'); return }
      setE(d as Espace)
      setQr(await QRCode.toDataURL((d as Espace).liens.public, { margin: 1, width: 220 }))
    } catch { setErreur('Connexion impossible : réessaie dans un instant.') }
  }, [base])
  useEffect(() => { charger() }, [charger])

  useEffect(() => {
    if (!e) return
    fetch(`${base}/commissions?page=${page}&taille=${TAILLE}`, { cache: 'no-store' })
      .then((r) => r.json()).then((d) => { setComs(d.commissions ?? []); setTotal(d.total ?? 0) }).catch(() => {})
  }, [e, page, base])

  if (erreur) return <div className="carte p-8 text-center"><p className="font-bold">Espace introuvable</p><p className="texte-doux mt-2">{erreur}</p></div>
  if (!e) return <div className="carte p-8 text-center texte-doux">Chargement de ton espace…</div>

  if (!e.charte_acceptee) {
    return (
      <div className="carte p-6 sm:p-8 space-y-4">
        <p className="text-xl font-extrabold">Bienvenue {e.nom.split(' ')[0]}</p>
        <p className="texte-doux">Avant de commencer, lis et accepte la charte de l’ambassadeur Prepaxia.</p>
        <p className="whitespace-pre-line text-sm rounded-xl border bord p-4">{e.charte}</p>
        <button className="bouton" onClick={async () => { await fetch(`${base}/charte`, { method: 'POST' }); charger() }}>
          <ShieldCheck size={18} /> J’accepte la charte
        </button>
      </div>
    )
  }

  const pages = Math.max(1, Math.ceil(total / TAILLE))
  const demanderNumero = async () => {
    setMsgPaiement('')
    const r = await fetch(`${base}/paiement`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paiement) })
    const d = await r.json().catch(() => ({}))
    setMsgPaiement(r.ok ? d.message : (typeof d.detail === 'string' ? d.detail : 'Demande impossible.'))
    if (r.ok) charger()
  }

  return (
    <div className="space-y-6">
      <div className="carte p-6 sm:p-8">
        <p className="surtitre">Espace ambassadeur</p>
        <h1 className="titre-section">Bonjour {e.nom.split(' ')[0]}</h1>
        {e.statut === 'suspendu' && (
          <p className="mt-3 rounded-xl border border-amber-400 p-3 text-sm">
            Ton code est suspendu : il n’inscrit plus de nouveaux élèves et tes gains sont gelés. Contacte l’équipe Prepaxia.
          </p>
        )}
        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] items-center">
          <div className="space-y-3">
            <p className="text-sm texte-doux">Ton code</p>
            <p className="text-3xl font-extrabold tracking-wider">{e.code}</p>
            <p className="text-sm texte-doux break-all">{e.liens.public}</p>
            <div className="flex flex-wrap gap-2">
              <CopierCode texte={e.liens.public} libelle="Copier mon lien" />
              <CopierCode texte={e.textes.whatsapp} libelle="Copier le message" />
              <a className="bouton !px-4 !py-2 text-sm" target="_blank" rel="noreferrer noopener"
                href={`https://wa.me/?text=${encodeURIComponent(e.textes.whatsapp)}`}><MessageCircle size={16} /> Partager sur WhatsApp</a>
            </div>
          </div>
          {qr && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt={`QR code de ${e.liens.public}`} width={160} height={160} className="rounded-xl bg-white p-2 mx-auto" />
              <a href={qr} download={`prepaxia-${e.code}.png`} className="text-xs underline">Télécharger le QR code</a>
            </div>
          )}
        </div>
      </div>

      <div className="carte p-6 space-y-2">
        <p className="font-bold">Ta rémunération</p>
        <p>{e.regle.texte}, pendant {e.regle.duree_mois} mois après l’inscription de chaque élève
          {e.regle.premium_seulement ? ' (formules Premium)' : ''}.</p>
        <p className="text-sm texte-doux">Chaque gain est validé après {e.regle.delai_validation_jours} jours, puis versé par Mobile Money
          vers le {e.regle.jour_versement} du mois dès {fcfa(e.regle.seuil_versement_fcfa)}.</p>
        {e.regle.paliers.map((p) => <p key={p.abonnes} className="text-sm">Bonus de {fcfa(p.bonus_fcfa)} à {p.abonnes} abonnés.</p>)}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([['Visites de ton lien', String(e.stats.visites)], ['Inscrits', String(e.stats.inscrits)], ['Abonnés', String(e.stats.abonnes)],
          ['En validation', fcfa(e.gains.en_validation_fcfa)], ['À verser', fcfa(e.gains.a_payer_fcfa)], ['Déjà versé', fcfa(e.gains.paye_fcfa)],
          ...(e.gains.gele_fcfa ? [['Gelé', fcfa(e.gains.gele_fcfa)]] : [])] as [string, string][]).map(([l, v]) => (
          <div key={l} className="carte p-4"><p className="text-xs texte-doux">{l}</p><p className="text-lg font-extrabold">{v}</p></div>
        ))}
      </div>

      <div className="carte p-6 space-y-3">
        <p className="font-bold flex items-center gap-2"><Wallet size={18} /> Où recevoir tes gains</p>
        <p className="text-sm">{e.paiement.numero ? `${e.paiement.numero} · ${e.paiement.operateur ?? ''}` : 'Aucun numéro Mobile Money enregistré.'}</p>
        {e.paiement.demande_en_cours ? (
          <p className="text-sm texte-doux">Ta demande de changement est en cours de vérification par l’équipe.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <input className="flex-1 min-w-[180px] rounded-xl border bord bg-transparent px-4 py-2" inputMode="tel" placeholder="+225 07 00 00 00 00"
              value={paiement.numero} onChange={(ev) => setPaiement({ ...paiement, numero: ev.target.value })} />
            <select className="rounded-xl border bord bg-transparent px-3 py-2" value={paiement.operateur}
              onChange={(ev) => setPaiement({ ...paiement, operateur: ev.target.value })}>
              {OPERATEURS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <button className="bouton-neutre !px-4 !py-2 text-sm" disabled={paiement.numero.replace(/\D/g, '').length < 8} onClick={demanderNumero}>
              {e.paiement.numero ? 'Demander un changement' : 'Enregistrer mon numéro'}</button>
          </div>
        )}
        {msgPaiement && <p className="text-sm">{msgPaiement}</p>}
        <p className="text-xs texte-doux">Pour ta sécurité, tout numéro est vérifié par l’équipe Prepaxia avant d’être utilisé.</p>
      </div>

      <div className="carte p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold">Historique de tes commissions ({total})</p>
          <a href={`${base}/commissions.csv`} className="bouton-neutre !px-4 !py-2 text-sm"><Download size={16} /> Télécharger (CSV)</a>
        </div>
        {coms.length === 0 ? <p className="text-sm texte-doux">Aucune commission pour l’instant.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs texte-doux">
                <th className="py-2 pr-3">Date</th><th className="pr-3">Élève</th><th className="pr-3">Formule</th><th className="pr-3">Prix payé</th>
                <th className="pr-3">Règle</th><th className="pr-3 text-right">Gain</th><th className="pr-3">Statut</th><th>Versée le</th>
              </tr></thead>
              <tbody>
                {coms.map((c) => {
                  const [lib, coul] = STATUTS[c.statut] ?? [c.statut, '']
                  return (
                    <tr key={c.numero} className="border-t bord">
                      <td className="py-2 pr-3 whitespace-nowrap">{date(c.cree_le)}</td>
                      <td className="pr-3">{c.eleve ?? (c.type === 'palier' ? 'Bonus' : '-')}</td>
                      <td className="pr-3">{c.plan ?? '-'}</td>
                      <td className="pr-3 whitespace-nowrap">{c.type === 'palier' ? '-' : fcfa(c.montant_abonnement_fcfa)}</td>
                      <td className="pr-3">{c.type === 'palier' ? 'Palier' : c.mode === 'pourcentage' ? `${c.taux_pct} %` : 'Fixe'}</td>
                      <td className="pr-3 text-right font-bold whitespace-nowrap">{fcfa(c.montant_fcfa)}</td>
                      <td className={`pr-3 ${coul}`}>{lib}</td>
                      <td className="whitespace-nowrap">{date(c.payee_le)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 text-sm">
            <button className="bouton-neutre !px-3 !py-1.5" disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button>
            <span>Page {page} / {pages}</span>
            <button className="bouton-neutre !px-3 !py-1.5" disabled={page >= pages} onClick={() => setPage(page + 1)}>Suivant</button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="carte p-6 space-y-2">
          <p className="font-bold">Tes élèves ({e.filleuls.length})</p>
          {e.filleuls.length === 0 ? <p className="text-sm texte-doux">Personne ne s’est encore inscrit avec ton code.</p> :
            <ul className="text-sm space-y-1 max-h-72 overflow-y-auto">{e.filleuls.map((f, i) => (
              <li key={i} className="flex justify-between gap-2"><span>{f.nom}</span>
                <span className="texte-doux">{date(f.inscrit_le)}{f.abonne ? ' · abonné' : ''}</span></li>
            ))}</ul>}
        </div>
        <div className="carte p-6 space-y-2">
          <p className="font-bold">Tes versements ({e.versements.length})</p>
          {e.versements.length === 0 ? <p className="text-sm texte-doux">Aucun versement pour l’instant.</p> :
            <ul className="text-sm space-y-1">{e.versements.map((v, i) => (
              <li key={i} className="flex justify-between gap-2"><span>{date(v.le)} · réf. {v.reference}</span><b>{fcfa(v.montant_fcfa)}</b></li>
            ))}</ul>}
        </div>
      </div>
      <p className="text-center text-xs texte-doux">Ce lien est personnel : ne le partage pas. Pour partager Prepaxia, utilise ton lien public ci-dessus.</p>
    </div>
  )
}
