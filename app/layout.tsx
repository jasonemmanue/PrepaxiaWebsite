import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Entete from '@/components/Entete'
import PiedDePage from '@/components/PiedDePage'
import { lireContenu, lireLiens } from '@/lib/api'

const police = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--police',
  display: 'swap',
})

const SITE = process.env.SITE_URL || 'https://prepaxia.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Prepaxia — prépare ton concours avec méthode',
    template: '%s · Prepaxia',
  },
  description:
    'Cours, annales corrigées, simulations chronométrées et Prepaxia AI : la préparation aux concours ENSEA, ISE, INPHB, ESATIC, ENS et au BAC ivoirien.',
  openGraph: {
    type: 'website',
    siteName: 'Prepaxia',
    locale: 'fr_FR',
    images: [{ url: '/logo.png', width: 512, height: 512 }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F7FF' },
    { media: '(prefers-color-scheme: dark)', color: '#061446' },
  ],
}

// Applique le thème AVANT le premier rendu : sinon la page clignote en clair
// puis passe en sombre.
const scriptTheme = `(function(){try{var t=localStorage.getItem('theme');
var s=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
if(s==='dark')document.documentElement.classList.add('dark');}catch(e){}})()`

export default async function Racine({ children }: { children: React.ReactNode }) {
  const [contenu, liens] = await Promise.all([lireContenu(), lireLiens()])
  return (
    <html lang="fr" className={police.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body className="font-sans antialiased">
        <Entete urlAppWeb={contenu.url_app_web} liens={liens} />
        <main>{children}</main>
        <PiedDePage contenu={contenu} liens={liens} />
      </body>
    </html>
  )
}
