/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image Docker minimale pour Railway (voir Dockerfile).
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }, {
      // (2026-10-20) Espace d'un ambassadeur : l'adresse EST le secret. Jamais
      // transmise à un autre site (Referer), jamais en cache.
      source: '/ambassadeur/:path*',
      headers: [
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'Cache-Control', value: 'no-store' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      ],
    }]
  },
}
export default nextConfig
