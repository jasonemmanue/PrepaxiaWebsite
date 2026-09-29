import type { Metadata } from 'next'
import { lireConcours } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Les concours préparés',
  description: 'Tous les concours et examens préparés sur Prepaxia, avec leurs matières.',
}

export default async function PageConcours() {
  const concours = await lireConcours()
  return (
    <section className="conteneur py-16">
      <p className="surtitre">Concours préparés</p>
      <h1 className="titre-section">{concours.length} concours et examens</h1>
      <p className="mt-3 max-w-2xl texte-doux">
        Chaque concours a son programme : ses matières, ses chapitres et ses annales.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {concours.map((c) => (
          <article key={c.id} className="carte p-7">
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl font-extrabold"
                style={{ background: `${c.couleur_hex ?? '#0F4FE0'}26`, color: c.couleur_hex ?? '#0F4FE0' }}
              >
                {c.nom.slice(0, 1)}
              </span>
              <div>
                <h2 className="text-lg font-bold">{c.nom}</h2>
                <p className="text-xs texte-doux">
                  {c.type} · {c.matieres.length} matière{c.matieres.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {c.description && <p className="mt-4 text-sm leading-relaxed texte-doux">{c.description}</p>}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.matieres.map((m) => (
                <span key={m.id} className="rounded-full border bord px-2.5 py-1 text-xs texte-doux">
                  {m.symbole ? `${m.symbole} ` : ''}{m.nom}
                </span>
              ))}
            </div>
          </article>
        ))}
        {concours.length === 0 && (
          <p className="texte-doux">La liste des concours est momentanément indisponible.</p>
        )}
      </div>
    </section>
  )
}
