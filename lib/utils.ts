import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "Invalid Date"

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date"
    }

    // Format the date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

/**
 * Ensures a valid image URL or returns a fallback
 */
export function ensureValidImageUrl(url: string | undefined | null, fallback = "/placeholder.svg"): string {
  if (!url) return fallback

  // If it's already a valid URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If it's a relative URL, make sure it starts with a slash
  if (!url.startsWith('/')) {
    return `/${url}`
  }

  return url
}

