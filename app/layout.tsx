import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible, Poppins } from 'next/font/google'
import './globals.css'
import Entete from '@/components/Entete'
import PiedDePage from '@/components/PiedDePage'
import { ObservateurApparition } from '@/components/Animations'
import { liensTelechargement, lireArticles, lireContenu, lireLiens, lireVersion } from '@/lib/api'

// Polices de la charte : Poppins pour l'interface, Atkinson Hyperlegible pour les longs textes.
const police = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--police',
  display: 'swap',
})
const lecture = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--lecture',
  display: 'swap',
  preload: false,
})

const SITE = process.env.SITE_URL || 'https://www.prepaxia.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Prepaxia : ton préparateur IA pour le concours et le BAC',
    template: '%s · Prepaxia',
  },
  description:
    'Cours, quiz, annales, concours blancs corrigés et tuteurs IA (Prepaxia AI, Prepaxia Corrector, Prepaxia Generator) pour préparer le BAC ivoirien et les concours de l\'ENSEA. Sur Android, iPhone, iPad et ordinateur.',
  openGraph: { type: 'website', siteName: 'Prepaxia', locale: 'fr_FR' },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F7FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1238' },
  ],
}

// Avant le premier rendu : thème sombre par défaut (comme l'app), clair si l'élève l'a
// choisi ; classe « js » pour les animations d'apparition (sans JS, tout reste visible).
const scriptTheme = `(function(){var d=document.documentElement;d.classList.add('js');
try{if(localStorage.getItem('theme')==='light')d.classList.remove('dark');}catch(e){}})()`

export default async function Racine({ children }: { children: React.ReactNode }) {
  const [contenu, liens, version, articles] = await Promise.all([
    lireContenu(), lireLiens(), lireVersion(), lireArticles(1),
  ])
  const telechargement = liensTelechargement(version, contenu.url_app_web)
  const avecJournal = articles.length > 0
  return (
    <html lang="fr" className={`dark ${police.variable} ${lecture.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body className="font-sans antialiased">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-marque focus:px-4 focus:py-2 focus:text-white">
          Aller au contenu
        </a>
        <Entete liens={telechargement} avecJournal={avecJournal} />
        <main id="contenu">{children}</main>
        <PiedDePage contenu={contenu} liens={liens} telechargement={telechargement} avecJournal={avecJournal} />
        <ObservateurApparition />
      </body>
    </html>
  )
}
