"use client";

import { useState } from "react";
import { AlertOctagon, CheckCircle2, ChevronLeft, ChevronRight, ListChecks } from "lucide-react";
import { Button, Card, CardHeader } from "@/components/ui/primitives";
import type { Complication, Step } from "@/lib/data/procedures";
import { cn } from "@/lib/utils";
import { useL } from "@/lib/i18n/locale";

export function StepWorkflow({ steps }: { steps: Step[] }) {
  const [i, setI] = useState(0);
  const l = useL();
  const [done, setDone] = useState<Set<number>>(new Set());
  const step = steps[i];
  const markAndNext = () => {
    setDone((d) => new Set(d).add(i));
    setI((x) => Math.min(steps.length - 1, x + 1));
  };
  return (
    <Card>
      <CardHeader
        title={l("Step-by-step interactive workflow", "ขั้นตอนการทำหัตถการแบบโต้ตอบ")}
        subtitle={l(`${done.size}/${steps.length} steps confirmed`, `ยืนยันแล้ว ${done.size}/${steps.length} ขั้นตอน`)}
        icon={<ListChecks className="h-4 w-4" />}
      />
      <div className="grid gap-4 p-4 md:grid-cols-[240px_1fr]">
        <ol className="flex flex-col gap-1">
          {steps.map((s, idx) => (
            <li key={s.title}>
              <button
                onClick={() => setI(idx)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs",
                  idx === i ? "bg-cyan-500/10 text-cyan-200" : "text-slate-400 hover:bg-panel-2",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                    done.has(idx) ? "border-emerald-400 bg-emerald-500/20 text-emerald-200" : "border-slate-600",
                  )}
                >
                  {done.has(idx) ? "✓" : idx + 1}
                </span>
                <span className="flex-1">{s.title}</span>
                {s.critical && <AlertOctagon className="h-3 w-3 text-amber-400" aria-label="critical step" />}
              </button>
            </li>
          ))}
        </ol>
        <div className="flex flex-col rounded-lg border border-line bg-panel-2 p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted">{l(`Step ${i + 1} of ${steps.length}`, `ขั้นตอนที่ ${i + 1} จาก ${steps.length}`)}</p>
          <h4 className="mt-1 text-lg font-semibold">{step.title}</h4>
          {step.critical && (
            <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
              <AlertOctagon className="h-3 w-3" /> {l("Safety-critical step", "ขั้นตอนสำคัญด้านความปลอดภัย")}
            </p>
          )}
          <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-200">{step.detail}</p>
          <div className="mt-4 flex items-center justify-between">
            <Button size="sm" variant="ghost" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>
              <ChevronLeft className="h-3.5 w-3.5" /> {l("Back", "ย้อนกลับ")}
            </Button>
            <Button size="sm" variant="primary" onClick={markAndNext}>
              <CheckCircle2 className="h-3.5 w-3.5" /> {done.has(i) ? l("Confirmed", "ยืนยันแล้ว") : l("Confirm step", "ยืนยันขั้นตอน")}
              {i < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ComplicationsChecklist({ tips, complications }: { tips: string[]; complications: Complication[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const l = useL();
  const toggle = (k: string) =>
    setChecked((c) => {
      const n = new Set(c);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  return (
    <Card>
      <CardHeader title={l("Tips & complications checklist", "Checklist เคล็ดลับและภาวะแทรกซ้อน")} subtitle={l("Tick each item as you plan the case", "ติ๊กแต่ละข้อขณะวางแผนเคส")} icon={<ListChecks className="h-4 w-4" />} />
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">{l("Technical tips", "เคล็ดลับทางเทคนิค")}</p>
          <ul className="space-y-1.5">
            {tips.map((t) => (
              <li key={t}>
                <label className="flex cursor-pointer gap-2 text-[13px] text-slate-300">
                  <input type="checkbox" checked={checked.has(t)} onChange={() => toggle(t)} className="mt-0.5 accent-cyan-400" />
                  <span className={cn(checked.has(t) && "text-slate-500 line-through")}>{t}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-300">{l("Complications — prevent & manage", "ภาวะแทรกซ้อน — การป้องกันและการจัดการ")}</p>
          <div className="space-y-2">
            {complications.map((c) => (
              <label key={c.name} className="block cursor-pointer rounded-md border border-line bg-panel-2 p-2.5 text-[13px]">
                <span className="flex items-center gap-2">
                  <input type="checkbox" checked={checked.has(c.name)} onChange={() => toggle(c.name)} className="accent-cyan-400" />
                  <b className="text-slate-100">{c.name}</b>
                  {c.incidence && <span className="text-[11px] text-muted">· {c.incidence}</span>}
                </span>
                <span className="mt-1 block pl-6 text-xs text-slate-400"><b className="text-emerald-300/90">{l("Prevent:", "ป้องกัน:")}</b> {c.prevention}</span>
                <span className="block pl-6 text-xs text-slate-400"><b className="text-amber-300/90">{l("Manage:", "จัดการ:")}</b> {c.management}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
