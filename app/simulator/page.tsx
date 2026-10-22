import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { SimulatorClient } from "./SimulatorClient";

export const metadata: Metadata = { title: "Virtual Bronchoscopy Simulator" };

export default function SimulatorPage() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Simulator", th: "Simulator" }}
        title={{ en: "Virtual bronchoscopy simulator", th: "Virtual bronchoscopy simulator ฝึกส่องกล้อง" }}
        description={{ en: "Drive a flexible video bronchoscope through a procedurally modelled tracheobronchial tree (trachea → segmental and subsegmental bronchi). Practise scope handling in free mode, then test yourself with scored navigation and identification tasks.", th: "บังคับ flexible video bronchoscope ผ่าน tracheobronchial tree จำลอง (trachea → segmental และ subsegmental bronchi) ฝึกการควบคุมกล้องในโหมดอิสระ แล้วทดสอบตัวเองด้วยโจทย์นำทางและระบุ segment ที่มีการให้คะแนน" }}
      />
      <SimulatorClient />
    </>
  );
}
