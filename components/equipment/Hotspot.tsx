"use client";

import { cn } from "@/lib/utils";

/** Numbered SVG callout marker. */
export function Hotspot({
  x,
  y,
  n,
  active,
  onClick,
  label,
}: {
  x: number;
  y: number;
  n: number;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className="cursor-pointer outline-none"
    >
      {active && <circle cx={x} cy={y} r={15} className="fill-cyan-400/20 stroke-cyan-300" strokeWidth={1} />}
      <circle cx={x} cy={y} r={10} className={cn(active ? "fill-cyan-400" : "fill-slate-900 stroke-cyan-400")} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" className={cn("text-[11px] font-bold", active ? "fill-slate-950" : "fill-cyan-300")}>
        {n}
      </text>
      <title>{label}</title>
    </g>
  );
}
