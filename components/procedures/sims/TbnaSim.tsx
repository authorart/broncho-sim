"use client";

import { useState } from "react";
import { Microscope, Syringe } from "lucide-react";
import { Badge, Button, Callout } from "@/components/ui/primitives";
import { ConvexSonogram } from "@/components/imaging/Sonograms";
import { needleSegment, type ConvexParams } from "@/components/imaging/sonography";
import { TBNA_TECHNIQUES } from "@/lib/data/procedures";
import { NEEDLES } from "@/lib/data/equipment";
import { SimShell, type SimLog } from "../SimShell";
import { cn } from "@/lib/utils";
import { useL } from "@/lib/i18n/locale";
import { useContent } from "@/lib/i18n/content";

const STATIONS = [
  { id: "4R", n: "N3", why: "contralateral mediastinal for a LEFT primary", th: "mediastinal ฝั่งตรงข้ามสำหรับก้อนด้านซ้าย" },
  { id: "7", n: "N2", why: "subcarinal", th: "subcarinal" },
  { id: "4L", n: "N2", why: "ipsilateral mediastinal", th: "mediastinal ฝั่งเดียวกัน" },
  { id: "11L", n: "N1", why: "ipsilateral interlobar (hilar)", th: "interlobar (hilar) ฝั่งเดียวกัน" },
];
const RANK: Record<string, number> = { N3: 0, N2: 1, N1: 2 };

type Stage = "order" | "needle" | "puncture" | "done";

function inEllipse(x: number, y: number, e: { x: number; y: number; rx: number; ry: number }) {
  return ((x - e.x) / e.rx) ** 2 + ((y - e.y) / e.ry) ** 2 < 1;
}

