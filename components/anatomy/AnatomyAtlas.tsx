"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AlertTriangle, Boxes, Eye, Info, Layers, Lightbulb, MapPin, Shuffle } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, Tabs } from "@/components/ui/primitives";
import { MiniMap } from "@/components/airway/MiniMap";
import { SEG_BY_ID, poseLookingInto, START_POSE, type Pose } from "@/lib/airway/geometry";
import { NODE_STATIONS, ZONE_COLORS, type Access } from "@/lib/data/mediastinum";
import type { MapOptions, MapSelection } from "@/components/airway/AirwayMap3D";
import { LarynxDiagram } from "./LarynxDiagram";
import { cn } from "@/lib/utils";

const EndoscopeView = dynamic(() => import("@/components/airway/EndoscopeView").then((m) => m.EndoscopeView), {
  ssr: false,
  loading: () => <div className="aspect-square w-full animate-pulse rounded-2xl bg-panel" />,
});
const AirwayMap3D = dynamic(() => import("@/components/airway/AirwayMap3D").then((m) => m.AirwayMap3D), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-panel" />,
});

type Station = { id: string; label: string; focus: string; pose: () => Pose };

const STATIONS: Station[] = [
  { id: "subglottis", label: "Subglottis / upper trachea", focus: "trachea", pose: () => START_POSE },
  { id: "carina", label: "Main carina", focus: "RMB", pose: () => poseLookingInto("trachea", 16) },
  { id: "rmb", label: "RMB — RUL takeoff", focus: "RUL", pose: () => poseLookingInto("RMB", 9, "RUL") },
  { id: "rul", label: "RUL trifurcation", focus: "RUL", pose: () => poseLookingInto("RUL", 7) },
  { id: "bi", label: "Bronchus intermedius", focus: "BI", pose: () => poseLookingInto("BI", 12) },
  { id: "rml", label: "RML (B4/B5)", focus: "RML", pose: () => poseLookingInto("RML", 7) },
  { id: "rll", label: "RLL: B6 & basal trunk", focus: "RLL", pose: () => poseLookingInto("RLL", 6) },
  { id: "rbasal", label: "RLL basal B7–B10", focus: "RB-basal", pose: () => poseLookingInto("RB-basal", 6) },
  { id: "lmb", label: "Secondary (LUL/LLL) carina", focus: "LMB", pose: () => poseLookingInto("LMB", 14) },
  { id: "lul", label: "LUL: upper division vs lingula", focus: "LUL", pose: () => poseLookingInto("LUL", 6) },
  { id: "lupper", label: "Upper division B1+2 / B3", focus: "LUL-upper", pose: () => poseLookingInto("LUL-upper", 6) },
  { id: "lingula", label: "Lingula B4/B5", focus: "Lingula", pose: () => poseLookingInto("Lingula", 8) },
  { id: "lll", label: "LLL: B6 & basal trunk", focus: "LLL", pose: () => poseLookingInto("LLL", 6) },
  { id: "lbasal", label: "LLL basal B7+8 / B9 / B10", focus: "LB-basal", pose: () => poseLookingInto("LB-basal", 6) },
];

const ACCESS: (Access | "all")[] = ["all", "EBUS", "EUS", "Mediastinoscopy", "Surgical"];

export function AnatomyAtlas() {
  const [tab, setTab] = useState<"endo" | "map">("endo");
  const [station, setStation] = useState(STATIONS[1]);
  const [focus, setFocus] = useState<string>("RMB");
  const poseRef = useRef<Pose>(STATIONS[1].pose());
  const [labels, setLabels] = useState(true);
  const [selection, setSelection] = useState<MapSelection>({ type: "node", id: "4R" });
  const [opts, setOpts] = useState<MapOptions>({ showVessels: true, showNodes: true, showLabels: true, accessFilter: "all" });

  const goStation = (s: Station) => {
    setStation(s);
    setFocus(s.focus);
    poseRef.current = s.pose();
  };

  const selectedBranch = tab === "endo" ? focus : selection?.type === "airway" ? selection.id : null;
  const selectedNode = tab === "map" && selection?.type === "node" ? NODE_STATIONS.find((n) => n.id === selection.id) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            { value: "endo", label: <><Eye className="h-3.5 w-3.5" />Endoscopic view</> },
            { value: "map", label: <><Boxes className="h-3.5 w-3.5" />3D anatomical map + IASLC stations</> },
          ]}
        />
        <p className="text-xs text-muted">
          {tab === "endo"
            ? "Click a label in the image or a branch on the map to read about it."
            : "Drag to orbit · scroll to zoom · click nodes or airways."}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        {tab === "endo" ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative mx-auto w-full max-w-[680px]">
              <EndoscopeView
                key={station.id}
                poseRef={poseRef}
                annotations={labels}
                still
                onLabelClick={(id) => setFocus(id)}
                className="aspect-square w-full rounded-2xl border border-line"
              >
                <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[11px] text-cyan-200/90">
                  {station.label}
                </div>
              </EndoscopeView>
              <div className="mt-2 flex justify-between">
                <Button size="sm" variant="ghost" onClick={() => setLabels((l) => !l)}>
                  <Layers className="h-3.5 w-3.5" /> {labels ? "Hide" : "Show"} labels
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => goStation(STATIONS[Math.floor(Math.random() * STATIONS.length)])}
                >
                  <Shuffle className="h-3.5 w-3.5" /> Random view
                </Button>
              </div>
            </div>
            <Card className="h-fit">
              <CardHeader title="Landmark tour" icon={<MapPin className="h-4 w-4" />} />
              <div className="flex flex-col gap-0.5 p-2">
                {STATIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => goStation(s)}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                      s.id === station.id ? "bg-cyan-500/10 text-cyan-300" : "text-slate-300 hover:bg-panel-2",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="h-56 border-t border-line p-2">
                <MiniMap highlight={focus} onSelect={(id) => setFocus(id)} />
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="h-[560px] overflow-hidden rounded-2xl border border-line">
              <AirwayMap3D selection={selection} onSelect={setSelection} options={opts} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Toggle on={opts.showNodes} onClick={() => setOpts((o) => ({ ...o, showNodes: !o.showNodes }))}>Lymph nodes</Toggle>
              <Toggle on={opts.showVessels} onClick={() => setOpts((o) => ({ ...o, showVessels: !o.showVessels }))}>Great vessels</Toggle>
              <Toggle on={opts.showLabels} onClick={() => setOpts((o) => ({ ...o, showLabels: !o.showLabels }))}>Station labels</Toggle>
              <span className="ml-2 text-xs text-muted">Accessible by:</span>
              {ACCESS.map((a) => (
                <Toggle key={a} on={opts.accessFilter === a} onClick={() => setOpts((o) => ({ ...o, accessFilter: a }))}>
                  {a === "all" ? "All" : a}
                </Toggle>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-muted">
              {Object.entries(ZONE_COLORS).map(([z, c]) => (
                <span key={z} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  {z}
                </span>
              ))}
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />Aorta</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500/60" />Pulmonary artery</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-400/60" />SVC / azygos</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {selectedNode ? <NodeInfo id={selectedNode.id} /> : selectedBranch ? <BranchInfo id={selectedBranch} /> : (
            <Card className="p-4 text-sm text-muted">Select an airway branch or lymph node station.</Card>
          )}
          {tab === "endo" && <LarynxDiagram />}
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        on ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400 hover:text-slate-200",
      )}
    >
      {children}
    </button>
  );
}

