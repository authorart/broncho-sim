"use client";

import { BalSim, WashSim } from "./sims/LavageSims";
import { BrushSim, EbbxSim } from "./sims/ToolSims";
import { TblbSim } from "./sims/TblbSim";
import { TbnaSim } from "./sims/TbnaSim";
import type { Procedure } from "@/lib/data/procedures";

export function ProcedureSim({ id }: { id: Procedure["id"] }) {
  switch (id) {
    case "bw":
      return <WashSim />;
    case "bal":
      return <BalSim />;
    case "brush":
      return <BrushSim />;
    case "ebbx":
      return <EbbxSim />;
    case "tblb":
      return <TblbSim />;
    case "tbna":
      return <TbnaSim />;
  }
}
