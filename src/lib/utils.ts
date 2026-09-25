import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "https://www.instagram.com/ordo_automacao/" → "@ordo_automacao" */
export function instagramHandle(url: string): string {
  const handle = url.replace(/\/+$/, "").split("/").pop();
  return handle ? `@${handle}` : url;
}
