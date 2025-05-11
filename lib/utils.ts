import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a duration string in HH:MM:SS format and returns the total seconds.
 * Returns undefined if the input is not a valid HH:MM:SS string.
 *
 * @param durationString - The duration string in HH:MM:SS format (e.g., "00:01:30").
 * @returns The total number of seconds, or undefined if invalid.
 */
/**
 * Parses a duration string in HH:MM:SS format and returns the total minutes as a float.
 * Returns undefined if the input is not a valid HH:MM:SS string.
 */
export function parseMinutes(durationString: string): number | undefined {
  if (!durationString) return undefined;
  const hmsMatch = durationString.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (hmsMatch) {
    const hours = parseInt(hmsMatch[1], 10);
    const minutes = parseInt(hmsMatch[2], 10);
    const seconds = parseInt(hmsMatch[3], 10);
    return hours * 60 + minutes + seconds / 60;
  }
  console.warn(`Could not parse HH:MM:SS duration: ${durationString}`);
  return undefined;
}



