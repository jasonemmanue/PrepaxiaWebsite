'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Download, Menu, X } from 'lucide-react'
import BasculeTheme from './BasculeTheme'
import BadgesStores from './BadgesStores'
import type { LiensTelechargement } from '@/lib/api'

// (2026-10-23) En-tête en verre, comme la barre du haut de l'app (≥ 1024 px) ; menu plein
// en dessous, avec les trois badges de téléchargement. CGU et confidentialité : pied de page.
const NAV = [
  { href: '/#fonctionnalites', label: 'Fonctionnalités' },
  { href: '/#interfaces', label: 'Interfaces' },
  { href: '/#tuteurs-ia', label: 'Tuteurs IA' },
  { href: '/#tarifs', label: 'Tarifs' },
  { href: '/concours', label: 'Concours' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Entete({ liens, avecJournal }: { liens: LiensTelechargement; avecJournal: boolean }) {
  const [ouvert, setOuvert] = useState(false)
  const [defile, setDefile] = useState(false)
  const nav = avecJournal ? [...NAV, { href: '/journal', label: 'Journal' }] : NAV

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8)
    surDefilement()
    window.addEventListener('scroll', surDefilement, { passive: true })
    return () => window.removeEventListener('scroll', surDefilement)
  }, [])

  useEffect(() => {
    if (!ouvert) return
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && setOuvert(false)
    window.addEventListener('keydown', echap)
    return () => window.removeEventListener('keydown', echap)
  }, [ouvert])

  const fond = defile || ouvert
  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        fond ? 'border-b border-filet/70 bg-fond/80 shadow-doux backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="conteneur flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-lg font-bold" onClick={() => setOuvert(false)}>
          <Image src="/logo.png" alt="" width={36} height={36} className="rounded-[10px]" priority />
          Prepaxia
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium lg:flex" aria-label="Navigation principale">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className="group relative py-2 texte-doux transition-colors hover:text-ink">
              {n.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-marque transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <BasculeTheme />
          <Link href="/#telecharger" className="bouton hidden !rounded-xl !px-4 !py-2 text-sm sm:inline-flex">
            <Download size={16} /> Télécharger
          </Link>
          <button
            className="rounded-xl p-2 texte-doux transition-colors hover:text-ink lg:hidden"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {ouvert ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div
        id="menu-mobile"
        className={`grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${ouvert ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <nav className="conteneur flex flex-col gap-1 pb-6 pt-2" aria-label="Menu">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOuvert(false)} tabIndex={ouvert ? 0 : -1}
                className="rounded-xl px-3 py-3 font-medium transition-colors hover:bg-releve">
                {n.label}
              </Link>
            ))}
            <BadgesStores liens={liens} className="mt-4 px-1" />
          </nav>
        </div>
      </div>
    </header>
  )
}
