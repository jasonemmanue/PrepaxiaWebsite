import Image from 'next/image'
import Link from 'next/link'
import { lienAndroid, type ContenuSite, type Liens } from '@/lib/api'

export default function PiedDePage({ contenu, liens }: { contenu: ContenuSite; liens: Liens }) {
  const email = contenu.contact_email || liens.email_contact
  const android = lienAndroid(liens)
  return (
    <footer className="mt-24 border-t bord">
      <div className="conteneur grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 font-extrabold text-lg">
            <Image src="/logo.png" alt="" width={34} height={34} className="rounded-xl" />
            Prepaxia
          </div>
          <p className="mt-3 text-sm texte-doux leading-relaxed">
            La préparation aux concours et examens, pensée pour les candidats
            d&apos;Afrique de l&apos;Ouest.
          </p>
        </div>
        <div>
          <p className="font-bold">Application</p>
          <ul className="mt-3 space-y-2 text-sm texte-doux">
            {android && <li><a href={android} className="hover:text-bleu">Télécharger pour Android</a></li>}
            {liens.appstore_url && <li><a href={liens.appstore_url} className="hover:text-bleu">Télécharger sur l&apos;App Store</a></li>}
            {contenu.url_app_web && <li><a href={contenu.url_app_web} className="hover:text-bleu">Version web</a></li>}
            <li><Link href="/#tarifs" className="hover:text-bleu">Tarifs</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold">Découvrir</p>
          <ul className="mt-3 space-y-2 text-sm texte-doux">
            <li><Link href="/concours" className="hover:text-bleu">Les concours</Link></li>
            <li><Link href="/journal" className="hover:text-bleu">Le journal</Link></li>
            <li><Link href="/#faq" className="hover:text-bleu">Questions fréquentes</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold">Contact & légal</p>
          <ul className="mt-3 space-y-2 text-sm texte-doux">
            {email && <li><a href={`mailto:${email}`} className="hover:text-bleu">{email}</a></li>}
            {liens.whatsapp_chaine && <li><a href={liens.whatsapp_chaine} className="hover:text-bleu">Chaîne WhatsApp</a></li>}
            {contenu.url_youtube && <li><a href={contenu.url_youtube} className="hover:text-bleu">Chaîne YouTube</a></li>}
            {contenu.url_tiktok && <li><a href={contenu.url_tiktok} className="hover:text-bleu">TikTok</a></li>}
            {contenu.url_facebook && <li><a href={contenu.url_facebook} className="hover:text-bleu">Facebook</a></li>}
            <li><Link href="/cgu" className="hover:text-bleu">Conditions d&apos;utilisation</Link></li>
            <li><Link href="/confidentialite" className="hover:text-bleu">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t bord py-6 text-center text-xs texte-doux">
        © {new Date().getFullYear()} Prepaxia Tech Corporation. Tous droits réservés.
      </p>
    </footer>
  )
}
