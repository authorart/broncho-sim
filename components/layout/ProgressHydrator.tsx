"use client";

import { useEffect } from "react";
import { hydrateProgress } from "@/lib/store/progress";
import { hydrateLocale, useLocale } from "@/lib/i18n/locale";

/** Loads persisted progress + language after mount and keeps <html lang> in sync. */
export function ProgressHydrator() {
  const locale = useLocale((s) => s.locale);
  useEffect(() => {
    hydrateProgress();
    hydrateLocale();
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
