
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This is just a helper function to indicate that a resource wasn't found
// The actual UI component is moved to the NotFound page
export function notFound() {
  return null; // Return null instead of JSX
}
