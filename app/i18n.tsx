"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { messages, type MessageKey, zhContent } from "./translations";

export type Locale = "en" | "zh";
type Variables = Record<string, string | number>;
type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: MessageKey, variables?: Variables) => string;
  localize: <T>(value: T) => T;
};

const storageKey = "portfolio-locale";
const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, variables?: Variables) {
  if (!variables)
    return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => key in variables ? String(variables[key]) : match);
}

function localizeValue<T>(value: T, locale: Locale): T {
  if (locale === "en")
    return value;
  if (typeof value === "string")
    return (zhContent[value] ?? value) as T;
  if (Array.isArray(value))
    return value.map((item) => localizeValue(item, locale)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeValue(item, locale)])) as T;
  return value;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    let frame = 0;
    try {
      const savedLocale = localStorage.getItem(storageKey);
      if (savedLocale === "en" || savedLocale === "zh")
        frame = window.requestAnimationFrame(() => setLocaleState(savedLocale));
    } catch {
      return;
    }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try {
      localStorage.setItem(storageKey, nextLocale);
    } catch {
      return;
    }
  }, []);

  const toggleLocale = useCallback(() => setLocale(locale === "en" ? "zh" : "en"), [locale, setLocale]);
  const t = useCallback((key: MessageKey, variables?: Variables) => interpolate(messages[locale][key], variables), [locale]);
  const localize = useCallback(<T,>(value: T) => localizeValue(value, locale), [locale]);
  const contextValue = useMemo(() => ({ locale, setLocale, toggleLocale, t, localize }), [locale, setLocale, toggleLocale, t, localize]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context)
    throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}
