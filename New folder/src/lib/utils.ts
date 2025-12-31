import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Authentication utility functions
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = sessionStorage.getItem("iw_token");
  return !!token;
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("iw_token");
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("iw_token", token);
};

export const clearAuthData = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("iw_token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("isAuthenticated");
};

export const debugAuthState = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  const token = getAuthToken();
  const user = sessionStorage.getItem("user");
  const isAuth = sessionStorage.getItem("isAuthenticated");

};

// Common theme classes for consistent styling
export const themeClasses = {
  card: "border-0 shadow-2xl bg-gray-900/50 backdrop-blur-xl text-white border border-gray-800/20 rounded-xl overflow-hidden",
  input:
    "pl-10 bg-gray-800/50 border-gray-700/50 text-white focus:border-emerald-500 focus:ring focus:ring-emerald-500/30 rounded-md",
  button:
    "w-full h-12 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-medium rounded-md shadow-lg shadow-emerald-600/20 flex items-center justify-center transition-all duration-200",
  alert: {
    success:
      "border-emerald-500/50 bg-emerald-950/30 text-emerald-300 backdrop-blur-sm",
    error: "border-red-500/50 bg-red-950/30 text-red-300 backdrop-blur-sm",
  },
} as const;
