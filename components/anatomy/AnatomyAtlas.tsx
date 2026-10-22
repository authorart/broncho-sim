"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AlertTriangle, Boxes, Eye, Info, Layers, Lightbulb, MapPin, Shuffle } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, Tabs } from "@/components/ui/primitives";
import { MiniMap } from "@/components/airway/MiniMap";
import { SEG_BY_ID, type Pose } from "@/lib/airway/geometry";
import { STANDARD_VIEWS, type StandardView } from "@/lib/airway/views";
import { NODE_STATIONS, ZONE_COLORS, type Access } from "@/lib/data/mediastinum";
import type { MapOptions, MapSelection } from "@/components/airway/AirwayMap3D";
import { LarynxDiagram } from "./LarynxDiagram";
import { cn } from "@/lib/utils";
import { useL } from "@/lib/i18n/locale";
import { useContent } from "@/lib/i18n/content";

const EndoscopeView = dynamic(() => import("@/components/airway/EndoscopeView").then((m) => m.EndoscopeView), {
  ssr: false,
  loading: () => <div className="aspect-square w-full animate-pulse rounded-2xl bg-panel" />,
});
const AirwayMap3D = dynamic(() => import("@/components/airway/AirwayMap3D").then((m) => m.AirwayMap3D), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-panel" />,
});

type Station = StandardView;
const STATIONS: Station[] = STANDARD_VIEWS;

const ACCESS: (Access | "all")[] = ["all", "EBUS", "EUS", "Mediastinoscopy", "Surgical"];

