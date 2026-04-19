import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL = import.meta.env.VITE_API_URL || "https://vishalmasala.onrender.com";

export const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  
  // Ensure we don't double prefix if the URL already has /uploads (standard in our DB)
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};
