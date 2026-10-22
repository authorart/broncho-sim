import { PageHeaderL } from "@/components/ui/PageHeaderL";
import type { Metadata } from "next";
import { QuizRunner } from "@/components/quiz/QuizRunner";

export const metadata: Metadata = { title: "Quiz & Self-Assessment" };

export default function QuizPage() {
  return (
    <>
      <PageHeaderL
        eyebrow={{ en: "Module 5 · Assessment", th: "Module 5 · ประเมินตนเอง" }}
        title={{ en: "Quiz & self-assessment", th: "แบบทดสอบและประเมินตนเอง" }}
        description={{ en: "High-yield clinical vignettes with simulated endoscopic views and generated EBUS sonograms. Instant feedback with rationale referenced to the textbook and CHEST, ATS, ERS and BTS guidance.", th: "โจทย์ clinical vignette สำคัญพร้อมภาพส่องกล้องจำลองและภาพ EBUS ที่สร้างขึ้น เฉลยทันทีพร้อมเหตุผลและอ้างอิงจากตำราและแนวทางของ CHEST, ATS, ERS และ BTS" }}
      />
      <QuizRunner />
    </>
  );
}
