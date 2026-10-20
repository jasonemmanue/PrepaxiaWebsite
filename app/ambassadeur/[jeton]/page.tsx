// app/ambassadeur/[jeton]/page.tsx
// (2026-10-20) Espace privé d'un ambassadeur partenaire. L'adresse EST le secret :
// jamais indexée, jamais en cache, jamais transmise à un autre site (en-têtes
// posés dans next.config.mjs).
import type { Metadata } from 'next'
import EspaceAmbassadeur from '@/components/partenaires/EspaceAmbassadeur'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Mon espace ambassadeur',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
}

export default function PageEspace({ params }: { params: { jeton: string } }) {
  return (
    <section className="conteneur max-w-5xl py-10 sm:py-14">
      <EspaceAmbassadeur jeton={params.jeton} />
    </section>
  )
}
