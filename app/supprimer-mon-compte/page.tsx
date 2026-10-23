// app/supprimer-mon-compte/page.tsx
// (2026-10-17) Page publique exigée par Google Play (sécurité des données) :
// comment demander la suppression de son compte Prepaxia et de ses données.
// (2026-10-23) Repli à jour de la refonte 1.17.49 : Moi → Paramètres → Sécurité.
import type { Metadata } from 'next'
import PageTexte from '@/components/PageTexte'
import { lireContenu } from '@/lib/api'

export const revalidate = 300
export const metadata: Metadata = {
  title: 'Supprimer mon compte Prepaxia',
  description: 'Comment supprimer ton compte Prepaxia et les données associées.',
}

// Repli si l'API ne renvoie pas encore ce texte (modifiable dans l'admin → Site web).
const TEXTE = `Cette page explique comment supprimer ton compte de l'application **Prepaxia**, éditée par **Prepaxia Tech Corporation**, et ce que deviennent tes données.

## 1. Depuis l'application (le plus rapide)

1. Ouvre l'application Prepaxia et connecte-toi.
2. Touche ta photo de profil (ou tes initiales) en haut de l'écran pour ouvrir **Moi**, puis **Paramètres**, puis **Sécurité**.
3. Touche **Supprimer mon compte**, puis confirme.

Ta session est fermée sur tous tes appareils et ton compte est supprimé aussitôt.

## 2. Sans l'application

Écris à **assistanceprepaxia@gmail.com** depuis l'adresse e-mail de ton compte (ou indique le numéro de téléphone du compte), avec pour objet « Suppression de mon compte Prepaxia ». Nous vérifions que la demande vient bien du titulaire du compte, puis nous supprimons le compte sous 30 jours au plus et te confirmons la suppression par e-mail.

## 3. Données supprimées

- Ton profil : nom, prénom, nom d'utilisateur, e-mail, numéros de téléphone et WhatsApp, photo de profil, concours visé, série et lycée.
- Ta progression : leçons, quiz, exercices, XP, série de jours, objectifs, favoris, bibliothèque.
- Tes contenus : messages du chat, conversations avec Prepaxia AI, copies et corrections du Corrector, épreuves du Generator.
- Tes crédits IA restants, tes abonnements en cours et tes accès aux contenus achetés : ils sont perdus et ne sont pas remboursés.
- Les jetons de notification de tes appareils.

Ton adresse e-mail et ton numéro sont libérés : tu pourras créer un nouveau compte avec eux.

## 4. Données conservées et durée

- **Factures et paiements** : le montant, la date, la référence et le moyen de paiement sont conservés **10 ans**, comme l'exige la loi comptable. Ils sont détachés de ton identité (compte anonymisé).
- **Journaux techniques de sécurité** (connexions, erreurs) : conservés **90 jours au plus**, puis effacés.

Aucune autre donnée n'est conservée. Prepaxia ne vend jamais tes données.

## 5. Contact

Pour toute question : **assistanceprepaxia@gmail.com** ou WhatsApp **+225 01 72 95 71 71**.`

export default async function SupprimerMonCompte() {
  const contenu = await lireContenu()
  return <PageTexte titre="Supprimer mon compte Prepaxia" texte={contenu.suppression_compte || TEXTE} />
}
