import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TYPESCRIPT REQUIREMENT 3: Function Overloads
export function formatDate(date: Date): string;
export function formatDate(date: string): string;
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// TYPESCRIPT REQUIREMENT 5: Type Predicate
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Mock delay helper
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
