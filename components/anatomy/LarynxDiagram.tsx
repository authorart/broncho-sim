"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/primitives";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const PARTS = {
  epiglottis: "Epiglottis — pass the scope posterior to its tip; valleculae lie in front of it (foreign-body traps).",
  cords: "True vocal cords — should abduct on inspiration and adduct on phonation ('eee'). Paradoxical adduction with only a posterior diamond-shaped chink suggests vocal cord dysfunction.",
  vestibular: "Vestibular (false) folds — lie above the true cords.",
  arytenoids: "Arytenoids — posterior landmarks; enter the glottis in the midline between the cords, ideally during inspiration.",
  pyriform: "Pyriform recesses — lateral to the larynx; stimulation (superior laryngeal nerve) can trigger laryngospasm, so apply topical lidocaine first.",
} as const;

type PartKey = keyof typeof PARTS;

/** Schematic glottis as seen from above (operator behind the head, anterior at top). */
export function LarynxDiagram() {
  const [part, setPart] = useState<PartKey>("cords");
  const cls = (k: PartKey) =>
    cn("cursor-pointer transition-opacity", part === k ? "opacity-100" : "opacity-70 hover:opacity-100");
  return (
    <Card>
      <CardHeader title="Larynx & glottis (entry point)" subtitle="Click a structure" icon={<Mic className="h-4 w-4" />} />
      <div className="grid gap-3 p-4 sm:grid-cols-[180px_1fr] xl:grid-cols-1">
        <svg viewBox="0 0 200 200" className="mx-auto w-48" role="img" aria-label="Schematic laryngeal inlet">
          <circle cx="100" cy="100" r="96" fill="#1a0b0b" />
          <g className={cls("pyriform")} onClick={() => setPart("pyriform")}>
            <ellipse cx="38" cy="120" rx="14" ry="34" fill="#5b1d1d" />
            <ellipse cx="162" cy="120" rx="14" ry="34" fill="#5b1d1d" />
          </g>
          <g className={cls("epiglottis")} onClick={() => setPart("epiglottis")}>
            <path d="M50 52 Q100 10 150 52 Q100 36 50 52Z" fill="#d98d84" stroke="#f1b0a6" />
          </g>
          <g className={cls("vestibular")} onClick={() => setPart("vestibular")}>
            <path d="M70 60 Q58 110 86 160 L78 160 Q48 110 62 60Z" fill="#c4645c" />
            <path d="M130 60 Q142 110 114 160 L122 160 Q152 110 138 60Z" fill="#c4645c" />
          </g>
          <path d="M98 62 L84 156 L116 156 L102 62Z" fill="#050202" />
          <g className={cls("cords")} onClick={() => setPart("cords")}>
            <path d="M98 62 L84 156 L90 156 L100 66Z" fill="#f5e6df" />
            <path d="M102 62 L116 156 L110 156 L100 66Z" fill="#f5e6df" />
          </g>
          <g className={cls("arytenoids")} onClick={() => setPart("arytenoids")}>
            <circle cx="82" cy="166" r="10" fill="#d47a70" />
            <circle cx="118" cy="166" r="10" fill="#d47a70" />
          </g>
          <text x="100" y="196" textAnchor="middle" className="fill-slate-400 text-[9px]">posterior</text>
          <text x="100" y="12" textAnchor="middle" className="fill-slate-400 text-[9px]">anterior</text>
        </svg>
        <p className="text-[13px] leading-relaxed text-slate-300">{PARTS[part]}</p>
      </div>
    </Card>
  );
}
