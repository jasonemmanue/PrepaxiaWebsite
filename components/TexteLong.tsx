// Rend un texte saisi dans l'admin : paragraphes séparés par une ligne vide,
// « ## » pour un titre, « - » pour une puce. Volontairement simple : le
// rédacteur n'a pas à connaître le HTML, et rien n'est injecté tel quel.
// (2026-10-05) « **gras** » : morceaux entre doubles astérisques en gras
// (texte React, jamais de HTML injecté).
// (2026-10-23) Police de lecture de la charte (Atkinson Hyperlegible), listes numérotées.
export function riche(t: string) {
  return t.split('**').map((morceau, k) => (k % 2 === 1 ? <strong key={k} className="text-ink">{morceau}</strong> : morceau))
}

export default function TexteLong({ texte }: { texte: string }) {
  const blocs = texte.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return (
    <div className="space-y-4 text-[1.0625rem] leading-[1.7]" style={{ fontFamily: 'var(--lecture), var(--police), sans-serif' }}>
      {blocs.map((b, i) => {
        if (b.startsWith('## ')) return <h2 key={i} className="pt-6 font-sans text-xl font-semibold text-ink">{b.slice(3)}</h2>
        if (b.startsWith('### ')) return <h3 key={i} className="pt-3 font-sans text-lg font-semibold text-ink">{b.slice(4)}</h3>
        const lignes = b.split('\n')
        if (lignes.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-6 texte-doux marker:text-lien">
              {lignes.map((l, j) => <li key={j}>{riche(l.trim().slice(2))}</li>)}
            </ul>
          )
        }
        if (lignes.every((l) => /^\d+\.\s/.test(l.trim()))) {
          return (
            <ol key={i} className="list-decimal space-y-1.5 pl-6 texte-doux marker:font-semibold marker:text-lien">
              {lignes.map((l, j) => <li key={j}>{riche(l.trim().replace(/^\d+\.\s/, ''))}</li>)}
            </ol>
          )
        }
        return <p key={i} className="texte-doux whitespace-pre-line">{riche(b)}</p>
      })}
    </div>
  )
}
