"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { add, along, poseLookingInto, type Pose } from "@/lib/airway/geometry";
import type { QuizImage } from "@/lib/data/quiz";
import { VIEW_BY_ID } from "@/lib/airway/views";
import { ConvexSonogram, RadialSonogram } from "@/components/imaging/Sonograms";
import { CONVEX_PRESETS } from "@/components/imaging/sonography";
import { useL } from "@/lib/i18n/locale";

const EndoscopeView = dynamic(() => import("@/components/airway/EndoscopeView").then((m) => m.EndoscopeView), {
  ssr: false,
  loading: () => <div className="aspect-square w-full animate-pulse rounded-full bg-panel" />,
});

function EndoStill({ img }: { img: Extract<QuizImage, { kind: "endo" }> }) {
  const pose = useRef<Pose>("view" in img ? VIEW_BY_ID[img.view].pose() : poseLookingInto(img.segment, img.back, img.lookAt));
  const lesion =
    "lesion" in img && img.lesion
      ? { center: add(along(img.lesion.segment, img.lesion.t), img.lesion.offset), radius: img.lesion.radius }
      : null;
  return <EndoscopeView poseRef={pose} lesion={lesion} still className="aspect-square w-full rounded-xl" />;
}

export function QuestionImage({ img }: { img: QuizImage }) {
  const l = useL();
  return (
    <figure className="mx-auto w-full max-w-sm">
      {img.kind === "endo" && <EndoStill img={img} />}
      {img.kind === "cp-ebus" && <ConvexSonogram params={{ ...CONVEX_PRESETS[img.preset], gain: 1 }} />}
      {img.kind === "rp-ebus" && <RadialSonogram params={{ seed: 9, pattern: img.pattern, gain: 1 }} />}
      <figcaption className="mt-1 text-center text-[11px] text-muted">
        {img.kind === "endo" ? l("Simulated white-light view", "ภาพจำลอง white-light") : l("Procedurally generated ultrasound image", "ภาพ ultrasound ที่สร้างด้วย procedural generation")}
      </figcaption>
    </figure>
  );
}
