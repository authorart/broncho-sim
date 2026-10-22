"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart3, CheckCircle2, ChevronRight, GraduationCap, RotateCcw, XCircle } from "lucide-react";
import { Badge, Button, Card, CardHeader, Callout } from "@/components/ui/primitives";
import { CATEGORY_LABEL, QUIZ, type QuizQuestion } from "@/lib/data/quiz";
import { REF_BY_ID } from "@/lib/data/references";
import { useProgress, type QuizCategory } from "@/lib/store/progress";
import { QuestionImage } from "./QuestionImage";
import { cn } from "@/lib/utils";
import { useL } from "@/lib/i18n/locale";
import { useContent } from "@/lib/i18n/content";

type SessionQ = { q: QuizQuestion; order: number[] };

const CATS = Object.keys(CATEGORY_LABEL) as QuizCategory[];

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function QuizRunner() {
  const [cats, setCats] = useState<Set<QuizCategory>>(new Set(CATS));
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<SessionQ[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [results, setResults] = useState<{ cat: QuizCategory; correct: boolean }[]>([]);
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const l = useL();
  const content = useContent();
  const catLabel = (c: QuizCategory) => content.category(c, CATEGORY_LABEL[c]);

  const pool = QUIZ.filter((q) => cats.has(q.category));

  const start = () => {
    const qs = shuffle(pool).slice(0, Math.min(count, pool.length));
    setSession(qs.map((q) => ({ q, order: shuffle(q.options.map((_, i) => i)) })));
    setIdx(0);
    setChosen(null);
    setResults([]);
  };

  if (!session) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader title={l("Build a quiz", "สร้างชุดข้อสอบ")} subtitle={l(`${QUIZ.length} vignette MCQs across four domains`, `ข้อสอบ MCQ แบบ vignette ${QUIZ.length} ข้อ ใน 4 หมวด`)} icon={<GraduationCap className="h-4 w-4" />} />
        <div className="space-y-5 p-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted">{l("Domains", "หมวด")}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {CATS.map((c) => (
                <label key={c} className={cn("flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm", cats.has(c) ? "border-cyan-500/50 bg-cyan-500/5" : "border-line")}>
                  <input
                    type="checkbox"
                    className="accent-cyan-400"
                    checked={cats.has(c)}
                    onChange={() =>
                      setCats((s) => {
                        const n = new Set(s);
                        if (n.has(c)) n.delete(c);
                        else n.add(c);
                        return n;
                      })
                    }
                  />
                  {catLabel(c)}
                  <span className="ml-auto text-xs text-muted">{QUIZ.filter((q) => q.category === c).length}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-muted">{l("Questions", "จำนวนข้อ")}</p>
            <div className="flex gap-2">
              {[5, 10, 20, 40].map((n) => (
                <button key={n} onClick={() => setCount(n)} className={cn("rounded-md border px-3 py-1.5 font-mono text-sm", count === n ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200" : "border-line text-slate-400")}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Button variant="primary" onClick={start} disabled={pool.length === 0}>
            {l(`Start quiz (${Math.min(count, pool.length)} questions)`, `เริ่มทำข้อสอบ (${Math.min(count, pool.length)} ข้อ)`)}
          </Button>
        </div>
      </Card>
    );
  }

  if (idx >= session.length) {
    const total = results.filter((r) => r.correct).length;
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader title={l("Session complete", "ทำข้อสอบเสร็จแล้ว")} icon={<BarChart3 className="h-4 w-4" />} />
        <div className="space-y-4 p-5">
          <p className="text-center font-mono text-5xl font-bold text-cyan-300">
            {Math.round((total / results.length) * 100)}%
          </p>
          <p className="text-center text-sm text-muted">{l(`${total} / ${results.length} correct`, `ถูก ${total} / ${results.length} ข้อ`)}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CATS.filter((c) => results.some((r) => r.cat === c)).map((c) => {
              const rs = results.filter((r) => r.cat === c);
              const ok = rs.filter((r) => r.correct).length;
              return (
                <div key={c} className="rounded-lg border border-line bg-panel-2 p-3">
                  <p className="text-xs text-muted">{catLabel(c)}</p>
                  <p className="font-mono text-lg">{ok}/{rs.length}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${(ok / rs.length) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={start}><RotateCcw className="h-3.5 w-3.5" /> {l("New session", "ทำชุดใหม่")}</Button>
            <Button variant="ghost" onClick={() => setSession(null)}>{l("Change settings", "เปลี่ยนการตั้งค่า")}</Button>
            <Link href="/dashboard" className="inline-flex h-10 items-center gap-2 rounded-md bg-accent-strong px-4 text-sm font-semibold text-slate-950 hover:bg-accent">
              <BarChart3 className="h-4 w-4" /> {l("Performance dashboard", "Dashboard ผลการเรียน")}
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  const { order } = session[idx];
  const q = content.quiz(session[idx].q);
  const answered = chosen !== null;
  const correct = answered && chosen === q.answer;

  const choose = (optIndex: number) => {
    if (answered) return;
    setChosen(optIndex);
    const ok = optIndex === q.answer;
    recordAnswer(q.id, optIndex, ok);
    setResults((r) => [...r, { cat: q.category, correct: ok }]);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>{l("Question", "ข้อที่")} {idx + 1} / {session.length}</span>
        <Badge tone="accent">{catLabel(q.category)}</Badge>
      </div>
      <div className="mb-4 h-1 rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${(idx / session.length) * 100}%` }} />
      </div>
      <Card>
        <div className={cn("grid gap-5 p-5", q.image && "md:grid-cols-[minmax(0,1fr)_300px]")}>
          <div>
            <p className="text-[15px] leading-relaxed text-slate-100">{q.stem}</p>
            <div className="mt-4 flex flex-col gap-2" role="radiogroup">
              {order.map((oi, k) => {
                const isAns = oi === q.answer;
                const isChosen = oi === chosen;
                return (
                  <button
                    key={oi}
                    role="radio"
                    aria-checked={isChosen}
                    onClick={() => choose(oi)}
                    disabled={answered}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                      !answered && "border-line hover:border-cyan-500/50 hover:bg-cyan-500/5",
                      answered && isAns && "border-emerald-400/70 bg-emerald-500/10",
                      answered && isChosen && !isAns && "border-rose-400/70 bg-rose-500/10",
                      answered && !isAns && !isChosen && "border-line opacity-60",
                    )}
                  >
                    <span className="mt-0.5 font-mono text-xs text-muted">{String.fromCharCode(65 + k)}</span>
                    <span className="flex-1">{q.options[oi]}</span>
                    {answered && isAns && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />}
                    {answered && isChosen && !isAns && <XCircle className="h-4 w-4 shrink-0 text-rose-300" />}
                  </button>
                );
              })}
            </div>
          </div>
          {q.image && <QuestionImage key={q.id} img={q.image} />}
        </div>
        {answered && (
          <div className="space-y-3 border-t border-line p-5">
            <Callout tone={correct ? "ok" : "danger"} title={correct ? l("Correct", "ถูกต้อง") : l("Incorrect", "ไม่ถูกต้อง")}>
              {q.rationale}
            </Callout>
            <p className="text-[11px] text-muted">
              {l("References:", "อ้างอิง:")} {q.refs.map((r) => REF_BY_ID[r]?.short).join(" · ")}
            </p>
            <Button variant="primary" onClick={() => { setIdx((i) => i + 1); setChosen(null); }}>
              {idx + 1 < session.length ? l("Next question", "ข้อถัดไป") : l("See results", "ดูผลลัพธ์")} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
