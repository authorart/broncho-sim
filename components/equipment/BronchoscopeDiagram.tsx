"use client";

import { useMemo } from "react";
import { Hotspot } from "./Hotspot";

const HOTSPOTS: Record<string, [number, number]> = {
  lever: [196, 104],
  switches: [300, 30],
  suction: [384, 52],
  port: [382, 292],
  ring: [356, 352],
  boot: [334, 398],
  insertion: [470, 494],
  bending: [690, 420],
  tip: [700, 70],
  cord: [92, 300],
};

/**
 * Schematic of a BF-190-series video bronchoscope drawn in the orientation of the operation-manual
 * nomenclature figure: control section upright, insertion tube hanging down and running to the tip.
 * The bending section follows the lever; the rotation ring turns the bending plane (foreshortened in
 * this side view) and rotates the endoscopic image (inset).
 */
export function BronchoscopeDiagram({
  active,
  onSelect,
  flex,
  rotation,
  order,
}: {
  active: string;
  onSelect: (id: string) => void;
  flex: number;
  rotation: number;
  order: string[];
}) {
  const bend = useMemo(() => {
    const start = { x: 640, y: 478 };
    const L = 78;
    const steps = 28;
    // the bending plane is rotated by the ring: the side view shows its projection
    const total = (-flex * Math.cos((rotation * Math.PI) / 180) * Math.PI) / 180;
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
  }, [flex, rotation]);

  return (
    <svg viewBox="0 0 760 560" className="w-full" role="img" aria-label="Flexible video bronchoscope (BF-190 series) diagram">
      <defs>
        <linearGradient id="cs-body" x1="0" x2="1">
          <stop offset="0" stopColor="#1f2937" />
          <stop offset="0.45" stopColor="#4b5563" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="tube" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4b5563" />
          <stop offset="0.5" stopColor="#111827" />
          <stop offset="1" stopColor="#030712" />
        </linearGradient>
      </defs>

      {/* universal cord to endoscope connector */}
      <path d="M262 122 C 170 130, 110 190, 96 270 S 80 420, 70 470" fill="none" stroke="#111827" strokeWidth="13" strokeLinecap="round" />
      <path d="M262 122 C 170 130, 110 190, 96 270 S 80 420, 70 470" fill="none" stroke="#374151" strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(70 470)">
        <rect x="-26" y="0" width="52" height="40" rx="6" fill="#d1d5db" stroke="#6b7280" />
        <rect x="-6" y="40" width="12" height="20" rx="2" fill="#9ca3af" />
        <text x="0" y="74" textAnchor="middle" className="fill-slate-400 text-[10px]">endoscope connector</text>
      </g>

      {/* control section head */}
      <path d="M262 64 Q262 40 286 38 L330 38 Q356 40 362 62 L370 150 Q372 168 350 176 L278 176 Q256 168 258 150 Z" fill="url(#cs-body)" stroke="#6b7280" />
      {/* remote switches (top) */}
      <circle cx="290" cy="50" r="9" fill="#9ca3af" stroke="#e5e7eb" />
      <circle cx="318" cy="50" r="9" fill="#9ca3af" stroke="#e5e7eb" />
      <text x="290" y="54" textAnchor="middle" className="fill-slate-900 text-[9px] font-bold">1</text>
      <text x="318" y="54" textAnchor="middle" className="fill-slate-900 text-[9px] font-bold">2</text>
      {/* suction cylinder + valve */}
      <path d="M352 66 L374 46 L386 58 L366 78 Z" fill="#9ca3af" stroke="#d1d5db" />
      <circle cx="380" cy="52" r="8" fill="#e5e7eb" stroke="#6b7280" />
      {/* angulation lever with U/D marks */}
      <path d="M262 92 L214 84 Q200 84 200 96 L200 112 Q200 124 214 122 L262 116 Z" fill="#374151" stroke="#9ca3af" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={212 + i * 8} y1={88} x2={212 + i * 8} y2={118} stroke="#6b7280" strokeWidth="2" />
      ))}
      <text x="365" y="104" className="fill-slate-300 text-[10px] font-semibold">▲U</text>
      <text x="365" y="118" className="fill-slate-300 text-[10px] font-semibold">▼D</text>

      {/* grip */}
      <path d="M278 176 L350 176 L338 330 L292 330 Z" fill="url(#cs-body)" stroke="#6b7280" />
      {/* instrument channel port + biopsy valve + colour code */}
      <path d="M340 270 L372 256 L380 272 L346 290 Z" fill="#6b7280" stroke="#d1d5db" />
      <rect x="368" y="248" width="18" height="16" rx="3" transform="rotate(-25 377 256)" fill="#f8fafc" stroke="#94a3b8" />
      <path d="M338 296 L352 290 L350 312 L336 316 Z" fill="#3b82f6" />
      {/* rotation ring with UP indication */}
      <rect x="286" y="330" width="58" height="22" rx="4" fill="#374151" stroke="#9ca3af" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={292 + i * 8} y1={332} x2={292 + i * 8} y2={350} stroke="#6b7280" />
      ))}
      <circle cx={315 + Math.sin((rotation * Math.PI) / 180) * 22} cy={341} r={3.5} fill="#fbbf24" />
      {/* boot */}
      <path d="M292 352 L338 352 L322 404 L308 404 Z" fill="#1f2937" stroke="#4b5563" />

      {/* insertion tube */}
      <path d="M315 404 L315 450 Q315 478 345 478 L640 478" fill="none" stroke="#030712" strokeWidth="14" strokeLinecap="round" />
      <path d="M315 404 L315 450 Q315 478 345 478 L640 478" fill="none" stroke="#1f2937" strokeWidth="10" strokeLinecap="round" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={380 + i * 22} y1={474} x2={380 + i * 22} y2={482} stroke="#9ca3af" strokeWidth={1} />
      ))}
      {/* UP indication on insertion tube */}
      <circle cx={360} cy={478 - 4 * Math.cos((rotation * Math.PI) / 180)} r={2.6} fill="#fbbf24" />

      {/* bending section */}
      <path d={bend.d} fill="none" stroke="#030712" strokeWidth="13" strokeLinecap="round" />
      <path d={bend.d} fill="none" stroke="#475569" strokeWidth="9" strokeLinecap="round" strokeDasharray="4 3" />
      <circle cx={bend.end.x} cy={bend.end.y} r={6.5} fill="#cbd5e1" stroke="#64748b" />
      <text x={600} y={526} className="fill-slate-400 text-[11px]">
        tip {flex > 0 ? "+" : ""}
        {flex}° · rotation {rotation > 0 ? "+" : ""}
        {rotation}°
      </text>

      {/* distal end face (manual: 1 objective, 2 light guides, 3 channel) */}
      <g transform="translate(640 120)">
        <circle r="50" fill="#0b1220" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="10" cy="4" r="14" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="7" cy="1" r="5" fill="#7dd3fc" opacity="0.6" />
        <circle cx="12" cy="-26" r="7" fill="#fef9c3" stroke="#eab308" />
        <circle cx="16" cy="32" r="7" fill="#fef9c3" stroke="#eab308" />
        <circle cx="-24" cy="2" r="11" fill="#020617" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="0" y="-55" textAnchor="middle" className="fill-slate-300 text-[10px] font-semibold">UP</text>
        <text x="0" y="64" textAnchor="middle" className="fill-slate-300 text-[10px] font-semibold">DOWN</text>
        <text x="0" y="-70" textAnchor="middle" className="fill-slate-400 text-[10px]">distal end (front view)</text>
        <text x="36" y="8" className="fill-sky-300 text-[9px]">objective</text>
        <text x="22" y="-30" className="fill-yellow-200 text-[9px]">light guide</text>
        <text x="-48" y="22" className="fill-amber-300 text-[9px]">channel</text>
      </g>

      {/* octagonal endoscopic image: UP arrow rotates with the scope; tool enters from the right */}
      <g transform="translate(640 300)">
        <path d="M-30 -44 L30 -44 L48 -26 L48 26 L30 44 L-30 44 L-48 26 L-48 -26 Z" fill="#7c2d12" stroke="#94a3b8" />
        <circle r="12" fill="#1c0a05" />
        <g transform={`rotate(${-rotation})`}>
          <path d="M0 -36 L-6 -26 L6 -26 Z" fill="#fbbf24" />
        </g>
        <path d="M48 0 L22 0" stroke="#e5e7eb" strokeWidth="3" />
        <text x="0" y="62" textAnchor="middle" className="fill-slate-400 text-[10px]">image: tool enters at 3 o&apos;clock</text>
      </g>

      {order.map((id, i) => {
        const [x, y] = HOTSPOTS[id];
        return <Hotspot key={id} x={x} y={y} n={i + 1} active={active === id} onClick={() => onSelect(id)} label={id} />;
      })}
    </svg>
  );
}
