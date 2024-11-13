import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export const formatDate = (date: Date | null): string => {
  if (!date) return '-'
  const parsedDate = new Date(date)
  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) return '-'
  
  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const hours = String(parsedDate.getHours()).padStart(2, '0')
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
  const seconds = String(parsedDate.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
