import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and dedupe Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Prefix an asset path with the configured base path (for GitHub Pages). */
export function asset(path: string) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    if (/^https?:\/\//.test(path)) return path;
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
