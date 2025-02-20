"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";

type Theme = "light" | "dark";
type Language = "es" | "en";

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Effect to handle language changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <AppContext.Provider value={{ theme, setTheme, language, setLanguage }}>
        {children}
      </AppContext.Provider>
    </I18nextProvider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
