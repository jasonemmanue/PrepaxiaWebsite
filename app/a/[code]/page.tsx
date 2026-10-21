// app/a/[code]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// (2026-10-20) Lien public d'un ambassadeur partenaire : prepaxia.com/a/PX-XXXXXX.
// Présente Prepaxia et transmet le code :
//   • Android : lien Play Store avec « referrer » (l'app remplit le code seule) ;
//   • app web : ?amb=CODE (gardé 30 jours par l'app web) ;
//   • iPhone / iPad : Apple ne transmet rien → le code est affiché à recopier.
// La visite est comptée par l'API (une par visiteur et par jour, IP transmise).
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Apple, Globe, Smartphone } from 'lucide-react'
import CopierCode from '@/components/partenaires/CopierCode'
import { API_BASE, lireLiens } from '@/lib/api'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Rejoins Prepaxia',
  description: 'Cours, annales corrigées, quiz, Prepaxia AI, Prepaxia Corrector, Prepaxia Generator et bien d’autres surprises pour réussir ton concours ou ton BAC.',
  robots: { index: false, follow: false },
}

interface Reponse { valide: boolean; code?: string; prenom?: string; liens?: { android: string; web: string } }

async function verifier(code: string): Promise<Reponse> {
  if (!/^[A-Za-z0-9 -]{4,20}$/.test(code)) return { valide: false }
  const h = headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || ''
  try {
    const r = await fetch(`${API_BASE}/api/v1/partenaires/code/${encodeURIComponent(code)}`, {
      headers: { 'X-Visiteur-Ip': ip }, cache: 'no-store',
    })
    return r.ok ? ((await r.json()) as Reponse) : { valide: false }
  } catch {
    return { valide: false }
  }
}

export default async function LienAmbassadeur({ params }: { params: { code: string } }) {
  const code = decodeURIComponent(params.code || '')
  const [r, liens] = await Promise.all([verifier(code), lireLiens()])
  const valide = r.valide && r.code && r.liens
  return (
    <section className="conteneur max-w-2xl py-14 sm:py-20">
      <div className="carte p-7 sm:p-10 text-center">
        <p className="surtitre">{valide ? `${r.prenom} t’invite` : 'Bienvenue'}</p>
        <h1 className="titre-section">Prépare ton concours avec Prepaxia</h1>
        <p className="texte-doux mt-3">
          Cours, annales corrigées, quiz, objectifs du jour, Prepaxia AI (ton tuteur IA), Prepaxia Corrector, Prepaxia
          Generator et bien d’autres surprises : tout pour réussir ton concours ou ton BAC.
        </p>

        {valide && (
          <div className="mt-8 rounded-2xl border bord p-5">
            <p className="text-sm texte-doux">Ton code ambassadeur</p>
            <p className="mt-1 text-3xl font-extrabold tracking-wider">{r.code}</p>
            <div className="mt-3 flex justify-center"><CopierCode texte={r.code!} libelle="Copier le code" /></div>
            <p className="mt-3 text-xs texte-doux">
              Sur Android et sur le web, il est rempli tout seul. Sur iPhone ou iPad, colle-le dans « Code ambassadeur »
              au moment de l’inscription.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:items-center">
          <a href={valide ? r.liens!.android : (liens.playstore_url || 'https://play.google.com/store/apps/details?id=com.prepaxia.app')}
            className="bouton w-full sm:w-80">
            <Smartphone size={20} /> Télécharger sur Google Play
          </a>
          {liens.appstore_url && (
            <a href={liens.appstore_url} className="bouton-neutre w-full sm:w-80"><Apple size={20} /> Télécharger sur l’App Store</a>
          )}
          <a href={valide ? r.liens!.web : 'https://www.webapp.prepaxia.com/'} className="bouton-neutre w-full sm:w-80">
            <Globe size={20} /> Continuer sur le web
          </a>
        </div>

        {!valide && code && (
          <p className="mt-6 text-sm texte-doux">Ce lien d’ambassadeur n’est plus actif, mais tu peux t’inscrire normalement.</p>
        )}
      </div>
      <p className="mt-6 text-center text-sm texte-doux">
        Toi aussi, fais découvrir Prepaxia et sois rémunéré : <Link href="/devenir-ambassadeur" className="font-semibold underline">deviens ambassadeur</Link>.
      </p>
    </section>
  )
}
