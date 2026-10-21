import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, PageHeader } from "@/components/ui/primitives";
import { PROCEDURES } from "@/lib/data/procedures";

export const metadata: Metadata = { title: "Procedural Trainers" };

export default function ProceduresIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Module 4 · Procedures"
        title="Procedural simulators & step-by-step trainer"
        description="Each procedure has an interactive workflow, a tips & complications checklist and a scored mini-simulation."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROCEDURES.map((p) => (
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
        ))}
      </div>
    </>
  );
}
