'use client'
// (2026-10-20) Copie d'un texte (code ambassadeur, lien) avec confirmation.
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopierCode({ texte, libelle = 'Copier' }: { texte: string; libelle?: string }) {
  const [copie, setCopie] = useState(false)
  const copier = async () => {
    try {
      await navigator.clipboard.writeText(texte)
      setCopie(true)
      setTimeout(() => setCopie(false), 2000)
    } catch {
      // Navigateur sans presse-papiers : le texte reste affiché et sélectionnable.
    }
  }
  return (
    <button type="button" onClick={copier} className="bouton-neutre !px-4 !py-2 text-sm" aria-live="polite">
      {copie ? <Check size={16} /> : <Copy size={16} />} {copie ? 'Copié' : libelle}
    </button>
  )
}
