import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "hace unos segundos"
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} d`

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
}

export function cleanLocationName(address: string): string {
  if (!address) return "";

  // Split by comma
  const parts = address.split(",").map((part) => part.trim());

  // Filter out parts
  const filteredParts = parts.filter((part) => {
    // Remove "Ecuador" (case insensitive)
    const isCountry = part.toLowerCase() === "ecuador";

    // Remove postal codes (usually 6 digits in Ecuador, checking for 5-6 digits to be safe)
    // Also ensuring it's purely numeric
    const isPostalCode = /^\d{5,6}$/.test(part);

    return !isCountry && !isPostalCode;
  });

  return filteredParts.join(", ");
}
