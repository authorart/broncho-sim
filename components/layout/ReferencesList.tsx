"use client";

import { ExternalLink } from "lucide-react";
import { Callout, Card } from "@/components/ui/primitives";
import { REFERENCES } from "@/lib/data/references";
import { useL } from "@/lib/i18n/locale";

export function ReferencesList() {
  const l = useL();
  return (
    <>
      <Callout tone="warn" title={l("Educational use only", "ใช้เพื่อการศึกษาเท่านั้น")} className="mb-6">
        {l(
          "BronchoSim is a learning aid for trainees in pulmonary medicine. It does not provide medical advice, is not a validated assessment tool, and does not replace supervised hands-on training, manufacturer instructions for use, or institutional protocols. Thresholds (platelets, INR, drug holding windows) vary between guidelines and centres — verify locally. The anatomical model is schematic.",
          "BronchoSim เป็นสื่อการเรียนรู้สำหรับแพทย์ผู้ฝึกอบรมด้านอายุรศาสตร์โรคระบบการหายใจ ไม่ใช่คำแนะนำทางการแพทย์ ไม่ใช่เครื่องมือประเมินที่ผ่านการรับรอง และไม่สามารถใช้แทนการฝึกภายใต้การดูแล คู่มือการใช้งานของผู้ผลิต หรือแนวปฏิบัติของสถาบัน เกณฑ์ต่างๆ (platelets, INR, ระยะหยุดยา) แตกต่างกันในแต่ละแนวทางและสถาบัน — โปรดตรวจสอบกับสถาบันของท่าน แบบจำลองกายวิภาคเป็นแบบแผนผัง",
        )}
      </Callout>
      <Card>
        <ol className="divide-y divide-line">
          {REFERENCES.map((r, i) => (
            <li key={r.id} id={r.id} className="flex gap-3 px-4 py-3 text-sm">
              <span className="w-6 shrink-0 font-mono text-xs text-muted">{i + 1}.</span>
              <div className="flex-1">
                <p className="text-slate-200">{r.citation}</p>
                <p className="mt-0.5 text-[11px] text-cyan-400/80">
                  {l("cited as", "อ้างอิงในชื่อ")} “{r.short}”
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 hover:underline">
                      link <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
      <p className="mt-6 text-center text-xs text-muted">
        © 2026 Sirot Jantharaksa, MD. {l("All rights reserved.", "สงวนลิขสิทธิ์")}
      </p>
    </>
  );
}
