"use client";

import { useMemo } from "react";
import { useLocale } from "./locale";
import type { AirwayBranchDef } from "@/lib/data/airway";
import type { NodeStation } from "@/lib/data/mediastinum";
import type { Device } from "@/lib/data/equipment";
import type { IndicationGroup, Contraindication, AntithromboticRule } from "@/lib/data/guidelines";
import type { Procedure } from "@/lib/data/procedures";
import type { QuizQuestion } from "@/lib/data/quiz";
import type { StandardView } from "@/lib/airway/views";
import { TH_AIRWAY, TH_LARYNX, TH_NODES, TH_VIEWS } from "./th/anatomy";
import { TH_DEVICES, TH_EBUS_NOTE, TH_NEEDLE_USE, TH_SCOPE_USE, TH_SPEC_LABEL } from "./th/equipment";
import { TH_ANTITHROMBOTICS, TH_ASA, TH_CONTRAINDICATIONS, TH_INDICATIONS, TH_NOT_HELPFUL, TH_PLANNED } from "./th/guidelines";
import { TH_PROCEDURES, TH_TBNA_TECHNIQUES } from "./th/procedures";
import { TH_CATEGORY, TH_QUIZ } from "./th/quiz";

/**
 * Localised views of the medical content. English data is the source of truth; Thai overlays
 * replace explanatory text only (anatomy, drug and device terms stay in English).
 */
export function useContent() {
  const locale = useLocale((s) => s.locale);
  return useMemo(() => {
    const th = locale === "th";
    return {
      locale,
      airway: (d: AirwayBranchDef): AirwayBranchDef => (th && TH_AIRWAY[d.id] ? { ...d, ...TH_AIRWAY[d.id] } : d),
      view: (v: StandardView): StandardView => (th && TH_VIEWS[v.id] ? { ...v, ...TH_VIEWS[v.id] } : v),
      node: (n: NodeStation): NodeStation => (th && TH_NODES[n.id] ? { ...n, ...TH_NODES[n.id] } : n),
      larynx: (key: string, en: string) => (th ? (TH_LARYNX[key] ?? en) : en),
      device: (d: Device): Device => {
        const o = th ? TH_DEVICES[d.id] : undefined;
        if (!o) return d;
        return { ...d, tagline: o.tagline, parts: d.parts.map((p) => (o.parts[p.id] ? { ...p, ...o.parts[p.id] } : p)) };
      },
      scopeUse: (id: string, en: string) => (th ? (TH_SCOPE_USE[id] ?? en) : en),
      ebusNote: (id: string, en: string) => (th ? (TH_EBUS_NOTE[id] ?? en) : en),
      needleUse: (gauge: string, en: string) => (th ? (TH_NEEDLE_USE[gauge] ?? en) : en),
      specLabel: (en: string) => (th ? (TH_SPEC_LABEL[en] ?? en) : en),
      indication: (g: IndicationGroup): IndicationGroup => {
        const o = th ? TH_INDICATIONS[g.id] : undefined;
        if (!o) return g;
        return { ...g, title: o.title, items: g.items.map((it, i) => o.items[i] ?? it) };
      },
      notHelpful: (list: string[]) => (th ? TH_NOT_HELPFUL : list),
      contraindication: (c: Contraindication): Contraindication => (th && TH_CONTRAINDICATIONS[c.label] ? { ...c, ...TH_CONTRAINDICATIONS[c.label] } : c),
      antithrombotic: (a: AntithromboticRule): AntithromboticRule => (th && TH_ANTITHROMBOTICS[a.drug] ? { ...a, ...TH_ANTITHROMBOTICS[a.drug] } : a),
      asa: (i: number, en: string) => (th ? (TH_ASA[i] ?? en) : en),
      planned: (key: string, en: string) => (th ? (TH_PLANNED[key] ?? en) : en),
      procedure: (p: Procedure): Procedure => {
        const o = th ? TH_PROCEDURES[p.id] : undefined;
        if (!o) return p;
        return {
          ...p,
          summary: o.summary,
          indications: o.indications,
          keyNumbers: o.keyNumbers,
          steps: p.steps.map((s, i) => ({ ...s, ...(o.steps[i] ?? {}) })),
          tips: o.tips,
          complications: p.complications.map((c, i) => ({ ...c, ...(o.complications[i] ?? {}) })),
          specimens: o.specimens,
        };
      },
      technique: (id: string, en: string) => (th ? (TH_TBNA_TECHNIQUES[id] ?? en) : en),
      quiz: (q: QuizQuestion): QuizQuestion => (th && TH_QUIZ[q.id] ? { ...q, ...TH_QUIZ[q.id] } : q),
      category: (c: string, en: string) => (th ? (TH_CATEGORY[c] ?? en) : en),
    };
  }, [locale]);
}
