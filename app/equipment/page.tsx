import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { EquipmentGuide } from "@/components/equipment/EquipmentGuide";

export const metadata: Metadata = { title: "Endoscope & Tool Guide" };

export default function EquipmentPage() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Module 2 · Equipment", th: "Module 2 · อุปกรณ์" }}
        title={{ en: "Endoscope & tool anatomy", th: "ส่วนประกอบกล้องและอุปกรณ์" }}
        description={{ en: "Explore the flexible video bronchoscope, the convex-probe EBUS scope with its TBNA needle, and the radial-probe EBUS guide-sheath system. Click the numbered callouts; use the controls to bend the tip, inflate the balloon, set the needle stopper or move the radial probe.", th: "ศึกษา flexible video bronchoscope, convex-probe EBUS พร้อมเข็ม TBNA และระบบ radial-probe EBUS กับ guide sheath คลิกหมายเลขเพื่อดูคำอธิบาย และใช้ตัวควบคุมเพื่องอปลายกล้อง ขยาย balloon ตั้ง needle stopper หรือเลื่อน radial probe" }}
      />
      <EquipmentGuide />
    </>
  );
}
