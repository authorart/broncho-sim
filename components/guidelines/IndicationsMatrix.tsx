"use client";

import { useState } from "react";
import { Ban, Crosshair, Search, Wrench } from "lucide-react";
import { Badge, Card, CardHeader, Tabs } from "@/components/ui/primitives";
import { CONTRAINDICATIONS, INDICATIONS, NOT_HELPFUL } from "@/lib/data/guidelines";
import { REF_BY_ID } from "@/lib/data/references";
import { useL } from "@/lib/i18n/locale";
import { useContent } from "@/lib/i18n/content";

export function IndicationsMatrix() {
  const [kind, setKind] = useState<"all" | "diagnostic" | "therapeutic">("all");
  const [q, setQ] = useState("");
  const l = useL();
  const content = useContent();
  const match = (s: string) => s.toLowerCase().includes(q.toLowerCase());
  const groups = INDICATIONS.map(content.indication)
    .filter((g) => kind === "all" || g.kind === kind)
    .map((g) => ({ ...g, items: g.items.filter((it) => !q || match(it.label) || match(it.detail ?? "")) }))
    .filter((g) => g.items.length);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader
          title={l("Indications", "ข้อบ่งชี้")}
          subtitle={l("Diagnostic vs therapeutic", "เพื่อวินิจฉัย และเพื่อรักษา")}
          icon={<Crosshair className="h-4 w-4" />}
          action={
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={l("Filter…", "ค้นหา…")}
                  aria-label="Filter indications"
                  className="h-8 w-40 rounded-md border border-line bg-panel-2 pl-7 pr-2 text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <Tabs
                value={kind}
                onChange={setKind}
                options={[
                  { value: "all", label: l("All", "ทั้งหมด") },
                  { value: "diagnostic", label: l("Diagnostic", "วินิจฉัย") },
                  { value: "therapeutic", label: <><Wrench className="h-3 w-3" />{l("Therapeutic", "รักษา")}</> },
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
                <Badge tone={g.kind === "therapeutic" ? "warn" : "accent"}>{g.kind === "therapeutic" ? l("therapeutic", "รักษา") : l("diagnostic", "วินิจฉัย")}</Badge>
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
            <p className="mb-2 text-sm font-semibold text-slate-300">{l("Low-yield / not indicated", "ประโยชน์น้อย / ไม่มีข้อบ่งชี้")}</p>
            <ul className="list-disc space-y-1 pl-4 text-[13px] text-muted">
              {content.notHelpful(NOT_HELPFUL).map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title={l("Contraindications", "ข้อห้าม")}
          subtitle={l("Most are relative — weigh benefit against risk; ensure resuscitation capability", "ส่วนใหญ่เป็นข้อห้ามสัมพัทธ์ — ชั่งประโยชน์กับความเสี่ยง และต้องพร้อมกู้ชีพ")}
          icon={<Ban className="h-4 w-4" />}
        />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {(["absolute", "relative"] as const).map((k) => (
            <div key={k}>
              <p className={k === "absolute" ? "mb-2 text-xs font-semibold uppercase tracking-wider text-rose-300" : "mb-2 text-xs font-semibold uppercase tracking-wider text-amber-300"}>
                {k === "absolute" ? l("absolute", "ข้อห้ามเด็ดขาด (absolute)") : l("relative", "ข้อห้ามสัมพัทธ์ (relative)")}
              </p>
              <ul className="space-y-2">
                {CONTRAINDICATIONS.filter((c) => c.kind === k).map(content.contraindication).map((c) => (
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
