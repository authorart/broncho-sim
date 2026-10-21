"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/primitives";
import { SimShell, type SimLog } from "../SimShell";
import { cn } from "@/lib/utils";

const CYCLE = 4; // s per breath
const INSP = 1.6; // s inspiration
const PLEURA_BASE = 56; // mm from scope tip at end-expiration

/** Pleura moves outward on inspiration. */
function pleuraAt(t: number) {
  const ph = t % CYCLE;
  const insp = ph < INSP;
  const k = insp ? Math.sin((ph / INSP) * (Math.PI / 2)) : Math.cos(((ph - INSP) / (CYCLE - INSP)) * (Math.PI / 2));
  return { pos: PLEURA_BASE + 4 * k, insp };
}

export function TblbSim() {
  const [depth, setDepth] = useState(20);
  const [jaws, setJaws] = useState<"closed" | "open">("closed");
  const [samples, setSamples] = useState(0);
  const [touched, setTouched] = useState(false);
  const [penalty, setPenalty] = useState(0);
  const [ptx, setPtx] = useState(false);
  const [log, setLog] = useState<SimLog[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const start = useRef(0);
  const painLogged = useRef(false);

  const depthRef = useRef(depth);
  const jawsRef = useRef(jaws);

  // Breathing animation + pleural contact detection run in the rAF loop (not during render).
  useEffect(() => {
    start.current = performance.now();
    let raf = 0;
    const loop = () => {
      const now = (performance.now() - start.current) / 1000;
      setT(now);
      const d = pleuraAt(now).pos - depthRef.current;
      if (d <= 1.5 && !painLogged.current) {
        painLogged.current = true;
        if (jawsRef.current === "closed") {
          setTouched(true);
          setLog((x) => [{ tone: "warn", text: "Resistance — patient reports sharp pain: you are at the pleura. Withdraw 1–2 cm before opening." }, ...x]);
        } else {
          setPenalty((p) => p + 20);
          setLog((x) => [{ tone: "danger", text: "Open jaws against the pleura! High pneumothorax risk (−20)." }, ...x]);
        }
      }
      if (d > 6) painLogged.current = false;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { pos: pleura, insp } = pleuraAt(t);
  const dist = pleura - depth;
  const push = (l: SimLog) => setLog((x) => [l, ...x]);
  const setJawsBoth = (j: "open" | "closed") => {
    jawsRef.current = j;
    setJaws(j);
  };

  const open = () => {
    setJawsBoth("open");
    if (!touched) push({ tone: "warn", text: "Opened before locating the pleura (no resistance felt yet) — distance is a guess." });
    else if (dist < 10) {
      setPenalty((p) => p + 10);
      push({ tone: "warn", text: `Opened only ${dist.toFixed(0)} mm from the pleura (−10). Aim for 10–20 mm.` });
    } else push({ tone: "ok", text: `Jaws opened ${dist.toFixed(0)} mm from the pleura${insp ? " during inspiration ✓" : ""}.` });
  };

  const close = () => {
    if (jaws !== "open") return;
    setJawsBoth("closed");
    const d = dist;
    let note = "";
    let tone: SimLog["tone"] = "ok";
    if (d < 8) {
      if (Math.random() < 0.35) {
        setPtx(true);
        setPenalty((p) => p + 35);
        tone = "danger";
        note = `Bite ${d.toFixed(0)} mm from the pleura → PNEUMOTHORAX on fluoroscopy (−35).`;
      } else {
        setPenalty((p) => p + 10);
        tone = "warn";
        note = `Bite only ${d.toFixed(0)} mm from the pleura — got away with it this time (−10).`;
      }
      setSamples((s) => s + 1);
    } else if (d > 30) {
      tone = "warn";
      note = "Bite too proximal — mostly bronchial wall, little alveolar tissue.";
    } else {
      setSamples((s) => s + 1);
      note = `Good parenchymal sample (${d.toFixed(0)} mm from pleura).`;
    }
    if (insp) {
      note += " Closed during inspiration — prefer end-expiration.";
      setPenalty((p) => p + 3);
    } else note += " Closed at expiration ✓";
    if (Math.random() < 0.08) {
      note += " Moderate bleeding — kept wedged with suction; settled.";
    }
    push({ tone, text: note });
  };

  const finish = () => {
    let s = 30 + Math.min(6, samples) * 12 - penalty;
    if (samples < 4) s -= 10;
    s = Math.max(0, Math.min(100, s));
    setScore(s);
    push({ tone: samples >= 4 ? "ok" : "warn", text: `${samples} parenchymal samples (BTS: 4–6 diffuse, 7–8 focal). ${ptx ? "Pneumothorax: assess size, aspirate/drain if large or symptomatic." : "Fluoroscopic screen: no pneumothorax."}` });
  };

  const reset = () => {
    setDepth(20);
    depthRef.current = 20;
    setJawsBoth("closed");
    setSamples(0);
    setTouched(false);
    setPenalty(0);
    setPtx(false);
    setLog([]);
    setScore(null);
  };

  // Fluoro geometry
  const px = (mm: number) => 30 + mm * 4.4;
  return (
    <SimShell
      procId="tblb"
      title="Mini-simulation: fluoroscopic TBLB"
      subtitle="Suspected sarcoidosis, diffuse micronodules. Locate the pleura, back off, open on inspiration, close at end-expiration."
      log={log}
      score={score}
      onReset={reset}
    >
      <div className="space-y-3 text-sm">
        <svg viewBox="0 0 320 200" className="w-full rounded-lg bg-[#0c0f14]" aria-label="Fluoroscopy view">
          <defs>
            <radialGradient id="lung" cx="0.4" cy="0.5" r="0.7">
              <stop offset="0" stopColor="#3f4652" />
              <stop offset="1" stopColor="#14171c" />
            </radialGradient>
          </defs>
          <rect width="320" height="200" fill="url(#lung)" />
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d={`M0 ${20 + i * 32} Q160 ${0 + i * 32} 330 ${40 + i * 32}`} stroke="#5b6472" strokeWidth="5" fill="none" opacity="0.45" />
          ))}
          <path d={`M${px(pleura)} 0 Q${px(pleura) + 18} 100 ${px(pleura)} 200`} stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <text x={px(pleura) - 4} y="14" textAnchor="end" className="fill-slate-300 text-[9px]">pleura</text>
          {ptx && <path d={`M${px(pleura) - 12} 10 Q${px(pleura) - 2} 100 ${px(pleura) - 12} 190`} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />}
          {/* scope */}
          <rect x="0" y="94" width="30" height="12" fill="#e5e7eb" opacity="0.8" />
          {/* forceps */}
          <line x1="30" y1="100" x2={px(depth)} y2="100" stroke="#f8fafc" strokeWidth="2" />
          {jaws === "open" ? (
            <path d={`M${px(depth)} 100 l8 -6 M${px(depth)} 100 l8 6`} stroke="#f8fafc" strokeWidth="2.5" />
          ) : (
            <rect x={px(depth)} y="97" width="8" height="6" fill="#f8fafc" />
          )}
          <text x="10" y="190" className={cn("text-[10px] font-semibold", insp ? "fill-cyan-300" : "fill-amber-300")}>
            {insp ? "INSPIRATION" : "EXPIRATION"}
          </text>
          <text x="310" y="190" textAnchor="end" className="fill-slate-300 font-mono text-[10px]">
            to pleura {Math.max(0, dist).toFixed(0)} mm
          </text>
        </svg>
        <label className="block">
          Forceps advance beyond scope: <b className="font-mono text-cyan-300">{depth} mm</b>
          <input type="range" className="slider mt-1 w-full" min={0} max={62} value={depth} onChange={(e) => { setDepth(+e.target.value); depthRef.current = +e.target.value; }} disabled={score !== null} />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={open} disabled={jaws === "open" || score !== null}>Open jaws</Button>
          <Button onClick={close} disabled={jaws === "closed" || score !== null}>Close & retract (bite)</Button>
          <Button variant="primary" onClick={finish} disabled={score !== null || samples === 0}>Finish & screen for PTX</Button>
          <span className="self-center font-mono text-xs text-muted">samples {samples}</span>
        </div>
      </div>
    </SimShell>
  );
}
