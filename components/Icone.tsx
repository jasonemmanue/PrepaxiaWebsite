import {
  BookOpen, Camera, Timer, Sparkles, Trophy, Target, ClipboardCheck,
  GraduationCap, BarChart3, MessageCircle, type LucideIcon,
} from 'lucide-react'

// Les icônes des fonctionnalités sont choisies dans l'admin par un mot-clé.
const ICONES: Record<string, LucideIcon> = {
  book: BookOpen, livre: BookOpen,
  timer: Timer, chrono: Timer,
  camera: Camera, photo: Camera,
  sparkles: Sparkles, ia: Sparkles,
  trophy: Trophy, classement: Trophy,
  target: Target, objectif: Target,
  quiz: ClipboardCheck,
  diplome: GraduationCap,
  stats: BarChart3,
  chat: MessageCircle,
}

// (2026-10-23) Charte : une couleur par PILIER (pas par fonctionnalité), sur une tuile à 16 %.
const PILIERS: Record<string, string> = {
  book: 'apprendre', livre: 'apprendre', stats: 'apprendre',
  timer: 'entrainer', chrono: 'entrainer', target: 'entrainer', objectif: 'entrainer', quiz: 'entrainer', diplome: 'entrainer',
  camera: 'ia', photo: 'ia', sparkles: 'ia', ia: 'ia',
  trophy: 'communaute', classement: 'communaute', chat: 'communaute',
}
const COULEURS: Record<string, string> = {
  apprendre: 'text-pilier-apprendre',
  entrainer: 'text-pilier-entrainer',
  ia: 'text-pilier-ia',
  communaute: 'text-pilier-communaute',
}

/** Classe de couleur du pilier d'une icône (IA par défaut). */
export const couleurPilier = (nom: string) => COULEURS[PILIERS[nom?.toLowerCase()] ?? 'ia']

export default function Icone({ nom, taille = 22 }: { nom: string; taille?: number }) {
  const C = ICONES[nom?.toLowerCase()] ?? Sparkles
  return <C size={taille} />
}
