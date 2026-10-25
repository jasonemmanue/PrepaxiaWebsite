// app/remboursement/page.tsx
// (2026-10-24) Politique de remboursement (erreurs seulement). Texte modifiable dans l'admin → Site web ; repli ici.
import type { Metadata } from 'next'
import PageTexte from '@/components/PageTexte'
import { lireContenu } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Politique de remboursement',
  description: 'Dans quels cas un achat Prepaxia est remboursé.',
}

const TEXTE = `Un achat activé sur ton compte est définitif, sauf dans ces cas :

- **Double débit** pour le même achat ;
- **Paiement débité sans activation** dans l'application ;
- **Erreur technique de Prepaxia** qui t'empêche d'utiliser ce que tu as payé.

## Comment demander

Dans les **14 jours** qui suivent le paiement, à **assistanceprepaxia@gmail.com** ou sur WhatsApp **+225 01 72 95 71 71**, avec l'email ou le numéro du compte, la date, le montant, le moyen de paiement et la référence. Réponse sous **7 jours**.`

export default async function Page() {
  const contenu = await lireContenu()
  return <PageTexte titre="Politique de remboursement" texte={contenu.remboursement || TEXTE} />
}
