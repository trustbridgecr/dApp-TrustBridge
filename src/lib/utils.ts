import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../locales/en.json";
import esTranslations from "../locales/es.json";

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safe localStorage check that works in both client and server environments
const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("language") || "en";
  }
  return "en";
};

// i18n configuration
const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    es: {
      translation: esTranslations,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  // Additional recommended settings
  detection: {
    order: ["localStorage", "navigator"],
  },
  react: {
    useSuspense: false, // Recommended when using SSR
  },
});

export { i18n };
export default i18n;
