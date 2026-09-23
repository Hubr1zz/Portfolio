"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { contentMessages, messages, type ContentKey, type MessageKey } from "./translations";

export type Locale = "en" | "zh";
type Variables = Record<string, string | number>;
type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: MessageKey, variables?: Variables) => string;
  content: (key: ContentKey) => string;
  localizeProject: <T extends { id: string }>(project: T) => T;
  localizeProjects: <T extends Record<string, { id: string }[]>>(projects: T) => T;
  localizeTab: <T extends { id: string }>(tab: T) => T;
  localizeTabs: <T extends { id: string }[]>(tabs: T) => T;
  localizeBoardItems: <T extends { id: string }[]>(projectId: string, items: T) => T;
};

const storageKey = "portfolio-locale";
const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, variables?: Variables) {
  if (!variables)
    return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => key in variables ? String(variables[key]) : match);
}

function pathSegment(value: unknown, index: number) {
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string")
    return value.id;
  return String(index);
}

function localizeValue<T>(value: T, path: string, locale: Locale): T {
  if (locale === "en")
    return value;
  if (typeof value === "string")
    return ((contentMessages.zh as Record<string, string>)[path] ?? value) as T;
  if (Array.isArray(value))
    return value.map((item, index) => localizeValue(item, `${path}.${pathSegment(item, index)}`, locale)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeValue(item, `${path}.${key}`, locale)])) as T;
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
  const content = useCallback((key: ContentKey) => contentMessages[locale][key], [locale]);
  const localizeProject = useCallback(<T extends { id: string },>(project: T) => localizeValue(project, `project.${project.id}`, locale), [locale]);
  const localizeProjects = useCallback(<T extends Record<string, { id: string }[]>,>(projectGroups: T) => Object.fromEntries(Object.entries(projectGroups).map(([group, groupProjects]) => [group, groupProjects.map((project) => localizeValue(project, `project.${project.id}`, locale))])) as T, [locale]);
  const localizeTab = useCallback(<T extends { id: string },>(tab: T) => localizeValue(tab, `tab.${tab.id}`, locale), [locale]);
  const localizeTabs = useCallback(<T extends { id: string }[],>(tabList: T) => tabList.map((tab) => localizeValue(tab, `tab.${tab.id}`, locale)) as T, [locale]);
  const localizeBoardItems = useCallback(<T extends { id: string }[],>(projectId: string, items: T) => items.map((item) => localizeValue(item, `project.${projectId}.section.${item.id}`, locale)) as T, [locale]);
  const contextValue = useMemo(() => ({ locale, setLocale, toggleLocale, t, content, localizeProject, localizeProjects, localizeTab, localizeTabs, localizeBoardItems }), [locale, setLocale, toggleLocale, t, content, localizeProject, localizeProjects, localizeTab, localizeTabs, localizeBoardItems]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context)
    throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}
