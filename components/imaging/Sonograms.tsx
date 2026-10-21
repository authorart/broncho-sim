"use client";

import { useEffect, useRef } from "react";
import { drawConvex, drawRadial, type ConvexParams, type RadialParams } from "./sonography";
import { cn } from "@/lib/utils";

export function ConvexSonogram({
  params,
  className,
  label = "Convex-probe EBUS image (procedurally generated)",
}: {
  params: ConvexParams;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const key = JSON.stringify(params);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    drawConvex(ctx, c.width, c.height, JSON.parse(key) as ConvexParams);
  }, [key]);
  return (
    <canvas
      ref={ref}
      width={420}
      height={340}
      role="img"
      aria-label={label}
      className={cn("h-auto w-full rounded-lg bg-black", className)}
    />
  );
}

export function RadialSonogram({
  params,
  className,
  label = "Radial-probe EBUS image (procedurally generated)",
}: {
  params: RadialParams;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const key = JSON.stringify(params);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    drawRadial(ctx, c.width, JSON.parse(key) as RadialParams);
  }, [key]);
  return (
    <canvas
      ref={ref}
      width={340}
      height={340}
      role="img"
      aria-label={label}
      className={cn("h-auto w-full rounded-full bg-black", className)}
    />
  );
}
