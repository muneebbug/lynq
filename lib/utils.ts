import { format } from 'date-fns'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date) => {
  return format(date, 'dd MMMM, yyyy')
}

export const formatDateTime = (date: Date) => {
  // returns a string like "01 January, 2023 12:00 AM"
  return format(date, 'dd MMMM, yyyy HH:mm a')
}
