/**
 * @fileoverview Utility functions for class name management
 * Combines clsx and tailwind-merge for optimal Tailwind CSS class handling.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine and merge Tailwind CSS class names intelligently.
 * Handles conditional classes and merges conflicting Tailwind utilities.
 *
 * @param {...ClassValue[]} inputs - Class values to combine (strings, objects, arrays)
 * @returns {string} Merged class name string
 * @example
 * cn('px-2 py-1', 'px-4') // Returns: 'py-1 px-4' (px-2 is overridden)
 * cn('text-red-500', condition && 'text-blue-500') // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