function BranchInfo({ id }: { id: string }) {
  const seg = SEG_BY_ID[id];
  const def = seg?.def;
  if (!seg || !def) return null;
  return (
    <Card>
      <CardHeader
        title={def.name}
        subtitle={[def.boyden && `Boyden ${def.boyden}`, def.jacksonHuber && `Jackson–Huber: ${def.jacksonHuber}`].filter(Boolean).join(" · ") || def.level}
        icon={<Info className="h-4 w-4" />}
        action={<Badge tone="accent">{def.level}</Badge>}
      />
      <div className="space-y-3 p-4 text-sm">
        <p className="leading-relaxed text-slate-300">{def.description}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-md bg-panel-2 p-2"><p className="text-muted">Length</p><p className="font-mono text-slate-200">{def.length} mm</p></div>
          <div className="rounded-md bg-panel-2 p-2"><p className="text-muted">ID origin</p><p className="font-mono text-slate-200">{def.diameter[0]} mm</p></div>
          <div className="rounded-md bg-panel-2 p-2"><p className="text-muted">Side</p><p className="font-mono text-slate-200">{def.side === "C" ? "Midline" : def.side === "R" ? "Right" : "Left"}</p></div>
        </div>
        {def.landmarks && (
          <Section icon={<MapPin className="h-3.5 w-3.5" />} title="Landmarks">
            {def.landmarks}
          </Section>
        )}
        {def.variations && (
          <Section icon={<Lightbulb className="h-3.5 w-3.5" />} title="Variations">
            {def.variations}
          </Section>
        )}
        {def.pitfalls && (
          <Callout tone="warn" title={<span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />Pitfalls</span>}>
            <ul className="list-disc space-y-1 pl-4">
              {def.pitfalls.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Callout>
        )}
        <p className="text-[11px] text-muted">Source: Ernst 2017, ch. 4 (paraphrased).</p>
      </div>
    </Card>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: string[] }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">{icon}{title}</p>
      <ul className="list-disc space-y-1 pl-5 text-[13px] text-slate-300">
        {children.map((c) => <li key={c}>{c}</li>)}
      </ul>
    </div>
  );
}

function NodeInfo({ id }: { id: string }) {
  const n = NODE_STATIONS.find((x) => x.id === id)!;
  return (
    <Card>
      <CardHeader
        title={`Station ${n.id} — ${n.name}`}
        subtitle={n.zone}
        icon={<span className="mt-1 block h-3 w-3 rounded-full" style={{ background: ZONE_COLORS[n.zone] }} />}
      />
      <div className="space-y-3 p-4 text-sm">
        <div className="flex flex-wrap gap-1.5">
          {n.access.map((a) => (
            <Badge key={a} tone={a === "EBUS" ? "accent" : a === "Surgical" ? "danger" : "default"}>{a}</Badge>
          ))}
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">IASLC boundaries</p>
          <p className="text-[13px] leading-relaxed text-slate-300">{n.boundaries}</p>
        </div>
        {n.ebusTechnique && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">EBUS approach</p>
            <p className="text-[13px] leading-relaxed text-slate-300">{n.ebusTechnique}</p>
          </div>
        )}
        {n.landmarkVessel && <p className="text-[13px] text-slate-300"><b className="text-slate-200">Vascular landmark:</b> {n.landmarkVessel}</p>}
        {n.pearl && <Callout tone="info" title="Pearl">{n.pearl}</Callout>}
        <p className="text-[11px] text-muted">Sources: IASLC map (Rusch 2009); Ernst 2017 ch. 11 &amp; 13. Positions in the 3D model are schematic.</p>
      </div>
    </Card>
  );
}
