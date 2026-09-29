import type { MetadataRoute } from 'next'
import { lireArticles } from '@/lib/api'

const SITE = process.env.SITE_URL || 'https://prepaxia.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await lireArticles(50)
  return [
    ...['', '/concours', '/journal', '/cgu', '/confidentialite'].map((p) => ({ url: `${SITE}${p}` })),
    ...articles.map((a) => ({
      url: `${SITE}/journal/${a.slug}`,
      lastModified: a.publie_le ? new Date(a.publie_le) : undefined,
    })),
  ]
}
