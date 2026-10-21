"use client";

import { useEffect } from "react";
import { hydrateProgress } from "@/lib/store/progress";

export function ProgressHydrator() {
  useEffect(() => {
    hydrateProgress();
  }, []);
  return null;
}
