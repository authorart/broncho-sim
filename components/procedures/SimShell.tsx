"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FlaskConical, RotateCcw, Trophy } from "lucide-react";
import { Button, Card, CardHeader } from "@/components/ui/primitives";
import { useProgress } from "@/lib/store/progress";
import { cn } from "@/lib/utils";

export type SimLog = { tone: "ok" | "warn" | "danger" | "info"; text: string };

/** Frame for each procedure's mini-simulation: shows the event log and records the score. */
export function SimShell({
  procId,
  title,
  subtitle,
  children,
  log,
  score,
  onReset,
}: {
  procId: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  log: SimLog[];
  score: number | null;
  onReset: () => void;
}) {
  const record = useProgress((s) => s.recordProcedure);
  const best = useProgress((s) => Math.max(0, ...(s.procedures[procId] ?? []).map((r) => r.score)));
  const saved = useRef(false);
  useEffect(() => {
    // record once per completed run
    if (score !== null && !saved.current) {
      saved.current = true;
      record(procId, score);
    }
    if (score === null) saved.current = false;
  }, [score, procId, record]);
  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={subtitle}
        icon={<FlaskConical className="h-4 w-4" />}
        action={
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        }
      />
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>{children}</div>
        <div className="flex flex-col gap-2">
          {score !== null && (
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3 text-center">
              <Trophy className="mx-auto h-5 w-5 text-amber-300" />
              <p className="mt-1 font-mono text-3xl font-bold text-cyan-300">{score}</p>
              <p className="text-[11px] text-muted">run score · best {Math.max(best, score)}</p>
            </div>
          )}
          <p className="text-[11px] uppercase tracking-wider text-muted">Event log</p>
          <ul className="scrollbar-thin flex max-h-80 flex-col gap-1 overflow-y-auto" aria-live="polite">
            {log.length === 0 && <li className="text-xs text-muted">Actions and feedback appear here.</li>}
            {log.map((l, i) => (
              <li
                key={i}
                className={cn(
                  "rounded border px-2 py-1 text-xs",
                  l.tone === "ok" && "border-emerald-500/30 text-emerald-200",
                  l.tone === "warn" && "border-amber-500/30 text-amber-200",
                  l.tone === "danger" && "border-rose-500/30 text-rose-200",
                  l.tone === "info" && "border-line text-slate-300",
                )}
              >
                {l.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
