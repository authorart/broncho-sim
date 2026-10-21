"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsDown,
  ChevronsUp,
  Crosshair,
  Eye,
  EyeOff,
  Gauge,
  MapPin,
  RotateCcw,
  RotateCw,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import { EndoscopeView } from "@/components/airway/EndoscopeView";
import { MiniMap, type MiniMapHandle } from "@/components/airway/MiniMap";
import { Badge, Button, Card, CardHeader, Callout, Tabs } from "@/components/ui/primitives";
import { SEGMENT_IDS } from "@/lib/data/airway";
import {
  CHILDREN,
  SEG_BY_ID,
  START_POSE,
  locationLabel,
  nearestSegment,
  poseLookingInto,
  type Pose,
} from "@/lib/airway/geometry";
import {
  FLEX_DOWN_MAX,
  FLEX_UP_MAX,
  createScope,
  emptyInput,
  insertionCm,
  scopeView,
  stepScope,
  type ScopeInput,
  type ScopeState,
} from "@/lib/airway/scope";
import { useProgress } from "@/lib/store/progress";
import { cn, formatSeconds } from "@/lib/utils";

type Mode = "free" | "navigate" | "identify";

type Hud = {
  location: string;
  level: string;
  depthCm: number;
  flex: number;
  roll: number;
  contacts: number;
  wedged: boolean;
  time: number;
};

const LANDMARKS: { label: string; pose: () => Pose }[] = [
  { label: "Subglottis (start)", pose: () => START_POSE },
  { label: "Main carina", pose: () => poseLookingInto("trachea", 16) },
  { label: "RUL orifice", pose: () => poseLookingInto("RMB", 9, "RUL") },
  { label: "RUL trifurcation", pose: () => poseLookingInto("RUL", 7) },
  { label: "BI → RML / RLL", pose: () => poseLookingInto("BI", 12) },
  { label: "RLL basal segments", pose: () => poseLookingInto("RB-basal", 6) },
  { label: "LUL / LLL secondary carina", pose: () => poseLookingInto("LMB", 14) },
  { label: "Upper division vs lingula", pose: () => poseLookingInto("LUL", 6) },
  { label: "LLL basal segments", pose: () => poseLookingInto("LB-basal", 6) },
];

