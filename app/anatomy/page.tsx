import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { AnatomyAtlas } from "@/components/anatomy/AnatomyAtlas";
import { NomenclatureTable } from "@/components/anatomy/NomenclatureTable";

export const metadata: Metadata = { title: "Airway Anatomy Atlas" };

export default function AnatomyPage() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Module 1 · Anatomy", th: "Module 1 · กายวิภาค" }}
        title={{ en: "Interactive airway anatomy atlas", th: "Airway anatomy atlas แบบโต้ตอบ" }}
        description={{ en: "Tour the tracheobronchial tree from the subglottis to the segmental bronchi (Boyden B1–B10) in a realistic intraluminal view, then switch to the 3D extraluminal map to relate the airways to IASLC lymph node stations and the great vessels.", th: "สำรวจ tracheobronchial tree ตั้งแต่ subglottis ถึง segmental bronchi (Boyden B1–B10) ในมุมมองภายใน lumen ที่สมจริง แล้วสลับไปที่แผนที่ 3D ภายนอก airway เพื่อดูความสัมพันธ์กับ IASLC lymph node stations และหลอดเลือดใหญ่" }}
      />
      <AnatomyAtlas />

      <NomenclatureTable />
    </>
  );
}
