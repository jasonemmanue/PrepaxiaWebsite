'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Smartphone, Tablet } from 'lucide-react'
import Visuel, { FORMATS } from './Visuel'

// (2026-10-23) Interfaces de l'app : visuels des stores (vraies captures de l'app dans
// leur cadre), téléphone et tablette. Défilement au doigt, flèches au-dessus (jamais
// posées sur les images), légende sous chaque image.

export interface ItemGalerie { nom: string; titre: string; texte: string }
export interface GroupeGalerie { cle: 'tel' | 'tab'; libelle: string; items: ItemGalerie[] }

const LARGEURS = {
  tel: 'w-[64vw] max-w-[250px] sm:w-[232px] lg:w-auto lg:max-w-none lg:basis-[calc((100%-5rem)/5)]',
  tab: 'w-[78vw] max-w-[340px] sm:w-[320px] lg:w-auto lg:max-w-none lg:basis-[calc((100%-2.5rem)/3)]',
}
const TAILLES = {
  tel: '(min-width: 1024px) 230px, (min-width: 640px) 232px, 64vw',
  tab: '(min-width: 1024px) 370px, (min-width: 640px) 320px, 78vw',
}

export default function GalerieInterfaces({ groupes }: { groupes: GroupeGalerie[] }) {
  const [actif, setActif] = useState(0)
  const rail = useRef<HTMLDivElement>(null)
  const [bords, setBords] = useState({ gauche: false, droite: false })
  const groupe = groupes[actif]

  const mesurer = useCallback(() => {
    const r = rail.current
    if (!r) return
    setBords({ gauche: r.scrollLeft > 4, droite: r.scrollLeft + r.clientWidth < r.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    const r = rail.current
    if (!r) return
    r.scrollTo({ left: 0 })
    mesurer()
    r.addEventListener('scroll', mesurer, { passive: true })
    window.addEventListener('resize', mesurer)
    return () => { r.removeEventListener('scroll', mesurer); window.removeEventListener('resize', mesurer) }
  }, [actif, mesurer])

  const defiler = (sens: 1 | -1) => {
    const r = rail.current
    if (!r) return
    const carte = r.firstElementChild as HTMLElement | null
    r.scrollBy({ left: sens * ((carte?.offsetWidth ?? 260) + 20), behavior: 'smooth' })
  }

  if (!groupe) return null
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-2xl border bord bg-surface/70 p-1" role="tablist" aria-label="Appareil">
          {groupes.map((g, i) => (
            <button key={g.cle} role="tab" aria-selected={i === actif} onClick={() => setActif(i)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                i === actif ? 'bg-marque text-white shadow-marque' : 'texte-doux hover:text-ink'}`}>
              {g.cle === 'tel' ? <Smartphone size={16} /> : <Tablet size={16} />}
              {g.libelle}
            </button>
          ))}
        </div>
        <div className={`hidden gap-2 transition-opacity sm:flex ${bords.gauche || bords.droite ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <button onClick={() => defiler(-1)} disabled={!bords.gauche} aria-label="Images précédentes"
            className="flex h-11 w-11 items-center justify-center rounded-full border bord bg-surface/70 transition hover:border-marque disabled:opacity-35">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => defiler(1)} disabled={!bords.droite} aria-label="Images suivantes"
            className="flex h-11 w-11 items-center justify-center rounded-full border bord bg-surface/70 transition hover:border-marque disabled:opacity-35">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        key={groupe.cle}
        ref={rail}
        className="sans-barre -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {groupe.items.map((it, i) => (
          <figure key={it.nom} className={`entree group shrink-0 snap-start last:snap-end ${LARGEURS[groupe.cle]}`}
            style={{ animationDelay: `${i * 70}ms` }}>
            <div className="overflow-hidden rounded-[1.6rem] border bord bg-fond shadow-doux transition duration-500 group-hover:-translate-y-1.5 group-hover:border-marque/60">
              <Visuel nom={`${groupe.cle}-${it.nom}`} format={FORMATS[groupe.cle]} alt={it.titre}
                sizes={TAILLES[groupe.cle]} className="transition duration-700 group-hover:scale-[1.03]" />
            </div>
            <figcaption className="mt-4 px-1">
              <p className="font-semibold leading-snug">{it.titre}</p>
              <p className="mt-1 text-sm leading-relaxed texte-doux">{it.texte}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
