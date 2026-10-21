"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { SimShell, type SimLog } from "../SimShell";
import { cn } from "@/lib/utils";

/* ──────────────────────────── Brush: sequencing ──────────────────────────── */

type BrushState = { inScope: boolean; sheathOut: boolean; brushOut: boolean; brushed: boolean };

const BRUSH_ACTIONS = [
  { id: "insert", label: "Insert brush (retracted) into the working channel" },
  { id: "sheath", label: "Advance sheath beyond the scope tip" },
  { id: "extend", label: "Extend brush onto the lesion" },
  { id: "brush", label: "Brush lesion: vigorous to-and-fro strokes" },
  { id: "retract", label: "Retract brush into sheath" },
  { id: "withdraw", label: "Withdraw sheath + brush through channel" },
  { id: "smear", label: "Smear slides / agitate brush in fixative" },
] as const;
type BrushAction = (typeof BRUSH_ACTIONS)[number]["id"];
const SCRAMBLED = [5, 3, 0, 6, 2, 4, 1].map((i) => BRUSH_ACTIONS[i]);

export function BrushSim() {
  const [st, setSt] = useState<BrushState>({ inScope: false, sheathOut: false, brushOut: false, brushed: false });
  const [errors, setErrors] = useState(0);
  const [log, setLog] = useState<SimLog[]>([]);
  const [score, setScore] = useState<number | null>(null);
  // Fixed scrambled order: identical on server and client, and not the answer key.
  const shuffled = SCRAMBLED;
  const push = (l: SimLog) => setLog((x) => [l, ...x]);

  const fail = (text: string) => {
    setErrors((e) => e + 1);
    push({ tone: "danger", text });
  };

  const act = (a: BrushAction) => {
    if (score !== null) return;
    switch (a) {
      case "insert":
        if (st.inScope) return fail("Brush is already in the channel.");
        setSt({ ...st, inScope: true });
        return push({ tone: "ok", text: "Sheathed brush passed through the channel — bristles protected." });
      case "sheath":
        if (!st.inScope) return fail("Nothing in the channel yet.");
        setSt({ ...st, sheathOut: true });
        return push({ tone: "ok", text: "Sheath visible ~2 cm beyond the tip." });
      case "extend":
        if (!st.sheathOut) return fail("Extending the brush inside the channel would damage the scope — advance the sheath out first.");
        setSt({ ...st, brushOut: true });
        return push({ tone: "ok", text: "Brush extended onto the lesion under direct vision." });
      case "brush":
        if (!st.brushOut) return fail("Brush is not deployed.");
        setSt({ ...st, brushed: true });
        return push({ tone: "ok", text: "Several vigorous strokes with rotation across the lesion surface." });
      case "retract":
        if (!st.brushOut) return fail("Brush is not out.");
        if (!st.brushed) push({ tone: "warn", text: "Retracted before sampling the lesion." });
        setSt({ ...st, brushOut: false });
        return push({ tone: "ok", text: "'Brush in!' — bristles back inside the sheath." });
      case "withdraw":
        if (!st.inScope) return fail("Nothing to withdraw.");
        if (st.brushOut) return fail("Withdrawing with the brush exposed strips the sample in the channel and damages it.");
        setSt({ inScope: false, sheathOut: false, brushOut: false, brushed: st.brushed });
        return push({ tone: "ok", text: "Sheath and brush removed together." });
      case "smear": {
        if (st.inScope || !st.brushed) return fail(st.inScope ? "The brush is still in the scope." : "No sample has been collected.");
        const s = Math.max(0, 100 - errors * 15);
        setScore(s);
        return push({ tone: "ok", text: "Slides prepared; brush agitated in CytoLyt. Run complete." });
      }
    }
  };

  const reset = () => {
    setSt({ inScope: false, sheathOut: false, brushOut: false, brushed: false });
    setErrors(0);
    setLog([]);
    setScore(null);
  };

  return (
    <SimShell
      procId="brush"
      title="Mini-simulation: sheathed brushing sequence"
      subtitle="Perform the actions in a safe order. Each unsafe action costs 15 points."
      log={log}
      score={score}
      onReset={reset}
    >
      <div className="space-y-4">
        <svg viewBox="0 0 400 90" className="w-full rounded-lg bg-[#0b1220]" aria-label="Brush state">
          <rect x="0" y="30" width="170" height="30" rx="8" fill="#1f2937" stroke="#475569" />
          <text x="10" y="80" className="fill-slate-500 text-[9px]">scope</text>
          <path d="M240 10 Q300 20 330 45 Q300 70 240 80" fill="#7f2d2a" opacity="0.6" />
          <ellipse cx="300" cy="45" rx="26" ry="18" fill="#d6b4a7" opacity={0.9} />
          <text x="300" y="86" textAnchor="middle" className="fill-slate-500 text-[9px]">lesion</text>
          {st.inScope && <line x1="20" y1="45" x2={st.sheathOut ? 230 : 160} y2="45" stroke="#f59e0b" strokeWidth="5" />}
          {st.brushOut && (
            <g>
              <line x1="230" y1="45" x2="285" y2="45" stroke="#e2e8f0" strokeWidth="1.5" />
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={i} x1={262 + i * 2.5} y1="38" x2={262 + i * 2.5} y2="52" stroke="#cbd5e1" />
              ))}
            </g>
          )}
        </svg>
        <div className="grid gap-2 sm:grid-cols-2">
          {shuffled.map((a) => (
            <Button key={a.id} size="sm" className="h-auto justify-start py-2 text-left" onClick={() => act(a.id)} disabled={score !== null}>
              {a.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted">Errors: {errors}</p>
      </div>
    </SimShell>
  );
}

/* ──────────────────────────── EBBx: forceps & haemostasis ──────────────────────────── */

const HEMOSTASIS = [
  { id: "suction", label: "Suction & observe (keep view)", good: true },
  { id: "saline", label: "Cold saline 20 mL", good: true },
  { id: "epi", label: "Topical epinephrine 1:20,000 (small aliquots)", good: true },
  { id: "wedge", label: "Wedge / balloon tamponade", good: true },
  { id: "withdraw", label: "Withdraw scope to the trachea", good: false },
  { id: "bite", label: "Keep biopsying", good: false },
] as const;

export function EbbxSim() {
  const [lesion, setLesion] = useState<"carina" | "parallel">("parallel");
  const [forceps, setForceps] = useState<"cup" | "alligator" | "spike">("cup");
  const [angle, setAngle] = useState(30);
  const [bites, setBites] = useState<{ ok: boolean; note: string }[]>([]);
  const [bleed, setBleed] = useState(0);
  const [bleedDone, setBleedDone] = useState(false);
  const [usedHem, setUsedHem] = useState<string[]>([]);
  const [penalty, setPenalty] = useState(0);
  const [log, setLog] = useState<SimLog[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const push = (l: SimLog) => setLog((x) => [l, ...x]);

  const effAngle = lesion === "carina" ? Math.min(90, angle + 40) : angle;

  const bite = () => {
    if (bleed > 0) {
      setPenalty((p) => p + 15);
      return push({ tone: "danger", text: "Biopsying into an active bleed worsens haemorrhage — control it first (−15)." });
    }
    const n = bites.length;
    let p = Math.sin((effAngle * Math.PI) / 180);
    if (lesion === "parallel" && forceps === "spike") p += 0.25;
    if (n === 0) p *= 0.45; // surface necrosis
    const cartilage = lesion === "parallel" && effAngle < 25 && Math.random() < 0.5;
    const ok = !cartilage && Math.random() < Math.min(0.95, p);
    const note = cartilage
      ? "Forceps slid and bit a cartilage ring — crushed, non-diagnostic fragment."
      : n === 0 && !ok
        ? "Superficial necrotic slough — go deeper at the same spot."
        : ok
          ? "Good core of viable tumour."
          : "Tangential bite — small superficial fragment.";
    setBites((b) => [...b, { ok, note }]);
    push({ tone: ok ? "ok" : "warn", text: `Bite ${n + 1}: ${note}` });
    if (!bleedDone && n >= 1 && Math.random() < 0.45) {
      setBleed(3);
      push({ tone: "danger", text: "Brisk oozing obscures the field! Choose haemostatic measures." });
    }
  };

  const hem = (id: (typeof HEMOSTASIS)[number]["id"]) => {
    const h = HEMOSTASIS.find((x) => x.id === id)!;
    if (!h.good) {
      setPenalty((p) => p + 15);
      setBleed(Math.min(4, bleed + 1));
      return push({ tone: "danger", text: id === "withdraw" ? "Withdrawing loses control of the bleeding segment and soils the airway (−15)." : "More bites aggravate bleeding (−15)." });
    }
    if (id === "epi" && !usedHem.includes("saline")) push({ tone: "warn", text: "Cold saline is usually tried before epinephrine." });
    setUsedHem((u) => [...u, id]);
    const nb = Math.max(0, bleed - 1);
    setBleed(nb);
    if (nb === 0) {
      setBleedDone(true);
      push({ tone: "ok", text: "Haemostasis achieved. Observe before continuing." });
    } else push({ tone: "info", text: `${h.label}: bleeding slowing.` });
  };

  const finish = () => {
    const good = bites.filter((b) => b.ok).length;
    let s = 40 + Math.min(4, good) * 15 - penalty;
    if (bites.length > 6) s -= 10;
    if (bleed > 0) s -= 25;
    s = Math.max(0, Math.min(100, s));
    setScore(s);
    push({ tone: good >= 3 ? "ok" : "warn", text: `${good} diagnostic fragments from ${bites.length} bites (aim for 3–6 good samples; yield >80% in visible tumours).` });
  };

  const reset = () => {
    setBites([]);
    setBleed(0);
    setBleedDone(false);
    setUsedHem([]);
    setPenalty(0);
    setLog([]);
    setScore(null);
  };

  return (
    <SimShell
      procId="ebbx"
      title="Mini-simulation: forceps orientation & haemostasis"
      subtitle="Exophytic tumour in the bronchus intermedius. Optimise the approach, then manage any bleeding."
      log={log}
      score={score}
      onReset={reset}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-1.5">
            <span className="self-center text-xs text-muted">Lesion:</span>
            {(["parallel", "carina"] as const).map((l) => (
              <button key={l} onClick={() => setLesion(l)} className={cn("rounded-md border px-2 py-1 text-xs", lesion === l ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}>
                {l === "parallel" ? "Along the side wall" : "At a bifurcation"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="self-center text-xs text-muted">Forceps:</span>
            {(["cup", "alligator", "spike"] as const).map((f) => (
              <button key={f} onClick={() => setForceps(f)} className={cn("rounded-md border px-2 py-1 text-xs", forceps === f ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}>
                {f === "spike" ? "With central spike" : f === "cup" ? "Cup" : "Alligator"}
              </button>
            ))}
          </div>
          <label className="block">
            Scope flexion → forceps-to-lesion angle: <b className="font-mono text-cyan-300">{effAngle}°</b>
            <input type="range" className="slider mt-1 w-full" min={5} max={90} value={angle} onChange={(e) => setAngle(+e.target.value)} />
          </label>
          <div className="flex gap-2">
            <Button onClick={bite} disabled={score !== null}><Scissors className="h-3.5 w-3.5" /> Take bite</Button>
            <Button variant="primary" onClick={finish} disabled={score !== null || bites.length === 0}>Finish</Button>
          </div>
          {bleed > 0 && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
              <p className="mb-2 text-xs font-semibold text-rose-200">Bleeding severity: {"●".repeat(bleed)}{"○".repeat(Math.max(0, 4 - bleed))}</p>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {HEMOSTASIS.map((h) => (
                  <Button key={h.id} size="sm" variant="secondary" className="h-auto justify-start py-1.5 text-left" onClick={() => hem(h.id)}>
                    {h.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <svg viewBox="0 0 220 200" className="w-full rounded-lg bg-[#0b1220]" aria-label="Forceps approach angle">
          {lesion === "parallel" ? (
            <>
              <rect x="0" y="150" width="220" height="50" fill="#7f2d2a" opacity="0.6" />
              <path d="M70 150 Q110 112 150 150 Z" fill="#d6b4a7" />
            </>
          ) : (
            <>
              <path d="M110 200 L110 120 L60 60 M110 120 L160 60" stroke="#7f2d2a" strokeWidth="30" opacity="0.6" fill="none" />
              <circle cx="110" cy="122" r="20" fill="#d6b4a7" />
            </>
          )}
          <line
            x1={110 - Math.cos((effAngle * Math.PI) / 180) * 120}
            y1={lesion === "parallel" ? 135 - Math.sin((effAngle * Math.PI) / 180) * 120 : 122 - Math.sin((effAngle * Math.PI) / 180) * 110}
            x2="110"
            y2={lesion === "parallel" ? 135 : 104}
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          {bleed > 0 && <rect width="220" height="200" fill="#991b1b" opacity={0.12 * bleed} />}
          <text x="110" y="16" textAnchor="middle" className="fill-slate-400 text-[10px]">perpendicular bites = deeper tissue</text>
        </svg>
      </div>
    </SimShell>
  );
}
