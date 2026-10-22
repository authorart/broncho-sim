"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, OctagonX, TriangleAlert } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/primitives";
import { ASA_CLASSES, PLANNED_LABEL, assessRisk, type PlannedProcedure, type RiskInput } from "@/lib/data/guidelines";
import { REF_BY_ID } from "@/lib/data/references";
import { cn } from "@/lib/utils";
import { useL } from "@/lib/i18n/locale";
import { useContent } from "@/lib/i18n/content";

const DEFAULT: RiskInput = {
  procedure: "tblb",
  platelets: 180,
  inr: 1.1,
  anticoag: "none",
  daysHeld: 0,
  asa: 2,
  spo2: 95,
  o2Lpm: 0,
  recentMIWeeks: null,
  pulmHtn: false,
  creatinine: 1.0,
  fasting: true,
  consent: true,
};

const SCENARIOS: { label: string; th: string; input: Partial<RiskInput> }[] = [
  { label: "Sarcoid work-up, healthy", th: "สืบค้น sarcoid ผู้ป่วยแข็งแรง", input: {} },
  { label: "TBLB on clopidogrel (2 d held)", th: "TBLB ขณะได้ clopidogrel (หยุด 2 วัน)", input: { anticoag: "p2y12", daysHeld: 2 } },
  { label: "Heme-onc: plt 32, BAL only", th: "ผู้ป่วยโลหิตวิทยา: plt 32, BAL อย่างเดียว", input: { procedure: "bal", platelets: 32, asa: 3 } },
  { label: "EBUS on apixaban, held 1 d", th: "EBUS ขณะได้ apixaban (หยุด 1 วัน)", input: { procedure: "tbna", anticoag: "doac", daysHeld: 1 } },
  { label: "TBLB, 6 L O₂, SpO₂ 88%", th: "TBLB, O₂ 6 L, SpO₂ 88%", input: { spo2: 88, o2Lpm: 6, asa: 4 } },
];

function numOrNull(v: string) {
  return v === "" ? null : Number(v);
}

