import type { Metadata } from 'next'
import PageTexte from '@/components/PageTexte'
import { lireContenu } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = { title: 'Politique de confidentialité' }

export default async function Confidentialite() {
  const contenu = await lireContenu()
  return <PageTexte titre="Politique de confidentialité" texte={contenu.confidentialite} />
}
