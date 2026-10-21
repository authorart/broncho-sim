"use client";

import { useState } from "react";
import { Ban, Crosshair, Search, Wrench } from "lucide-react";
import { Badge, Card, CardHeader, Tabs } from "@/components/ui/primitives";
import { CONTRAINDICATIONS, INDICATIONS, NOT_HELPFUL } from "@/lib/data/guidelines";
import { REF_BY_ID } from "@/lib/data/references";

export function IndicationsMatrix() {
  const [kind, setKind] = useState<"all" | "diagnostic" | "therapeutic">("all");
  const [q, setQ] = useState("");
  const match = (s: string) => s.toLowerCase().includes(q.toLowerCase());
  const groups = INDICATIONS.filter((g) => kind === "all" || g.kind === kind)
    .map((g) => ({ ...g, items: g.items.filter((it) => !q || match(it.label) || match(it.detail ?? "")) }))
    .filter((g) => g.items.length);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader
          title="Indications"
          subtitle="Diagnostic vs therapeutic"
          icon={<Crosshair className="h-4 w-4" />}
          action={
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter…"
                  aria-label="Filter indications"
                  className="h-8 w-40 rounded-md border border-line bg-panel-2 pl-7 pr-2 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <Tabs
                value={kind}
                onChange={setKind}
                options={[
                  { value: "all", label: "All" },
                  { value: "diagnostic", label: "Diagnostic" },
                  { value: "therapeutic", label: <><Wrench className="h-3 w-3" />Therapeutic</> },
                ]}
              />
            </div>
          }
        />
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <div key={g.id} className="rounded-lg border border-line bg-panel-2 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{g.title}</p>
                <Badge tone={g.kind === "therapeutic" ? "warn" : "accent"}>{g.kind}</Badge>
              </div>
              <ul className="space-y-1.5">
                {g.items.map((it) => (
                  <li key={it.label} className="text-[13px]">
                    <span className="text-slate-100">{it.label}</span>
                    {it.detail && <span className="block text-xs text-muted">{it.detail}</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] text-cyan-400/70">{g.refs.map((r) => REF_BY_ID[r]?.short).join(" · ")}</p>
            </div>
          ))}
          <div className="rounded-lg border border-dashed border-line p-3">
            <p className="mb-2 text-sm font-semibold text-slate-300">Low-yield / not indicated</p>
            <ul className="list-disc space-y-1 pl-4 text-[13px] text-muted">
              {NOT_HELPFUL.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Contraindications"
          subtitle="Most are relative — weigh benefit against risk; ensure resuscitation capability"
          icon={<Ban className="h-4 w-4" />}
        />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {(["absolute", "relative"] as const).map((k) => (
            <div key={k}>
              <p className={k === "absolute" ? "mb-2 text-xs font-semibold uppercase tracking-wider text-rose-300" : "mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300"}>
                {k}
              </p>
              <ul className="space-y-2">
                {CONTRAINDICATIONS.filter((c) => c.kind === k).map((c) => (
                  <li key={c.label} className={k === "absolute" ? "rounded-md border border-rose-500/25 bg-rose-500/5 px-3 py-2" : "rounded-md border border-amber-500/25 bg-amber-500/5 px-3 py-2"}>
                    <p className="text-sm font-medium text-slate-100">{c.label}</p>
                    <p className="text-xs text-slate-400">{c.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
