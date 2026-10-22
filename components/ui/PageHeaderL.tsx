"use client";

import { PageHeader } from "./primitives";
import { pick, useLocale, type Bi } from "@/lib/i18n/locale";

/** Page header usable from server components, rendered in the current language. */
export function PageHeaderL({ eyebrow, title, description }: { eyebrow?: Bi; title: Bi; description?: Bi }) {
  const locale = useLocale((s) => s.locale);
  return (
    <PageHeader
      eyebrow={eyebrow ? pick(eyebrow, locale) : undefined}
      title={pick(title, locale)}
      description={description ? pick(description, locale) : undefined}
    />
  );
}

/** Inline bilingual text for server components. */
export function L({ en, th }: Bi) {
  const locale = useLocale((s) => s.locale);
  return <>{locale === "th" ? th : en}</>;
}