export function TbnaSim() {
  const [stage, setStage] = useState<Stage>("order");
  const [order, setOrder] = useState<string[]>([]);
  const [needle, setNeedle] = useState<string | null>(null);
  const [technique, setTechnique] = useState("jab");
  const [shift, setShift] = useState(0);
  const [doppler, setDoppler] = useState(false);
  const [dopplerChecked, setDopplerChecked] = useState(false);
  const [stopper, setStopper] = useState(30);
  const [inNode, setInNode] = useState(false);
  const [agitations, setAgitations] = useState(0);
  const [passes, setPasses] = useState<number[]>([]);
  const [penalty, setPenalty] = useState(0);
  const [log, setLog] = useState<SimLog[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const l = useL();
  const content = useContent();
  const push = (e: SimLog) => setLog((x) => [e, ...x]);

  // Scene for station 4R: node lateral, SVC/azygos nearby. `shift` slides anatomy as the scope moves.
  // Mirrored so the needle (entering from the upper right) must avoid the vessel.
  const node = { x: -(6 + shift), y: 18, rx: 8.5, ry: 7 };
  const vessel = { x: 5 - shift, y: 14, rx: 5.5, ry: 5 };
  const depth = inNode ? Math.min(stopper, 34) : 0;
  const params: ConvexParams = {
    seed: 77,
    nodes: [{ ...node, rot: -0.1, echo: 0.24, heterogeneity: 0.6, margin: 0.85 }],
    vessels: [{ ...vessel, flow: "toward" }],
    doppler,
    gain: 1,
    needle: inNode ? { depth, angleDeg: 38 } : null,
  };

  const pickStation = (id: string) => {
    if (order.includes(id)) return;
    const next = [...order, id];
    setOrder(next);
    if (next.length === STATIONS.length) {
      const ranks = next.map((s) => RANK[STATIONS.find((x) => x.id === s)!.n]);
      const sorted = ranks.every((r, i) => i === 0 || r >= ranks[i - 1]);
      if (sorted) push({ tone: "ok", text: l("Correct sequence: N3 → N2 → N1. Sampling 4R first avoids upstaging by contamination and establishes the highest stage.", "ลำดับถูกต้อง: N3 → N2 → N1 การเก็บ 4R ก่อนป้องกัน upstaging จากการปนเปื้อน และได้ stage สูงสุด") });
      else {
        setPenalty((p) => p + 20);
        push({ tone: "danger", text: l(`Order ${next.join(" → ")} risks contaminating N3 with tumour cells from lower stations. Sample 4R (N3) first, then 7/4L (N2), then 11L (N1) (−20).`, `ลำดับ ${next.join(" → ")} เสี่ยงทำให้ N3 ปนเปื้อนเซลล์มะเร็งจาก station ที่ต่ำกว่า ควรเก็บ 4R (N3) ก่อน แล้ว 7/4L (N2) ตามด้วย 11L (N1) (−20)`) });
      }
      setStage("needle");
    }
  };

  const chooseNeedle = (g: string) => {
    setNeedle(g);
    const info = NEEDLES.find((n) => n.gauge === g)!;
    push({ tone: g === "25 G" ? "warn" : "ok", text: `${g}: ${content.needleUse(g, info.use)}` });
  };

  const puncture = () => {
    if (!dopplerChecked) {
      setPenalty((p) => p + 10);
      push({ tone: "warn", text: l("Punctured without a Doppler check of the needle path (−10).", "เจาะโดยไม่ตรวจแนวเข็มด้วย Doppler (−10)") });
    }
    const seg = needleSegment({ depth: Math.min(stopper, 34), angleDeg: 38 });
    let hitVessel = false;
    let hitNode = false;
    for (let i = 0; i <= 40; i++) {
      const x = seg.start.x + ((seg.end.x - seg.start.x) * i) / 40;
      const y = seg.start.y + ((seg.end.y - seg.start.y) * i) / 40;
      if (inEllipse(x, y, vessel)) hitVessel = true;
      if (inEllipse(x, y, node)) hitNode = true;
    }
    const endsInNode = inEllipse(seg.end.x, seg.end.y, node);
    if (hitVessel) {
      setPenalty((p) => p + 25);
      push({ tone: "danger", text: l("Aspirate fills with blood — vascular puncture! Release suction, retract the needle, reposition (−25).", "ดูดได้เลือดเต็ม — เจาะโดนหลอดเลือด! ปล่อย suction เก็บเข็ม แล้วเปลี่ยนตำแหน่ง (−25)") });
      return;
    }
    if (!hitNode) {
      push({ tone: "warn", text: l("Needle path misses the node. Adjust scope position along the airway.", "แนวเข็มไม่ผ่าน node ปรับตำแหน่งกล้องตาม airway") });
      return;
    }
    if (!endsInNode) {
      push({ tone: "warn", text: l("Needle traverses the node and exits its far wall — shorten the stopper so the tip stays inside.", "เข็มทะลุ node ออกผนังด้านไกล — ตั้ง stopper ให้สั้นลงเพื่อให้ปลายเข็มอยู่ใน node") });
      setPenalty((p) => p + 5);
    }
    setInNode(true);
    setAgitations(0);
    push({ tone: "ok", text: l(`Needle inside the node (${TBNA_TECHNIQUES.find((t) => t.id === technique)?.name} technique). Remove stylet, ± suction, then agitate.`, `เข็มอยู่ใน node แล้ว (เทคนิค ${TBNA_TECHNIQUES.find((t) => t.id === technique)?.name}) ถอด stylet ± suction แล้วขยับเข็ม`) });
  };

  const completePass = () => {
    const a = agitations;
    setPasses((p) => [...p, a]);
    setInNode(false);
    if (a < 8) push({ tone: "warn", text: l(`Pass ${passes.length + 1}: only ${a} agitations — scant material. Aim for ~8–20.`, `ครั้งที่ ${passes.length + 1}: ขยับเพียง ${a} ครั้ง — ได้ตัวอย่างน้อย ควร ~8–20 ครั้ง`) });
    else if (a > 25) push({ tone: "warn", text: l(`Pass ${passes.length + 1}: ${a} agitations — excessive; more blood contamination.`, `ครั้งที่ ${passes.length + 1}: ขยับ ${a} ครั้ง — มากเกินไป เลือดปนมากขึ้น`) });
    else push({ tone: "ok", text: l(`Pass ${passes.length + 1}: ${a} agitations — release suction, needle into sheath, smear + cell block.`, `ครั้งที่ ${passes.length + 1}: ขยับ ${a} ครั้ง — ปล่อย suction เก็บเข็มเข้า sheath ทำ smear + cell block`) });
  };

  const rose = () => {
    const good = passes.filter((a) => a >= 8 && a <= 25).length;
    let s = 100 - penalty;
    if (passes.length < 3) s -= 15;
    if (good >= 2) push({ tone: "ok", text: l("ROSE: adequate — malignant cells consistent with non-small cell carcinoma (favour adenocarcinoma). Take 1–2 extra passes for molecular testing (EGFR/ALK/PD-L1).", "ROSE: เพียงพอ — พบเซลล์มะเร็งเข้าได้กับ non-small cell carcinoma (น่าจะ adenocarcinoma) เจาะเพิ่ม 1–2 ครั้งสำหรับ molecular testing (EGFR/ALK/PD-L1)") });
    else {
      s -= 15;
      push({ tone: "warn", text: l("ROSE: scant lymphocytes only — non-diagnostic. More passes needed; report 'non-diagnostic' not 'negative'.", "ROSE: พบ lymphocyte เพียงเล็กน้อย — non-diagnostic ต้องเจาะเพิ่ม และรายงานว่า 'non-diagnostic' ไม่ใช่ 'negative'") });
    }
    setScore(Math.max(0, Math.min(100, s)));
    setStage("done");
  };

  const reset = () => {
    setStage("order");
    setOrder([]);
    setNeedle(null);
    setTechnique("jab");
    setShift(0);
    setDoppler(false);
    setDopplerChecked(false);
    setStopper(30);
    setInNode(false);
    setAgitations(0);
    setPasses([]);
    setPenalty(0);
    setLog([]);
    setScore(null);
  };

  return (
    <SimShell
      procId="tbna"
      title={l("Mini-simulation: EBUS-TBNA staging", "Mini-simulation: EBUS-TBNA staging")}
      subtitle={l("LUL T2 adenocarcinoma suspected; PET-positive nodes at 4R, 4L, 7 and 11L.", "สงสัย adenocarcinoma ที่ LUL ขนาด T2; PET-positive nodes ที่ 4R, 4L, 7 และ 11L")}
      log={log}
      score={score}
      onReset={reset}
    >
      <div className="space-y-4 text-sm">
        <section>
          <p className="mb-1.5 text-xs uppercase tracking-wider text-muted">{l("1 · Sampling order (click stations in sequence)", "1 · ลำดับการเก็บตัวอย่าง (คลิก station ตามลำดับ)")}</p>
          <div className="flex flex-wrap gap-2">
            {STATIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => pickStation(s.id)}
                disabled={stage !== "order" || order.includes(s.id)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-left text-xs",
                  order.includes(s.id) ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-300 hover:border-slate-500",
                )}
              >
                <b className="font-mono">{s.id}</b>
                {order.includes(s.id) && <span className="ml-1 text-[10px]">#{order.indexOf(s.id) + 1} · {s.n}</span>}
                <span className="block text-[10px] text-muted">{l(s.why, s.th)}</span>
              </button>
            ))}
          </div>
        </section>

        {stage !== "order" && (
          <section>
            <p className="mb-1.5 text-xs uppercase tracking-wider text-muted">{l("2 · Needle & technique", "2 · เลือกเข็มและเทคนิค")}</p>
            <div className="flex flex-wrap gap-1.5">
              {NEEDLES.map((n) => (
                <button key={n.gauge} onClick={() => chooseNeedle(n.gauge)} className={cn("rounded-md border px-2.5 py-1 font-mono text-xs", needle === n.gauge ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-300")}>
                  {n.gauge}
                </button>
              ))}
              <span className="mx-2 self-center text-xs text-muted">{l("Technique:", "เทคนิค:")}</span>
              {TBNA_TECHNIQUES.map((t) => (
                <button key={t.id} title={content.technique(t.id, t.detail)} onClick={() => setTechnique(t.id)} className={cn("rounded-md border px-2.5 py-1 text-xs", technique === t.id ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-300")}>
                  {t.name}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted">{content.technique(technique, TBNA_TECHNIQUES.find((t) => t.id === technique)?.detail ?? "")}</p>
            {stage === "needle" && (
              <Button size="sm" className="mt-2" variant="primary" disabled={!needle} onClick={() => { setStage("puncture"); push({ tone: "info", text: l("Scope at 4R: distal trachea, transducer at ~2–3 o'clock just above the carina.", "กล้องอยู่ที่ 4R: trachea ส่วนปลาย วาง transducer ที่ ~2–3 นาฬิกา เหนือ carina เล็กน้อย") }); }}>
                {l("Go to station 4R", "ไปที่ station 4R")}
              </Button>
            )}
          </section>
        )}

        {(stage === "puncture" || stage === "done") && (
          <section className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted">{l("3 · Real-time puncture at 4R", "3 · เจาะแบบ real time ที่ 4R")}</p>
              <label className="block">
                {l("Scope position along the airway:", "ตำแหน่งกล้องตาม airway:")} <b className="font-mono text-cyan-300">{shift > 0 ? "+" : ""}{shift} mm</b>
                <input type="range" className="slider mt-1 w-full" min={-12} max={12} value={shift} onChange={(e) => { setShift(+e.target.value); setInNode(false); }} disabled={inNode || stage === "done"} />
              </label>
              <label className="block">
                Needle stopper: <b className="font-mono text-amber-300">{stopper} mm</b>
                <input type="range" className="slider mt-1 w-full" min={10} max={40} value={stopper} onChange={(e) => setStopper(+e.target.value)} disabled={inNode || stage === "done"} />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => { setDoppler((d) => !d); setDopplerChecked(true); }}>
                  Doppler {doppler ? l("on", "เปิด") : l("off", "ปิด")}
                </Button>
                <Button size="sm" onClick={puncture} disabled={inNode || stage === "done"}>
                  <Syringe className="h-3.5 w-3.5" /> {l("Puncture", "เจาะ")}
                </Button>
                <Button size="sm" onClick={() => setAgitations((a) => a + 1)} disabled={!inNode}>
                  {l("Agitate", "ขยับเข็ม")} ({agitations})
                </Button>
                <Button size="sm" onClick={completePass} disabled={!inNode}>
                  {l("Complete pass", "จบการเจาะครั้งนี้")}
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {l("Passes:", "จำนวนครั้งที่เจาะ:")}
                {passes.map((a, i) => <Badge key={i} tone={a >= 8 && a <= 25 ? "ok" : "warn"}>#{i + 1}: {a}×</Badge>)}
                {passes.length === 0 && <span className="text-muted">{l("none", "ยังไม่มี")}</span>}
              </div>
              <Button variant="primary" onClick={rose} disabled={passes.length === 0 || stage === "done"}>
                <Microscope className="h-3.5 w-3.5" /> {l("Send for ROSE & finish", "ส่ง ROSE และเสร็จสิ้น")}
              </Button>
            </div>
            <div>
              <ConvexSonogram params={params} />
              <p className="mt-1 text-[11px] text-muted">{l("Needle path enters from the upper right at a fixed angle — move the scope to align the node, check Doppler, set the stopper.", "เข็มเข้าจากขวาบนด้วยมุมคงที่ — เลื่อนกล้องให้ตรง node ตรวจ Doppler แล้วตั้ง stopper")}</p>
            </div>
          </section>
        )}
        {stage === "done" && (
          <Callout tone="info">{l("Golden rule: never advance or withdraw the catheter through the scope with the needle out. Report a negative result as \"non-diagnostic\".", "Golden rule: ห้ามดันหรือถอน catheter ผ่านกล้องขณะเข็มโผล่ และรายงานผลลบว่า \"non-diagnostic\"")}</Callout>
        )}
      </div>
    </SimShell>
  );
}
