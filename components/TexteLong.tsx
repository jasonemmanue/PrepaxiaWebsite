// Rend un texte saisi dans l'admin : paragraphes séparés par une ligne vide,
// « ## » pour un titre, « - » pour une puce. Volontairement simple : le
// rédacteur n'a pas à connaître le HTML, et rien n'est injecté tel quel.
// (2026-10-05) « **gras** » : morceaux entre doubles astérisques en gras
// (texte React, jamais de HTML injecté).
function riche(t: string) {
  return t.split('**').map((morceau, k) => (k % 2 === 1 ? <strong key={k}>{morceau}</strong> : morceau))
}

export default function TexteLong({ texte }: { texte: string }) {
  const blocs = texte.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return (
    <div className="space-y-4 leading-relaxed">
      {blocs.map((b, i) => {
        if (b.startsWith('## ')) return <h2 key={i} className="pt-4 text-xl font-bold">{b.slice(3)}</h2>
        if (b.startsWith('### ')) return <h3 key={i} className="pt-2 text-lg font-bold">{b.slice(4)}</h3>
        const lignes = b.split('\n')
        if (lignes.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-6 texte-doux">
              {lignes.map((l, j) => <li key={j}>{riche(l.trim().slice(2))}</li>)}
            </ul>
          )
        }
        return <p key={i} className="texte-doux whitespace-pre-line">{riche(b)}</p>
      })}
    </div>
  )
}
