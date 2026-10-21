"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { SEGMENTS, SEG_BY_ID, frontal, type V3 } from "@/lib/airway/geometry";
import { cn } from "@/lib/utils";

export type MiniMapHandle = { setTip: (p: V3, dir: V3) => void };

const VIEW = { x: -48, y: -114, w: 110, h: 200 };

/** Coronal schematic (viewer's left = patient's right, radiographic convention). */
export const MiniMap = forwardRef<
  MiniMapHandle,
  { target?: string | null; highlight?: string | null; className?: string; onSelect?: (id: string) => void }
>(function MiniMap({ target, highlight, className, onSelect }, ref) {
  const tipRef = useRef<SVGGElement>(null);
  useImperativeHandle(ref, () => ({
    setTip(p, dir) {
      const [x, y] = frontal(p);
      const [dx, dy] = [dir[0], -dir[1]];
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      tipRef.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${ang})`);
    },
  }));

  const targetIds = new Set<string>();
  if (target) {
    targetIds.add(target);
    for (const s of SEGMENTS) if (s.segmentId === target) targetIds.add(s.id);
  }

  return (
    <svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Coronal airway map with scope position"
    >
      {SEGMENTS.map((s) => {
        const [x1, y1] = frontal(s.a);
        const [x2, y2] = frontal(s.b);
        const isTarget = targetIds.has(s.id);
        const isHi = highlight && (s.id === highlight || s.segmentId === highlight);
        return (
          <line
            key={s.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeLinecap="round"
            strokeWidth={Math.max(1.2, (s.r1 + s.r2) * 0.85)}
            className={cn(
              onSelect && s.level === "segmental" && "cursor-pointer",
              isTarget ? "stroke-amber-400" : isHi ? "stroke-cyan-300" : "stroke-slate-600/80",
            )}
            onClick={onSelect && s.level === "segmental" ? () => onSelect(s.id) : undefined}
          >
            <title>{s.name}</title>
          </line>
        );
      })}
      <text x={VIEW.x + 3} y={VIEW.y + 8} className="fill-slate-500 text-[6px]">R</text>
      <text x={VIEW.x + VIEW.w - 7} y={VIEW.y + 8} className="fill-slate-500 text-[6px]">L</text>
      {target && SEG_BY_ID[target] && (
        <text
          x={frontal(SEG_BY_ID[target].b)[0]}
          y={frontal(SEG_BY_ID[target].b)[1] + 9}
          textAnchor="middle"
          className="fill-amber-300 text-[6px] font-semibold"
        >
          {target}
        </text>
      )}
      <g ref={tipRef}>
        <circle r={3.2} className="fill-cyan-400" />
        <path d="M2.5 -2 L7 0 L2.5 2 Z" className="fill-cyan-200" />
      </g>
    </svg>
  );
});
