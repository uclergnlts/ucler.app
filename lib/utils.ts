import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn/ui sınıf birleştirici: koşullu sınıfları toplar, çakışan Tailwind sınıflarında sonuncuyu bırakır. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
