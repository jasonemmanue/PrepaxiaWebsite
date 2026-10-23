'use client'

import { useState } from 'react'
import { Check, ChevronDown, GraduationCap, Sparkles, Trophy } from 'lucide-react'
import type { OngletTarifs, PlanAffiche } from '@/lib/tarifs'

// (2026-10-23) Tarifs réels (API), un onglet par cible : concours, BAC. Construits côté
// serveur par lib/tarifs.ts ; ce composant ne fait qu'afficher et changer d'onglet.

const fcfa = (n: number) => n.toLocaleString('fr-FR')
const estCredit = (t: string) => /crédits? ia/i.test(t)

function Puce({ texte }: { texte: string }) {
  return (
    <li className="flex gap-2.5">
      {estCredit(texte)
        ? <Sparkles size={17} className="mt-0.5 shrink-0 text-pilier-ia" />
        : <Check size={17} className="mt-0.5 shrink-0 text-lien" />}
      <span>{texte}</span>
    </li>
  )
}

function CartePlan({ p, i }: { p: PlanAffiche; i: number }) {
  return (
    <article
      className={`entree flex flex-col rounded-3xl p-6 ${p.enAvant
        ? 'border-2 border-marque bg-surface shadow-marque'
        : 'carte'}`}
      style={{ animationDelay: `${i * 70}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{p.nom}</h3>
        {p.enAvant && <span className="rounded-full bg-marque px-2.5 py-1 text-xs font-semibold text-white">{p.badge || 'Populaire'}</span>}
        {p.economie ? (
          <span className="rounded-full bg-ambre px-2.5 py-1 text-xs font-semibold text-ambre-sur">
            −{p.economie} % par mois
          </span>
        ) : null}
      </div>
      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-[2.15rem] font-bold leading-none tracking-tight">{fcfa(p.prix)}</span>
        <span className="text-sm font-semibold texte-doux">FCFA</span>
      </p>
      <p className="mt-2 text-sm texte-doux">pour {p.duree}</p>
      {p.mensuel ? (
        <p className="mt-1 text-sm">soit <strong>{fcfa(p.mensuel)} FCFA</strong> par mois</p>
      ) : null}
      {p.propres.length > 0 && (
        <ul className="mt-5 space-y-2.5 border-t bord pt-5 text-sm">
          {p.propres.map((a) => <Puce key={a} texte={a} />)}
        </ul>
      )}
      <div className="mt-auto pt-6">
        <a href="#telecharger" className={`${p.enAvant ? 'bouton' : 'bouton-neutre'} w-full !py-3 text-sm`}>
          Choisir dans l&apos;app
        </a>
      </div>
    </article>
  )
}

export default function Tarifs({ onglets, notes }: { onglets: OngletTarifs[]; notes: string[] }) {
  const [actif, setActif] = useState(0)
  const o = onglets[actif]
  if (!o) return null
  const plusieurs = o.plans.length > 1

  const carteGratuit = o.gratuit && (
    <article className="entree carte flex flex-col p-6" style={{ animationDelay: '140ms' }}>
      <h3 className="font-semibold">{o.gratuit.nom}</h3>
      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-[2.15rem] font-bold leading-none tracking-tight">0</span>
        <span className="text-sm font-semibold texte-doux">FCFA</span>
      </p>
      <p className="mt-2 text-sm texte-doux">sans limite de durée</p>
      {o.gratuit.avantages.length > 0 && (
        <ul className="mt-5 space-y-2.5 border-t bord pt-5 text-sm">
          {o.gratuit.avantages.map((a) => <Puce key={a} texte={a} />)}
        </ul>
      )}
    </article>
  )

  return (
    <div>
      {onglets.length > 1 && (
        <div className="inline-flex rounded-2xl border bord bg-surface/70 p-1" role="tablist" aria-label="Je prépare">
          {onglets.map((g, i) => (
            <button key={g.cle} role="tab" aria-selected={i === actif} onClick={() => setActif(i)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                i === actif ? 'bg-marque text-white shadow-marque' : 'texte-doux hover:text-ink'}`}>
              {g.cle === 'bac' ? <GraduationCap size={16} /> : <Trophy size={16} />}
              {g.libelle}
            </button>
          ))}
        </div>
      )}

      <div key={o.cle} className="mt-8">
        {plusieurs ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {o.plans.map((p, i) => <CartePlan key={p.code} p={p} i={i} />)}
            </div>
            <div className={`mt-5 grid gap-5 ${carteGratuit ? 'lg:grid-cols-[1.7fr_1fr]' : ''}`}>
              {o.communs.length > 0 && (
                <article className="entree verre p-6 sm:p-7" style={{ animationDelay: '100ms' }}>
                  <h3 className="font-semibold">Inclus dans toutes les formules payantes</h3>
                  <ul className="mt-5 grid gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
                    {o.communs.map((a) => <Puce key={a} texte={a} />)}
                  </ul>
                </article>
              )}
              {carteGratuit}
            </div>
          </>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {o.plans.map((p, i) => <CartePlan key={p.code} p={p} i={i} />)}
            {carteGratuit}
          </div>
        )}

        {o.comparatif.length > 0 && (
          <details className="group carte mt-5 overflow-hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold sm:px-7">
              Voir le comparatif détaillé
              <ChevronDown size={20} className="shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="border-t bord px-5 pb-6 sm:px-7">
              <div className="hidden grid-cols-[1.3fr_1fr_1fr] gap-4 pt-5 text-xs font-semibold uppercase tracking-[0.12em] texte-discret sm:grid">
                <span>Ce que tu as</span><span>Gratuit</span><span>Formules payantes</span>
              </div>
              {o.comparatif.map((c) => (
                <div key={c.titre} className="mt-5">
                  <p className="surtitre">{c.titre}</p>
                  <div className="mt-2 divide-y divide-filet/70">
                    {c.lignes.map((l) => (
                      <div key={l.libelle} className="grid gap-1.5 py-3 text-sm sm:grid-cols-[1.3fr_1fr_1fr] sm:gap-4">
                        <div>
                          <p className="font-medium">{l.libelle}</p>
                          {l.detail && <p className="text-xs texte-discret">{l.detail}</p>}
                        </div>
                        <p className="texte-doux"><span className="font-medium text-ink sm:hidden">Gratuit : </span>{l.gratuit}</p>
                        <p><span className="font-medium sm:hidden">Payant : </span>{l.payant}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {(notes.length > 0 || o.creditsEnPlus) && (
        <ul className="mt-6 space-y-1.5 text-sm texte-doux">
          {o.creditsEnPlus && <li>Besoin de plus de crédits IA ? Ils s&apos;achètent dans l&apos;app, {o.creditsEnPlus}.</li>}
          {notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      )}
    </div>
  )
}
