// (2026-10-23) Visuel de l'app (images des stores, `public/visuels/`), en version sombre ET
// claire : le thème choisi n'affiche que la bonne (classes .visuel-sombre / .visuel-clair).
// Fichiers : `<nom>-<sombre|clair>-<largeur>.webp`, générés depuis les images des stores
// (voir CLAUDE.md, « Visuels »).

export interface FormatVisuel { largeurs: [number, number]; l: number; h: number }

export const FORMATS = {
  heros: { largeurs: [640, 1200], l: 2580, h: 2420 },
  tel: { largeurs: [420, 760], l: 1290, h: 2796 },
  tab: { largeurs: [480, 960], l: 2064, h: 2752 },
} satisfies Record<string, FormatVisuel>

export default function Visuel({
  nom, format, alt, sizes, className = '', prioritaire = false,
}: {
  nom: string
  format: FormatVisuel
  alt: string
  sizes: string
  className?: string
  prioritaire?: boolean
}) {
  const [petit, grand] = format.largeurs
  return (
    <>
      {(['sombre', 'clair'] as const).map((theme) => {
        const src = (l: number) => `/visuels/${nom}-${theme}-${l}.webp`
        // Le sombre est le thème par défaut : seul lui est chargé en priorité.
        const tot = prioritaire && theme === 'sombre'
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={theme}
            src={src(grand)}
            srcSet={`${src(petit)} ${petit}w, ${src(grand)} ${grand}w`}
            sizes={sizes}
            width={format.l}
            height={format.h}
            alt={alt}
            loading={tot ? 'eager' : 'lazy'}
            decoding="async"
            {...((tot ? { fetchpriority: 'high' } : {}) as Record<string, string>)}
            className={`visuel-${theme} h-auto w-full ${className}`}
          />
        )
      })}
    </>
  )
}
