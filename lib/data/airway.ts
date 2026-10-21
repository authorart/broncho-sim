/**
 * Tracheobronchial tree as data. Coordinates are a patient frame in millimetres:
 *   +x = patient's LEFT, +y = SUPERIOR, +z = ANTERIOR. The main carina sits at the origin.
 * Each branch starts where its parent ends. Directions are unit-normalised at build time.
 * Dimensions follow Ernst 2017 ch. 4 (trachea 16–20 mm ID, RMB ~1.5 cm, BI 2–2.5 cm,
 * LMB 4–4.5 cm, LUL bronchus 2–3 cm, lingula 2–3 cm, LLL ~1 cm beyond B6).
 */

export type AirwayLevel = "trachea" | "main" | "lobar" | "segmental" | "subsegmental";
export type Side = "R" | "L" | "C";

export type AirwayBranchDef = {
  id: string;
  name: string;
  /** Boyden number, e.g. "B6" or "B1+2" */
  boyden?: string;
  /** Jackson–Huber descriptive name */
  jacksonHuber?: string;
  parent: string | null;
  side: Side;
  lobe?: "RUL" | "RML" | "RLL" | "LUL" | "Lingula" | "LLL";
  level: AirwayLevel;
  dir: [number, number, number];
  length: number;
  /** internal diameter at origin and end, mm */
  diameter: [number, number];
  /** cartilage ring prominence 0..1 (horseshoe rings in trachea/main bronchi) */
  rings: number;
  description: string;
  landmarks?: string[];
  pitfalls?: string[];
  variations?: string[];
};

export const TRACHEA_TOP: [number, number, number] = [0, 110, 16];

