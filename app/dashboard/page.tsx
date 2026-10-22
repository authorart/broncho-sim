import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = { title: "Performance Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Progress", th: "ความก้าวหน้า" }}
        title={{ en: "Performance dashboard", th: "สรุปผลการเรียนรู้" }}
        description={{ en: "Scores across anatomy, equipment, procedural safety and guidelines, plus simulator and mini-simulation performance. Stored only in this browser (localStorage).", th: "คะแนนด้านกายวิภาค อุปกรณ์ ความปลอดภัยในหัตถการ และแนวทางเวชปฏิบัติ รวมถึงผลจาก simulator และ mini-simulation บันทึกไว้ในเบราว์เซอร์นี้เท่านั้น (localStorage)" }}
      />
      <Dashboard />
    </>
  );
}
