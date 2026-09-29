import TexteLong from './TexteLong'

/** Page de texte légal (CGU, confidentialité) éditée depuis l'admin. */
export default function PageTexte({ titre, texte }: { titre: string; texte: string }) {
  return (
    <section className="conteneur max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold">{titre}</h1>
      <div className="mt-8">
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
