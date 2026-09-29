import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import TexteLong from '@/components/TexteLong'
import { lireArticle } from '@/lib/api'

export const revalidate = 300

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = await lireArticle(params.slug)
  return a ? { title: a.titre, description: a.resume ?? undefined } : { title: 'Article introuvable' }
}

export default async function PageArticle({ params }: { params: { slug: string } }) {
  const a = await lireArticle(params.slug)
  if (!a) notFound()
  return (
    <article className="conteneur max-w-3xl py-16">
      <Link href="/journal" className="inline-flex items-center gap-1 text-sm font-semibold text-bleu dark:text-bleu-clair">
        <ArrowLeft size={16} /> Le journal
      </Link>
      {a.categorie && <p className="mt-6 surtitre">{a.categorie}</p>}
      <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{a.titre}</h1>
      {a.publie_le && (
        <p className="mt-2 text-sm texte-doux">
          {new Date(a.publie_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
      {a.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.image_url} alt="" className="mt-8 w-full rounded-3xl" />
      )}
      {a.resume && <p className="mt-8 text-lg font-medium">{a.resume}</p>}
      <div className="mt-6">
        <TexteLong texte={a.contenu ?? ''} />
      </div>
    </article>
  )
}
