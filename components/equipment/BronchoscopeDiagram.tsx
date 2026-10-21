"use client";

import { useMemo } from "react";
import { Hotspot } from "./Hotspot";

const HOTSPOTS: Record<string, [number, number]> = {
  lever: [118, 42],
  suction: [176, 70],
  port: [214, 150],
  buttons: [92, 96],
  cord: [60, 268],
  insertion: [520, 196],
  bending: [790, 172],
  tip: [884, 72],
};

/** Side-view schematic of a flexible bronchoscope with a live bending-section preview. */
export function BronchoscopeDiagram({
  active,
  onSelect,
  flex,
  order,
}: {
  active: string;
  onSelect: (id: string) => void;
  flex: number;
  order: string[];
}) {
  // Bending section drawn as a constant-curvature arc from the end of the insertion tube.
  const bendPath = useMemo(() => {
    const start = { x: 730, y: 205 };
    const L = 70;
    const steps = 24;
    const total = (-flex * Math.PI) / 180; // SVG y is down: positive flex bends upward
    let x = start.x;
    let y = start.y;
    let ang = 0;
    const pts = [`M${x},${y}`];
    for (let i = 0; i < steps; i++) {
      ang += total / steps;
      x += Math.cos(ang) * (L / steps);
      y += Math.sin(ang) * (L / steps);
      pts.push(`L${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return { d: pts.join(" "), end: { x, y }, ang };
  }, [flex]);

  return (
    <svg viewBox="0 0 960 320" className="w-full" role="img" aria-label="Flexible bronchoscope diagram">
      <defs>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stopColor="#334155" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      {/* universal cord */}
      <path d="M70 150 C 20 200, 30 260, 120 290 S 260 300, 300 300" fill="none" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
      {/* control body */}
      <path d="M60 60 L170 50 Q190 50 196 70 L210 170 Q214 200 190 205 L90 210 Q62 210 60 180 Z" fill="url(#body)" stroke="#64748b" />
      {/* lever */}
      <path d="M110 58 L96 26 Q94 18 104 18 L132 22 Q140 24 136 32 L124 58 Z" fill="#0ea5e9" stroke="#38bdf8" />
      {/* suction valve */}
      <rect x="160" y="60" width="22" height="18" rx="4" fill="#ef4444" stroke="#fca5a5" />
      {/* buttons */}
      <circle cx="78" cy="90" r="5" fill="#94a3b8" />
      <circle cx="78" cy="106" r="5" fill="#94a3b8" />
      {/* biopsy port */}
      <path d="M196 150 L232 132 L240 146 L204 166 Z" fill="#f59e0b" stroke="#fcd34d" />
      {/* boot + insertion tube */}
      <path d="M196 188 L250 196 L250 214 L196 210 Z" fill="#475569" />
      <rect x="250" y="198" width="480" height="14" rx="7" fill="#1f2937" stroke="#475569" />
      {/* depth markings */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={300 + i * 50} y1={199} x2={300 + i * 50} y2={211} stroke="#94a3b8" strokeWidth={1} />
      ))}
      {/* bending section */}
      <path d={bendPath.d} fill="none" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" />
      <path d={bendPath.d} fill="none" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" strokeDasharray="5 3" opacity={0.9} />
      <circle cx={bendPath.end.x} cy={bendPath.end.y} r={8} fill="#e2e8f0" />
      <text x={730} y={250} className="fill-slate-400 text-[11px]">bending section: {flex > 0 ? "+" : ""}{flex}°</text>

      {/* distal tip face inset */}
      <g transform="translate(884 72)">
        <circle r="44" fill="#0b1220" stroke="#64748b" strokeWidth="2" />
        <circle cx="-12" cy="-6" r="11" fill="#082f49" stroke="#38bdf8" />
        <circle cx="-14" cy="-8" r="4" fill="#7dd3fc" opacity="0.7" />
        <circle cx="16" cy="-18" r="7" fill="#fef9c3" stroke="#fde047" />
        <circle cx="-6" cy="26" r="7" fill="#fef9c3" stroke="#fde047" />
        <circle cx="18" cy="14" r="10" fill="#020617" stroke="#f59e0b" />
        <text x="0" y="62" textAnchor="middle" className="fill-slate-400 text-[10px]">distal tip face</text>
        <text x="-12" y="-24" textAnchor="middle" className="fill-sky-300 text-[8px]">lens</text>
        <text x="30" y="34" textAnchor="middle" className="fill-amber-300 text-[8px]">channel</text>
        <text x="30" y="-28" textAnchor="middle" className="fill-yellow-200 text-[8px]">light</text>
      </g>

      {order.map((id, i) => {
        const [x, y] = HOTSPOTS[id];
        return <Hotspot key={id} x={x} y={y} n={i + 1} active={active === id} onClick={() => onSelect(id)} label={id} />;
      })}
    </svg>
  );
}
