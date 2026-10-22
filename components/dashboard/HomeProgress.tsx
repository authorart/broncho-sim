"use client";

import Link from "next/link";
import { Stat } from "@/components/ui/primitives";
import { QUIZ } from "@/lib/data/quiz";
import { SEGMENT_IDS } from "@/lib/data/airway";
import { useSummary } from "./Dashboard";
import { useL } from "@/lib/i18n/locale";

export function HomeProgress() {
  const s = useSummary();
  const l = useL();
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{l("Your progress", "ความก้าวหน้าของคุณ")}</h2>
        <Link href="/dashboard" className="text-xs text-cyan-300 hover:underline">{l("Full dashboard →", "ดูสรุปทั้งหมด →")}</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={l("Readiness", "ความพร้อม")} value={`${Math.round(s.readiness)}%`} />
        <Stat label="Quiz" value={s.answered ? `${Math.round(s.quizAcc)}%` : "—"} hint={l(`${s.answered}/${QUIZ.length} answered`, `ตอบแล้ว ${s.answered}/${QUIZ.length}`)} />
        <Stat label={l("Simulator tasks", "โจทย์ simulator")} value={s.sim.length} hint={l(`${s.mastered.size}/${SEGMENT_IDS.length} segments mastered`, `ทำได้ ${s.mastered.size}/${SEGMENT_IDS.length} segments`)} />
        <Stat label={l("Procedure sims", "Mini-sim หัตถการ")} value={s.procBest.filter((p) => p.best !== null).length + "/6"} hint={l("completed at least once", "ทำสำเร็จอย่างน้อยหนึ่งครั้ง")} />
      </div>
    </section>
  );
}
