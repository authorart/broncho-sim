"use client";

import { Hotspot } from "./Hotspot";

const CP_SPOTS: Record<string, [number, number]> = {
  transducer: [580, 300],
  balloon: [600, 232],
  optics: [470, 312],
  channel: [440, 222],
  sheath: [208, 408],
  stopper: [430, 408],
  stylet: [690, 408],
  syringe: [556, 470],
};

/**
 * Convex-probe EBUS tip in side view, after the BF-UC190F spec-sheet drawing: the UP side is at the
 * top. From proximal to distal: instrument channel outlet (UP side), forward-oblique objective lens +
 * light guide on the slope, then the curved linear transducer forming the distal end, which scans
 * toward the UP side — so flexing UP presses it onto the airway wall. The needle leaves the outlet
 * at an angle and runs inside the 65° ultrasound sector. Balloon channel outlet on the DOWN side.
 * Below: the EBUS-TBNA needle handle.
 */
export function CpEbusDiagram({
  active,
  onSelect,
  order,
  balloon,
  needleOut,
  stopperMm,
  oblique,
  flex,
}: {
  active: string;
  onSelect: (id: string) => void;
  order: string[];
  balloon: boolean;
  needleOut: number; // 0..1 of stopper travel
  stopperMm: number;
  oblique: number;
  flex: number;
}) {
  const out = { x: 462, y: 238 };
  const nA = (-17 * Math.PI) / 180;
  const nLen = 8 + needleOut * stopperMm * 4.4;
  const nEnd = { x: out.x + Math.cos(nA) * nLen, y: out.y + Math.sin(nA) * nLen };
  // 65° ultrasound sector from the convex array, centred up-forward.
  const fc = { x: 538, y: 262 };
  const fanR = 165;
  const c0 = (-38 * Math.PI) / 180;
  const half = (32.5 * Math.PI) / 180;
  const p1 = { x: fc.x + Math.cos(c0 - half) * fanR, y: fc.y + Math.sin(c0 - half) * fanR };
  const p2 = { x: fc.x + Math.cos(c0 + half) * fanR, y: fc.y + Math.sin(c0 + half) * fanR };
  // Optics on the slope: view axis tilted `oblique`° toward the UP side, 80° field of view.
  const oc = { x: 482, y: 250 };
  const oA = (-oblique * Math.PI) / 180;
  const fov = (40 * Math.PI) / 180;
  const ray = (a: number, r = 130) => `${oc.x + Math.cos(a) * r},${oc.y + Math.sin(a) * r}`;
  const bendDeg = flex * 0.22;

  return (
    <svg viewBox="0 0 780 500" className="w-full" role="img" aria-label="Convex-probe EBUS bronchoscope tip and EBUS-TBNA needle">
      <defs>
        <linearGradient id="cream" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fafaf9" />
          <stop offset="1" stopColor="#a8a29e" />
        </linearGradient>
        <linearGradient id="blk" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4b5563" />
          <stop offset="0.5" stopColor="#111827" />
          <stop offset="1" stopColor="#030712" />
        </linearGradient>
      </defs>

      <text x="30" y="40" className="fill-slate-300 text-[11px] font-semibold">UP ▲</text>
      <text x="30" y="352" className="fill-slate-300 text-[11px] font-semibold">DOWN ▼</text>

      {/* tip drawn ×1.35 so the distal anatomy is legible */}
      <g transform="translate(-170 -100) scale(1.35)">
      <g transform={`rotate(${-bendDeg} 330 265)`}>
        {/* ultrasound sector */}
        <path d={`M${fc.x},${fc.y} L${p1.x},${p1.y} A${fanR} ${fanR} 0 0 1 ${p2.x},${p2.y} Z`} fill="#22d3ee" opacity="0.07" stroke="#22d3ee" strokeOpacity="0.35" />
        <text x={fc.x + 40} y={fc.y - 150} className="fill-cyan-300/80 text-[9px]">65° scan sector</text>
        {/* optical field of view */}
        <path d={`M${oc.x},${oc.y} L${ray(oA - fov)} M${oc.x},${oc.y} L${ray(oA + fov)}`} stroke="#38bdf8" strokeDasharray="3 4" opacity="0.55" />
        <path d={`M${oc.x},${oc.y} L${ray(oA, 140)}`} stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />
        <text x={oc.x + 40} y={oc.y + 46} className="fill-sky-300 text-[9px]">{oblique}° forward-oblique · 80° FOV</text>

        {/* bending section + insertion tube */}
        <rect x="20" y="240" width="312" height="50" rx="14" fill="url(#blk)" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1={222 + i * 13} y1={242} x2={222 + i * 13} y2={288} stroke="#374151" strokeWidth="2" />
        ))}
        {/* rigid distal part */}
        <path d="M330 240 L474 240 L492 256 L492 290 L330 290 Z" fill="url(#cream)" stroke="#78716c" />
        {/* instrument channel outlet (UP side) */}
        <ellipse cx={out.x} cy={out.y + 1} rx="9" ry="4" fill="#020617" stroke="#f59e0b" />
        {/* objective lens + light guide on the slope */}
        <circle cx={oc.x} cy={oc.y} r="5" fill="#0c4a6e" stroke="#38bdf8" />
        <circle cx={oc.x - 9} cy={oc.y - 7} r="3" fill="#fef9c3" stroke="#eab308" />
        {/* curved linear transducer forming the distal end, facing the UP side */}
        <path d="M492 256 Q540 240 566 262 Q578 280 560 290 L492 290 Z" fill="url(#cream)" stroke="#78716c" />
        <path d="M496 255 Q540 239 566 262" fill="none" stroke="#fb7185" strokeWidth="7" strokeLinecap="round" />
        {Array.from({ length: 9 }).map((_, i) => {
          const t = i / 8;
          const x = 498 + t * 66;
          const y = 254 - Math.sin(t * Math.PI) * 10 + t * 8;
          return <line key={i} x1={x} y1={y} x2={x - 2} y2={y - 6} stroke="#be123c" />;
        })}
        {/* balloon channel outlet (DOWN side) */}
        <circle cx="520" cy="290" r="3.5" fill="#020617" />
        {balloon && <ellipse cx="532" cy="262" rx="52" ry="34" fill="#7dd3fc" opacity="0.25" stroke="#7dd3fc" strokeDasharray="4 3" />}

        {/* needle */}
        {needleOut > 0.02 && (
          <>
            <line x1={out.x} y1={out.y} x2={nEnd.x} y2={nEnd.y} stroke="#16a34a" strokeWidth="5" opacity="0.75" />
            <line x1={out.x} y1={out.y} x2={nEnd.x} y2={nEnd.y} stroke="#f1f5f9" strokeWidth="2" />
            <text x={nEnd.x + 6} y={nEnd.y - 4} className="fill-slate-200 text-[10px]">needle</text>
          </>
        )}
        <text x="40" y="232" className="fill-slate-400 text-[10px]">bending section</text>
        <text x="345" y="308" className="fill-stone-300 text-[10px]">rigid distal part (25 mm)</text>
      </g>
      {(["transducer", "balloon", "optics", "channel"] as const).map((id) => {
        const [x, y] = CP_SPOTS[id];
        const n = order.indexOf(id) + 1;
        return <Hotspot key={id} x={x} y={y} n={n} active={active === id} onClick={() => onSelect(id)} label={id} />;
      })}
      </g>

      {/* EBUS-TBNA needle handle */}
      <g transform="translate(120 390)">
        <rect x="0" y="6" width="40" height="24" rx="4" fill="#64748b" />
        <text x="20" y="48" textAnchor="middle" className="fill-slate-400 text-[9px]">to biopsy port</text>
        <rect x="40" y="0" width="100" height="36" rx="6" fill="#2563eb" stroke="#93c5fd" />
        <text x="90" y="22" textAnchor="middle" className="fill-white text-[10px] font-semibold">sheath adj.</text>
        <rect x="140" y="4" width="420" height="28" rx="6" fill="#e5e7eb" stroke="#94a3b8" />
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i}>
            <line x1={260 + i * 30} y1={4} x2={260 + i * 30} y2={12} stroke="#334155" />
            <text x={260 + i * 30} y={-2} textAnchor="middle" className="fill-slate-500 text-[8px]">{i * 5}</text>
          </g>
        ))}
        <rect x={252 + stopperMm * 6} y="-2" width="18" height="40" rx="3" fill="#f59e0b" stroke="#fcd34d" />
        <rect x={226 + needleOut * stopperMm * 6} y="0" width="28" height="36" rx="4" fill="#16a34a" stroke="#86efac" />
        <text x="420" y="54" textAnchor="middle" className="fill-amber-300 text-[10px]">stopper {stopperMm} mm (needle 20–40 mm)</text>
        <rect x="560" y="10" width="30" height="16" rx="3" fill="#94a3b8" />
        <circle cx="598" cy="18" r="8" fill="#cbd5e1" stroke="#64748b" />
        <path d="M430 32 L430 80 L470 80" stroke="#94a3b8" fill="none" strokeWidth="2" />
        <rect x="470" y="68" width="100" height="24" rx="5" fill="#f8fafc" opacity="0.9" />
        <text x="520" y="84" textAnchor="middle" className="fill-slate-900 text-[10px] font-semibold">20 mL syringe</text>
      </g>

      {order
        .filter((id) => !["transducer", "balloon", "optics", "channel"].includes(id))
        .map((id) => {
          const [x, y] = CP_SPOTS[id];
          return <Hotspot key={id} x={x} y={y} n={order.indexOf(id) + 1} active={active === id} onClick={() => onSelect(id)} label={id} />;
        })}
    </svg>
  );
}

