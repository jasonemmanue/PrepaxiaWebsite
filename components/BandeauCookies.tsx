'use client'

// components/BandeauCookies.tsx
// (2026-10-24) Consentement minimal : le site n'a ni publicité ni traceur ; seules
// les préférences (thème) sont facultatives. Choix gardé dans le navigateur.
// Refuser efface le thème mémorisé ; les cookies nécessaires restent actifs.
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CLE = 'consentement_cookies'

export default function BandeauCookies() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    try { setVisible(!localStorage.getItem(CLE)) } catch { setVisible(false) }
  }, [])
  if (!visible) return null
  const choisir = (v: 'tous' | 'necessaires') => {
    try {
      localStorage.setItem(CLE, v)
      if (v === 'necessaires') localStorage.removeItem('theme')
    } catch { /* navigateur sans stockage : rien à garder */ }
    setVisible(false)
  }
  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border bord bg-fond p-4 shadow-doux sm:inset-x-6">
      <p className="text-sm leading-relaxed">
        Prepaxia utilise seulement les cookies nécessaires au service et, si tu l&apos;acceptes, tes préférences
        d&apos;affichage. Aucune publicité, aucun traceur. <Link href="/cookies" className="underline">En savoir plus</Link>
      </p>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => choisir('necessaires')} className="rounded-xl border bord px-4 py-2 text-sm font-semibold">
          Nécessaires seulement
        </button>
        <button type="button" onClick={() => choisir('tous')} className="rounded-xl bg-marque px-4 py-2 text-sm font-semibold text-white">
          Tout accepter
        </button>
      </div>
    </div>
  )
}
