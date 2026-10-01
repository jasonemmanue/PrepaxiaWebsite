'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import BasculeTheme from './BasculeTheme'
import { lienAndroid, type Liens } from '@/lib/api'

// Pages réelles en tête (2026-10-01) : concours ouverts (admin), CGU,
// confidentialité, puis les ancres de l'accueil.
const NAV = [
  { href: '/concours', label: 'Concours' },
  { href: '/#fonctionnalites', label: 'Fonctionnalités' },
  { href: '/#tarifs', label: 'Tarifs' },
  { href: '/journal', label: 'Journal' },
  { href: '/cgu', label: 'CGU' },
  { href: '/confidentialite', label: 'Confidentialité' },
]

/** Application web : lien de l'admin (« Site web »), sinon le vrai domaine. */
const APP_WEB_DEFAUT = 'https://www.webapp.prepaxia.com/'


export default function Entete({ urlAppWeb, liens }: { urlAppWeb: string; liens: Liens }) {
  const [ouvert, setOuvert] = useState(false)
  const telecharger = lienAndroid(liens)
  const appStore = liens.appstore_url || null
  const web = urlAppWeb || APP_WEB_DEFAUT

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
          {telecharger && (
            <a href={telecharger} className="bouton hidden !py-2 !px-3 text-xs lg:inline-flex">
              Play Store
            </a>
          )}
          {appStore && (
            <a href={appStore} className="bouton-neutre hidden !py-2 !px-3 text-xs lg:inline-flex">
              App Store
            </a>
          )}
          <a href={web} className="bouton-neutre hidden !py-2 !px-3 text-xs sm:inline-flex">
            Continuer sur le web
          </a>
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
          {telecharger && <a href={telecharger} className="bouton mt-2">Télécharger sur le Play Store</a>}
          {appStore && <a href={appStore} className="bouton-neutre mt-2">Télécharger sur l&apos;App Store</a>}
          <a href={web} className="bouton-neutre mt-2">Continuer sur le web</a>
        </nav>
      )}
    </header>
  )
}
