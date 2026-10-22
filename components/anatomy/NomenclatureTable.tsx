"use client";

import { Table2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/primitives";
import { AIRWAY_BRANCHES } from "@/lib/data/airway";
import { useL } from "@/lib/i18n/locale";

const right = AIRWAY_BRANCHES.filter((b) => b.level === "segmental" && b.side === "R");
const left = AIRWAY_BRANCHES.filter((b) => b.level === "segmental" && b.side === "L");

export function NomenclatureTable() {
  const l = useL();
  return (
    <Card className="mt-6">
      <CardHeader
        title={l("Segmental nomenclature — Boyden vs Jackson–Huber", "ชื่อ segment — Boyden เทียบกับ Jackson–Huber")}
        subtitle={l(
          "Learn Jackson–Huber names first and use them consistently. The left lower lobe has no separate B7.",
          "ควรจำชื่อแบบ Jackson–Huber ก่อนและใช้ให้สม่ำเสมอ ข้างซ้ายไม่มี B7 แยกใน lower lobe",
        )}
        icon={<Table2 className="h-4 w-4" />}
      />
      <div className="grid gap-4 p-4 md:grid-cols-2">
        {[
          { side: l("Right lobe", "ปอดขวา"), rows: right },
          { side: l("Left lobe", "ปอดซ้าย"), rows: left },
        ].map(({ side, rows }) => (
          <table key={side} className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                <th className="py-2">{side}</th>
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
  );
}
