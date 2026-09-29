import type { Config } from 'tailwindcss'

// Palette dérivée du logo Prepaxia (identique à l'app et à l'admin).
const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bleu: { DEFAULT: '#0F4FE0', fonce: '#0234C4', ciel: '#1596FF', clair: '#7CC4FF' },
        nuit: { DEFAULT: '#061446', carte: '#0C1F63', surface: '#13297A' },
        encre: { DEFAULT: '#0B1640', douce: '#3B4A74', pale: '#5B6A94' },
      },
      fontFamily: { sans: ['var(--police)', 'system-ui', 'sans-serif'] },
      boxShadow: { doux: '0 20px 50px -20px rgba(2, 52, 196, 0.35)' },
    },
  },
  plugins: [],
}
export default config
