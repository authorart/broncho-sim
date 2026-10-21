import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { EquipmentGuide } from "@/components/equipment/EquipmentGuide";

export const metadata: Metadata = { title: "Endoscope & Tool Guide" };

export default function EquipmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Module 2 · Equipment"
        title="Endoscope & tool anatomy"
        description="Explore the flexible video bronchoscope, the convex-probe EBUS scope with its TBNA needle, and the radial-probe EBUS guide-sheath system. Click the numbered callouts; use the controls to bend the tip, inflate the balloon, set the needle stopper or move the radial probe."
      />
      <EquipmentGuide />
    </>
  );
}
