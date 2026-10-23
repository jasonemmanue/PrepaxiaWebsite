import type { Config } from 'tailwindcss'

// (2026-10-23) Couleurs de la charte graphique de l'app (Charte-graphique-Prepaxia.pdf) :
// des RÔLES, jamais une valeur en dur. Chaque rôle est une variable CSS (canaux RVB) définie
// dans app/globals.css pour le sombre (défaut, comme l'app) et le clair.
const role = (v: string) => `rgb(var(--${v}) / <alpha-value>)`

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fond: role('fond'),
        surface: role('surface'),
        releve: role('releve'),
        filet: role('filet'),
        ink: { DEFAULT: role('ink'), doux: role('ink-doux'), discret: role('ink-discret') },
        marque: { DEFAULT: '#2F5BEA', fonce: '#1D40C0', nuit: '#102993' },
        lien: role('lien'),
        ambre: { DEFAULT: '#FFB546', ink: role('ambre-ink'), sur: '#2A1A00' },
        pilier: {
          apprendre: role('p-apprendre'),
          entrainer: role('p-entrainer'),
          ia: role('p-ia'),
          communaute: role('p-communaute'),
        },
        // Anciens noms gardés pour les pages des ambassadeurs (mêmes teintes que la charte).
        bleu: { DEFAULT: '#2F5BEA', fonce: '#1D40C0', ciel: '#7CC4FF', clair: '#9DB6FF' },
      },
      fontFamily: { sans: ['var(--police)', 'system-ui', 'sans-serif'] },
      boxShadow: {
        // Ombres bleu nuit, jamais noires (charte, règles d'usage).
        doux: '0 24px 60px -28px rgba(10, 18, 56, 0.55)',
        marque: '0 18px 40px -16px rgba(47, 91, 234, 0.65)',
      },
      maxWidth: { site: '76rem' },
    },
  },
  plugins: [],
}
export default config
