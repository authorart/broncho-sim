import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = { title: "Performance Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Performance dashboard"
        description="Scores across anatomy, equipment, procedural safety and guidelines, plus simulator and mini-simulation performance. Stored only in this browser (localStorage)."
      />
      <Dashboard />
    </>
  );
}
