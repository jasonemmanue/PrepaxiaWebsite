import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { lireConcours, nomPropre } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Les concours préparés',
  description: 'Tous les concours et examens préparés sur Prepaxia, avec leurs matières.',
}

export default async function PageConcours() {
  const concours = await lireConcours()
  return (
    <section className="conteneur py-12 sm:py-16">
      <p className="surtitre">Concours et examens</p>
      <h1 className="titre-section">
        {concours.length > 0 ? `${concours.length} concours et examens préparés` : 'Concours et examens'}
      </h1>
      <p className="chapo">Chaque concours a son programme : ses matières, ses chapitres et ses annales.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {concours.map((c, i) => {
          const couleur = c.couleur_hex || '#2F5BEA'
          const matieres = Array.from(new Map(c.matieres.map((m) => [nomPropre(m.nom), m])).entries())
          return (
            <article key={c.id} className="apparition carte p-6 sm:p-7" style={{ ['--delai' as string]: `${(i % 2) * 90}ms` }}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold"
                  style={{ background: `${couleur}29`, color: couleur }}>
                  {nomPropre(c.nom).slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-tight">{nomPropre(c.nom)}</h2>
                  <p className="text-xs texte-discret">{c.type}</p>
                </div>
              </div>
              {c.description && <p className="mt-4 text-sm leading-relaxed texte-doux">{nomPropre(c.description)}</p>}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs texte-doux">
                <span className="inline-flex items-center gap-1.5"><BookOpen size={15} className="text-pilier-apprendre" />
                  {matieres.length} matière{matieres.length > 1 ? 's' : ''}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {matieres.map(([nom, m]) => (
                  <span key={nom} className="rounded-full border bord px-2.5 py-1 text-xs texte-doux">
                    {m.symbole ? `${m.symbole} ` : ''}{nom}
                  </span>
                ))}
              </div>
            </article>
          )
        })}
        {concours.length === 0 && (
          <p className="texte-doux">La liste des concours est momentanément indisponible.</p>
        )}
      </div>
      <div className="mt-10">
        <Link href="/#telecharger" className="bouton">Commencer ma préparation <ArrowRight size={18} /></Link>
      </div>
    </section>
  )
}
