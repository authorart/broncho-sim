"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Microscope,
  Stethoscope,
  Waypoints,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/anatomy", label: "Airway Atlas", icon: Waypoints },
  { href: "/simulator", label: "Simulator", icon: Activity },
  { href: "/equipment", label: "Equipment", icon: Wrench },
  { href: "/guidelines", label: "Guidelines Hub", icon: ClipboardCheck },
  { href: "/procedures", label: "Procedures", icon: Stethoscope },
  { href: "/quiz", label: "Quiz", icon: GraduationCap },
  { href: "/dashboard", label: "Performance", icon: Microscope },
  { href: "/references", label: "References", icon: BookOpen },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, label, icon: Icon }) => {
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
            {label}
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

export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r border-line bg-panel/60 px-3 py-5 lg:flex">
        <Brand />
        <NavLinks />
        <p className="mt-auto px-2 text-[11px] leading-relaxed text-muted">
          Educational use only. Not a substitute for supervised clinical training or institutional protocols.
        </p>
      </aside>

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-background/90 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-slate-300 hover:bg-panel-2"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-x-0 top-14 z-40 border-b border-line bg-panel p-3 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
