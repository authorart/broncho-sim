import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FlaskConical, Target } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/ui/primitives";
import { PROCEDURES, PROC_BY_ID, type Procedure } from "@/lib/data/procedures";
import { REF_BY_ID } from "@/lib/data/references";
import { ComplicationsChecklist, StepWorkflow } from "@/components/procedures/StepWorkflow";
import { ProcedureSim } from "@/components/procedures/ProcedureSim";

export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/procedures/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = PROC_BY_ID[id as Procedure["id"]];
  return { title: p ? `${p.name} (${p.abbr})` : "Procedure" };
}

export default async function ProcedurePage({ params }: PageProps<"/procedures/[id]">) {
  const { id } = await params;
  const p = PROC_BY_ID[id as Procedure["id"]];
  if (!p) notFound();

  return (
    <>
      <Link href="/procedures" className="mb-3 inline-flex items-center gap-1 text-xs text-muted hover:text-cyan-300">
        <ChevronLeft className="h-3.5 w-3.5" /> All procedures
      </Link>
      <PageHeader eyebrow={`Procedure · ${p.abbr}`} title={p.name} description={p.summary} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-4">
          <StepWorkflow steps={p.steps} />
          <ProcedureSim id={p.id} />
          <ComplicationsChecklist tips={p.tips} complications={p.complications} />
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Key numbers" icon={<Target className="h-4 w-4" />} />
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
            <CardHeader title="Indications" />
            <ul className="list-disc space-y-1 py-3 pl-8 pr-4 text-[13px] text-slate-300">
              {p.indications.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Specimen handling" icon={<FlaskConical className="h-4 w-4" />} />
            <ul className="list-disc space-y-1 py-3 pl-8 pr-4 text-[13px] text-slate-300">
              {p.specimens.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
          <Card className="p-4 text-[12px] text-muted">
            <p className="mb-1 font-semibold text-slate-300">References</p>
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
