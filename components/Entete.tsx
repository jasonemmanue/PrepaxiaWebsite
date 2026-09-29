'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import BasculeTheme from './BasculeTheme'
import { lienAndroid, type Liens } from '@/lib/api'

const NAV = [
  { href: '/#concours', label: 'Concours' },
  { href: '/#fonctionnalites', label: 'Fonctionnalités' },
  { href: '/#tarifs', label: 'Tarifs' },
  { href: '/journal', label: 'Journal' },
  { href: '/#faq', label: 'FAQ' },
]

export default function Entete({ urlAppWeb, liens }: { urlAppWeb: string; liens: Liens }) {
  const [ouvert, setOuvert] = useState(false)
  const telecharger = lienAndroid(liens)

  return (
    <header className="sticky top-0 z-40 border-b bord backdrop-blur-xl entete-fond">
      <div className="conteneur flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg">
          <Image src="/logo.png" alt="" width={34} height={34} className="rounded-xl" priority />
          Prepaxia
        </Link>
        <nav className="hidden flex-1 justify-center gap-7 text-sm font-medium md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="texte-doux hover:text-bleu dark:hover:text-bleu-clair">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <BasculeTheme />
          {urlAppWeb && (
            <a href={urlAppWeb} className="hidden text-sm font-semibold sm:inline texte-doux hover:text-bleu px-2">
              Se connecter
            </a>
          )}
          {telecharger && (
            <a href={telecharger} className="bouton hidden !py-2 !px-4 text-sm sm:inline-flex">
              Télécharger
            </a>
          )}
          <button
            className="md:hidden rounded-xl p-2 texte-doux"
            onClick={() => setOuvert((v) => !v)}
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {ouvert ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {ouvert && (
        <nav className="conteneur flex flex-col gap-1 pb-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOuvert(false)}
              className="rounded-xl px-3 py-2.5 font-medium hover:bg-bleu/10">
              {n.label}
            </Link>
          ))}
          {urlAppWeb && (
            <a href={urlAppWeb} className="rounded-xl px-3 py-2.5 font-medium hover:bg-bleu/10">
              Se connecter à l&apos;app web
            </a>
          )}
          {telecharger && <a href={telecharger} className="bouton mt-2">Télécharger l&apos;application</a>}
        </nav>
      )}
    </header>
  )
}
