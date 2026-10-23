import TexteLong from './TexteLong'

/** Page de texte (CGU, confidentialité, à propos…) éditée depuis l'admin. */
export default function PageTexte({ titre, texte, surtitre }: { titre: string; texte: string; surtitre?: string }) {
  return (
    <section className="conteneur max-w-3xl py-12 sm:py-16">
      {surtitre && <p className="surtitre">{surtitre}</p>}
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{titre}</h1>
      <div className="carte mt-8 p-6 sm:p-10">
        {texte ? (
          <TexteLong texte={texte} />
        ) : (
          <p className="texte-doux">
            Ce texte est en cours de publication. Il est aussi consultable dans
            l&apos;application, rubrique Paramètres.
          </p>
        )}
      </div>
    </section>
  )
}
