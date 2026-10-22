"use client";

import { useCallback } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Locale = "en" | "th";

type LocaleState = { locale: Locale; setLocale: (l: Locale) => void };

export const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "bronchosim-locale-v1",
      storage: createJSONStorage(() => {
        try {
          return window.localStorage;
        } catch {
          const mem = new Map<string, string>();
          return {
            getItem: (k: string) => mem.get(k) ?? null,
            setItem: (k: string, v: string) => void mem.set(k, v),
            removeItem: (k: string) => void mem.delete(k),
          };
        }
      }),
      skipHydration: true,
    },
  ),
);

export function hydrateLocale() {
  if (!useLocale.persist.hasHydrated()) void useLocale.persist.rehydrate();
}

/**
 * Bilingual string picker: `l("Advance", "ดันกล้องเข้า")`. Thai text keeps technical and medical
 * terms in English. Falls back to English when no Thai text is given.
 */
export function useL() {
  const locale = useLocale((s) => s.locale);
  return useCallback((en: string, th?: string) => (locale === "th" && th ? th : en), [locale]);
}

export type Bi = { en: string; th: string };

export function pick(b: Bi | string, locale: Locale) {
  return typeof b === "string" ? b : locale === "th" ? b.th : b.en;
}
