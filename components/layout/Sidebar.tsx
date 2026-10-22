"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Menu,
  Microscope,
  Stethoscope,
  Waypoints,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useL, useLocale } from "@/lib/i18n/locale";

export const NAV = [
  { href: "/", en: "Overview", th: "หน้าหลัก", icon: LayoutDashboard },
  { href: "/anatomy", en: "Airway Atlas", th: "Airway Atlas กายวิภาค", icon: Waypoints },
  { href: "/simulator", en: "Simulator", th: "Simulator ฝึกส่องกล้อง", icon: Activity },
  { href: "/equipment", en: "Equipment", th: "อุปกรณ์", icon: Wrench },
  { href: "/guidelines", en: "Guidelines Hub", th: "แนวทางเวชปฏิบัติ", icon: ClipboardCheck },
  { href: "/procedures", en: "Procedures", th: "หัตถการ", icon: Stethoscope },
  { href: "/quiz", en: "Quiz", th: "แบบทดสอบ", icon: GraduationCap },
  { href: "/dashboard", en: "Performance", th: "ผลการเรียนรู้", icon: Microscope },
  { href: "/references", en: "References", th: "เอกสารอ้างอิง", icon: BookOpen },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const l = useL();
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, en, th, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/30"
                : "text-slate-400 hover:bg-panel-2 hover:text-slate-100",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {l(en, th)}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 text-slate-950">
        <Waypoints className="h-4.5 w-4.5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight">BronchoSim</span>
        <span className="block text-[10px] uppercase tracking-widest text-muted">IP Training Suite</span>
      </span>
    </Link>
  );
}

/** EN / ไทย switch. Medical and technical terms stay in English in both languages. */
export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  return (
    <div className={cn("flex items-center gap-1 rounded-lg border border-line bg-panel p-1", className)} role="group" aria-label="Language">
      <Languages className="mx-1 h-3.5 w-3.5 text-muted" aria-hidden />
      {(
        [
          ["en", "EN"],
          ["th", "ไทย"],
        ] as const
      ).map(([code, label]) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            locale === code ? "bg-cyan-500/15 text-cyan-200" : "text-slate-400 hover:text-slate-100",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function Copyright({ className }: { className?: string }) {
  const l = useL();
  return (
    <p className={cn("text-[11px] leading-relaxed text-muted", className)}>
      © 2026 Sirot Jantharaksa, MD.
      <br />
      {l("All rights reserved.", "สงวนลิขสิทธิ์")}
    </p>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const l = useL();
  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-5 border-r border-line bg-panel/60 px-3 py-5 lg:flex">
        <Brand />
        <LanguageToggle className="mx-2 w-fit" />
        <NavLinks />
        <div className="mt-auto space-y-3 px-2">
          <p className="text-[11px] leading-relaxed text-muted">
            {l(
              "Educational use only. Not a substitute for supervised clinical training or institutional protocols.",
              "ใช้เพื่อการศึกษาเท่านั้น ไม่สามารถใช้แทนการฝึกภายใต้การดูแลของอาจารย์หรือแนวปฏิบัติของสถาบัน",
            )}
          </p>
          <Copyright className="border-t border-line pt-3" />
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-background/90 px-4 backdrop-blur lg:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="rounded-md p-2 text-slate-300 hover:bg-panel-2"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-x-0 top-14 z-40 border-b border-line bg-panel p-3 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
          <Copyright className="mt-3 border-t border-line px-3 pt-3" />
        </div>
      )}
    </>
  );
}