const B: AirwayBranchDef[] = [
  {
    id: "trachea",
    name: "Trachea",
    parent: null,
    side: "C",
    level: "trachea",
    dir: [0, -110, -16],
    length: 111,
    diameter: [18, 16],
    rings: 1,
    description:
      "Begins at the cricoid (≈C6) and runs ~10–12 cm to the main carina (≈T5). Adult internal diameter 16–20 mm with 18–22 horseshoe-shaped cartilage rings anteriorly and a smooth posterior membranous wall (trachealis).",
    landmarks: [
      "Anterior cartilage rings appear as regular pale ridges",
      "Posterior membranous wall bulges inward on expiration and cough",
      "Distal trachea angles slightly posteriorly toward the carina",
    ],
    pitfalls: [
      "Don't fixate on the first lesion: inspect BOTH lungs before sampling — synchronous lesions occur in up to ~10% of bronchogenic carcinomas.",
      "Dynamic posterior wall collapse >50% on expiration suggests tracheobronchomalacia / excessive dynamic airway collapse.",
      "Note extrinsic compression or deviation from paratracheal masses.",
    ],
    variations: ["Tracheal bronchus (\"pig bronchus\"): an RUL or apical segment arising directly from the right tracheal wall."],
  },
  {
    id: "RMB",
    name: "Right main bronchus",
    parent: "trachea",
    side: "R",
    level: "main",
    dir: [-0.55, -0.83, -0.1],
    length: 15,
    diameter: [12, 11],
    rings: 0.8,
    description:
      "Short (~1.5 cm), wide (10–12 mm) and more vertical than the left — the usual path of aspirated foreign bodies. The RUL takeoff arises almost immediately from its lateral wall.",
    landmarks: ["Main carina: sharp, keel-shaped AP septum separating RMB and LMB"],
    pitfalls: [
      "A widened or blunted main carina may indicate subcarinal (station 7) adenopathy.",
      "The RUL orifice is easy to miss if you advance too quickly — look laterally (≈3 o'clock) just past the carina.",
    ],
  },
  {
    id: "LMB",
    name: "Left main bronchus",
    parent: "trachea",
    side: "L",
    level: "main",
    dir: [0.75, -0.62, -0.12],
    length: 44,
    diameter: [11, 10],
    rings: 0.8,
    description:
      "Long (4–4.5 cm), narrower and more horizontal, coursing posteriorly, inferiorly and laterally beneath the aortic arch to the secondary (LUL/LLL) carina.",
    pitfalls: ["Extrinsic pulsation from the aortic arch / LPA is normal here — never needle a pulsatile bulge blindly."],
  },
  {
    id: "RUL",
    name: "Right upper lobe bronchus",
    parent: "RMB",
    side: "R",
    lobe: "RUL",
    level: "lobar",
    dir: [-1, 0.2, 0],
    length: 14,
    diameter: [9, 8],
    rings: 0.35,
    description:
      "Arises from the lateral wall of the RMB just below the carina and runs laterally 1–2 cm before trifurcating into apical (B1), posterior (B2) and anterior (B3) segments.",
    landmarks: ["Trifurcation (B1/B2/B3) — the classic 'Mercedes-Benz' sign"],
    pitfalls: ["Requires marked up-flexion with clockwise rotation; the apical segment (B1) is the hardest to enter."],
  },
  {
    id: "BI",
    name: "Bronchus intermedius",
    parent: "RMB",
    side: "R",
    level: "lobar",
    dir: [-0.2, -1, -0.12],
    length: 24,
    diameter: [10, 9],
    rings: 0.45,
    description:
      "Continuation of the RMB beyond the RUL, 2–2.5 cm long, dividing into the right middle lobe (anterior) and right lower lobe bronchi.",
    variations: ["Cardiac bronchus: rare blind-ending accessory bronchus from the medial BI wall."],
  },
  {
    id: "RML",
    name: "Right middle lobe bronchus",
    parent: "BI",
    side: "R",
    lobe: "RML",
    level: "lobar",
    dir: [-0.35, -0.45, 0.85],
    length: 14,
    diameter: [7, 6],
    rings: 0.2,
    description:
      "Arises from the anterolateral wall of the BI and runs anteriorly/laterally 1–2 cm, dividing into lateral (B4) and medial (B5) segments.",
    pitfalls: [
      "Long, narrow RML bronchus with acute takeoff — prone to extrinsic compression (middle lobe syndrome).",
      "Preferred BAL site in diffuse disease (with the lingula) because return is highest.",
    ],
  },
  {
    id: "RLL",
    name: "Right lower lobe bronchus",
    parent: "BI",
    side: "R",
    lobe: "RLL",
    level: "lobar",
    dir: [-0.05, -1, -0.08],
    length: 10,
    diameter: [9, 8],
    rings: 0.2,
    description: "Gives off the superior segment (B6) posteriorly, roughly opposite the RML orifice, then continues as the basal trunk.",
  },
  {
    id: "RB-basal",
    name: "Right basal trunk",
    parent: "RLL",
    side: "R",
    lobe: "RLL",
    level: "lobar",
    dir: [-0.1, -1, 0],
    length: 10,
    diameter: [8, 7.5],
    rings: 0.1,
    description: "Divides into medial (B7), anterior (B8), lateral (B9) and posterior (B10) basal segments.",
    pitfalls: ["B7 (medial basal) arises first from the medial wall and is often overlooked."],
  },
  {
    id: "LUL",
    name: "Left upper lobe bronchus",
    parent: "LMB",
    side: "L",
    lobe: "LUL",
    level: "lobar",
    dir: [0.6, 0.25, 0.55],
    length: 12,
    diameter: [9, 8.5],
    rings: 0.3,
    description:
      "2–3 cm long; divides into the upper division (apicoposterior B1+2 and anterior B3) and the lingular division. The LPA arches over its origin.",
  },
  {
    id: "LUL-upper",
    name: "LUL upper division",
    parent: "LUL",
    side: "L",
    lobe: "LUL",
    level: "lobar",
    dir: [0.25, 0.9, 0.25],
    length: 10,
    diameter: [8, 7],
    rings: 0.1,
    description: "Divides into apicoposterior (B1+2) and anterior (B3) segmental bronchi.",
    pitfalls: ["Apicoposterior segment requires maximal up-flexion — a common place for incomplete inspection."],
  },
  {
    id: "Lingula",
    name: "Lingular bronchus",
    parent: "LUL",
    side: "L",
    lobe: "Lingula",
    level: "lobar",
    dir: [0.45, -0.55, 0.7],
    length: 16,
    diameter: [7, 6],
    rings: 0.1,
    description: "2–3 cm long, runs inferolaterally and divides into superior (B4) and inferior (B5) lingular segments.",
  },
  {
    id: "LLL",
    name: "Left lower lobe bronchus",
    parent: "LMB",
    side: "L",
    lobe: "LLL",
    level: "lobar",
    dir: [0.2, -1, -0.15],
    length: 9,
    diameter: [9, 8.5],
    rings: 0.15,
    description: "Gives off the superior segment (B6) immediately, then continues ~1 cm before dividing into the basal segments.",
  },
  {
    id: "LB-basal",
    name: "Left basal trunk",
    parent: "LLL",
    side: "L",
    lobe: "LLL",
    level: "lobar",
    dir: [0.15, -1, 0],
    length: 10,
    diameter: [8, 7.5],
    rings: 0.1,
    description: "Divides into anteromedial (B7+8), lateral (B9) and posterior (B10) basal segments.",
  },
];

