import { Apple, Globe, Smartphone } from 'lucide-react'
import { lienAndroid, type Liens } from '@/lib/api'

/** Boutons de téléchargement : n'affiche que les liens réellement renseignés
 *  dans l'admin (Paramètres de l'app). */
export default function BoutonsStores({ liens, urlAppWeb }: { liens: Liens; urlAppWeb?: string }) {
  const android = lienAndroid(liens)
  const surPlay = Boolean(liens.playstore_url)
  return (
    <div className="flex flex-wrap gap-3">
      {android && (
        <a href={android} className="bouton">
          <Smartphone size={20} />
          <span className="text-left leading-tight">
            <span className="block text-[10px] font-semibold uppercase opacity-80">
              {surPlay ? 'Disponible sur' : 'Télécharger pour'}
            </span>
            {surPlay ? 'Google Play' : 'Android'}
          </span>
        </a>
      )}
      {liens.appstore_url && (
        <a href={liens.appstore_url} className="bouton-neutre">
          <Apple size={20} />
          <span className="text-left leading-tight">
            <span className="block text-[10px] font-semibold uppercase opacity-70">Télécharger sur</span>
            l&apos;App Store
          </span>
        </a>
      )}
      {urlAppWeb && (
        <a href={urlAppWeb} className="bouton-neutre">
          <Globe size={20} />
          <span className="text-left leading-tight">
            <span className="block text-[10px] font-semibold uppercase opacity-70">Sans installer</span>
            Version web
          </span>
        </a>
      )}
    </div>
  )
}
