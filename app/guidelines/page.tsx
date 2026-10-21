import type { Metadata } from "next";
import { Pill } from "lucide-react";
import { Card, CardHeader, PageHeader, Callout } from "@/components/ui/primitives";
import { IndicationsMatrix } from "@/components/guidelines/IndicationsMatrix";
import { RiskChecklist } from "@/components/guidelines/RiskChecklist";
import { ANTITHROMBOTICS, ASA_CLASSES } from "@/lib/data/guidelines";
import { REF_BY_ID } from "@/lib/data/references";

export const metadata: Metadata = { title: "Clinical Guidelines & Decision Support" };

export default function GuidelinesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 3 · Decision support"
        title="Clinical guidelines & decision-support hub"
        description="Indications, contraindications and a pre-procedural risk checklist (platelets, INR, antithrombotic holding windows, ASA class, oxygenation). Distilled from Ernst 2017, BTS 2013 and current reviews."
      />
      <div className="flex flex-col gap-6">
        <RiskChecklist />
        <IndicationsMatrix />

        <Card>
          <CardHeader
            title="Antithrombotic management before bronchoscopic sampling"
            subtitle="Bleeding-risk procedures: EBBx, TBLB, brushing, TBNA. Inspection/BAL are low risk."
            icon={<Pill className="h-4 w-4" />}
          />
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  <th className="py-2 pr-3">Agent</th>
                  <th className="pr-3">Low-risk (inspection / BAL)</th>
                  <th className="pr-3">Biopsy / TBNA</th>
                  <th className="pr-3">Restart</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {ANTITHROMBOTICS.map((a) => (
                  <tr key={a.drug} className="border-b border-line/60 align-top">
                    <td className="py-2 pr-3">
                      <p className="font-medium text-slate-100">{a.drug}</p>
                      <p className="text-[11px] text-muted">{a.klass}</p>
                    </td>
                    <td className="py-2 pr-3 text-slate-300">{a.lowRisk}</td>
                    <td className="py-2 pr-3 text-slate-200">{a.biopsy}</td>
                    <td className="py-2 pr-3 text-slate-300">{a.restart}</td>
                    <td className="py-2 text-[11px] text-cyan-400/80">{a.refs.map((r) => REF_BY_ID[r]?.short).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Callout tone="warn" className="mt-4" title="Thrombotic risk matters">
              Never interrupt dual antiplatelet therapy after a recent coronary stent, or anticoagulation for a mechanical valve / recent VTE, without
              cardiology/haematology input — consider whether a lower-risk sampling technique (e.g., EBUS-TBNA, which appears safe on clopidogrel in small series) can answer the question.
            </Callout>
          </div>
        </Card>

        <Card>
          <CardHeader title="ASA physical status" subtitle="Used for sedation planning; ASA ≥ III often requires a recent ECG" />
          <div className="grid gap-2 p-4 sm:grid-cols-5">
            {ASA_CLASSES.map((a) => (
              <div key={a.cls} className="rounded-lg border border-line bg-panel-2 p-3">
                <p className="font-mono text-lg font-bold text-cyan-300">ASA {a.cls}</p>
                <p className="text-xs text-slate-300">{a.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
