import { ANTERIOR_V, SUPERIOR_V, START_POSE, poseLookingInto, type Pose, type V3 } from "./geometry";

/**
 * Standard teaching views. Orientation (upHint + roll) is tuned so each rendered view matches the
 * layout of the corresponding image on the Olympus "Nomenclature and Anatomy of the Bronchial Tree"
 * poster and the VUmc segmental-anatomy series (operator behind the patient's head: on the main
 * carina view the LMB is on the left of the screen and the RMB on the right).
 */
export type StandardView = {
  id: string;
  label: string;
  /** airway branch the info panel should describe */
  focus: string;
  /** what a trainee should see — mirrors the reference photograph */
  expected: string;
  pose: () => Pose;
};

const v = (seg: string, back: number, lookAt?: string, up: V3 = ANTERIOR_V, roll = 0) => () =>
  poseLookingInto(seg, back, lookAt, up, roll);

export const STANDARD_VIEWS: StandardView[] = [
  {
    id: "trachea",
    label: "Trachea",
    focus: "trachea",
    expected: "Pale horseshoe cartilage rings anteriorly, smooth striated membranous wall at the bottom, main carina far ahead.",
    pose: () => START_POSE,
  },
  {
    id: "carina",
    label: "Main carina",
    focus: "trachea",
    expected: "Sharp vertical carina: left main bronchus on the LEFT of the screen, right main bronchus on the RIGHT; rings visible inside both.",
    pose: v("trachea", 13),
  },
  {
    id: "rmb",
    label: "Right main bronchus",
    focus: "RMB",
    expected: "RUL orifice high on the right (≈1 o'clock) separated by RC1 from the bronchus intermedius below-left.",
    pose: v("RMB", 9, undefined, ANTERIOR_V, 55),
  },
  {
    id: "rul",
    label: "Right upper lobe (B1/B2/B3)",
    focus: "RUL",
    expected: "Trifurcation: B1 (apical) at the top, B3 (anterior) on the left, B2 (posterior) on the right.",
    pose: v("RUL", 5, undefined, SUPERIOR_V),
  },
  {
    id: "bi",
    label: "Bronchus intermedius",
    focus: "BI",
    expected: "Three orifices: RML (B4–B5) on the left, basal trunk (B7–B10) in the centre, B6 upper right (scope rotated as usual for the right side).",
    pose: v("BI", 6, undefined, ANTERIOR_V, 100),
  },
  {
    id: "rml",
    label: "Right middle lobe (B4/B5)",
    focus: "RML",
    expected: "Bifurcation into medial B5 and lateral B4.",
    pose: v("RML", 5, undefined, SUPERIOR_V),
  },
  {
    id: "rll",
    label: "Right lower lobe (B6–B10)",
    focus: "RLL",
    expected: "B6 opening posteriorly (upper right) above the large basal trunk (lower left).",
    pose: v("BI", 2, "RLL", ANTERIOR_V, 100),
  },
  {
    id: "rbasal",
    label: "Right lower lobe basal group",
    focus: "RLL",
    expected: "B7 on the left (medial), B8 at the top, B9+10 to the right.",
    pose: v("RLL", 3),
  },
  {
    id: "rb8-10",
    label: "Right lower lobe (B8–B10)",
    focus: "RB-basal",
    expected: "B8 separated from the common B9+10 trunk by a thin spur; B9 and B10 just beyond.",
    pose: v("RB-basal", 2),
  },
  {
    id: "lmb",
    label: "Left main bronchus",
    focus: "LMB",
    expected: "Left secondary carina (LC2): LUL orifice above, LLL below.",
    pose: v("LMB", 10, undefined, ANTERIOR_V, -45),
  },
  {
    id: "lul",
    label: "Left upper lobe",
    focus: "LUL",
    expected: "Upper division (B1+2, B3) upper left, lingula (B4–B5) lower right, separated by LC1.",
    pose: v("LUL", 4, undefined, SUPERIOR_V, 35),
  },
  {
    id: "udb",
    label: "Upper division bronchus",
    focus: "LUL-upper",
    expected: "B1+2 at the top, B3 below.",
    pose: v("LUL-upper", 4, undefined, SUPERIOR_V),
  },
  {
    id: "lingula",
    label: "Lingula (B4/B5)",
    focus: "Lingula",
    expected: "Superior (B4) and inferior (B5) lingular orifices side by side.",
    pose: v("Lingula", 6, undefined, SUPERIOR_V),
  },
  {
    id: "lll",
    label: "Left lower lobe (B6–B10)",
    focus: "LLL",
    expected: "Basal trunk (B8–B10) upper centre, B6 lower right.",
    pose: v("LMB", 3, "LLL", ANTERIOR_V, 0),
  },
  {
    id: "lb6",
    label: "Left lower lobe B6 (a/b/c)",
    focus: "LB6",
    expected: "Trifurcation of the superior segment into B6a, B6b and B6c.",
    pose: v("LB6", 4),
  },
  {
    id: "lbasal",
    label: "Left lower lobe basal group",
    focus: "LB-basal",
    expected: "Stacked orifices: B8 (B7+8) at the top, B9 in the middle, B10 at the bottom.",
    pose: v("LB-basal", 4),
  },
];

export const VIEW_BY_ID: Record<string, StandardView> = Object.fromEntries(STANDARD_VIEWS.map((s) => [s.id, s]));
