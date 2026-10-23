import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Linkedin, Mail, Youtube } from 'lucide-react'
import type { ContenuSite, Liens, LiensTelechargement } from '@/lib/api'

function TikTok() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.4-2.47V9.7a5.7 5.7 0 0 0-6.5 5.6 5.7 5.7 0 0 0 5.7 5.7 5.7 5.7 0 0 0 5.69-5.7V9.01a7.3 7.3 0 0 0 4.3 1.38V7.3s-1.88.09-3.25-1.48z" />
    </svg>
  )
}

function WhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.79.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.5l5.9-1.55a11.3 11.3 0 0 0 5.54 1.41h.01c6.25 0 11.35-5.08 11.35-11.34 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  )
}

const lienSocial = 'flex h-10 w-10 items-center justify-center rounded-xl border bord texte-doux transition hover:-translate-y-0.5 hover:border-marque hover:text-ink'

export default function PiedDePage({ contenu, liens, telechargement, avecJournal }: {
  contenu: ContenuSite; liens: Liens; telechargement: LiensTelechargement; avecJournal: boolean
}) {
  const email = contenu.contact_email || liens.email_contact || 'assistanceprepaxia@gmail.com'
  // Numéro WhatsApp de l'assistance : réglé par l'exploitant dans l'admin, seulement lu ici.
  const whatsapp = (liens.whatsapp_contact || '').replace(/[^\d]/g, '')
  const reseaux = [
    { href: contenu.url_youtube, label: 'YouTube', icone: <Youtube size={18} /> },
    { href: contenu.url_tiktok, label: 'TikTok', icone: <TikTok /> },
    { href: contenu.url_facebook, label: 'Facebook', icone: <Facebook size={18} /> },
    { href: contenu.url_linkedin, label: 'LinkedIn', icone: <Linkedin size={18} /> },
    { href: liens.whatsapp_chaine, label: 'Chaîne WhatsApp', icone: <WhatsApp /> },
  ].filter((r) => r.href)
  const lien = 'transition-colors hover:text-ink'

  return (
    <footer className="mt-10 border-t bord bg-surface/60">
      <div className="conteneur grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-bold">
            <Image src="/logo.png" alt="" width={36} height={36} className="rounded-[10px]" />
            Prepaxia
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed texte-doux">
            Ton préparateur pour les concours et le BAC : cours, annales, concours blancs et tuteurs IA, sur
            téléphone, tablette et ordinateur.
          </p>
          {reseaux.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {reseaux.map((r) => (
                <a key={r.label} href={r.href!} className={lienSocial} aria-label={r.label} title={r.label}
                  target="_blank" rel="noopener noreferrer">
                  {r.icone}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold">Application</p>
          <ul className="mt-4 space-y-2.5 text-sm texte-doux">
            <li><a href={telechargement.android} className={lien}>Google Play (Android)</a></li>
            <li><a href={telechargement.ios} className={lien}>App Store (iPhone, iPad)</a></li>
            <li><a href={telechargement.web} className={lien}>Web / PC</a></li>
            <li><Link href="/#tarifs" className={lien}>Tarifs</Link></li>
            <li><Link href="/#interfaces" className={lien}>Interfaces</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Découvrir</p>
          <ul className="mt-4 space-y-2.5 text-sm texte-doux">
            <li><Link href="/concours" className={lien}>Les concours</Link></li>
            {avecJournal && <li><Link href="/journal" className={lien}>Le journal</Link></li>}
            <li><Link href="/#faq" className={lien}>Questions fréquentes</Link></li>
            <li><Link href="/a-propos" className={lien}>À propos de nous</Link></li>
            <li><Link href="/devenir-ambassadeur" className={lien}>Devenir ambassadeur</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact et légal</p>
          <ul className="mt-4 space-y-2.5 text-sm texte-doux">
            <li>
              <a href={`mailto:${email}`} className={`inline-flex items-center gap-2 break-all ${lien}`}>
                <Mail size={16} className="shrink-0" />{email}
              </a>
            </li>
            {whatsapp && (
              <li>
                <a href={`https://wa.me/${whatsapp}`} className={`inline-flex items-center gap-2 ${lien}`}
                  target="_blank" rel="noopener noreferrer">
                  <WhatsApp />Assistance WhatsApp
                </a>
              </li>
            )}
            <li><Link href="/cgu" className={lien}>Conditions d&apos;utilisation</Link></li>
            <li><Link href="/confidentialite" className={lien}>Confidentialité</Link></li>
            <li><Link href="/supprimer-mon-compte" className={lien}>Supprimer mon compte</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t bord">
        <div className="conteneur flex flex-col gap-2 py-6 text-xs texte-discret sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Prepaxia Tech Corporation. Tous droits réservés.</p>
          <p>Google Play et le logo Google Play sont des marques de Google LLC. Apple, le logo Apple et App Store sont des marques d&apos;Apple Inc.</p>
        </div>
      </div>
    </footer>
  )
}
