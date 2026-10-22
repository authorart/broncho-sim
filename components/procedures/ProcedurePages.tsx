"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, FlaskConical, Target } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/ui/primitives";
import { PROCEDURES, PROC_BY_ID, type Procedure } from "@/lib/data/procedures";
import { REF_BY_ID } from "@/lib/data/references";
import { useContent } from "@/lib/i18n/content";
import { useL } from "@/lib/i18n/locale";
import { ComplicationsChecklist, StepWorkflow } from "./StepWorkflow";
import { ProcedureSim } from "./ProcedureSim";

export function ProcedureCards() {
  const c = useContent();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {PROCEDURES.map((raw) => {
        const p = c.procedure(raw);
        return (
          <Link key={p.id} href={`/procedures/${p.id}`} className="group">
            <Card className="h-full p-5 transition-colors group-hover:border-cyan-500/50">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 font-mono text-sm font-bold text-cyan-300">{p.abbr}</span>
                <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" />
              </div>
              <h2 className="mt-3 text-lg font-semibold">{p.name}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-muted">{p.summary}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {p.keyNumbers.slice(0, 2).map((k) => (
                  <div key={k.label} className="rounded-md bg-panel-2 px-2 py-1.5">
                    <dt className="text-[10px] uppercase tracking-wider text-muted">{k.label}</dt>
                    <dd className="text-xs text-slate-200">{k.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export function ProcedureDetail({ id }: { id: Procedure["id"] }) {
  const c = useContent();
  const l = useL();
  const p = c.procedure(PROC_BY_ID[id]);
  return (
    <>
      <Link href="/procedures" className="mb-3 inline-flex items-center gap-1 text-xs text-muted hover:text-cyan-300">
        <ChevronLeft className="h-3.5 w-3.5" /> {l("All procedures", "หัตถการทั้งหมด")}
      </Link>
      <PageHeader eyebrow={`${l("Procedure", "หัตถการ")} · ${p.abbr}`} title={p.name} description={p.summary} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-4">
          <StepWorkflow key={c.locale} steps={p.steps} />
          <ProcedureSim id={p.id} />
          <ComplicationsChecklist key={`${c.locale}-c`} tips={p.tips} complications={p.complications} />
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title={l("Key numbers", "ตัวเลขสำคัญ")} icon={<Target className="h-4 w-4" />} />
            <dl className="divide-y divide-line/70 px-4 py-2 text-sm">
              {p.keyNumbers.map((k) => (
                <div key={k.label} className="py-2">
                  <dt className="text-[11px] uppercase tracking-wider text-muted">{k.label}</dt>
                  <dd className="text-slate-100">{k.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <CardHeader title={l("Indications", "ข้อบ่งชี้")} />
            <ul className="list-disc space-y-1 py-3 pl-8 pr-4 text-[13px] text-slate-300">
              {p.indications.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
          <Card>
            <CardHeader title={l("Specimen handling", "การจัดการสิ่งส่งตรวจ")} icon={<FlaskConical className="h-4 w-4" />} />
            <ul className="list-disc space-y-1 py-3 pl-8 pr-4 text-[13px] text-slate-300">
              {p.specimens.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
          <Card className="p-4 text-[12px] text-muted">
            <p className="mb-1 font-semibold text-slate-300">{l("References", "เอกสารอ้างอิง")}</p>
            <ul className="space-y-1">
              {p.refs.map((r) => (
                <li key={r}>{REF_BY_ID[r]?.citation}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
