"use client";

import { Pill } from "lucide-react";
import { Callout, Card, CardHeader } from "@/components/ui/primitives";
import { ANTITHROMBOTICS, ASA_CLASSES } from "@/lib/data/guidelines";
import { REF_BY_ID } from "@/lib/data/references";
import { useL } from "@/lib/i18n/locale";
import { useContent } from "@/lib/i18n/content";

export function AntithromboticTable() {
  const l = useL();
  const c = useContent();
  return (
    <Card>
      <CardHeader
        title={l("Antithrombotic management before bronchoscopic sampling", "การจัดการยาต้านเกล็ดเลือด/ยาต้านการแข็งตัวของเลือดก่อนเก็บตัวอย่าง")}
        subtitle={l(
          "Bleeding-risk procedures: EBBx, TBLB, brushing, TBNA. Inspection/BAL are low risk.",
          "หัตถการที่เสี่ยงเลือดออก: EBBx, TBLB, brushing, TBNA ส่วนการส่องดู/BAL ความเสี่ยงต่ำ",
        )}
        icon={<Pill className="h-4 w-4" />}
      />
      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <th className="py-2 pr-3">{l("Agent", "ยา")}</th>
              <th className="pr-3">{l("Low-risk (inspection / BAL)", "ความเสี่ยงต่ำ (ส่องดู / BAL)")}</th>
              <th className="pr-3">Biopsy / TBNA</th>
              <th className="pr-3">{l("Restart", "เริ่มยาใหม่")}</th>
              <th>{l("Source", "อ้างอิง")}</th>
            </tr>
          </thead>
          <tbody>
            {ANTITHROMBOTICS.map((raw) => {
              const a = c.antithrombotic(raw);
              return (
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
              );
            })}
          </tbody>
        </table>
        <Callout tone="warn" className="mt-4" title={l("Thrombotic risk matters", "อย่าลืมความเสี่ยง thrombosis")}>
          {l(
            "Never interrupt dual antiplatelet therapy after a recent coronary stent, or anticoagulation for a mechanical valve / recent VTE, without cardiology/haematology input — consider whether a lower-risk sampling technique (e.g., EBUS-TBNA, which appears safe on clopidogrel in small series) can answer the question.",
            "ห้ามหยุด dual antiplatelet หลังใส่ coronary stent ไม่นาน หรือหยุดยาต้านการแข็งตัวของเลือดในผู้ที่มี mechanical valve / VTE ไม่นาน โดยไม่ปรึกษาแพทย์โรคหัวใจ/โลหิตวิทยา — พิจารณาว่าเทคนิคที่เสี่ยงน้อยกว่า (เช่น EBUS-TBNA ซึ่งดูปลอดภัยแม้ได้ clopidogrel ในรายงานขนาดเล็ก) ตอบคำถามได้หรือไม่",
          )}
        </Callout>
      </div>
    </Card>
  );
}

export function AsaCard() {
  const l = useL();
  const c = useContent();
  return (
    <Card>
      <CardHeader
        title="ASA physical status"
        subtitle={l("Used for sedation planning; ASA ≥ III often requires a recent ECG", "ใช้วางแผน sedation; ASA ≥ III มักต้องมี ECG ล่าสุด")}
      />
      <div className="grid gap-2 p-4 sm:grid-cols-5">
        {ASA_CLASSES.map((a, i) => (
          <div key={a.cls} className="rounded-lg border border-line bg-panel-2 p-3">
            <p className="font-mono text-lg font-bold text-cyan-300">ASA {a.cls}</p>
            <p className="text-xs text-slate-300">{c.asa(i, a.label)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
