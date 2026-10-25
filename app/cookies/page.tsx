// app/cookies/page.tsx
// (2026-10-24) Politique des cookies (liste de contrôle TikTok / stores). Texte modifiable dans l'admin → Site web ; repli ici.
import type { Metadata } from 'next'
import PageTexte from '@/components/PageTexte'
import { lireContenu } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Politique des cookies',
  description: 'Cookies et stockage du navigateur utilisés par Prepaxia.',
}

const TEXTE = `Cette page explique comment le site www.prepaxia.com et l'application web de **Prepaxia Tech Corporation** utilisent les cookies et le stockage de ton navigateur.

## 1. Ce que nous utilisons

- **Nécessaires** : ta session de connexion à l'application web, la protection contre les abus et le bon affichage des pages.
- **Préférences** : ton thème (clair ou sombre), ta langue et ton choix sur le bandeau.

## 2. Ce que nous n'utilisons pas

Aucun cookie publicitaire, aucun traceur de réseau social, aucune revente de données.

## 3. Ton choix

Le bandeau du site permet d'accepter ou de refuser les préférences. Les cookies nécessaires restent actifs. Tu peux aussi les effacer dans les réglages de ton navigateur.

## 4. Contact

**assistanceprepaxia@gmail.com**`

export default async function Page() {
  const contenu = await lireContenu()
  return <PageTexte titre="Politique des cookies" texte={contenu.cookies || TEXTE} />
}
