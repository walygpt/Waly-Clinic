import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "text-green-600"
  if (confidence >= 0.6) return "text-yellow-600"
  return "text-red-600"
}

export function getPriorityBadgeColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive"
    case "medium":
      return "bg-yellow-500/10 text-yellow-700"
    case "low":
      return "bg-green-500/10 text-green-700"
    default:
      return "bg-muted text-muted-foreground"
  }
}
