"use client";

import Link from "next/link";
import { Stat } from "@/components/ui/primitives";
import { QUIZ } from "@/lib/data/quiz";
import { SEGMENT_IDS } from "@/lib/data/airway";
import { useSummary } from "./Dashboard";

export function HomeProgress() {
  const s = useSummary();
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Your progress</h2>
        <Link href="/dashboard" className="text-xs text-cyan-300 hover:underline">Full dashboard →</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Readiness" value={`${Math.round(s.readiness)}%`} />
        <Stat label="Quiz" value={s.answered ? `${Math.round(s.quizAcc)}%` : "—"} hint={`${s.answered}/${QUIZ.length} answered`} />
        <Stat label="Simulator tasks" value={s.sim.length} hint={`${s.mastered.size}/${SEGMENT_IDS.length} segments mastered`} />
        <Stat label="Procedure sims" value={s.procBest.filter((p) => p.best !== null).length + "/6"} hint="completed at least once" />
      </div>
    </section>
  );
}
