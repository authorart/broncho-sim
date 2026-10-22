import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { IndicationsMatrix } from "@/components/guidelines/IndicationsMatrix";
import { RiskChecklist } from "@/components/guidelines/RiskChecklist";
import { AntithromboticTable, AsaCard } from "@/components/guidelines/GuidelineTables";

export const metadata: Metadata = { title: "Clinical Guidelines & Decision Support" };

export default function GuidelinesPage() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Module 3 · Decision support", th: "Module 3 · ช่วยตัดสินใจทางคลินิก" }}
        title={{ en: "Clinical guidelines & decision-support hub", th: "แนวทางเวชปฏิบัติและเครื่องมือช่วยตัดสินใจ" }}
        description={{ en: "Indications, contraindications and a pre-procedural risk checklist (platelets, INR, antithrombotic holding windows, ASA class, oxygenation). Distilled from Ernst 2017, BTS 2013 and current reviews.", th: "ข้อบ่งชี้ ข้อห้าม และ checklist ประเมินความเสี่ยงก่อนหัตถการ (platelets, INR, ระยะหยุดยาต้านการแข็งตัวของเลือด, ASA class, ออกซิเจน) สรุปจาก Ernst 2017, BTS 2013 และบทความทบทวนปัจจุบัน" }}
      />
      <div className="flex flex-col gap-6">
        <RiskChecklist />
        <IndicationsMatrix />

        <AntithromboticTable />
        <AsaCard />
      </div>
    </>
  );
}
