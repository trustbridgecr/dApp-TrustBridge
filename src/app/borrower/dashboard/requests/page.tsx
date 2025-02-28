"use client";

import { useState, useEffect } from "react";
import { RequestsContent } from "@/components/borrewer/requests/requests-content";

export default function RequestsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className={`flex min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex-1 flex flex-col dark:bg-darkbg">
        <RequestsContent />
      </div>
    </div>
  );
}
