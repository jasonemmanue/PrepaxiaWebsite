// app/api/partenaires/[...chemin]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// (2026-10-20) Relais vers l'API pour les pages des ambassadeurs partenaires
// (candidature, espace privé). Le navigateur ne parle qu'au site : aucun
// réglage CORS sur l'API. L'IP du visiteur est transmise (X-Visiteur-Ip) pour
// que les limites anti-abus de l'API s'appliquent à CHAQUE visiteur et non au
// serveur du site. Seuls les chemins listés ci-dessous sont relayés.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { API_BASE } from '@/lib/api'

export const dynamic = 'force-dynamic'

const CHEMINS: { methode: 'GET' | 'POST'; motif: RegExp }[] = [
  { methode: 'GET', motif: /^config-publique$/ },
  { methode: 'POST', motif: /^candidature$/ },
  { methode: 'GET', motif: /^espace\/[A-Za-z0-9_-]{20,64}$/ },
  { methode: 'GET', motif: /^espace\/[A-Za-z0-9_-]{20,64}\/commissions(\.csv)?$/ },
  { methode: 'POST', motif: /^espace\/[A-Za-z0-9_-]{20,64}\/(charte|paiement)$/ },
]
const TAILLE_MAX = 20_000   // une candidature ne dépasse jamais quelques Ko

function ipVisiteur(req: NextRequest): string {
  const ff = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return ff || req.headers.get('x-real-ip') || req.ip || ''
}

async function relayer(req: NextRequest, chemin: string[], methode: 'GET' | 'POST') {
  const c = chemin.join('/')
  if (!CHEMINS.some((x) => x.methode === methode && x.motif.test(c))) {
    return NextResponse.json({ detail: 'Introuvable' }, { status: 404 })
  }
  const enTetes: Record<string, string> = { 'X-Visiteur-Ip': ipVisiteur(req), Accept: 'application/json' }
  let corps: string | undefined
  if (methode === 'POST') {
    corps = await req.text()
    if (corps.length > TAILLE_MAX) return NextResponse.json({ detail: 'Demande trop longue.' }, { status: 413 })
    enTetes['Content-Type'] = 'application/json'
  }
  const page = req.nextUrl.searchParams.get('page')
  const taille = req.nextUrl.searchParams.get('taille')
  const q = new URLSearchParams()
  if (page && /^\d{1,5}$/.test(page)) q.set('page', page)
  if (taille && /^\d{1,3}$/.test(taille)) q.set('taille', taille)
  try {
    const qs = q.toString()   // (URLSearchParams.size n'existe pas sur tous les Node)
    const r = await fetch(`${API_BASE}/api/v1/partenaires/${c}${qs ? `?${qs}` : ''}`, {
      method: methode, headers: enTetes, body: corps, cache: 'no-store',
    })
    const sortie = new NextResponse(await r.arrayBuffer(), { status: r.status })
    sortie.headers.set('Content-Type', r.headers.get('content-type') || 'application/json')
    const dispo = r.headers.get('content-disposition')
    if (dispo) sortie.headers.set('Content-Disposition', dispo)
    sortie.headers.set('Cache-Control', 'no-store')
    return sortie
  } catch {
    return NextResponse.json({ detail: 'Service momentanément indisponible. Réessaie dans un instant.' }, { status: 503 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { chemin: string[] } }) {
  return relayer(req, params.chemin, 'GET')
}

export async function POST(req: NextRequest, { params }: { params: { chemin: string[] } }) {
  return relayer(req, params.chemin, 'POST')
}