export function RiskChecklist() {
  const [i, setI] = useState<RiskInput>(DEFAULT);
  const l = useL();
  const content = useContent();
  const flags = useMemo(() => assessRisk(i, l), [i, l]);
  const set = <K extends keyof RiskInput>(k: K, v: RiskInput[K]) => setI((s) => ({ ...s, [k]: v }));
  const verdict = flags.some((f) => f.level === "stop") ? "stop" : flags.some((f) => f.level === "caution") ? "caution" : "ok";

  return (
    <Card>
      <CardHeader
        title={l("Pre-procedural risk checklist", "Checklist ประเมินความเสี่ยงก่อนหัตถการ")}
        subtitle={l("Enter patient factors — rules are teaching defaults; follow local protocols.", "กรอกข้อมูลผู้ป่วย — เกณฑ์เป็นค่าสำหรับการสอน ให้ยึดแนวปฏิบัติของสถาบัน")}
        icon={<ClipboardCheck className="h-4 w-4" />}
      />
      <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-3">
        <span className="mr-1 self-center text-xs text-muted">{l("Scenarios:", "สถานการณ์ตัวอย่าง:")}</span>
        {SCENARIOS.map((s) => (
          <button key={s.label} onClick={() => setI({ ...DEFAULT, ...s.input })} className="rounded-md border border-line px-2 py-1 text-[11px] text-slate-300 hover:border-cyan-500/50">
            {l(s.label, s.th)}
          </button>
        ))}
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label={l("Planned procedure", "หัตถการที่วางแผน")} className="col-span-2">
            <select value={i.procedure} onChange={(e) => set("procedure", e.target.value as PlannedProcedure)} className={inputCls}>
              {Object.entries(PLANNED_LABEL).map(([k, v]) => <option key={k} value={k}>{content.planned(k, v)}</option>)}
            </select>
          </Field>
          <Field label="Platelets (×10⁹/L)">
            <input type="number" value={i.platelets ?? ""} onChange={(e) => set("platelets", numOrNull(e.target.value))} className={inputCls} />
          </Field>
          <Field label="INR">
            <input type="number" step="0.1" value={i.inr ?? ""} onChange={(e) => set("inr", numOrNull(e.target.value))} className={inputCls} />
          </Field>
          <Field label={l("Antithrombotic", "ยาต้านเกล็ดเลือด/ต้านการแข็งตัว")}>
            <select value={i.anticoag} onChange={(e) => set("anticoag", e.target.value as RiskInput["anticoag"])} className={inputCls}>
              <option value="none">{l("None", "ไม่มี")}</option>
              <option value="aspirin">Aspirin</option>
              <option value="p2y12">Clopidogrel / P2Y12</option>
              <option value="warfarin">Warfarin</option>
              <option value="doac">DOAC</option>
              <option value="lmwh-therapeutic">LMWH (therapeutic)</option>
              <option value="heparin">IV heparin</option>
            </select>
          </Field>
          <Field label={l("Days held", "หยุดยามาแล้ว (วัน)")}>
            <input type="number" value={i.daysHeld ?? ""} onChange={(e) => set("daysHeld", numOrNull(e.target.value))} className={inputCls} disabled={i.anticoag === "none"} />
          </Field>
          <Field label="ASA class">
            <select value={i.asa} onChange={(e) => set("asa", Number(e.target.value))} className={inputCls}>
              {ASA_CLASSES.map((a, idx) => <option key={a.cls} value={idx + 1}>ASA {a.cls} — {content.asa(idx, a.label)}</option>)}
            </select>
          </Field>
          <Field label="SpO₂ (%)">
            <input type="number" value={i.spo2 ?? ""} onChange={(e) => set("spo2", numOrNull(e.target.value))} className={inputCls} />
          </Field>
          <Field label="O₂ (L/min)">
            <input type="number" value={i.o2Lpm ?? ""} onChange={(e) => set("o2Lpm", numOrNull(e.target.value))} className={inputCls} />
          </Field>
          <Field label={l("Weeks since MI (blank = none)", "MI มาแล้วกี่สัปดาห์ (เว้นว่าง = ไม่มี)")}>
            <input type="number" value={i.recentMIWeeks ?? ""} onChange={(e) => set("recentMIWeeks", numOrNull(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Creatinine (mg/dL)">
            <input type="number" step="0.1" value={i.creatinine ?? ""} onChange={(e) => set("creatinine", numOrNull(e.target.value))} className={inputCls} />
          </Field>
          <div className="col-span-2 flex flex-wrap gap-4 pt-1">
            <Check label="Pulmonary hypertension" checked={i.pulmHtn} onChange={(v) => set("pulmHtn", v)} />
            <Check label={l("Fasted", "งดน้ำงดอาหารแล้ว")} checked={i.fasting} onChange={(v) => set("fasting", v)} />
            <Check label={l("Consent documented", "มีบันทึก consent แล้ว")} checked={i.consent} onChange={(v) => set("consent", v)} />
          </div>
        </div>

        <div className="flex flex-col gap-2" aria-live="polite">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
              verdict === "stop" && "bg-rose-500/15 text-rose-200",
              verdict === "caution" && "bg-amber-500/15 text-amber-200",
              verdict === "ok" && "bg-emerald-500/15 text-emerald-200",
            )}
          >
            {verdict === "stop" ? <OctagonX className="h-4 w-4" /> : verdict === "caution" ? <TriangleAlert className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {verdict === "stop" ? l("Do not proceed as planned — correct or modify first", "ยังไม่ควรทำตามแผน — แก้ไขหรือปรับแผนก่อน") : verdict === "caution" ? l("Proceed with caution / mitigations", "ทำได้ด้วยความระมัดระวัง / มีมาตรการลดความเสี่ยง") : l("Cleared for the planned procedure", "ทำหัตถการตามแผนได้")}
          </div>
          <ul className="flex flex-col gap-1.5">
            {flags.map((f, idx) => (
              <li
                key={idx}
                className={cn(
                  "flex gap-2 rounded-md border px-3 py-2 text-[13px]",
                  f.level === "stop" && "border-rose-500/30 bg-rose-500/5",
                  f.level === "caution" && "border-amber-500/30 bg-amber-500/5",
                  f.level === "ok" && "border-emerald-500/20 bg-emerald-500/5",
                )}
              >
                {f.level === "stop" ? <OctagonX className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-300" /> : f.level === "caution" ? <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" /> : <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />}
                <span className="text-slate-200">
                  {f.text}
                  {f.ref && <span className="ml-1 text-[10px] text-cyan-400/80">[{REF_BY_ID[f.ref]?.short}]</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

const inputCls =
  "h-9 w-full rounded-md border border-line bg-panel-2 px-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none disabled:opacity-40";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-[11px] uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-cyan-400" />
      {label}
    </label>
  );
}
