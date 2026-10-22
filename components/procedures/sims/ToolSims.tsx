"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { SimShell, type SimLog } from "../SimShell";
import { cn } from "@/lib/utils";
import { useL } from "@/lib/i18n/locale";

/* ──────────────────────────── Brush: sequencing ──────────────────────────── */

type BrushState = { inScope: boolean; sheathOut: boolean; brushOut: boolean; brushed: boolean };

const BRUSH_ACTIONS = [
  { id: "insert", label: "Insert brush (retracted) into the working channel", th: "สอดแปรง (เก็บใน sheath) เข้า working channel" },
  { id: "sheath", label: "Advance sheath beyond the scope tip", th: "ดัน sheath ออกเลยปลายกล้อง" },
  { id: "extend", label: "Extend brush onto the lesion", th: "ดันแปรงออกไปที่รอยโรค" },
  { id: "brush", label: "Brush lesion: vigorous to-and-fro strokes", th: "ขัดรอยโรค: ไป-มาแรงๆ" },
  { id: "retract", label: "Retract brush into sheath", th: "ดึงแปรงกลับเข้า sheath" },
  { id: "withdraw", label: "Withdraw sheath + brush through channel", th: "ถอด sheath + แปรงออกทาง channel" },
  { id: "smear", label: "Smear slides / agitate brush in fixative", th: "ป้ายสไลด์ / เขย่าแปรงใน fixative" },
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
  const l = useL();
  const push = (e: SimLog) => setLog((x) => [e, ...x]);

  const fail = (text: string) => {
    setErrors((e) => e + 1);
    push({ tone: "danger", text });
  };

  const act = (a: BrushAction) => {
    if (score !== null) return;
    switch (a) {
      case "insert":
        if (st.inScope) return fail(l("Brush is already in the channel.", "แปรงอยู่ใน channel แล้ว"));
        setSt({ ...st, inScope: true });
        return push({ tone: "ok", text: l("Sheathed brush passed through the channel — bristles protected.", "สอดแปรงใน sheath ผ่าน channel แล้ว — ขนแปรงได้รับการปกป้อง") });
      case "sheath":
        if (!st.inScope) return fail(l("Nothing in the channel yet.", "ยังไม่มีอุปกรณ์ใน channel"));
        setSt({ ...st, sheathOut: true });
        return push({ tone: "ok", text: l("Sheath visible ~2 cm beyond the tip.", "เห็น sheath ยื่นเลยปลายกล้อง ~2 cm") });
      case "extend":
        if (!st.sheathOut) return fail(l("Extending the brush inside the channel would damage the scope — advance the sheath out first.", "การดันแปรงออกขณะอยู่ใน channel ทำให้กล้องเสียหาย — ดัน sheath ออกก่อน"));
        setSt({ ...st, brushOut: true });
        return push({ tone: "ok", text: l("Brush extended onto the lesion under direct vision.", "ดันแปรงไปที่รอยโรคภายใต้การมองเห็นแล้ว") });
      case "brush":
        if (!st.brushOut) return fail(l("Brush is not deployed.", "แปรงยังไม่ได้ดันออก"));
        setSt({ ...st, brushed: true });
        return push({ tone: "ok", text: l("Several vigorous strokes with rotation across the lesion surface.", "ขัดแรงๆ หลายครั้งพร้อมหมุนบนผิวรอยโรค") });
      case "retract":
        if (!st.brushOut) return fail(l("Brush is not out.", "แปรงไม่ได้อยู่นอก sheath"));
        if (!st.brushed) push({ tone: "warn", text: l("Retracted before sampling the lesion.", "เก็บแปรงก่อนได้ตัวอย่างจากรอยโรค") });
        setSt({ ...st, brushOut: false });
        return push({ tone: "ok", text: l("'Brush in!' — bristles back inside the sheath.", "'เก็บแปรง!' — ขนแปรงกลับเข้า sheath แล้ว") });
      case "withdraw":
        if (!st.inScope) return fail(l("Nothing to withdraw.", "ไม่มีอะไรให้ถอด"));
        if (st.brushOut) return fail(l("Withdrawing with the brush exposed strips the sample in the channel and damages it.", "ถอดขณะแปรงโผล่จะรูดตัวอย่างทิ้งใน channel และทำให้ channel เสียหาย"));
        setSt({ inScope: false, sheathOut: false, brushOut: false, brushed: st.brushed });
        return push({ tone: "ok", text: l("Sheath and brush removed together.", "ถอด sheath และแปรงออกพร้อมกันแล้ว") });
      case "smear": {
        if (st.inScope || !st.brushed) return fail(st.inScope ? l("The brush is still in the scope.", "แปรงยังอยู่ในกล้อง") : l("No sample has been collected.", "ยังไม่ได้เก็บตัวอย่าง"));
        const s = Math.max(0, 100 - errors * 15);
        setScore(s);
        return push({ tone: "ok", text: l("Slides prepared; brush agitated in CytoLyt. Run complete.", "เตรียมสไลด์และเขย่าแปรงใน CytoLyt แล้ว — จบรอบ") });
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
      title={l("Mini-simulation: sheathed brushing sequence", "Mini-simulation: ลำดับการทำ brushing ด้วยแปรงใน sheath")}
      subtitle={l("Perform the actions in a safe order. Each unsafe action costs 15 points.", "ทำตามลำดับที่ปลอดภัย การกระทำที่ไม่ปลอดภัยหักครั้งละ 15 คะแนน")}
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
              {l(a.label, a.th)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted">{l("Errors:", "ข้อผิดพลาด:")} {errors}</p>
      </div>
    </SimShell>
  );
}

/* ──────────────────────────── EBBx: forceps & haemostasis ──────────────────────────── */

const HEMOSTASIS = [
  { id: "suction", label: "Suction & observe (keep view)", th: "ดูดและสังเกต (รักษาภาพ)", good: true },
  { id: "saline", label: "Cold saline 20 mL", th: "Cold saline 20 mL", good: true },
  { id: "epi", label: "Topical epinephrine 1:20,000 (small aliquots)", th: "Topical epinephrine 1:20,000 (ครั้งละน้อย)", good: true },
  { id: "wedge", label: "Wedge / balloon tamponade", th: "Wedge / balloon tamponade", good: true },
  { id: "withdraw", label: "Withdraw scope to the trachea", th: "ถอยกล้องกลับไปที่ trachea", good: false },
  { id: "bite", label: "Keep biopsying", th: "ตัดชิ้นเนื้อต่อ", good: false },
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
  const l = useL();
  const push = (e: SimLog) => setLog((x) => [e, ...x]);

  const effAngle = lesion === "carina" ? Math.min(90, angle + 40) : angle;

  const bite = () => {
    if (bleed > 0) {
      setPenalty((p) => p + 15);
      return push({ tone: "danger", text: l("Biopsying into an active bleed worsens haemorrhage — control it first (−15).", "ตัดชิ้นเนื้อขณะเลือดยังออกจะทำให้เลือดออกมากขึ้น — ห้ามเลือดก่อน (−15)") });
    }
    const n = bites.length;
    let p = Math.sin((effAngle * Math.PI) / 180);
    if (lesion === "parallel" && forceps === "spike") p += 0.25;
    if (n === 0) p *= 0.45; // surface necrosis
    const cartilage = lesion === "parallel" && effAngle < 25 && Math.random() < 0.5;
    const ok = !cartilage && Math.random() < Math.min(0.95, p);
    const note = cartilage
      ? l("Forceps slid and bit a cartilage ring — crushed, non-diagnostic fragment.", "Forceps ลื่นไปงับ cartilage ring — ได้ชิ้นเนื้อบี้ ไม่ให้การวินิจฉัย")
      : n === 0 && !ok
        ? l("Superficial necrotic slough — go deeper at the same spot.", "ได้แต่เนื้อตายที่ผิว — ตัดลึกลงที่ตำแหน่งเดิม")
        : ok
          ? l("Good core of viable tumour.", "ได้ชิ้นเนื้อ tumour ที่ยังมีชีวิตดี")
          : l("Tangential bite — small superficial fragment.", "งับแบบเฉียง — ได้ชิ้นเล็กและตื้น");
    setBites((b) => [...b, { ok, note }]);
    push({ tone: ok ? "ok" : "warn", text: `${l("Bite", "ครั้งที่")} ${n + 1}: ${note}` });
    if (!bleedDone && n >= 1 && Math.random() < 0.45) {
      setBleed(3);
      push({ tone: "danger", text: l("Brisk oozing obscures the field! Choose haemostatic measures.", "เลือดซึมมากจนบังภาพ! เลือกวิธีห้ามเลือด") });
    }
  };

  const hem = (id: (typeof HEMOSTASIS)[number]["id"]) => {
    const h = HEMOSTASIS.find((x) => x.id === id)!;
    if (!h.good) {
      setPenalty((p) => p + 15);
      setBleed(Math.min(4, bleed + 1));
      return push({ tone: "danger", text: id === "withdraw" ? l("Withdrawing loses control of the bleeding segment and soils the airway (−15).", "การถอยกล้องทำให้ควบคุม segment ที่เลือดออกไม่ได้และเลือดไหลลง airway อื่น (−15)") : l("More bites aggravate bleeding (−15).", "การตัดเพิ่มทำให้เลือดออกมากขึ้น (−15)") });
    }
    if (id === "epi" && !usedHem.includes("saline")) push({ tone: "warn", text: l("Cold saline is usually tried before epinephrine.", "ปกติใช้ cold saline ก่อน epinephrine") });
    setUsedHem((u) => [...u, id]);
    const nb = Math.max(0, bleed - 1);
    setBleed(nb);
    if (nb === 0) {
      setBleedDone(true);
      push({ tone: "ok", text: l("Haemostasis achieved. Observe before continuing.", "เลือดหยุดแล้ว สังเกตก่อนทำต่อ") });
    } else push({ tone: "info", text: `${l(h.label, h.th)}: ${l("bleeding slowing.", "เลือดออกช้าลง")}` });
  };

  const finish = () => {
    const good = bites.filter((b) => b.ok).length;
    let s = 40 + Math.min(4, good) * 15 - penalty;
    if (bites.length > 6) s -= 10;
    if (bleed > 0) s -= 25;
    s = Math.max(0, Math.min(100, s));
    setScore(s);
    push({ tone: good >= 3 ? "ok" : "warn", text: l(`${good} diagnostic fragments from ${bites.length} bites (aim for 3–6 good samples; yield >80% in visible tumours).`, `ได้ชิ้นเนื้อที่วินิจฉัยได้ ${good} ชิ้นจาก ${bites.length} ครั้ง (ควรได้ชิ้นที่ดี 3–6 ชิ้น; yield >80% ใน visible tumour)`) });
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
      title={l("Mini-simulation: forceps orientation & haemostasis", "Mini-simulation: การจัดมุม forceps และการห้ามเลือด")}
      subtitle={l("Exophytic tumour in the bronchus intermedius. Optimise the approach, then manage any bleeding.", "Exophytic tumour ใน bronchus intermedius ปรับวิธีเข้าให้เหมาะ แล้วจัดการเลือดออกหากเกิดขึ้น")}
      log={log}
      score={score}
      onReset={reset}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-1.5">
            <span className="self-center text-xs text-muted">{l("Lesion:", "รอยโรค:")}</span>
            {(["parallel", "carina"] as const).map((k) => (
              <button key={k} onClick={() => setLesion(k)} className={cn("rounded-md border px-2 py-1 text-xs", lesion === k ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}>
                {k === "parallel" ? l("Along the side wall", "อยู่ตามผนังด้านข้าง") : l("At a bifurcation", "อยู่ที่จุดแยก")}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="self-center text-xs text-muted">Forceps:</span>
            {(["cup", "alligator", "spike"] as const).map((f) => (
              <button key={f} onClick={() => setForceps(f)} className={cn("rounded-md border px-2 py-1 text-xs", forceps === f ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}>
                {f === "spike" ? l("With central spike", "มี spike ตรงกลาง") : f === "cup" ? "Cup" : "Alligator"}
              </button>
            ))}
          </div>
          <label className="block">
            {l("Scope flexion → forceps-to-lesion angle:", "งอกล้อง → มุมระหว่าง forceps กับรอยโรค:")} <b className="font-mono text-cyan-300">{effAngle}°</b>
            <input type="range" className="slider mt-1 w-full" min={5} max={90} value={angle} onChange={(e) => setAngle(+e.target.value)} />
          </label>
          <div className="flex gap-2">
            <Button onClick={bite} disabled={score !== null}><Scissors className="h-3.5 w-3.5" /> {l("Take bite", "ตัดชิ้นเนื้อ")}</Button>
            <Button variant="primary" onClick={finish} disabled={score !== null || bites.length === 0}>{l("Finish", "เสร็จสิ้น")}</Button>
          </div>
          {bleed > 0 && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
              <p className="mb-2 text-xs font-semibold text-rose-200">{l("Bleeding severity:", "ความรุนแรงของเลือดออก:")} {"●".repeat(bleed)}{"○".repeat(Math.max(0, 4 - bleed))}</p>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {HEMOSTASIS.map((h) => (
                  <Button key={h.id} size="sm" variant="secondary" className="h-auto justify-start py-1.5 text-left" onClick={() => hem(h.id)}>
                    {l(h.label, h.th)}
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
