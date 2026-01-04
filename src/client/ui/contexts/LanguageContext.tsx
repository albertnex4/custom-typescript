// src/client/ui/contexts/LanguageContext.tsx
/**
 * Context Global para Idiomas
 * Permite cambiar dinámicamente el idioma en toda la aplicación
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import TranslationManager from "../../../shared/TranslationManager";

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>(() => {
    return localStorage.getItem("app_lang") || "es";
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Cargar idioma inicial
  useEffect(() => {
    TranslationManager.instance.loadLanguage(lang).then(() => {
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error loading language:", error);
      setIsLoading(false);
    });
  }, []);

  const setLang = (newLang: string) => {
    setIsLoading(true);
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
    
    TranslationManager.instance.loadLanguage(newLang).then(() => {
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error changing language:", error);
      setIsLoading(false);
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  }
  return context;
}
