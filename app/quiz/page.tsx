import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { QuizRunner } from "@/components/quiz/QuizRunner";

export const metadata: Metadata = { title: "Quiz & Self-Assessment" };

export default function QuizPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 5 · Assessment"
        title="Quiz & self-assessment"
        description="High-yield clinical vignettes with simulated endoscopic views and generated EBUS sonograms. Instant feedback with rationale referenced to the textbook and CHEST, ATS, ERS and BTS guidance."
      />
      <QuizRunner />
    </>
  );
}
