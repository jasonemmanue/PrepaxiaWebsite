import type { Metadata } from 'next'
import Link from 'next/link'
import { lireArticles } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Le journal',
  description: 'Dates, réformes, débouchés, bourses : ce qu’il faut savoir sur les concours.',
}

export default async function Journal() {
  const articles = await lireArticles(50)
  return (
    <section className="conteneur py-16">
      <p className="surtitre">Le journal</p>
      <h1 className="titre-section">Comprendre les concours, pas seulement les réviser.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.id} href={`/journal/${a.slug}`} className="carte group overflow-hidden transition hover:shadow-doux">
            {a.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.image_url} alt="" className="h-44 w-full object-cover" />
            )}
            <div className="p-6">
              {a.categorie && <p className="text-xs font-semibold text-bleu dark:text-bleu-clair">{a.categorie}</p>}
              <h2 className="mt-2 font-bold group-hover:text-bleu">{a.titre}</h2>
              {a.resume && <p className="mt-2 text-sm texte-doux">{a.resume}</p>}
            </div>
          </Link>
        ))}
      </div>
      {articles.length === 0 && <p className="mt-8 texte-doux">Les premiers articles arrivent bientôt.</p>}
    </section>
  )
}