type SegDef = Omit<AirwayBranchDef, "level" | "rings" | "diameter" | "length"> & {
  length?: number;
  diameter?: [number, number];
};

const SEGMENTS: SegDef[] = [
  // Right upper lobe
  { id: "RB1", boyden: "RB1", name: "RB1 – Apical", jacksonHuber: "Apical", parent: "RUL", side: "R", lobe: "RUL", dir: [-0.25, 1, 0.05], description: "Apical segment of the RUL; points cephalad." },
  { id: "RB2", boyden: "RB2", name: "RB2 – Posterior", jacksonHuber: "Posterior", parent: "RUL", side: "R", lobe: "RUL", dir: [-0.55, 0.3, -0.8], description: "Posterior segment of the RUL; a classic site of aspiration in the recumbent patient and of reactivation TB." },
  { id: "RB3", boyden: "RB3", name: "RB3 – Anterior", jacksonHuber: "Anterior", parent: "RUL", side: "R", lobe: "RUL", dir: [-0.5, 0.05, 0.86], description: "Anterior segment of the RUL." },
  // Right middle lobe
  { id: "RB4", boyden: "RB4", name: "RB4 – Lateral (RML)", jacksonHuber: "Lateral", parent: "RML", side: "R", lobe: "RML", dir: [-0.8, -0.3, 0.5], description: "Lateral segment of the RML — visualised over a longer distance than B5." },
  { id: "RB5", boyden: "RB5", name: "RB5 – Medial (RML)", jacksonHuber: "Medial", parent: "RML", side: "R", lobe: "RML", dir: [0.15, -0.45, 0.9], description: "Medial segment of the RML — more oblique course." },
  // Right lower lobe
  { id: "RB6", boyden: "RB6", name: "RB6 – Superior (RLL)", jacksonHuber: "Superior", parent: "RLL", side: "R", lobe: "RLL", dir: [-0.1, 0.05, -1], description: "Superior segment of the RLL, arising posteriorly — the most dependent segment in the supine patient (aspiration)." },
  { id: "RB7", boyden: "RB7", name: "RB7 – Medial basal", jacksonHuber: "Medial basal", parent: "RB-basal", side: "R", lobe: "RLL", dir: [0.4, -0.9, 0.15], description: "Medial (cardiac) basal segment — first and most medial of the basal segments." },
  { id: "RB8", boyden: "RB8", name: "RB8 – Anterior basal", jacksonHuber: "Anterior basal", parent: "RB-basal", side: "R", lobe: "RLL", dir: [-0.3, -0.8, 0.55], description: "Anterior basal segment." },
  { id: "RB9", boyden: "RB9", name: "RB9 – Lateral basal", jacksonHuber: "Lateral basal", parent: "RB-basal", side: "R", lobe: "RLL", dir: [-0.75, -0.65, -0.1], description: "Lateral basal segment." },
  { id: "RB10", boyden: "RB10", name: "RB10 – Posterior basal", jacksonHuber: "Posterior basal", parent: "RB-basal", side: "R", lobe: "RLL", dir: [-0.2, -0.7, -0.7], description: "Posterior basal segment — dependent in the supine patient." },
  // Left upper lobe
  { id: "LB1+2", boyden: "LB1+2", name: "LB1+2 – Apicoposterior", jacksonHuber: "Apicoposterior", parent: "LUL-upper", side: "L", lobe: "LUL", dir: [0.2, 0.85, -0.5], description: "Apicoposterior segment (B1 and B2 share a common trunk on the left)." },
  { id: "LB3", boyden: "LB3", name: "LB3 – Anterior", jacksonHuber: "Anterior", parent: "LUL-upper", side: "L", lobe: "LUL", dir: [0.3, 0.3, 0.9], description: "Anterior segment of the LUL, accompanied by the anterior segmental artery." },
  // Lingula
  { id: "LB4", boyden: "LB4", name: "LB4 – Superior lingular", jacksonHuber: "Superior lingular", parent: "Lingula", side: "L", lobe: "Lingula", dir: [0.8, -0.1, 0.6], description: "Superior lingular segment." },
  { id: "LB5", boyden: "LB5", name: "LB5 – Inferior lingular", jacksonHuber: "Inferior lingular", parent: "Lingula", side: "L", lobe: "Lingula", dir: [0.35, -0.75, 0.55], description: "Inferior lingular segment." },
  // Left lower lobe
  { id: "LB6", boyden: "LB6", name: "LB6 – Superior (LLL)", jacksonHuber: "Superior", parent: "LLL", side: "L", lobe: "LLL", dir: [0.15, 0.05, -1], description: "Superior segment of the LLL, arising posteriorly immediately on entering the LLL." },
  { id: "LB7+8", boyden: "LB7+8", name: "LB7+8 – Anteromedial basal", jacksonHuber: "Anteromedial basal", parent: "LB-basal", side: "L", lobe: "LLL", dir: [0.05, -0.8, 0.6], description: "Anteromedial basal segment (B7 and B8 commonly share a trunk on the left)." },
  { id: "LB9", boyden: "LB9", name: "LB9 – Lateral basal", jacksonHuber: "Lateral basal", parent: "LB-basal", side: "L", lobe: "LLL", dir: [0.75, -0.65, -0.1], description: "Lateral basal segment." },
  { id: "LB10", boyden: "LB10", name: "LB10 – Posterior basal", jacksonHuber: "Posterior basal", parent: "LB-basal", side: "L", lobe: "LLL", dir: [0.2, -0.7, -0.7], description: "Posterior basal segment." },
];

export const AIRWAY_BRANCHES: AirwayBranchDef[] = [
  ...B,
  ...SEGMENTS.map<AirwayBranchDef>((s) => ({
    ...s,
    level: "segmental",
    rings: 0,
    length: s.length ?? 12,
    diameter: s.diameter ?? [6, 5],
  })),
];

/** IDs of all segmental bronchi (training targets). */
export const SEGMENT_IDS = SEGMENTS.map((s) => s.id);

export const LOBE_LABEL: Record<string, string> = {
  RUL: "Right upper lobe",
  RML: "Right middle lobe",
  RLL: "Right lower lobe",
  LUL: "Left upper lobe (upper division)",
  Lingula: "Lingula",
  LLL: "Left lower lobe",
};