export function AnatomyAtlas() {
  const [tab, setTab] = useState<"endo" | "map">("endo");
  const [station, setStation] = useState(STATIONS[1]);
  const [focus, setFocus] = useState<string>(STATIONS[1].focus);
  const poseRef = useRef<Pose>(STATIONS[1].pose());
  const [labels, setLabels] = useState(true);
  const [selection, setSelection] = useState<MapSelection>({ type: "node", id: "4R" });
  const [opts, setOpts] = useState<MapOptions>({ showVessels: true, showNodes: true, showLabels: true, accessFilter: "all" });
  const l = useL();
  const content = useContent();
  const view = content.view(station);

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
            { value: "endo", label: <><Eye className="h-3.5 w-3.5" />{l("Endoscopic view", "ภาพจากกล้อง")}</> },
            { value: "map", label: <><Boxes className="h-3.5 w-3.5" />{l("3D anatomical map + IASLC stations", "แผนที่ 3D + IASLC stations")}</> },
          ]}
        />
        <p className="text-xs text-muted">
          {tab === "endo"
            ? l("Click a label in the image or a branch on the map to read about it.", "คลิกป้ายชื่อในภาพหรือแขนงบนแผนที่เพื่ออ่านคำอธิบาย")
            : l("Drag to orbit · scroll to zoom · click nodes or airways.", "ลากเพื่อหมุน · เลื่อนเพื่อซูม · คลิก node หรือ airway")}
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
                  {view.label}
                </div>
              </EndoscopeView>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-cyan-300">{l("Reference layout: ", "ตำแหน่งตามภาพอ้างอิง: ")}</span>
                {view.expected}
              </p>
              <div className="mt-2 flex justify-between">
                <Button size="sm" variant="ghost" onClick={() => setLabels((l) => !l)}>
                  <Layers className="h-3.5 w-3.5" /> {labels ? l("Hide labels", "ซ่อนป้ายชื่อ") : l("Show labels", "แสดงป้ายชื่อ")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => goStation(STATIONS[Math.floor(Math.random() * STATIONS.length)])}
                >
                  <Shuffle className="h-3.5 w-3.5" /> {l("Random view", "สุ่มภาพ")}
                </Button>
              </div>
            </div>
            <Card className="h-fit">
              <CardHeader title={l("Landmark tour", "จุดสังเกตสำคัญ")} icon={<MapPin className="h-4 w-4" />} />
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
                    {content.view(s).label}
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
              <Toggle on={opts.showNodes} onClick={() => setOpts((o) => ({ ...o, showNodes: !o.showNodes }))}>{l("Lymph nodes", "ต่อมน้ำเหลือง")}</Toggle>
              <Toggle on={opts.showVessels} onClick={() => setOpts((o) => ({ ...o, showVessels: !o.showVessels }))}>{l("Great vessels", "หลอดเลือดใหญ่")}</Toggle>
              <Toggle on={opts.showLabels} onClick={() => setOpts((o) => ({ ...o, showLabels: !o.showLabels }))}>{l("Station labels", "ชื่อ station")}</Toggle>
              <span className="ml-2 text-xs text-muted">{l("Accessible by:", "เข้าถึงได้ด้วย:")}</span>
              {ACCESS.map((a) => (
                <Toggle key={a} on={opts.accessFilter === a} onClick={() => setOpts((o) => ({ ...o, accessFilter: a }))}>
                  {a === "all" ? l("All", "ทั้งหมด") : a}
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
            <Card className="p-4 text-sm text-muted">{l("Select an airway branch or lymph node station.", "เลือกแขนง airway หรือ lymph node station")}</Card>
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
  const l = useL();
  const content = useContent();
  const seg = SEG_BY_ID[id];
  if (!seg || !seg.def) return null;
  const def = content.airway(seg.def);
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
          <div className="rounded-md bg-panel-2 p-2"><p className="text-muted">{l("Length", "ความยาว")}</p><p className="font-mono text-slate-200">{def.length} mm</p></div>
          <div className="rounded-md bg-panel-2 p-2"><p className="text-muted">{l("ID origin", "ขนาดภายใน")}</p><p className="font-mono text-slate-200">{def.diameter[0]} mm</p></div>
          <div className="rounded-md bg-panel-2 p-2"><p className="text-muted">{l("Side", "ข้าง")}</p><p className="font-mono text-slate-200">{def.side === "C" ? l("Midline", "กึ่งกลาง") : def.side === "R" ? l("Right", "ขวา") : l("Left", "ซ้าย")}</p></div>
        </div>
        {def.landmarks && (
          <Section icon={<MapPin className="h-3.5 w-3.5" />} title={l("Landmarks", "จุดสังเกต")}>
            {def.landmarks}
          </Section>
        )}
        {def.variations && (
          <Section icon={<Lightbulb className="h-3.5 w-3.5" />} title={l("Variations", "ความแปรผัน")}>
            {def.variations}
          </Section>
        )}
        {def.pitfalls && (
          <Callout tone="warn" title={<span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />{l("Pitfalls", "ข้อควรระวัง")}</span>}>
            <ul className="list-disc space-y-1 pl-4">
              {def.pitfalls.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Callout>
        )}
        <p className="text-[11px] text-muted">{l("Sources: Ernst 2017 ch. 4; Olympus nomenclature poster (paraphrased).", "แหล่งข้อมูล: Ernst 2017 ch. 4; Olympus nomenclature poster (เรียบเรียงใหม่)")}</p>
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
  const l = useL();
  const content = useContent();
  const n = content.node(NODE_STATIONS.find((x) => x.id === id)!);
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
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">{l("IASLC boundaries", "ขอบเขตตาม IASLC")}</p>
          <p className="text-[13px] leading-relaxed text-slate-300">{n.boundaries}</p>
        </div>
        {n.ebusTechnique && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">{l("EBUS approach", "วิธีหาด้วย EBUS")}</p>
            <p className="text-[13px] leading-relaxed text-slate-300">{n.ebusTechnique}</p>
          </div>
        )}
        {n.landmarkVessel && <p className="text-[13px] text-slate-300"><b className="text-slate-200">{l("Vascular landmark:", "หลอดเลือดที่ใช้เป็นจุดสังเกต:")}</b> {n.landmarkVessel}</p>}
        {n.pearl && <Callout tone="info" title={l("Pearl", "เกร็ดความรู้")}>{n.pearl}</Callout>}
        <p className="text-[11px] text-muted">{l("Sources: IASLC map (Rusch 2009); Ernst 2017 ch. 11 & 13. Positions in the 3D model are schematic.", "แหล่งข้อมูล: IASLC map (Rusch 2009); Ernst 2017 ch. 11 และ 13 ตำแหน่งในแบบจำลอง 3D เป็นแบบแผนผัง")}</p>
      </div>
    </Card>
  );
}
