'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// (2026-10-23) Animations du site, toutes désactivées par « Réduire les animations »
// (prefers-reduced-motion) : voir app/globals.css.

/** Fait apparaître au défilement chaque élément `.apparition` (rendu serveur) en lui
 *  ajoutant la classe `vu`. Monté une fois dans le layout ; relance à chaque page. */
export function ObservateurApparition() {
  const chemin = usePathname()
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.apparition:not(.vu)'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((e) => e.classList.add('vu'))
      return
    }
    const obs = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('vu')
          obs.unobserve(e.target)
        }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    elements.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [chemin])
  return null
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Chiffre qui défile de 0 à sa valeur quand il entre à l'écran. Le serveur rend la vraie
 *  valeur (lisible sans JavaScript) ; déjà visible au chargement, il ne bouge pas. */
export function Compteur({ valeur }: { valeur: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [affiche, setAffiche] = useState(valeur)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el || valeur <= 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) return
    setAffiche(0)
    let image = 0
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const debut = performance.now()
      const duree = 1400
      const pas = (t: number) => {
        const p = Math.min(1, (t - debut) / duree)
        setAffiche(Math.round(valeur * (1 - Math.pow(1 - p, 3))))
        if (p < 1) image = requestAnimationFrame(pas)
      }
      image = requestAnimationFrame(pas)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => { obs.disconnect(); cancelAnimationFrame(image) }
  }, [valeur])

  return <span ref={ref}>{affiche.toLocaleString('fr-FR')}</span>
}
