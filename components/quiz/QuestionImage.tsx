"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { add, along, poseLookingInto, type Pose } from "@/lib/airway/geometry";
import type { QuizImage } from "@/lib/data/quiz";
import { ConvexSonogram, RadialSonogram } from "@/components/imaging/Sonograms";
import { CONVEX_PRESETS } from "@/components/imaging/sonography";

const EndoscopeView = dynamic(() => import("@/components/airway/EndoscopeView").then((m) => m.EndoscopeView), {
  ssr: false,
  loading: () => <div className="aspect-square w-full animate-pulse rounded-full bg-panel" />,
});

function EndoStill({ img }: { img: Extract<QuizImage, { kind: "endo" }> }) {
  const pose = useRef<Pose>(poseLookingInto(img.segment, img.back, img.lookAt));
  const lesion = img.lesion
    ? { center: add(along(img.lesion.segment, img.lesion.t), img.lesion.offset), radius: img.lesion.radius }
    : null;
  return <EndoscopeView poseRef={pose} lesion={lesion} still className="aspect-square w-full rounded-xl" />;
}

export function QuestionImage({ img }: { img: QuizImage }) {
  return (
    <figure className="mx-auto w-full max-w-sm">
      {img.kind === "endo" && <EndoStill img={img} />}
      {img.kind === "cp-ebus" && <ConvexSonogram params={{ ...CONVEX_PRESETS[img.preset], gain: 1 }} />}
      {img.kind === "rp-ebus" && <RadialSonogram params={{ seed: 9, pattern: img.pattern, gain: 1 }} />}
      <figcaption className="mt-1 text-center text-[11px] text-muted">
        {img.kind === "endo" ? "Simulated white-light view (anterior wall at top)" : "Procedurally generated ultrasound image"}
      </figcaption>
    </figure>
  );
}
