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

export default function Icone({ nom, taille = 22 }: { nom: string; taille?: number }) {
  const C = ICONES[nom?.toLowerCase()] ?? Sparkles
  return <C size={taille} />
}
