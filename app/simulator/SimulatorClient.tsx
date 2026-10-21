"use client";

import dynamic from "next/dynamic";

const Simulator = dynamic(() => import("@/components/simulator/Simulator").then((m) => m.Simulator), {
  ssr: false,
  loading: () => <div className="aspect-square w-full max-w-[760px] animate-pulse rounded-2xl bg-panel" />,
});

export function SimulatorClient() {
  return <Simulator />;
}