function depthOf(id: string) {
  let d = 0;
  let cur = SEG_BY_ID[id];
  while (cur?.parent) {
    d += 1;
    cur = SEG_BY_ID[cur.parent];
  }
  return d;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function identifyOptions(target: string) {
  const parent = SEG_BY_ID[target].parent!;
  const siblings = (CHILDREN[parent] ?? []).filter((s) => s.level === "segmental" && s.id !== target).map((s) => s.id);
  const others = SEGMENT_IDS.filter((id) => id !== target && !siblings.includes(id)).sort(() => Math.random() - 0.5);
  const opts = [target, ...siblings.slice(0, 2), ...others].slice(0, 4);
  return opts.sort(() => Math.random() - 0.5);
}

export function Simulator() {
  const [initialScope] = useState(createScope);
  const scopeRef = useRef<ScopeState>(initialScope);
  const poseRef = useRef<Pose>(scopeView(initialScope));
  const flashRef = useRef(0);
  const inputRef = useRef<{ keys: Set<string>; ui: ScopeInput; wheel: number; drag: { flex: number; roll: number } }>({
    keys: new Set(),
    ui: emptyInput(),
    wheel: 0,
    drag: { flex: 0, roll: 0 },
  });
  const miniRef = useRef<MiniMapHandle>(null);
  const hudTimer = useRef(0);
  const dwell = useRef(0);

  const [mode, setMode] = useState<Mode>("free");
  const [annotations, setAnnotations] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [target, setTarget] = useState<string | null>(null);
  const [taskState, setTaskState] = useState<"idle" | "running" | "done">("idle");
  const [result, setResult] = useState<{ success: boolean; score: number; time: number; contacts: number; chosen?: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [hud, setHud] = useState<Hud>({ location: "Trachea", level: "trachea", depthCm: 18, flex: 0, roll: 0, contacts: 0, wedged: false, time: 0 });
  const recordSim = useProgress((s) => s.recordSim);

  const taskRef = useRef({ mode, target, taskState });
  useEffect(() => {
    taskRef.current = { mode, target, taskState };
  }, [mode, target, taskState]);

  const resetTo = useCallback((pose: Pose) => {
    scopeRef.current = createScope(pose);
    poseRef.current = scopeView(scopeRef.current);
    dwell.current = 0;
  }, []);

  const finishNavigate = useCallback(
    (success: boolean) => {
      const s = scopeRef.current;
      const t = taskRef.current.target!;
      const par = 12 + depthOf(t) * 5;
      const score = success ? Math.max(0, Math.round(100 - Math.max(0, s.time - par) * 1.5 - s.contacts * 8)) : 0;
      setTaskState("done");
      setResult({ success, score, time: s.time, contacts: s.contacts });
      recordSim({ kind: "navigate", target: t, success, timeSec: Math.round(s.time), contacts: s.contacts, score });
    },
    [recordSim],
  );

  const onTick = useCallback(
    (dt: number) => {
      const inp = inputRef.current;
      const k = inp.keys;
      const input: ScopeInput = {
        advance: (k.has("w") || k.has("arrowup") ? 1 : 0) - (k.has("s") || k.has("arrowdown") ? 1 : 0) + inp.ui.advance + inp.wheel,
        roll: (k.has("d") || k.has("arrowright") ? 1 : 0) - (k.has("a") || k.has("arrowleft") ? 1 : 0) + inp.ui.roll + inp.drag.roll,
        flex: (k.has("q") ? 1 : 0) - (k.has("e") ? 1 : 0) + inp.ui.flex + inp.drag.flex,
        straighten: k.has(" ") || inp.ui.straighten,
        slow: k.has("shift"),
      };
      inp.wheel *= 0.82;
      if (Math.abs(inp.wheel) < 0.02) inp.wheel = 0;
      inp.drag.flex *= 0.6;
      inp.drag.roll *= 0.6;
      input.advance = Math.max(-1, Math.min(1, input.advance));

      const { mode: m, taskState: ts, target: tgt } = taskRef.current;
      const s = scopeRef.current;
      // Scope is frozen in identify mode and outside a running navigation task.
      if (m === "identify" || (m === "navigate" && ts !== "running")) Object.assign(input, emptyInput());
      stepScope(s, input, dt);
      flashRef.current = s.flash;
      const view = scopeView(s);
      poseRef.current = view;
      miniRef.current?.setTip(view.pos, view.forward);

      if (m === "navigate" && ts === "running" && tgt) {
        const loc = nearestSegment(s.pos);
        const inTarget = loc.seg.id === tgt || loc.seg.segmentId === tgt;
        if (inTarget && (loc.seg.id !== tgt || loc.h > 0.2)) dwell.current += dt;
        else dwell.current = 0;
        if (dwell.current > 0.6) finishNavigate(true);
      }

      hudTimer.current += dt;
      if (hudTimer.current > 0.12) {
        hudTimer.current = 0;
        const loc = locationLabel(s.pos);
        setHud({
          location: loc.label,
          level: loc.level,
          depthCm: insertionCm(s),
          flex: s.flex,
          roll: s.rollDeg,
          contacts: s.contacts,
          wedged: s.wedged,
          time: s.time,
        });
      }
    },
    [finishNavigate],
  );

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d", "q", "e", " ", "shift", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        inputRef.current.keys.add(key);
        if (key.startsWith("arrow") || key === " ") e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => inputRef.current.keys.delete(e.key.toLowerCase());
    const blur = () => inputRef.current.keys.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // Wheel + drag on the view
  const viewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      inputRef.current.wheel = Math.max(-1, Math.min(1, inputRef.current.wheel - e.deltaY * 0.004));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const startMode = (m: Mode) => {
    setMode(m);
    setResult(null);
    setTaskState("idle");
    setTarget(null);
    if (m === "free") resetTo(START_POSE);
  };

  const newNavigateTask = () => {
    const t = pick(SEGMENT_IDS);
    setTarget(t);
    setResult(null);
    resetTo(START_POSE);
    setTaskState("running");
  };

  const newIdentifyTask = () => {
    const t = pick(SEGMENT_IDS);
    const parent = SEG_BY_ID[t].parent!;
    const back = Math.min(7, SEG_BY_ID[parent].length * 0.6);
    resetTo(poseLookingInto(parent, back, t));
    setTarget(t);
    setOptions(identifyOptions(t));
    setResult(null);
    setTaskState("running");
  };

  const answerIdentify = (id: string) => {
    if (!target || taskState !== "running") return;
    const success = id === target;
    const score = success ? 100 : 0;
    setTaskState("done");
    setResult({ success, score, time: 0, contacts: 0, chosen: id });
    recordSim({ kind: "identify", target, success, timeSec: 0, contacts: 0, score });
  };

  /** On-screen hold buttons: apply a partial input while pressed, clear it on release. */
  const setHold = useCallback((patch: Partial<ScopeInput>, active: boolean) => {
    const ui = inputRef.current.ui as Record<string, unknown>;
    for (const [k, v] of Object.entries(patch)) ui[k] = active ? v : typeof v === "boolean" ? false : 0;
  }, []);

  const showLabels = mode === "free" && annotations;
  const flexPct = ((hud.flex - FLEX_DOWN_MAX) / (FLEX_UP_MAX - FLEX_DOWN_MAX)) * 100;
  const zeroPct = ((0 - FLEX_DOWN_MAX) / (FLEX_UP_MAX - FLEX_DOWN_MAX)) * 100;

  const identifyFrozen = mode === "identify";
  // Don't reveal the answer through the HUD or map while an identification question is open.
  const hideLocation = mode === "identify" && !result;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs
            value={mode}
            onChange={startMode}
            options={[
              { value: "free", label: <><Eye className="h-3.5 w-3.5" />Free exploration</> },
              { value: "navigate", label: <><Target className="h-3.5 w-3.5" />Task: navigate</> },
              { value: "identify", label: <><Crosshair className="h-3.5 w-3.5" />Task: identify</> },
            ]}
          />
          <div className="flex items-center gap-2">
            {mode === "free" && (
              <Button size="sm" variant="ghost" onClick={() => setAnnotations((a) => !a)} aria-pressed={annotations}>
                {annotations ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                Labels
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setQuality((q) => (q === "high" ? "low" : "high"))}>
              <Gauge className="h-3.5 w-3.5" />
              {quality === "high" ? "High quality" : "Performance"}
            </Button>
          </div>
        </div>

        <div
          ref={viewRef}
          className="relative mx-auto aspect-square w-full max-w-[min(78vh,760px)] touch-none select-none overflow-hidden rounded-2xl border border-line"
          onPointerDown={(e) => {
            if (identifyFrozen) return;
            if ((e.target as HTMLElement).tagName === "BUTTON") return;
            dragRef.current = { x: e.clientX, y: e.clientY };
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!dragRef.current) return;
            const dx = e.clientX - dragRef.current.x;
            const dy = e.clientY - dragRef.current.y;
            dragRef.current = { x: e.clientX, y: e.clientY };
            inputRef.current.drag.roll = Math.max(-3, Math.min(3, dx * 0.35));
            inputRef.current.drag.flex = Math.max(-3, Math.min(3, -dy * 0.35));
          }}
          onPointerUp={() => (dragRef.current = null)}
          onPointerCancel={() => (dragRef.current = null)}
        >
          <EndoscopeView
            poseRef={poseRef}
            flashRef={flashRef}
            annotations={showLabels}
            onTick={onTick}
            quality={quality}
            className="h-full w-full"
          >
            <div className="pointer-events-none absolute left-3 top-3 space-y-1 font-mono text-[11px] text-cyan-200/90">
              <p>{hideLocation ? "location hidden" : hud.location}</p>
              <p className="text-slate-400">INS {hud.depthCm.toFixed(1)} cm · FLX {hud.flex > 0 ? "+" : ""}{hud.flex.toFixed(0)}°</p>
            </div>
            <div className="pointer-events-none absolute right-3 top-3 text-right font-mono text-[11px] text-slate-300/90">
              <p>{formatSeconds(hud.time)}</p>
              <p className={cn(hud.contacts > 0 && "text-rose-300")}>wall contacts {hud.contacts}</p>
            </div>
            {hud.wedged && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded bg-amber-500/20 px-2 py-1 font-mono text-[11px] text-amber-200 ring-1 ring-amber-400/40">
                WEDGED — lumen narrower than scope
              </div>
            )}
          </EndoscopeView>
          {mode === "navigate" && taskState !== "running" && (
            <Overlay>
              {result ? (
                <ResultCard result={result} target={target!} onNext={newNavigateTask} />
              ) : (
                <div className="max-w-sm text-center">
                  <Target className="mx-auto h-8 w-8 text-amber-300" />
                  <h3 className="mt-2 text-lg font-semibold">Navigation task</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    A random segmental bronchus is assigned. Drive from the subglottis to its lumen. Scored on time
                    against par and wall contacts (mucosal trauma).
                  </p>
                  <Button variant="primary" className="mt-4" onClick={newNavigateTask}>
                    Start task
                  </Button>
                </div>
              )}
            </Overlay>
          )}
          {mode === "identify" && taskState === "idle" && (
            <Overlay>
              <div className="max-w-sm text-center">
                <Crosshair className="mx-auto h-8 w-8 text-cyan-300" />
                <h3 className="mt-2 text-lg font-semibold">Identification task</h3>
                <p className="mt-1 text-sm text-slate-300">
                  You will be parked in front of a division with no labels. Name the segmental orifice in the
                  <b> centre of the view</b>.
                </p>
                <Button variant="primary" className="mt-4" onClick={newIdentifyTask}>
                  Start task
                </Button>
              </div>
            </Overlay>
          )}
          {mode === "identify" && taskState !== "idle" && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-cyan-300/70" />
          )}
        </div>

        {/* On-screen controls (touch friendly) */}
        <div className="mx-auto grid w-full max-w-[760px] grid-cols-3 gap-2 sm:grid-cols-6">
          <CtrlBtn label="Advance" hint="W / ↑ / wheel" icon={<ArrowUp className="h-4 w-4" />} patch={{ advance: 1 }} onHold={setHold} disabled={identifyFrozen} />
          <CtrlBtn label="Withdraw" hint="S / ↓" icon={<ArrowDown className="h-4 w-4" />} patch={{ advance: -1 }} onHold={setHold} disabled={identifyFrozen} />
          <CtrlBtn label="Tip up" hint="Q · drag ↑" icon={<ChevronsUp className="h-4 w-4" />} patch={{ flex: 1 }} onHold={setHold} disabled={identifyFrozen} />
          <CtrlBtn label="Tip down" hint="E · drag ↓" icon={<ChevronsDown className="h-4 w-4" />} patch={{ flex: -1 }} onHold={setHold} disabled={identifyFrozen} />
          <CtrlBtn label="Rotate CCW" hint="A / ←" icon={<RotateCcw className="h-4 w-4" />} patch={{ roll: -1 }} onHold={setHold} disabled={identifyFrozen} />
          <CtrlBtn label="Rotate CW" hint="D / →" icon={<RotateCw className="h-4 w-4" />} patch={{ roll: 1 }} onHold={setHold} disabled={identifyFrozen} />
        </div>
        <p className="text-center text-xs text-muted">
          Space = straighten tip · Shift = fine advance · drag on the image to flex/rotate. Image convention: operator
          behind the head — anterior wall at top, patient&apos;s right on screen right.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {mode === "identify" && taskState !== "idle" && (
          <Card>
            <CardHeader title="Which segment is in the centre?" icon={<Crosshair className="h-4 w-4" />} />
            <div className="grid grid-cols-2 gap-2 p-4">
              {options.map((o) => {
                const isAns = result && o === target;
                const isWrong = result && o === result.chosen && !result.success;
                return (
                  <Button
                    key={o}
                    onClick={() => answerIdentify(o)}
                    disabled={!!result}
                    className={cn(
                      "h-auto flex-col items-start py-2 text-left",
                      isAns && "!border-emerald-400 !bg-emerald-500/15 !opacity-100",
                      isWrong && "!border-rose-400 !bg-rose-500/15 !opacity-100",
                    )}
                  >
                    <span className="font-mono text-sm font-semibold">{o}</span>
                    <span className="text-[11px] text-muted">{SEG_BY_ID[o].def?.jacksonHuber}</span>
                  </Button>
                );
              })}
            </div>
            {result && (
              <div className="space-y-3 border-t border-line p-4">
                <Callout tone={result.success ? "ok" : "danger"} title={result.success ? "Correct" : `Incorrect — this was ${target}`}>
                  {SEG_BY_ID[target!].def?.description}
                </Callout>
                <Button variant="primary" onClick={newIdentifyTask}>Next airway</Button>
              </div>
            )}
          </Card>
        )}

        <Card>
          <CardHeader title="Bending section" subtitle="Thumb lever: up to +180° / −130°" icon={<Gauge className="h-4 w-4" />} />
          <div className="flex items-center gap-4 p-4">
            <div className="relative h-36 w-3 rounded-full bg-panel-2">
              <div className="absolute inset-x-0 h-px bg-slate-500" style={{ bottom: `${zeroPct}%` }} />
              <div
                className="absolute left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-400 shadow"
                style={{ bottom: `${flexPct}%` }}
              />
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2 text-sm">
              <Readout label="Tip flex" value={`${hud.flex > 0 ? "+" : ""}${hud.flex.toFixed(0)}°`} />
              <Readout label="Rotation" value={`${hud.roll > 0 ? "+" : ""}${hud.roll.toFixed(0)}°`} />
              <Readout label="Insertion" value={`${hud.depthCm.toFixed(1)} cm`} />
              <Readout label="Contacts" value={String(hud.contacts)} tone={hud.contacts ? "danger" : undefined} />
            </div>
          </div>
        </Card>

        <Card className={cn("overflow-hidden", hideLocation && "hidden")}>
          <CardHeader
            title="Position (coronal)"
            subtitle={mode === "navigate" && target ? `Target: ${SEG_BY_ID[target].name}` : hud.location}
            icon={<MapPin className="h-4 w-4" />}
            action={mode === "navigate" && target ? <Badge tone="warn">{target}</Badge> : null}
          />
          <div className="h-72 p-2">
            <MiniMap ref={miniRef} target={mode === "navigate" ? target : null} />
          </div>
        </Card>

        {mode === "free" && (
          <Card>
            <CardHeader title="Jump to landmark" icon={<MapPin className="h-4 w-4" />} />
            <div className="flex flex-wrap gap-1.5 p-4">
              {LANDMARKS.map((l) => (
                <Button key={l.label} size="sm" onClick={() => resetTo(l.pose())}>
                  {l.label}
                </Button>
              ))}
            </div>
          </Card>
        )}
        {mode === "navigate" && taskState === "running" && (
          <Card className="p-4">
            <p className="text-sm">
              Navigate to <b className="text-amber-300">{SEG_BY_ID[target!].name}</b>
            </p>
            <p className="mt-1 text-xs text-muted">Par time {12 + depthOf(target!) * 5}s · −8 per wall contact</p>
            <Button size="sm" variant="danger" className="mt-3" onClick={() => finishNavigate(false)}>
              Give up
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0 grid place-items-center bg-slate-950/70 p-6 backdrop-blur-sm">{children}</div>;
}

function ResultCard({
  result,
  target,
  onNext,
}: {
  result: { success: boolean; score: number; time: number; contacts: number };
  target: string;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-line bg-panel p-5 text-center">
      <Trophy className={cn("mx-auto h-8 w-8", result.success ? "text-amber-300" : "text-slate-500")} />
      <h3 className="mt-2 text-lg font-semibold">{result.success ? `Reached ${target}` : "Task abandoned"}</h3>
      <p className="mt-1 font-mono text-4xl font-bold text-cyan-300">{result.score}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <Readout label="Time" value={formatSeconds(result.time)} icon={<Timer className="h-3 w-3" />} />
        <Readout label="Wall contacts" value={String(result.contacts)} tone={result.contacts ? "danger" : undefined} />
      </div>
      <Button variant="primary" className="mt-4" onClick={onNext}>
        Next target
      </Button>
    </div>
  );
}

function Readout({ label, value, tone, icon }: { label: string; value: string; tone?: "danger"; icon?: ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-panel-2 px-2 py-1.5">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">{icon}{label}</p>
      <p className={cn("font-mono text-sm font-semibold", tone === "danger" && "text-rose-300")}>{value}</p>
    </div>
  );
}

function CtrlBtn({
  label,
  hint,
  icon,
  disabled,
  patch,
  onHold,
}: {
  label: string;
  hint: string;
  icon: ReactNode;
  disabled?: boolean;
  patch: Partial<ScopeInput>;
  onHold: (patch: Partial<ScopeInput>, active: boolean) => void;
}) {
  const release = () => onHold(patch, false);
  return (
    <button
      disabled={disabled}
      className="flex touch-none select-none flex-col items-center gap-0.5 rounded-lg border border-line bg-panel px-2 py-2 text-xs text-slate-200 active:bg-cyan-500/20 disabled:opacity-40"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onHold(patch, true);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <span className="text-[10px] text-muted">{hint}</span>
    </button>
  );
}
