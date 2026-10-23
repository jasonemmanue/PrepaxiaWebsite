import type { MetadataRoute } from 'next'

const SITE = process.env.SITE_URL || 'https://www.prepaxia.com'

export default function robots(): MetadataRoute.Robots {
  // (2026-10-20) Liens d'ambassadeurs (/a/…) et espaces privés (/ambassadeur/…) : jamais indexés.
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/a/', '/ambassadeur/', '/api/'] }],
    sitemap: `${SITE}/sitemap.xml`,
  }
}
