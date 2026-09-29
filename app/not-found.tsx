import Link from 'next/link'

export default function Introuvable() {
  return (
    <section className="conteneur py-32 text-center">
      <p className="text-6xl font-extrabold text-bleu">404</p>
      <h1 className="mt-4 text-2xl font-bold">Cette page n&apos;existe pas.</h1>
      <Link href="/" className="bouton mt-8">Retour à l&apos;accueil</Link>
    </section>
  )
}
