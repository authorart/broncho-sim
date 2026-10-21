"use client";

import { useState } from "react";
import { Droplets } from "lucide-react";
import { Button, Callout } from "@/components/ui/primitives";
import { SimShell, type SimLog } from "../SimShell";
import { cn } from "@/lib/utils";

type Suction = "gentle" | "strong";

function rand(spread: number) {
  return (Math.random() - 0.5) * 2 * spread;
}

/* ──────────────────────────── BAL ──────────────────────────── */

const BAL_SITES = [
  { id: "RML", label: "RML (B4/B5)", base: 0.62 },
  { id: "Lingula", label: "Lingula (B4/B5)", base: 0.6 },
  { id: "RB10", label: "RLL posterior basal (B10)", base: 0.42 },
  { id: "LB9", label: "LLL lateral basal (B9)", base: 0.44 },
] as const;

type WedgeZone = "open" | "wedged" | "over";
const zoneOf = (d: number): WedgeZone => (d < 38 ? "open" : d <= 72 ? "wedged" : "over");

export function BalSim() {
  const [site, setSite] = useState<(typeof BAL_SITES)[number]["id"] | null>(null);
  const [depth, setDepth] = useState(10);
  const [confirmed, setConfirmed] = useState(false);
  const [suction, setSuction] = useState<Suction>("gentle");
  const [aliquots, setAliquots] = useState<{ vol: number; rec: number }[]>([]);
  const [log, setLog] = useState<SimLog[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [penalties, setPenalties] = useState<Set<string>>(new Set());

  const zone = zoneOf(depth);
  const push = (l: SimLog) => setLog((x) => [l, ...x]);
  const penalise = (k: string) => setPenalties((p) => new Set(p).add(k));

  const reset = () => {
    setSite(null);
    setDepth(10);
    setConfirmed(false);
    setSuction("gentle");
    setAliquots([]);
    setLog([]);
    setScore(null);
    setPenalties(new Set());
  };

  const suctionTest = () => {
    if (zone === "open") {
      push({ tone: "warn", text: "Suction test: lumen stays open around the tip — NOT wedged; fluid will leak proximally." });
      setConfirmed(false);
    } else if (zone === "wedged") {
      push({ tone: "ok", text: "Suction test: the distal airway gently collapses around the tip — wedge confirmed (3rd–4th order)." });
      setConfirmed(true);
    } else {
      push({ tone: "danger", text: "Tip forced: mucosa blanches, a trickle of blood appears — over-wedged. Withdraw slightly." });
      setConfirmed(false);
      penalise("over");
    }
  };

  const instil = (vol: number) => {
    if (!site) return push({ tone: "warn", text: "Choose a lavage site first." });
    if (!confirmed) {
      push({ tone: "warn", text: "Instilling without a confirmed wedge — expect leak and contamination." });
      penalise("unconfirmed");
    }
    const base = BAL_SITES.find((s) => s.id === site)!.base;
    const wf = zone === "open" ? 0.35 : zone === "wedged" ? 1 : 0.55;
    const sf = suction === "gentle" ? 1 : 0.6;
    if (suction === "strong") {
      push({ tone: "warn", text: "Strong suction collapses the distal airways — recovery falls." });
      penalise("strong");
    }
    const frac = Math.max(0.05, Math.min(0.85, base * wf * sf + rand(0.07)));
    const rec = Math.round(vol * frac);
    setAliquots((a) => [...a, { vol, rec }]);
    push({
      tone: zone === "over" ? "danger" : frac >= 0.4 ? "ok" : "warn",
      text: `Aliquot ${aliquots.length + 1}: ${vol} mL in → ${rec} mL back (${Math.round(frac * 100)}%)${zone === "over" ? ", blood-tinged" : ""}.`,
    });
  };

  const finish = () => {
    const inV = aliquots.reduce((s, a) => s + a.vol, 0);
    const outV = aliquots.reduce((s, a) => s + a.rec, 0);
    const pct = inV ? (outV / inV) * 100 : 0;
    let s = 100;
    const notes: SimLog[] = [];
    if (site === "RB10" || site === "LB9") {
      s -= 15;
      notes.push({ tone: "warn", text: "Diffuse disease: RML/lingula give better recovery than lower-lobe segments in the supine patient (−15)." });
    }
    if (penalties.has("unconfirmed")) { s -= 15; notes.push({ tone: "warn", text: "Instilled before confirming wedge (−15)." }); }
    if (penalties.has("over")) { s -= 20; notes.push({ tone: "danger", text: "Over-wedging traumatised the mucosa and added blood (−20)." }); }
    if (penalties.has("strong")) { s -= 10; notes.push({ tone: "warn", text: "Strong suction used (−10) — use gentle suction (<100 mmHg) or syringe." }); }
    if (inV < 100 || inV > 300) { s -= 10; notes.push({ tone: "warn", text: `Total instilled ${inV} mL — aim for 100–300 mL (−10).` }); }
    if (aliquots.length < 3 || aliquots.length > 5) { s -= 10; notes.push({ tone: "warn", text: `${aliquots.length} aliquots — standard is 3–5 (−10).` }); }
    if (pct < 40) { s -= 10; notes.push({ tone: "warn", text: `Recovery ${pct.toFixed(0)}% is below the normal 40–70% (−10).` }); }
    if (outV < 40) { s -= 10; notes.push({ tone: "warn", text: `Only ${outV} mL returned — labs usually need ~40–60 mL (−10).` }); }
    s = Math.max(0, s);
    setScore(s);
    setLog((l) => [{ tone: "info", text: `Finished: ${inV} mL instilled, ${outV} mL recovered (${pct.toFixed(0)}%).` }, ...notes, ...l]);
  };

  const inV = aliquots.reduce((s, a) => s + a.vol, 0);
  const outV = aliquots.reduce((s, a) => s + a.rec, 0);

  return (
    <SimShell
      procId="bal"
      title="Mini-simulation: wedge & lavage"
      subtitle="Immunocompromised patient with diffuse bilateral ground-glass opacities — rule out PJP / infection."
      log={log}
      score={score}
      onReset={reset}
    >
      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-1.5 text-xs uppercase tracking-wider text-muted">1 · Choose the segment</p>
          <div className="flex flex-wrap gap-1.5">
            {BAL_SITES.map((s) => (
              <button
                key={s.id}
                disabled={score !== null}
                onClick={() => {
                  setSite(s.id);
                  push({ tone: "info", text: `Site selected: ${s.label}.` });
                }}
                className={cn("rounded-md border px-2.5 py-1 text-xs", site === s.id ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-300")}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div>
            <p className="mb-1.5 text-xs uppercase tracking-wider text-muted">2 · Advance into the subsegment</p>
            <input
              type="range"
              className="slider w-full"
              min={0}
              max={100}
              value={depth}
              disabled={score !== null}
              onChange={(e) => {
                setDepth(+e.target.value);
                setConfirmed(false);
              }}
            />
            <p className="mt-1 text-xs">
              Tip position:{" "}
              <b className={cn(zone === "open" && "text-amber-300", zone === "wedged" && "text-emerald-300", zone === "over" && "text-rose-300")}>
                {zone === "open" ? "lumen open" : zone === "wedged" ? "snug in 3rd–4th order bronchus" : "forced / over-wedged"}
              </b>
            </p>
            <Button size="sm" className="mt-2" onClick={suctionTest} disabled={score !== null}>
              Gentle suction test
            </Button>
          </div>
          <WedgeGraphic depth={depth} zone={zone} />
        </div>

        <div>
          <p className="mb-1.5 text-xs uppercase tracking-wider text-muted">3 · Instil & recover aliquots</p>
          <div className="flex flex-wrap items-center gap-2">
            {[20, 30, 50, 60].map((v) => (
              <Button key={v} size="sm" onClick={() => instil(v)} disabled={score !== null}>
                <Droplets className="h-3.5 w-3.5" /> {v} mL
              </Button>
            ))}
            <span className="ml-2 text-xs text-muted">Suction:</span>
            {(["gentle", "strong"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSuction(s)}
                className={cn("rounded-md border px-2 py-1 text-xs capitalize", suction === s ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Meter label="Instilled" value={`${inV} mL`} />
            <Meter label="Recovered" value={`${outV} mL`} />
            <Meter label="Return" value={inV ? `${Math.round((outV / inV) * 100)}%` : "—"} />
          </div>
        </div>

        <Button variant="primary" onClick={finish} disabled={score !== null || aliquots.length === 0}>
          Finish & send specimens
        </Button>
        {score !== null && (
          <Callout tone="info">
            Request cell count/differential, PJP DFA/silver stain, bacterial/fungal/AFB cultures, galactomannan and viral PCR. Normal
            differential: macrophages ~90%, lymphocytes ~5–10%.
          </Callout>
        )}
      </div>
    </SimShell>
  );
}

function WedgeGraphic({ depth, zone }: { depth: number; zone: WedgeZone }) {
  const tipX = 20 + depth * 1.4;
  return (
    <svg viewBox="0 0 200 120" className="w-full rounded-lg bg-[#0b1220]" aria-label="Scope tip in a tapering bronchus">
      <path d="M0 20 L120 40 L200 52 L200 68 L120 80 L0 100 Z" fill="#7f2d2a" opacity="0.65" />
      <path d="M0 30 L120 46 L200 56 L200 64 L120 74 L0 90 Z" fill="#1a0808" />
      <rect x={tipX - 60} y={46 - Math.max(0, (tipX - 80) * 0.08)} width={60} height={28 + Math.max(0, (tipX - 80) * 0.16)} rx="6" fill="#334155" stroke="#64748b" />
      <circle cx={tipX} cy={60} r={3} fill={zone === "wedged" ? "#34d399" : zone === "over" ? "#fb7185" : "#fbbf24"} />
      {zone === "over" && <circle cx={tipX + 6} cy={52} r={3} fill="#dc2626" opacity="0.8" />}
    </svg>
  );
}

function Meter({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-panel-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}

/* ──────────────────────────── Bronchial washing ──────────────────────────── */

export function WashSim() {
  const [vol, setVol] = useState(20);
  const [wedge, setWedge] = useState(false);
  const [suction, setSuction] = useState<Suction>("gentle");
  const [returned, setReturned] = useState<number | null>(null);
  const [cyto, setCyto] = useState(false);
  const [micro, setMicro] = useState(false);
  const [log, setLog] = useState<SimLog[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const push = (l: SimLog) => setLog((x) => [l, ...x]);

  const reset = () => {
    setVol(20);
    setWedge(false);
    setSuction("gentle");
    setReturned(null);
    setCyto(false);
    setMicro(false);
    setLog([]);
    setScore(null);
  };

  const wash = () => {
    const frac = (suction === "gentle" ? 0.55 : 0.35) + rand(0.08);
    const r = Math.round(vol * frac);
    setReturned(r);
    push({ tone: "info", text: `Instilled ${vol} mL at the LUL orifice${wedge ? " (wedged)" : ""}, recovered ${r} mL into the trap.` });
    if (suction === "strong") push({ tone: "warn", text: "High suction traumatises mucosa and collapses the airway — use gentle wall suction." });
  };

  const finish = () => {
    let s = 100;
    const notes: SimLog[] = [];
    if (wedge) { s -= 15; notes.push({ tone: "warn", text: "Washing does not require wedging — that's BAL (−15)." }); }
    if (vol > 50) { s -= 15; notes.push({ tone: "warn", text: "Washing volumes are small: 5–50 mL (−15)." }); }
    if (suction === "strong") { s -= 10; notes.push({ tone: "warn", text: "Gentle suction recommended (−10)." }); }
    if (!cyto) { s -= 20; notes.push({ tone: "warn", text: "Cytology not requested for a suspected tumour (−20)." }); }
    if ((returned ?? 0) < (cyto && micro ? 15 : 10)) { s -= 15; notes.push({ tone: "warn", text: "Insufficient return: ~10 mL cytology + ~5–15 mL microbiology (−15)." }); }
    setScore(Math.max(0, s));
    setLog((l) => [{ tone: "ok", text: `Specimens sent: ${[cyto && "cytology", micro && "microbiology"].filter(Boolean).join(" + ") || "none"}.` }, ...notes, ...l]);
  };

  return (
    <SimShell
      procId="bw"
      title="Mini-simulation: targeted bronchial washing"
      subtitle="Smoker with an exophytic LUL lesion — washings collected alongside brushing and biopsy."
      log={log}
      score={score}
      onReset={reset}
    >
      <div className="space-y-4 text-sm">
        <label className="block">
          Saline volume: <b className="font-mono text-cyan-300">{vol} mL</b>
          <input type="range" className="slider mt-1 w-full" min={5} max={100} step={5} value={vol} onChange={(e) => setVol(+e.target.value)} disabled={score !== null} />
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={wedge} onChange={(e) => setWedge(e.target.checked)} className="accent-cyan-400" disabled={score !== null} />Wedge the scope</label>
          <span className="flex items-center gap-2">
            Suction:
            {(["gentle", "strong"] as const).map((s) => (
              <button key={s} onClick={() => setSuction(s)} className={cn("rounded-md border px-2 py-0.5 text-xs capitalize", suction === s ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}>{s}</button>
            ))}
          </span>
        </div>
        <Button onClick={wash} disabled={score !== null}><Droplets className="h-3.5 w-3.5" /> Instil & aspirate</Button>
        {returned !== null && (
          <div className="space-y-2 rounded-lg border border-line bg-panel-2 p-3">
            <p>Specimen trap: <b className="font-mono">{returned} mL</b>. Route to:</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={cyto} onChange={(e) => setCyto(e.target.checked)} className="accent-cyan-400" />Cytology</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={micro} onChange={(e) => setMicro(e.target.checked)} className="accent-cyan-400" />Microbiology</label>
            </div>
            <Button variant="primary" size="sm" onClick={finish} disabled={score !== null}>Send & finish</Button>
          </div>
        )}
      </div>
    </SimShell>
  );
}
