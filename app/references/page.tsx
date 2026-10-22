import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { ReferencesList } from "@/components/layout/ReferencesList";

export const metadata: Metadata = { title: "References & Disclaimer" };

export default function ReferencesPage() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Sources", th: "แหล่งข้อมูล" }}
        title={{ en: "References & disclaimer", th: "เอกสารอ้างอิงและข้อจำกัดความรับผิดชอบ" }}
        description={{ en: "BronchoSim content is paraphrased and synthesised from the sources below. No figures or text are reproduced; all images in the app are procedurally generated.", th: "เนื้อหาใน BronchoSim เรียบเรียงและสังเคราะห์จากแหล่งข้อมูลด้านล่าง ไม่ได้คัดลอกรูปหรือข้อความ ภาพทั้งหมดในโปรแกรมสร้างขึ้นด้วยคอมพิวเตอร์" }}
      />
      <ReferencesList />
    </>
  );
}
