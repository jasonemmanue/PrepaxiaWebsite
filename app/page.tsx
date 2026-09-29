import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import BoutonsStores from '@/components/BoutonsStores'
import Icone from '@/components/Icone'
import {
  lireArticles, lireConcours, lireContenu, lireLiens, lirePlans, lireStats,
} from '@/lib/api'

export const revalidate = 300

const fcfa = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`
const dateFr = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

export default async function Accueil() {
  const [contenu, stats, concours, liens, articles, plans] = await Promise.all([
    lireContenu(), lireStats(), lireConcours(), lireLiens(), lireArticles(3), lirePlans(),
  ])
  const payants = plans.filter((p) => p.prix_fcfa > 0)

  return (
    <>
      {/* ── Héros ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="vague pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-bleu/15 blur-3xl dark:bg-bleu/25" />
        <div aria-hidden className="vague-lente pointer-events-none absolute -bottom-48 -right-40 h-[560px] w-[560px] rounded-full bg-bleu-ciel/20 blur-3xl" />
        <div className="conteneur relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            {contenu.bandeau && (
              <span className="inline-flex rounded-full border bord px-3.5 py-1.5 text-xs font-semibold text-bleu dark:text-bleu-clair carte !rounded-full">
                {contenu.bandeau}
              </span>
            )}
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-6xl">
              {contenu.hero_titre}
              <br />
              <span className="text-bleu dark:text-bleu-clair">{contenu.hero_titre_accent}</span>
            </h1>
            {contenu.hero_sous_titre && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed texte-doux">{contenu.hero_sous_titre}</p>
            )}
            <div className="mt-8">
              <BoutonsStores liens={liens} urlAppWeb={contenu.url_app_web} />
            </div>
            {/* Chiffres lus en base : aucun ne peut être inventé. */}
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                [stats.inscrits, 'candidats inscrits'],
                [stats.concours, 'concours couverts'],
                [stats.chapitres, 'chapitres de cours'],
              ].map(([n, l]) => (
                <div key={String(l)} className="carte px-4 py-3">
                  <dt className="text-2xl font-extrabold">{Number(n).toLocaleString('fr-FR')}</dt>
                  <dd className="text-xs texte-doux">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Maquettes de l'application */}
          <div className="relative mx-auto h-[520px] w-full max-w-md">
            <Telephone src="/ecrans/statistiques.jpg" className="absolute left-0 top-12 w-[46%] -rotate-6 opacity-90" />
            <Telephone src="/ecrans/onboarding.jpg" className="absolute left-1/2 top-0 z-10 w-[52%] -translate-x-1/2" />
            <Telephone src="/ecrans/connexion.jpg" className="absolute right-0 top-12 w-[46%] rotate-6 opacity-90" />
          </div>
        </div>
      </section>

      {/* ── Concours ──────────────────────────────────────────────────── */}
      {concours.length > 0 && (
        <section id="concours" className="conteneur scroll-mt-24 py-16">
          <p className="surtitre">Concours préparés</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="titre-section max-w-2xl">Choisis ton concours, Prepaxia prépare le reste.</h2>
            <Link href="/concours" className="inline-flex items-center gap-1 font-semibold text-bleu dark:text-bleu-clair">
              Voir les {concours.length} concours <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {concours.slice(0, 6).map((c) => (
              <article key={c.id} className="carte p-6 transition hover:-translate-y-1 hover:shadow-doux">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-2xl" style={{ background: `${c.couleur_hex ?? '#0F4FE0'}26` }}>
                    <span className="flex h-full items-center justify-center font-extrabold" style={{ color: c.couleur_hex ?? '#0F4FE0' }}>
                      {c.nom.slice(0, 1)}
                    </span>
                  </span>
                  <div>
                    <h3 className="font-bold leading-tight">{c.nom}</h3>
                    <p className="text-xs texte-doux">{c.type}</p>
                  </div>
                </div>
                {c.description && <p className="mt-4 text-sm leading-relaxed texte-doux">{c.description}</p>}
                {c.matieres.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.matieres.slice(0, 5).map((m) => (
                      <span key={m.id} className="rounded-full border bord px-2.5 py-1 text-xs texte-doux">
                        {m.symbole ? `${m.symbole} ` : ''}{m.nom}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Fonctionnalités ───────────────────────────────────────────── */}
      {contenu.fonctionnalites.length > 0 && (
        <section id="fonctionnalites" className="conteneur scroll-mt-24 py-16">
          <p className="surtitre">Ce que fait Prepaxia</p>
          <h2 className="titre-section max-w-2xl">Travailler sérieusement, sans se disperser.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {contenu.fonctionnalites.map((f) => (
              <div key={f.titre} className="carte flex gap-4 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bleu text-white shadow-doux">
                  <Icone nom={f.icone} />
                </span>
                <div>
                  <h3 className="font-bold">{f.titre}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed texte-doux">{f.texte}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Comment ça marche ─────────────────────────────────────────── */}
      {contenu.etapes.length > 0 && (
        <section className="conteneur py-16">
          <p className="surtitre">Comment ça marche</p>
          <h2 className="titre-section">{contenu.etapes.length} étapes, et tu es lancé.</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {contenu.etapes.map((e, i) => (
              <li key={e.titre} className="carte p-6">
                <span className="text-4xl font-extrabold text-bleu/30 dark:text-bleu-clair/40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-bold">{e.titre}</h3>
                <p className="mt-1.5 text-sm leading-relaxed texte-doux">{e.texte}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Élèves ────────────────────────────────────────────────────── */}
      <section className="conteneur py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-3xl">
              <Image src={`/eleve_${i}.jpg`} alt="Élève en préparation" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Témoignages ───────────────────────────────────────────────── */}
      {contenu.temoignages.length > 0 && (
        <section className="conteneur py-16">
          <p className="surtitre">Ils préparent avec Prepaxia</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {contenu.temoignages.map((t) => (
              <figure key={t.nom} className="carte p-6">
                <blockquote className="leading-relaxed">« {t.texte} »</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">
                  {t.nom}{t.role ? <span className="font-normal texte-doux"> — {t.role}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── Tarifs ────────────────────────────────────────────────────── */}
      {payants.length > 0 && (
        <section id="tarifs" className="conteneur scroll-mt-24 py-16">
          <p className="surtitre">Tarifs</p>
          <h2 className="titre-section">Commence gratuitement, passe Premium quand tu veux.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {payants.map((p) => (
              <div key={p.id} className="carte flex flex-col p-6">
                <h3 className="font-bold">{p.nom}</h3>
                <p className="mt-3 text-3xl font-extrabold">{fcfa(p.prix_fcfa)}</p>
                {p.duree_jours ? (
                  <p className="text-sm texte-doux">pour {p.duree_jours >= 360 ? '1 an' : `${p.duree_jours} jours`}</p>
                ) : null}
                <ul className="mt-5 space-y-2 text-sm">
                  {(p.avantages ?? []).map((a) => (
                    <li key={a} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-bleu" />{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm texte-doux">Paiement par Mobile Money (Orange, MTN, Moov, Wave) dans l&apos;application.</p>
        </section>
      )}

      {/* ── Journal ───────────────────────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="conteneur py-16">
          <p className="surtitre">Le journal</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="titre-section">Comprendre les concours, pas seulement les réviser.</h2>
            <Link href="/journal" className="inline-flex items-center gap-1 font-semibold text-bleu dark:text-bleu-clair">
              Tous les articles <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/journal/${a.slug}`} className="carte group overflow-hidden transition hover:shadow-doux">
                {a.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image_url} alt="" className="h-44 w-full object-cover" />
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold text-bleu dark:text-bleu-clair">
                    {[a.categorie, dateFr(a.publie_le)].filter(Boolean).join(' · ')}
                  </p>
                  <h3 className="mt-2 font-bold group-hover:text-bleu">{a.titre}</h3>
                  {a.resume && <p className="mt-2 text-sm texte-doux line-clamp-3">{a.resume}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      {contenu.faq.length > 0 && (
        <section id="faq" className="conteneur scroll-mt-24 py-16">
          <p className="surtitre">Questions fréquentes</p>
          <h2 className="titre-section">Tout ce qu&apos;il faut savoir.</h2>
          <div className="mt-8 space-y-3">
            {contenu.faq.map((q) => (
              <details key={q.question} className="carte group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q.question}
                  <ChevronDown size={18} className="shrink-0 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed texte-doux">{q.reponse}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── Appel final ───────────────────────────────────────────────── */}
      <section className="conteneur py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-bleu-fonce via-bleu to-bleu-ciel p-10 text-white sm:p-14">
          <div aria-hidden className="vague absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">Application mobile</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
            Ta préparation tient dans ton téléphone.
          </h2>
          <p className="mt-4 max-w-xl text-white/85">
            Installe Prepaxia, choisis ton concours et commence en quelques minutes. Sept jours
            Premium offerts à l&apos;inscription.
          </p>
          <div className="mt-8 [&_.bouton-neutre]:bg-white/10 [&_.bouton-neutre]:text-white [&_.bouton-neutre]:border-white/30 [&_.bouton]:bg-white [&_.bouton]:text-bleu-fonce">
            <BoutonsStores liens={liens} urlAppWeb={contenu.url_app_web} />
          </div>
        </div>
      </section>
    </>
  )
}

function Telephone({ src, className }: { src: string; className?: string }) {
  return (
    <div className={`rounded-[2.2rem] border-[6px] border-encre bg-encre p-0 shadow-doux dark:border-black ${className ?? ''}`}>
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.8rem]">
        <Image src={src} alt="Écran de l'application Prepaxia" fill sizes="240px" className="object-cover object-top" />
      </div>
    </div>
  )
}
