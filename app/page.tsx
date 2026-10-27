import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Check, ChevronDown, Gift, Mail, Sparkles } from 'lucide-react'
import BadgesStores from '@/components/BadgesStores'
import { Compteur } from '@/components/Animations'
import GalerieInterfaces, { type GroupeGalerie } from '@/components/GalerieInterfaces'
import Icone, { couleurPilier } from '@/components/Icone'
import Tarifs from '@/components/Tarifs'
import { riche } from '@/components/TexteLong'
import Visuel, { FORMATS } from '@/components/Visuel'
import {
  estBac, liensTelechargement, lireArticles, lireConcours, lireContenu, lireGrille, lireLiens,
  lirePlans, lireStats, lireVersion, nomPropre,
} from '@/lib/api'
import { construireOnglet, estPayant, estPlanBac, sansEmoji, type OngletTarifs } from '@/lib/tarifs'

export const revalidate = 300

const dateFr = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
const delai = (ms: number) => ({ '--delai': `${ms}ms` }) as CSSProperties

// Noms des fonctions de l'app (bande défilante), avec la couleur de leur pilier.
const FONCTIONS: [string, string][] = [
  ['Cours chapitre par chapitre', 'apprendre'], ['Quiz', 'entrainer'], ['Pièges à éviter', 'apprendre'],
  ['Exercices corrigés', 'entrainer'], ['Annales', 'entrainer'], ['Concours blancs', 'entrainer'],
  ['Bac blancs', 'entrainer'], ['Prepaxia AI', 'ia'], ['Prepaxia Corrector', 'ia'], ['Prepaxia Generator', 'ia'],
  ['Vidéos', 'apprendre'], ['Ressources PDF', 'apprendre'], ['Fil « Pour toi »', 'apprendre'],
  ['Mode Concentration', 'entrainer'], ['Série de jours', 'entrainer'], ['Classement', 'communaute'],
  ['Chat du concours', 'communaute'],
]
const POINT: Record<string, string> = {
  apprendre: 'bg-pilier-apprendre', entrainer: 'bg-pilier-entrainer', ia: 'bg-pilier-ia', communaute: 'bg-pilier-communaute',
}

// Légendes des visuels des stores (images livrées avec le site, voir CLAUDE.md « Visuels »).
const GALERIE: GroupeGalerie[] = [
  {
    cle: 'tel', libelle: 'Sur téléphone', items: [
      { nom: 'preparateur-ia', titre: 'Ton préparateur IA', texte: 'Annales, Generator et Corrector à portée de main.' },
      { nom: 'ce-qui-te-manque', titre: 'Apprendre', texte: 'Tes matières, ta progression et le fil « Pour toi ».' },
      { nom: 'attentes-du-jury', titre: 'Prepaxia AI', texte: 'Des réponses rédigées comme au concours, formules comprises.' },
      { nom: 'epreuves-inedites', titre: 'S\'entraîner', texte: 'Prochain concours blanc, annales et modes d\'entraînement.' },
      { nom: 'communaute', titre: 'Communauté', texte: 'Le classement de ton concours et le chat entre candidats.' },
    ],
  },
  {
    cle: 'tab', libelle: 'Sur tablette', items: [
      { nom: 'preparateur-ia', titre: 'S\'entraîner', texte: 'Concours blancs, annales et outils IA côte à côte.' },
      { nom: 'ce-qui-te-manque', titre: 'Apprendre', texte: 'Tes matières et le fil « Pour toi » en grand.' },
      { nom: 'corrector', titre: 'Prepaxia Corrector', texte: 'Photographie ta copie : la correction arrive rédigée.' },
      { nom: 'generator', titre: 'Prepaxia Generator', texte: 'Des épreuves inédites au format de ton concours.' },
      { nom: 'progres', titre: 'Ma progression', texte: 'Temps de travail, XP, rang et série de jours.' },
      { nom: 'communaute', titre: 'Communauté', texte: 'Classement, récompenses du mois et chat.' },
    ],
  },
]

