import type { MetadataRoute } from 'next'

const SITE = process.env.SITE_URL || 'https://prepaxia.com'

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE}/sitemap.xml` }
}