const RP_SPOTS: Record<string, [number, number]> = {
  probe: [430, 168],
  scope: [120, 168],
  gs: [262, 120],
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
  const gsTip = [tip[0] - 26, tip[1] - (tip[1] - 150) * 0.15];
  return (
    <svg viewBox="0 0 960 300" className="w-full" role="img" aria-label="Radial EBUS probe in a peripheral bronchus">
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
      {/* thin bronchoscope wedged in the segmental bronchus */}
      <rect x="0" y="130" width="190" height="20" rx="7" fill="#111827" stroke="#4b5563" />
      <text x="10" y="122" className="fill-slate-400 text-[10px]">thin scope (Ø ~4.2 mm, 2.0 mm channel)</text>
      {/* guide sheath with radiopaque tip marker */}
      <path d={`M190 140 L360 150 L${gsTip[0]} ${gsTip[1]}`} stroke="#f59e0b" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85" />
      <circle cx={gsTip[0]} cy={gsTip[1]} r="4" fill="#fde68a" stroke="#b45309" />
      {/* radial probe */}
      <path d={`M190 140 L360 150 L${tip[0]} ${tip[1]}`} stroke="#e2e8f0" strokeWidth="2" fill="none" />
      <circle cx={tip[0]} cy={tip[1]} r="6" fill="#22d3ee" />
      <circle cx={tip[0]} cy={tip[1]} r="18" fill="none" stroke="#22d3ee" opacity="0.5" strokeDasharray="3 3" />
      <text x={tip[0] + 22} y={tip[1] + 30} className="fill-cyan-300 text-[10px]">20 MHz, 360°</text>

      {/* fluoroscopy inset */}
      <g transform="translate(780 20)">
        <rect width="170" height="150" rx="10" fill="#111827" stroke="#475569" />
        <circle cx="85" cy="75" r="62" fill="#1f2937" />
        <ellipse cx="102" cy="70" rx="18" ry="15" fill="#9ca3af" opacity="0.55" />
        <path d={`M20 120 L60 98 L${88 + (tip[0] - 590) * 0.15} ${70 + (tip[1] - 160) * 0.15}`} stroke="#f8fafc" strokeWidth="2" fill="none" />
        <circle cx={84 + (gsTip[0] - 590) * 0.15} cy={70 + (gsTip[1] - 160) * 0.15} r="2.5" fill="#fde68a" />
        <text x="85" y="144" textAnchor="middle" className="fill-slate-400 text-[10px]">fluoroscopy</text>
      </g>

      {order.map((id, i) => {
        const [x, y] = RP_SPOTS[id];
        return <Hotspot key={id} x={x} y={y} n={i + 1} active={active === id} onClick={() => onSelect(id)} label={id} />;
      })}
    </svg>
  );
}