/** Visuel de chaque tuteur IA, d'après son nom. */
const visuelTuteur = (titre: string) =>
  /corrector/i.test(titre) ? 'tel-corrector' : /generator/i.test(titre) ? 'tel-generator' : 'tel-reflechir'

export default async function Accueil() {
  const [contenu, stats, concours, liens, version, articles, plans] = await Promise.all([
    lireContenu(), lireStats(), lireConcours(), lireLiens(), lireVersion(), lireArticles(3), lirePlans(),
  ])
  const telechargement = liensTelechargement(version, contenu.url_app_web)
  const bac = concours.find(estBac)
  const unConcours = concours.find((c) => !estBac(c))
  const [grilleConcours, grilleBac] = await Promise.all([
    lireGrille(unConcours?.id), bac ? lireGrille(bac.id) : Promise.resolve(null),
  ])

  // ── Tarifs : un onglet par cible, prix et contenus réels ──
  const gratuit = plans.find((p) => !estPayant(p) && (p.duree_jours ?? 0) > 366)
  const essai = plans.find((p) => !estPayant(p) && (p.duree_jours ?? 0) > 0 && (p.duree_jours ?? 0) <= 31)
  const onglets: OngletTarifs[] = []
  const payantsConcours = plans.filter((p) => estPayant(p) && !estPlanBac(p))
  const payantsBac = plans.filter((p) => estPayant(p) && estPlanBac(p))
  if (payantsConcours.length) onglets.push(construireOnglet('concours', 'Concours', payantsConcours, grilleConcours, gratuit))
  if (payantsBac.length && grilleBac) onglets.push(construireOnglet('bac', 'BAC', payantsBac, grilleBac, gratuit))
  const notesTarifs = [
    grilleConcours.note,
    'Sur iPhone et iPad, l\'abonnement se prend sur la version Web / PC et s\'active aussitôt dans l\'app.',
    'Prix de la formule standard : un concours ou une série peut avoir son propre prix, toujours affiché dans l\'application avant le paiement.',
  ].filter((n): n is string => Boolean(n))

  // ── Outils IA proposés au BAC (lus dans la grille du BAC) ──
  const iaBac = (grilleBac?.categories ?? [])
    .flatMap((c) => c.lignes.map((l) => sansEmoji(l.libelle)))
    .filter((n) => /^Prepaxia (AI|Corrector|Generator)$/.test(n))

  const chiffres = [
    [stats.concours, 'concours et examens'],
    [stats.chapitres, 'chapitres de cours'],
    [stats.lecons ?? 0, 'leçons'],
    [stats.exercices ?? 0, 'exercices corrigés'],
    [stats.annales ?? 0, 'annales'],
    // (2026-10-24) Temps exact (même filtre que l'admin) : « X h Y min » plus bas.
    [(stats.heures_utilisation ?? 0) * 60 + (stats.minutes_utilisation ?? 0), 'de révision'],
    [stats.inscrits, 'élèves inscrits'],
  ].filter(([n]) => Number(n) > 0) as [number, string][]
  const colonnesChiffres = ['', '', '', 'sm:grid-cols-3 lg:grid-cols-3', 'sm:grid-cols-4 lg:grid-cols-4',
    'sm:grid-cols-3 lg:grid-cols-5', 'sm:grid-cols-3 lg:grid-cols-6', 'sm:grid-cols-4 lg:grid-cols-7'][chiffres.length] || 'sm:grid-cols-3'

  const tuteurs = contenu.tuteurs_ia ?? []
  const whatsapp = (liens.whatsapp_contact || '').replace(/[^\d]/g, '')
  const email = contenu.contact_email || liens.email_contact || 'assistanceprepaxia@gmail.com'

  return (
    <>
      {/* ── Héros ─────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="conteneur grid items-center gap-8 pb-8 pt-8 sm:pt-12 lg:grid-cols-[1.08fr_1fr] lg:gap-4 lg:pb-14 lg:pt-6">
          <div className="apparition">
            {contenu.bandeau && (
              <p className="pastille texte-doux">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ambre opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ambre" />
                </span>
                {contenu.bandeau}
              </p>
            )}
            <h1 className="mt-6 text-[2.4rem] font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4.1rem]">
              {contenu.hero_titre}
              <br />
              <span className="text-ambre-ink">{contenu.hero_titre_accent}</span>
            </h1>
            {contenu.hero_sous_titre && <p className="chapo">{contenu.hero_sous_titre}</p>}
            <BadgesStores liens={telechargement} className="mt-8" />
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm texte-doux">
              {essai && (
                <li className="flex items-center gap-1.5"><Check size={16} className="text-lien" />Essai gratuit de {essai.duree_jours} jours</li>
              )}
              <li className="flex items-center gap-1.5"><Check size={16} className="text-lien" />Android, iPhone, iPad et ordinateur</li>
              <li className="flex items-center gap-1.5"><Check size={16} className="text-lien" />Un seul compte partout</li>
            </ul>
          </div>
          <div className="apparition relative mx-auto w-full max-w-[560px] lg:max-w-none" style={delai(150)}>
            <div aria-hidden className="respire absolute inset-[12%] rounded-full bg-marque/30 blur-3xl" />
            <div className="flotte fondu relative">
              <Visuel nom="heros" format={FORMATS.heros} prioritaire
                alt="L'application Prepaxia : un chapitre de mathématiques, Corrector et tes points à revoir"
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 560px, 100vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Bande des fonctions ───────────────────────────────────────── */}
      <div className="bande-defilante overflow-hidden border-y bord bg-surface/40 py-4" aria-label="Fonctions de l'application">
        <div className="defile flex w-max gap-8 pr-8">
          {[0, 1].map((copie) => (
            <ul key={copie} className="flex shrink-0 gap-8" aria-hidden={copie === 1}>
              {FONCTIONS.map(([nom, pilier]) => (
                <li key={nom} className="flex items-center gap-2.5 whitespace-nowrap text-sm font-medium texte-doux">
                  <span className={`h-2 w-2 rounded-full ${POINT[pilier]}`} />{nom}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ── Chiffres réels (lus en base) ──────────────────────────────── */}
      {chiffres.length > 0 && (
        <section className="conteneur pt-12 sm:pt-16">
          <dl className={`apparition verre grid grid-cols-2 gap-x-4 gap-y-7 p-6 sm:p-8 ${colonnesChiffres}`}>
            {chiffres.map(([n, l]) => (
              <div key={l} className="text-center">
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="block text-3xl font-bold tracking-tight sm:text-4xl">
                    {l === 'de révision'
                      ? <><Compteur valeur={Math.floor(Number(n) / 60)} /> h {Number(n) % 60} min</>
                      : <Compteur valeur={Number(n)} />}
                  </span>
                  <span className="mt-1 block text-sm texte-doux">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ── Concours ──────────────────────────────────────────────────── */}
      {concours.length > 0 && (
        <section id="concours" className="conteneur section scroll-mt-20">
          <div className="apparition flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="surtitre">Concours et examens</p>
              <h2 className="titre-section max-w-2xl">Choisis ton concours, Prepaxia prépare le reste.</h2>
            </div>
            <Link href="/concours" className="inline-flex items-center gap-1.5 font-semibold text-lien transition-[gap] hover:gap-2.5">
              Voir le détail <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {concours.map((c, i) => {
              const couleur = c.couleur_hex || '#2F5BEA'
              const matieres = Array.from(new Set(c.matieres.map((m) => nomPropre(m.nom))))
              return (
                <article key={c.id} className="apparition carte flex flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-doux" style={delai(i * 80)}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
                      style={{ background: `${couleur}29`, color: couleur }}>
                      {nomPropre(c.nom).slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-tight">{nomPropre(c.nom)}</h3>
                      <p className="text-xs texte-discret">{c.type} · {matieres.length} matière{matieres.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {c.description && <p className="mt-4 line-clamp-2 text-sm leading-relaxed texte-doux">{nomPropre(c.description)}</p>}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {matieres.slice(0, 4).map((m) => (
                      <span key={m} className="rounded-full border bord px-2.5 py-1 text-xs texte-doux">{m}</span>
                    ))}
                    {matieres.length > 4 && (
                      <span className="rounded-full bg-releve px-2.5 py-1 text-xs font-medium texte-doux">+{matieres.length - 4}</span>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Fonctionnalités ───────────────────────────────────────────── */}
      {contenu.fonctionnalites.length > 0 && (
        <section id="fonctionnalites" className="conteneur section scroll-mt-20 !pt-0">
          <div className="apparition">
            <p className="surtitre">Ce que fait Prepaxia</p>
            <h2 className="titre-section max-w-2xl">Travailler sérieusement, sans se disperser.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contenu.fonctionnalites.map((f, i) => (
              <article key={f.titre} className="apparition carte group flex gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:border-marque/50 hover:shadow-doux sm:block sm:p-6" style={delai((i % 3) * 80)}>
                <span className={`tuile transition-transform duration-300 group-hover:scale-110 ${couleurPilier(f.icone)}`}>
                  <Icone nom={f.icone} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug sm:mt-5">{f.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed texte-doux">{f.texte}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Interfaces de l'application ───────────────────────────────── */}
      <section id="interfaces" className="section scroll-mt-20 border-y bord bg-surface/40">
        <div className="conteneur">
          <div className="apparition">
            <p className="surtitre">L&apos;application en images</p>
            <h2 className="titre-section max-w-3xl">Des écrans pensés pour réviser vite et bien.</h2>
            <p className="chapo">
              Les vrais écrans de Prepaxia, sur téléphone et sur tablette. Le site suit ton thème : passe en mode clair
              ou sombre pour voir les deux versions de l&apos;app.
            </p>
          </div>
          <div className="apparition mt-8" style={delai(120)}>
            <GalerieInterfaces groupes={GALERIE} />
          </div>
        </div>
      </section>

      {/* ── Tuteurs IA ────────────────────────────────────────────────── */}
      {tuteurs.length > 0 && (
        <section id="tuteurs-ia" className="conteneur section scroll-mt-20">
          <div className="apparition mx-auto max-w-3xl text-center">
            <p className="surtitre !text-pilier-ia">Tuteurs IA</p>
            <h2 className="titre-section">{contenu.tuteurs_titre || 'Des tuteurs IA qui te font progresser'}</h2>
            {contenu.tuteurs_sous_titre && <p className="chapo mx-auto">{contenu.tuteurs_sous_titre}</p>}
          </div>
          <div className="mt-10 space-y-12 lg:mt-16 lg:space-y-20">
            {tuteurs.map((t, i) => (
              <div key={t.titre} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                i % 2 ? 'md:grid-cols-[230px_minmax(0,1fr)]' : 'md:grid-cols-[minmax(0,1fr)_230px]'}`}>
                <div className={`apparition ${i % 2 ? 'md:order-2' : ''}`}>
                  <span className="tuile text-pilier-ia"><Icone nom={t.icone} /></span>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{t.titre}</h3>
                  {t.texte && <p className="mt-3 text-base leading-relaxed texte-doux sm:text-lg">{t.texte}</p>}
                  {(t.points ?? '').trim() && (
                    <ul className="mt-6 space-y-3">
                      {(t.points ?? '').split('\n').map((p) => p.trim()).filter(Boolean).map((p) => (
                        <li key={p} className="flex gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pilier-ia/15 text-pilier-ia">
                            <Check size={14} strokeWidth={3} />
                          </span>
                          <span className="leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={`apparition relative mx-auto w-full max-w-[230px] lg:max-w-[290px] ${i % 2 ? 'md:order-1' : ''}`} style={delai(120)}>
                  <div aria-hidden className="respire absolute -inset-8 rounded-full bg-pilier-ia/25 blur-3xl" />
                  <div className={`relative overflow-hidden rounded-[2rem] border bord shadow-doux ${i % 2 ? 'flotte-lente' : 'flotte'}`}>
                    <Visuel nom={visuelTuteur(t.titre)} format={FORMATS.tel} alt={t.titre}
                      sizes="(min-width: 1024px) 290px, 230px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(contenu.tuteurs_note || (bac && iaBac.length > 0)) && (
            <div className="apparition verre mx-auto mt-14 flex max-w-3xl gap-4 p-5 sm:p-6">
              <Sparkles size={22} className="mt-0.5 shrink-0 text-pilier-ia" />
              <div className="space-y-1.5 text-sm leading-relaxed texte-doux">
                {contenu.tuteurs_note && <p>{contenu.tuteurs_note}</p>}
                {bac && iaBac.length > 0 && iaBac.length < 3 && (
                  <p>Au BAC : {iaBac.join(', ')} seulement.</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Comment ça marche ─────────────────────────────────────────── */}
      {contenu.etapes.length > 0 && (
        <section className="conteneur section !pt-0">
          <div className="apparition">
            <p className="surtitre">Comment ça marche</p>
            <h2 className="titre-section">{contenu.etapes.length} étapes, et tu es lancé.</h2>
          </div>
          <ol className="relative mt-10 grid gap-5 md:grid-cols-3">
            <span aria-hidden className="absolute left-[16%] right-[16%] top-[2.6rem] hidden h-px bg-gradient-to-r from-transparent via-marque/60 to-transparent md:block" />
            {contenu.etapes.map((e, i) => (
              <li key={e.titre} className="apparition carte relative flex gap-4 p-5 sm:p-6 md:block" style={delai(i * 100)}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marque text-lg font-bold text-white shadow-marque">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold md:mt-5">{e.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed texte-doux">{e.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Témoignages (seulement s'il y en a de réels) ──────────────── */}
      {contenu.temoignages.length > 0 && (
        <section className="conteneur section !pt-0">
          <p className="surtitre apparition">Ils préparent avec Prepaxia</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {contenu.temoignages.map((t, i) => (
              <figure key={t.nom} className="apparition carte flex flex-col p-6" style={delai(i * 80)}>
                <blockquote className="flex-1 leading-relaxed">« {t.texte} »</blockquote>
                <div className="mt-5 flex items-center gap-3">
                  {t.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photo} alt={t.nom} className="h-11 w-11 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marque font-bold text-white">
                      {(t.nom || '?').trim().charAt(0).toUpperCase()}
                    </span>
                  )}
                  <figcaption className="text-sm font-semibold">
                    {t.nom}{t.role ? <span className="block font-normal texte-doux">{t.role}</span> : null}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── Tarifs (prix et contenus réels) ───────────────────────────── */}
      {onglets.length > 0 && (
        <section id="tarifs" className="section scroll-mt-20 border-y bord bg-surface/40">
          <div className="conteneur">
            <div className="apparition">
              <p className="surtitre">Tarifs</p>
              <h2 className="titre-section">{grilleConcours.titre || 'Passe à la vitesse supérieure'}</h2>
              <p className="chapo">Commence gratuitement. Les prix ci-dessous sont ceux de l&apos;application, en FCFA.</p>
            </div>
            {essai && (
              <div className="apparition verre mt-8 flex gap-4 p-5 sm:items-center sm:p-6" style={delai(80)}>
                <span className="tuile text-pilier-entrainer"><Gift size={22} /></span>
                <p className="text-sm leading-relaxed texte-doux sm:text-base">
                  <strong className="text-ink">Essai gratuit de {essai.duree_jours} jours</strong>, une seule fois par
                  appareil, depuis l&apos;application Android ou iPhone : le 1er chapitre de chaque matière dans
                  tous les concours et examens, avec des crédits IA offerts les premiers jours. Formule Classique :
                  les 3 premiers chapitres de chaque matière ; formules Premium : tous les chapitres.
                </p>
              </div>
            )}
            <div className="apparition mt-8" style={delai(120)}>
              <Tarifs onglets={onglets} notes={notesTarifs} />
            </div>
          </div>
        </section>
      )}

      {/* ── Journal ───────────────────────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="conteneur section">
          <div className="apparition flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="surtitre">Le journal</p>
              <h2 className="titre-section">Comprendre les concours, pas seulement les réviser.</h2>
            </div>
            <Link href="/journal" className="inline-flex items-center gap-1.5 font-semibold text-lien">
              Tous les articles <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {articles.map((a, i) => (
              <Link key={a.id} href={`/journal/${a.slug}`} className="apparition carte group overflow-hidden transition hover:shadow-doux" style={delai(i * 80)}>
                {a.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image_url} alt="" className="h-44 w-full object-cover" />
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold text-lien">{[a.categorie, dateFr(a.publie_le)].filter(Boolean).join(' · ')}</p>
                  <h3 className="mt-2 font-semibold group-hover:text-lien">{a.titre}</h3>
                  {a.resume && <p className="mt-2 line-clamp-3 text-sm texte-doux">{a.resume}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      {contenu.faq.length > 0 && (
        <section id="faq" className="conteneur section scroll-mt-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div className="apparition">
              <p className="surtitre">Questions fréquentes</p>
              <h2 className="titre-section">Tout ce qu&apos;il faut savoir.</h2>
              <p className="chapo">Une autre question ? L&apos;assistance Prepaxia te répond.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} className="bouton !py-3 text-sm" target="_blank" rel="noopener noreferrer">
                    Écrire sur WhatsApp
                  </a>
                )}
                <a href={`mailto:${email}`} className="bouton-neutre !py-3 text-sm"><Mail size={16} />Par e-mail</a>
              </div>
            </div>
            <div className="space-y-3">
              {contenu.faq.map((q, i) => (
                <details key={q.question} className="apparition carte group overflow-hidden" style={delai(i * 60)}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold transition-colors hover:text-lien sm:px-6">
                    {q.question}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-releve transition-transform duration-300 group-open:rotate-180">
                      <ChevronDown size={18} />
                    </span>
                  </summary>
                  <p className="px-5 pb-5 leading-relaxed texte-doux sm:px-6">{riche(q.reponse)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Télécharger ───────────────────────────────────────────────── */}
      <section id="telecharger" className="conteneur scroll-mt-20 pb-14 sm:pb-20">
        <div className="apparition relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-marque via-marque-fonce to-marque-nuit p-7 text-white shadow-marque sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:p-14">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">Télécharger Prepaxia</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Ta préparation tient dans ta poche.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/85">
              Installe Prepaxia, choisis ton concours ou ton examen et commence en quelques minutes.
              {essai ? ` Essai gratuit de ${essai.duree_jours} jours, une seule fois par appareil, valable dans tous les concours et examens.` : ''}
            </p>
            <BadgesStores liens={telechargement} className="mt-8" />
          </div>
          {/* Formes de la charte graphique (couverture), à côté du texte, jamais dessous. */}
          <div aria-hidden className="relative mx-auto hidden h-64 w-full max-w-[320px] lg:block">
            <span className="flotte absolute left-[6%] top-0 h-[78%] w-[22%] rounded-full bg-white/15" />
            <span className="flotte-lente absolute right-[4%] top-[2%] h-[40%] w-[18%] rounded-b-full bg-bleu-ciel" />
            <span className="tourne absolute right-[30%] top-[18%] h-24 w-24 rounded-full border-[10px] border-ambre p-[10px] sm:h-28 sm:w-28">
              <span className="block h-full w-full rounded-full border-[8px] border-ambre" />
            </span>
            <span className="flotte absolute bottom-[12%] right-0 h-[22%] w-[52%] rounded-l-full bg-pilier-ia" />
            <span className="flotte-lente absolute bottom-0 left-[38%] h-9 w-9 rounded-full bg-pilier-communaute" />
            <Image src="/logo.png" alt="" width={84} height={84} className="flotte absolute bottom-[26%] left-[10%] rounded-[22px] shadow-doux" />
          </div>
        </div>
      </section>
    </>
  )
}
