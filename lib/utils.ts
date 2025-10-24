import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function generateTimestamp(hoursAgo: number, minuteVariance = 0): string {
  const now = new Date()
  const variance = (Math.random() - 0.5) * minuteVariance * 60 * 1000
  const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000 + variance)
  return timestamp.toISOString()
}
