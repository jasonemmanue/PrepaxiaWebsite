'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/** Bascule clair / sombre, mémorisée dans le navigateur. */
export default function BasculeTheme() {
  const [sombre, setSombre] = useState(false)

  useEffect(() => {
    setSombre(document.documentElement.classList.contains('dark'))
  }, [])

  const basculer = () => {
    const suivant = !sombre
    document.documentElement.classList.toggle('dark', suivant)
    try { localStorage.setItem('theme', suivant ? 'dark' : 'light') } catch {}
    setSombre(suivant)
  }

  return (
    <button
      onClick={basculer}
      className="rounded-xl p-2 texte-doux hover:text-bleu"
      aria-label={sombre ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {sombre ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  )
}
