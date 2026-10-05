import type { Metadata } from 'next'
import PageTexte from '@/components/PageTexte'
import { lireContenu } from '@/lib/api'

// (2026-10-05) Page « À propos de nous » : texte modifiable dans l'admin
// (Site web → À propos de nous), ouverte aussi depuis le Profil de l'app.
export const revalidate = 300
export const metadata: Metadata = {
  title: 'À propos de nous',
  description: "Prepaxia, startup fondée par des étudiants de l'ENSEA d'Abidjan pour préparer le BAC et les concours des grandes écoles.",
}

export default async function APropos() {
  const contenu = await lireContenu()
  return <PageTexte titre={contenu.a_propos_titre || 'À propos de nous'} texte={contenu.a_propos || ''} />
}
