import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { ProcedureCards } from "@/components/procedures/ProcedurePages";

export const metadata: Metadata = { title: "Procedural Trainers" };

export default function ProceduresIndex() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Module 4 · Procedures", th: "Module 4 · หัตถการ" }}
        title={{ en: "Procedural simulators & step-by-step trainer", th: "ฝึกหัตถการทีละขั้นตอนพร้อมแบบจำลอง" }}
        description={{ en: "Each procedure has an interactive workflow, a tips & complications checklist and a scored mini-simulation.", th: "แต่ละหัตถการมีขั้นตอนแบบโต้ตอบ checklist เคล็ดลับและภาวะแทรกซ้อน และ mini-simulation ที่มีการให้คะแนน" }}
      />
      <ProcedureCards />
    </>
  );
}
