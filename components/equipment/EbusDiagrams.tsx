"use client";

import { Hotspot } from "./Hotspot";

const CP_SPOTS: Record<string, [number, number]> = {
  transducer: [338, 92],
  balloon: [300, 40],
  optics: [212, 52],
  channel: [214, 156],
  sheath: [520, 236],
  stopper: [640, 236],
  stylet: [890, 236],
  vacutainer: [780, 300],
};

/** CP-EBUS distal tip (side view) + needle device. */
export function CpEbusDiagram({
  active,
  onSelect,
  order,
  balloon,
  needleOut,
  stopperMm,
}: {
  active: string;
  onSelect: (id: string) => void;
  order: string[];
  balloon: boolean;
  needleOut: number; // 0..1
  stopperMm: number;
}) {
  const needleAngle = (32 * Math.PI) / 180;
  const nLen = 20 + needleOut * 130;
  const nx = 236 + Math.cos(needleAngle) * nLen;
  const ny = 150 + Math.sin(needleAngle) * nLen;
  return (
    <svg viewBox="0 0 960 340" className="w-full" role="img" aria-label="Convex-probe EBUS scope tip and needle">
      {/* scope shaft */}
      <rect x="20" y="96" width="210" height="58" rx="10" fill="#1f2937" stroke="#475569" />
      {/* tip housing */}
      <path d="M230 96 L300 96 Q360 100 362 140 Q360 170 300 162 L230 154 Z" fill="#334155" stroke="#64748b" />
      {/* convex array */}
      <path d="M300 98 Q362 100 362 140" fill="none" stroke="#22d3ee" strokeWidth="6" />
      {/* balloon */}
      {balloon && <ellipse cx="332" cy="112" rx="44" ry="34" fill="#38bdf8" opacity="0.22" stroke="#7dd3fc" strokeDasharray="4 3" />}
      {/* ultrasound fan */}
      <path d="M330 120 L470 20 A170 170 0 0 1 520 210 Z" fill="#22d3ee" opacity="0.06" />
      {/* oblique optics */}
      <circle cx="232" cy="110" r="7" fill="#082f49" stroke="#38bdf8" />
      <path d="M232 110 L150 30 M232 110 L110 80" stroke="#38bdf8" strokeDasharray="3 4" opacity="0.7" />
      <text x="108" y="24" className="fill-sky-300 text-[10px]">forward-oblique view ≈20–35°</text>
      {/* channel exit + needle */}
      <circle cx="236" cy="150" r="6" fill="#020617" stroke="#f59e0b" />
      <line x1="236" y1="150" x2={nx} y2={ny} stroke="#e2e8f0" strokeWidth="2.5" />
      <text x={nx + 6} y={ny + 4} className="fill-slate-300 text-[10px]">needle</text>

      {/* needle device */}
      <g transform="translate(420 220)">
        <rect x="0" y="0" width="520" height="34" rx="8" fill="#1e293b" stroke="#475569" />
        <rect x="70" y="-6" width="80" height="46" rx="6" fill="#0369a1" stroke="#38bdf8" />
        <text x="110" y="62" textAnchor="middle" className="fill-sky-300 text-[10px]">sheath adjuster</text>
        <rect x={190 + stopperMm * 1.5} y="-6" width="50" height="46" rx="6" fill="#b45309" stroke="#f59e0b" />
        <text x={215 + stopperMm * 1.5} y="62" textAnchor="middle" className="fill-amber-300 text-[10px]">stopper {stopperMm} mm</text>
        <rect x="440" y="6" width="80" height="22" rx="4" fill="#64748b" />
        <line x1="520" y1="17" x2="545" y2="17" stroke="#cbd5e1" strokeWidth="4" />
        <circle cx="550" cy="17" r="7" fill="#cbd5e1" />
        <path d="M330 34 L330 70 L390 70" stroke="#94a3b8" fill="none" strokeWidth="2" />
        <rect x="380" y="58" width="70" height="26" rx="5" fill="#e2e8f0" opacity="0.9" />
        <text x="415" y="75" textAnchor="middle" className="fill-slate-900 text-[10px] font-semibold">20 mL</text>
      </g>

      {order.map((id, i) => {
        const [x, y] = CP_SPOTS[id];
        return <Hotspot key={id} x={x} y={y} n={i + 1} active={active === id} onClick={() => onSelect(id)} label={id} />;
      })}
    </svg>
  );
}

