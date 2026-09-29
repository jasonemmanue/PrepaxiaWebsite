import type { Metadata } from 'next'
import PageTexte from '@/components/PageTexte'
import { lireContenu } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = { title: "Conditions d'utilisation" }

export default async function Cgu() {
  const contenu = await lireContenu()
  return <PageTexte titre="Conditions d'utilisation" texte={contenu.cgu} />
}
