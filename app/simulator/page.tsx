import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { SimulatorClient } from "./SimulatorClient";

export const metadata: Metadata = { title: "Virtual Bronchoscopy Simulator" };

export default function SimulatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulator"
        title="Virtual bronchoscopy simulator"
        description="Drive a flexible video bronchoscope through a procedurally modelled tracheobronchial tree (trachea → segmental and subsegmental bronchi). Practise scope handling in free mode, then test yourself with scored navigation and identification tasks."
      />
      <SimulatorClient />
    </>
  );
}