const RP_SPOTS: Record<string, [number, number]> = {
  probe: [430, 168],
  gs: [250, 128],
  patterns: [600, 70],
  fluoro: [820, 50],
};

export type ProbePosition = "concentric" | "eccentric" | "adjacent" | "aerated";

/** Peripheral bronchus with lesion; the probe tip position follows the chosen relationship. */
export function RpEbusDiagram({
  active,
  onSelect,
  order,
  position,
}: {
  active: string;
  onSelect: (id: string) => void;
  order: string[];
  position: ProbePosition;
}) {
  const tip = { concentric: [590, 160], eccentric: [560, 176], adjacent: [520, 196], aerated: [470, 236] }[position];
  return (
    <svg viewBox="0 0 960 300" className="w-full" role="img" aria-label="Radial EBUS probe in a peripheral bronchus">
      {/* lung parenchyma */}
      <rect x="0" y="0" width="760" height="300" fill="#0b1220" />
      {/* bronchial tree */}
      <path d="M0 140 L200 140 L360 150 L470 160 L600 160" stroke="#be7b74" strokeWidth="26" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M360 150 L470 236 L520 280" stroke="#be7b74" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.45" />
      <path d="M470 160 L520 196" stroke="#be7b74" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.45" />
      {/* lesion */}
      <ellipse cx="600" cy="160" rx="62" ry="50" fill="#64748b" opacity="0.65" stroke="#94a3b8" />
      <text x="600" y="230" textAnchor="middle" className="fill-slate-400 text-[11px]">peripheral lesion</text>
      {/* pleura */}
      <path d="M740 0 Q720 150 740 300" stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="6 4" />
      <text x="728" y="292" textAnchor="end" className="fill-slate-400 text-[10px]">visceral pleura</text>
      {/* scope + guide sheath + probe */}
      <rect x="0" y="128" width="180" height="24" rx="8" fill="#1f2937" stroke="#475569" />
      <path d={`M180 140 L360 150 L${tip[0] - 10} ${tip[1]}`} stroke="#f59e0b" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M180 140 L360 150 L${tip[0]} ${tip[1]}`} stroke="#e2e8f0" strokeWidth="2" fill="none" />
      <circle cx={tip[0]} cy={tip[1]} r="7" fill="#22d3ee" />
      <circle cx={tip[0]} cy={tip[1]} r="16" fill="none" stroke="#22d3ee" opacity="0.5" strokeDasharray="3 3" />

      {/* fluoroscopy inset */}
      <g transform="translate(780 20)">
        <rect width="170" height="150" rx="10" fill="#111827" stroke="#475569" />
        <circle cx="85" cy="75" r="62" fill="#1f2937" />
        <ellipse cx="102" cy="70" rx="18" ry="15" fill="#9ca3af" opacity="0.55" />
        <path d={`M20 120 L60 98 L${88 + (tip[0] - 590) * 0.15} ${70 + (tip[1] - 160) * 0.15}`} stroke="#f8fafc" strokeWidth="2" fill="none" />
        <text x="85" y="144" textAnchor="middle" className="fill-slate-400 text-[10px]">fluoroscopy</text>
      </g>

      {order.map((id, i) => {
        const [x, y] = RP_SPOTS[id];
        return <Hotspot key={id} x={x} y={y} n={i + 1} active={active === id} onClick={() => onSelect(id)} label={id} />;
      })}
    </svg>
  );
}
