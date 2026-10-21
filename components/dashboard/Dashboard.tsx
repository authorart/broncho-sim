"use client";

import Link from "next/link";
import { Activity, Brain, Crosshair, FlaskConical, GraduationCap, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardHeader, Stat } from "@/components/ui/primitives";
import { CATEGORY_LABEL, QUIZ } from "@/lib/data/quiz";
import { PROCEDURES } from "@/lib/data/procedures";
import { SEGMENT_IDS } from "@/lib/data/airway";
import { useProgress, type QuizCategory } from "@/lib/store/progress";
import { cn, formatSeconds } from "@/lib/utils";

function Bar({ value, tone = "accent" }: { value: number; tone?: "accent" | "ok" | "warn" }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-800">
      <div
        className={cn("h-full rounded-full", tone === "accent" && "bg-cyan-400", tone === "ok" && "bg-emerald-400", tone === "warn" && "bg-amber-400")}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function useSummary() {
  const quiz = useProgress((s) => s.quiz);
  const sim = useProgress((s) => s.sim);
  const procedures = useProgress((s) => s.procedures);

  const byCat = (Object.keys(CATEGORY_LABEL) as QuizCategory[]).map((c) => {
    const qs = QUIZ.filter((q) => q.category === c);
    const attempted = qs.filter((q) => quiz[q.id]?.length);
    const latestCorrect = attempted.filter((q) => quiz[q.id]!.at(-1)!.correct).length;
    return {
      cat: c,
      total: qs.length,
      attempted: attempted.length,
      accuracy: attempted.length ? (latestCorrect / attempted.length) * 100 : 0,
    };
  });
  const answered = byCat.reduce((s, c) => s + c.attempted, 0);
  const quizAcc = answered ? byCat.reduce((s, c) => s + (c.accuracy * c.attempted) / 100, 0) / answered * 100 : 0;

  const nav = sim.filter((a) => a.kind === "navigate");
  const ident = sim.filter((a) => a.kind === "identify");
  const navOk = nav.filter((a) => a.success);
  const simAvg = nav.length ? nav.reduce((s, a) => s + a.score, 0) / nav.length : 0;
  const identAcc = ident.length ? (ident.filter((a) => a.success).length / ident.length) * 100 : 0;
  const mastered = new Set(sim.filter((a) => a.success).map((a) => a.target));

  const procBest = PROCEDURES.map((p) => {
    const runs = procedures[p.id] ?? [];
    return { p, runs: runs.length, best: runs.length ? Math.max(...runs.map((r) => r.score)) : null, last: runs.at(-1)?.score ?? null };
  });
  const procDone = procBest.filter((x) => x.best !== null);
  const procAvg = procDone.length ? procDone.reduce((s, x) => s + (x.best ?? 0), 0) / procDone.length : 0;

  const parts = [answered ? quizAcc : null, nav.length || ident.length ? (simAvg + identAcc) / (nav.length && ident.length ? 2 : 1) : null, procDone.length ? procAvg : null].filter(
    (x): x is number => x !== null,
  );
  const readiness = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;

  return { byCat, answered, quizAcc, nav, navOk, ident, simAvg, identAcc, mastered, procBest, procAvg, readiness, sim };
}

export function Dashboard() {
  const s = useSummary();
  const reset = useProgress((x) => x.reset);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Overall readiness" value={`${Math.round(s.readiness)}%`} hint="mean of quiz, simulator & procedure scores" />
        <Stat label="Quiz accuracy" value={s.answered ? `${Math.round(s.quizAcc)}%` : "—"} hint={`${s.answered}/${QUIZ.length} questions attempted`} />
        <Stat label="Navigation score" value={s.nav.length ? Math.round(s.simAvg) : "—"} hint={`${s.navOk.length}/${s.nav.length} targets reached`} />
        <Stat label="Segments mastered" value={`${s.mastered.size}/${SEGMENT_IDS.length}`} hint="reached or identified correctly" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Quiz by domain" subtitle="Accuracy on your latest answer to each question" icon={<GraduationCap className="h-4 w-4" />} />
          <div className="space-y-3 p-4">
            {s.byCat.map((c) => (
              <div key={c.cat}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{CATEGORY_LABEL[c.cat]}</span>
                  <span className="font-mono text-xs text-muted">
                    {c.attempted ? `${Math.round(c.accuracy)}%` : "—"} · {c.attempted}/{c.total}
                  </span>
                </div>
                <Bar value={c.accuracy} tone={c.accuracy >= 80 ? "ok" : c.accuracy >= 60 ? "accent" : "warn"} />
              </div>
            ))}
            <Link href="/quiz" className="inline-block pt-1 text-xs text-cyan-300 hover:underline">Take a quiz →</Link>
          </div>
        </Card>

        <Card>
          <CardHeader title="Procedural mini-simulations" subtitle="Best score per procedure" icon={<FlaskConical className="h-4 w-4" />} />
          <div className="space-y-3 p-4">
            {s.procBest.map(({ p, best, runs, last }) => (
              <div key={p.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <Link href={`/procedures/${p.id}`} className="hover:text-cyan-300">{p.abbr} — {p.name}</Link>
                  <span className="font-mono text-xs text-muted">{best !== null ? `best ${best} · last ${last} · ${runs} runs` : "not attempted"}</span>
                </div>
                <Bar value={best ?? 0} tone={(best ?? 0) >= 80 ? "ok" : "accent"} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Simulator attempts"
          subtitle={`Identification accuracy ${s.ident.length ? Math.round(s.identAcc) + "%" : "—"} over ${s.ident.length} tasks`}
          icon={<Activity className="h-4 w-4" />}
          action={<Link href="/simulator" className="text-xs text-cyan-300 hover:underline">Open simulator →</Link>}
        />
        <div className="overflow-x-auto p-4">
          {s.sim.length === 0 ? (
            <p className="text-sm text-muted">No simulator tasks yet.</p>
          ) : (
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  <th className="py-2">When</th>
                  <th>Task</th>
                  <th>Target</th>
                  <th>Result</th>
                  <th>Time</th>
                  <th>Contacts</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {[...s.sim].reverse().slice(0, 15).map((a) => (
                  <tr key={a.id} className="border-b border-line/60">
                    <td className="py-1.5 text-xs text-muted">{new Date(a.at).toLocaleString()}</td>
                    <td className="flex items-center gap-1.5 py-1.5">
                      {a.kind === "navigate" ? <Brain className="h-3.5 w-3.5 text-amber-300" /> : <Crosshair className="h-3.5 w-3.5 text-cyan-300" />}
                      {a.kind}
                    </td>
                    <td className="font-mono">{a.target}</td>
                    <td><Badge tone={a.success ? "ok" : "danger"}>{a.success ? "success" : "miss"}</Badge></td>
                    <td className="font-mono text-xs">{a.kind === "navigate" ? formatSeconds(a.timeSec) : "—"}</td>
                    <td className="font-mono text-xs">{a.kind === "navigate" ? a.contacts : "—"}</td>
                    <td className="font-mono">{a.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="danger" size="sm" onClick={() => { if (window.confirm("Erase all locally stored progress?")) reset(); }}>
          <Trash2 className="h-3.5 w-3.5" /> Reset my progress
        </Button>
      </div>
    </div>
  );
}
