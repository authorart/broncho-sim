"use client";

import Link from "next/link";
import { Activity, ArrowRight, ClipboardCheck, GraduationCap, Stethoscope, Waypoints, Wrench } from "lucide-react";
import { Card } from "@/components/ui/primitives";
import { HomeProgress } from "@/components/dashboard/HomeProgress";
import { useL } from "@/lib/i18n/locale";

const MODULES = [
  {
    href: "/anatomy",
    icon: Waypoints,
    title: ["Airway anatomy atlas", "Airway anatomy atlas"],
    text: [
      "Intraluminal tour from subglottis to B1–B10 with clickable orifices, plus a 3D map of IASLC stations and great vessels.",
      "สำรวจภายใน lumen ตั้งแต่ subglottis ถึง B1–B10 คลิกรูเปิดเพื่อดูคำอธิบาย พร้อมแผนที่ 3D ของ IASLC stations และหลอดเลือดใหญ่",
    ],
    tag: "Module 1",
  },
  {
    href: "/equipment",
    icon: Wrench,
    title: ["Endoscope & tool guide", "ส่วนประกอบกล้องและอุปกรณ์"],
    text: [
      "Flexible bronchoscope, convex-probe EBUS with TBNA needle, radial probe + guide sheath — interactive callouts and live ultrasound.",
      "Flexible bronchoscope, convex-probe EBUS พร้อมเข็ม TBNA, radial probe + guide sheath — คำอธิบายแบบโต้ตอบและภาพ ultrasound สด",
    ],
    tag: "Module 2",
  },
  {
    href: "/guidelines",
    icon: ClipboardCheck,
    title: ["Guidelines & decision support", "แนวทางเวชปฏิบัติและช่วยตัดสินใจ"],
    text: [
      "Indications, absolute vs relative contraindications, antithrombotic windows and a pre-procedure risk checklist.",
      "ข้อบ่งชี้ ข้อห้ามเด็ดขาดและข้อห้ามสัมพัทธ์ ระยะหยุดยาต้านการแข็งตัวของเลือด และ checklist ความเสี่ยงก่อนหัตถการ",
    ],
    tag: "Module 3",
  },
  {
    href: "/procedures",
    icon: Stethoscope,
    title: ["Procedural trainers", "ฝึกหัตถการ"],
    text: [
      "BW, BAL, brushing, EBBx, TBLB and TBNA/EBUS-TBNA — step-by-step workflows with scored mini-simulations.",
      "BW, BAL, brushing, EBBx, TBLB และ TBNA/EBUS-TBNA — ขั้นตอนทีละขั้นพร้อม mini-simulation ที่มีการให้คะแนน",
    ],
    tag: "Module 4",
  },
  {
    href: "/simulator",
    icon: Activity,
    title: ["Virtual bronchoscopy simulator", "Virtual bronchoscopy simulator"],
    text: [
      "Drive a scope with realistic tip flexion and rotation. Free exploration, navigation and identification tasks.",
      "บังคับกล้องด้วยการงอปลายและหมุนกล้องที่สมจริง มีโหมดสำรวจอิสระ โจทย์นำทาง และโจทย์ระบุ segment",
    ],
    tag: "Simulator",
  },
  {
    href: "/quiz",
    icon: GraduationCap,
    title: ["Quiz & self-assessment", "แบบทดสอบและประเมินตนเอง"],
    text: [
      "40 vignette MCQs with simulated endoscopic images and EBUS sonograms, instant referenced feedback.",
      "โจทย์ MCQ แบบ vignette 40 ข้อ พร้อมภาพส่องกล้องจำลองและภาพ EBUS เฉลยทันทีพร้อมอ้างอิง",
    ],
    tag: "Module 5",
  },
] as const;

export default function Home() {
  const l = useL();
  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-[#0b1625] via-[#0a1019] to-[#08121a] p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">BronchoSim</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          {l("Interactive bronchoscopy & interventional pulmonology training", "ฝึก bronchoscopy และ interventional pulmonology แบบโต้ตอบ")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">
          {l(
            "Learn the airway the way you see it through the scope, rehearse sampling techniques step by step, and test yourself against guideline-based vignettes — all in the browser.",
            "เรียนรู้ airway แบบที่เห็นจริงผ่านกล้อง ซ้อมเทคนิคการเก็บตัวอย่างทีละขั้นตอน และทดสอบตัวเองด้วยโจทย์ตามแนวทางเวชปฏิบัติ — ทั้งหมดบนเบราว์เซอร์",
          )}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/simulator" className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent-strong px-5 text-sm font-semibold text-slate-950 hover:bg-accent">
            <Activity className="h-4 w-4" /> {l("Launch simulator", "เริ่มใช้ simulator")}
          </Link>
          <Link href="/anatomy" className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-panel px-5 text-sm hover:border-slate-500">
            <Waypoints className="h-4 w-4" /> {l("Explore the airway atlas", "สำรวจ airway atlas")}
          </Link>
        </div>
      </section>

      <HomeProgress />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map(({ href, icon: Icon, title, text, tag }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full p-5 transition-colors group-hover:border-cyan-500/50">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-500/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[11px] uppercase tracking-wider text-muted">{tag}</span>
              </div>
              <h2 className="mt-4 font-semibold">{l(title[0], title[1])}</h2>
              <p className="mt-1 text-sm text-muted">{l(text[0], text[1])}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs text-cyan-300">
                {l("Open", "เปิด")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </Link>
        ))}
      </section>

      <p className="text-center text-[11px] text-muted">
        {l("Content paraphrased from Ernst (ed.), Introduction to Bronchoscopy, 2nd ed. (2017), Olympus documentation and BTS, CHEST, ATS/ERS guidance — see ", "เนื้อหาเรียบเรียงจาก Ernst (ed.), Introduction to Bronchoscopy, 2nd ed. (2017), เอกสาร Olympus และแนวทางของ BTS, CHEST, ATS/ERS — ดู ")}
        <Link href="/references" className="text-cyan-300 hover:underline">{l("references", "เอกสารอ้างอิง")}</Link>.{" "}
        {l("Educational use only.", "ใช้เพื่อการศึกษาเท่านั้น")}
        <br />© 2026 Sirot Jantharaksa, MD. {l("All rights reserved.", "สงวนลิขสิทธิ์")}
      </p>
    </div>
  );
}
