"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type QuizCategory = "anatomy" | "equipment" | "safety" | "guidelines";

export type QuizAnswer = { chosen: number; correct: boolean; at: number };

export type SimAttempt = {
  id: string;
  kind: "navigate" | "identify";
  target: string;
  success: boolean;
  timeSec: number;
  contacts: number;
  score: number;
  at: number;
};

export type ProcedureRun = { score: number; at: number };

type ProgressState = {
  quiz: Record<string, QuizAnswer[]>;
  sim: SimAttempt[];
  procedures: Record<string, ProcedureRun[]>;
  recordAnswer: (qid: string, chosen: number, correct: boolean) => void;
  recordSim: (a: Omit<SimAttempt, "id" | "at">) => void;
  recordProcedure: (procId: string, score: number) => void;
  reset: () => void;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      quiz: {},
      sim: [],
      procedures: {},
      recordAnswer: (qid, chosen, correct) =>
        set((s) => ({
          quiz: { ...s.quiz, [qid]: [...(s.quiz[qid] ?? []), { chosen, correct, at: Date.now() }] },
        })),
      recordSim: (a) =>
        set((s) => ({
          sim: [...s.sim, { ...a, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() }].slice(-200),
        })),
      recordProcedure: (procId, score) =>
        set((s) => ({
          procedures: { ...s.procedures, [procId]: [...(s.procedures[procId] ?? []), { score, at: Date.now() }].slice(-50) },
        })),
      reset: () => set({ quiz: {}, sim: [], procedures: {} }),
    }),
    {
      name: "bronchosim-progress-v1",
      storage: createJSONStorage(() => {
        try {
          return window.localStorage;
        } catch {
          // private mode / blocked storage: fall back to in-memory
          const mem = new Map<string, string>();
          return {
            getItem: (k: string) => mem.get(k) ?? null,
            setItem: (k: string, v: string) => void mem.set(k, v),
            removeItem: (k: string) => void mem.delete(k),
          };
        }
      }),
      skipHydration: true,
    },
  ),
);

/** Call once on the client to load persisted progress (avoids SSR hydration mismatch). */
export function hydrateProgress() {
  if (!useProgress.persist.hasHydrated()) void useProgress.persist.rehydrate();
}
