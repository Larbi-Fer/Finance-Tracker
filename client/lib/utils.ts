import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isStringInteger(str: any) {
  if (typeof str === 'number') return true;
  if (typeof str !== 'string') return false;
  const trimmedStr = str.trim();
  if (trimmedStr === '') { // Handle empty or whitespace-only strings
    return false;
  }
  const parsedInt = parseInt(trimmedStr, 10);
  return Number.isInteger(parsedInt) && String(parsedInt) === trimmedStr;
}