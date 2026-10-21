import type { Metadata } from "next";
import { PageHeader, Card, CardHeader } from "@/components/ui/primitives";
import { AnatomyAtlas } from "@/components/anatomy/AnatomyAtlas";
import { AIRWAY_BRANCHES } from "@/lib/data/airway";
import { Table2 } from "lucide-react";

export const metadata: Metadata = { title: "Airway Anatomy Atlas" };

const right = AIRWAY_BRANCHES.filter((b) => b.level === "segmental" && b.side === "R");
const left = AIRWAY_BRANCHES.filter((b) => b.level === "segmental" && b.side === "L");

export default function AnatomyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 1 · Anatomy"
        title="Interactive airway anatomy atlas"
        description="Tour the tracheobronchial tree from the subglottis to the segmental bronchi (Boyden B1–B10) in a realistic intraluminal view, then switch to the 3D extraluminal map to relate the airways to IASLC lymph node stations and the great vessels."
      />
      <AnatomyAtlas />

      <Card className="mt-6">
        <CardHeader
          title="Segmental nomenclature — Boyden vs Jackson–Huber"
          subtitle="Learn Jackson–Huber names first and use them consistently (Ernst 2017, Table 4.1)."
          icon={<Table2 className="h-4 w-4" />}
        />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {[
            { side: "Right", rows: right },
            { side: "Left", rows: left },
          ].map(({ side, rows }) => (
            <table key={side} className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  <th className="py-2">{side} lobe</th>
                  <th>Boyden</th>
                  <th>Jackson–Huber</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-line/60">
                    <td className="py-1.5 text-slate-400">{r.lobe}</td>
                    <td className="font-mono text-cyan-300">{r.boyden}</td>
                    <td className="text-slate-200">{r.jacksonHuber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </Card>
    </>
  );
}
