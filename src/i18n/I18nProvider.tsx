"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { languages, messages, type Language, type MessageKey } from "./messages";
import { translateSiteCopy } from "./site-copy";
import type { SiteCopyContent } from "@/lib/cms/site-copy";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey) => string;
  tc: (text: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "lead-multichoice-language";

export function I18nProvider({
  children,
  siteCopyOverrides,
}: {
  children: ReactNode;
  siteCopyOverrides?: SiteCopyContent | null;
}) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && languages.includes(saved as Language)) setLanguageState(saved as Language);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => siteCopyOverrides?.translations[language][`message:${key}`] ?? messages[language][key] ?? messages.en[key],
      tc: (text) => siteCopyOverrides?.translations[language][`copy:${text}`] ?? translateSiteCopy(language, text),
    }),
    [language, setLanguage, siteCopyOverrides],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
