/**
 * Tracheobronchial tree as data. Coordinates are a patient frame in millimetres:
 *   +x = patient's LEFT, +y = SUPERIOR, +z = ANTERIOR. The main carina sits at the origin.
 * Each branch starts where its parent ends. Directions are unit-normalised at build time.
 *
 * Branching pattern follows the Olympus "Nomenclature and Anatomy of the Bronchial Tree"
 * poster and real endoscopic series (Lausanne bronchoscopy atlas; VUmc "Segmental anatomy"):
 *  - RUL trifurcates (B1/B2/B3); left upper division bifurcates (B1+2/B3).
 *  - RB6 arises posteriorly at the level of the RML orifice, so the distal BI shows three
 *    orifices (RML, B6, basal trunk).
 *  - Right basal: B7 arises medially first, then B8, then a common B9+10 trunk.
 *  - Left basal: B7 is usually absent / fused with B8 (B7+8 = "B8"), then a common B9+10 trunk.
 * Dimensions follow Ernst 2017 ch. 4 (trachea 16–20 mm ID, RMB ~1.5 cm, BI 2–2.5 cm,
 * LMB 4–4.5 cm, LUL 2–3 cm incl. divisions, LLL ~1 cm beyond B6).
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
  /** number of subsegmental branches drawn beyond a segment (a/b or a/b/c) */
  subsegments?: 2 | 3;
  description: string;
  landmarks?: string[];
  pitfalls?: string[];
  variations?: string[];
};

export const TRACHEA_TOP: [number, number, number] = [0, 110, 14];

const B: AirwayBranchDef[] = [
  {
    id: "trachea",
    name: "Trachea",
    parent: null,
    side: "C",
    level: "trachea",
    dir: [0, -110, -14],
    length: 111,
    diameter: [18, 17],
    rings: 1,
    description:
      "Begins at the cricoid (≈C6) and runs ~10–12 cm to the main carina (≈T5). Adult internal diameter 16–20 mm with 18–22 pale, horseshoe-shaped cartilage rings anteriorly and a smooth posterior membranous wall with fine longitudinal folds.",
    landmarks: [
      "Anterior cartilage rings appear as regular pale arcs, visible far down the lumen",
      "Posterior membranous wall (trachealis) — smooth, longitudinal striations, bulges on cough/expiration",
      "Main carina in the distance: sharp vertical septum, LMB on the left of the screen, RMB on the right",
    ],
    pitfalls: [
      "Don't fixate on the first lesion: inspect BOTH lungs before sampling — synchronous lesions occur in up to ~10% of bronchogenic carcinomas.",
      "Dynamic posterior wall collapse >50% on expiration suggests tracheobronchomalacia / excessive dynamic airway collapse.",
      "Note extrinsic compression or deviation from paratracheal masses.",
    ],
    variations: ["Tracheal bronchus (\"bronchus suis\"): an RUL or apical segment arising directly from the right tracheal wall.", "Sabre-sheath trachea (COPD): narrowed coronal diameter."],
  },
  {
    id: "RMB",
    name: "Right main bronchus",
    parent: "trachea",
    side: "R",
    level: "main",
    dir: [-0.45, -0.88, -0.1],
    length: 17,
    diameter: [14, 13],
    rings: 0.85,
    description:
      "Short (~1.5 cm), wide and more vertical than the left — the usual path of aspirated foreign bodies. Looking down the RMB, the RUL orifice sits high on the lateral wall (upper right of the screen) separated from the bronchus intermedius by the right secondary carina (RC1).",
    landmarks: ["RC1: spur between the RUL orifice and the bronchus intermedius"],
    pitfalls: [
      "A widened or blunted main carina may indicate subcarinal (station 7) adenopathy.",
      "The RUL orifice is easy to miss if you advance too quickly — look up and to the right just past the carina.",
    ],
  },
  {
    id: "LMB",
    name: "Left main bronchus",
    parent: "trachea",
    side: "L",
    level: "main",
    dir: [0.72, -0.68, -0.12],
    length: 44,
    diameter: [12, 11.5],
    rings: 0.85,
    description:
      "Long (4–4.5 cm), narrower and more horizontal, coursing posteriorly, inferiorly and laterally beneath the aortic arch. Its distal view shows the left secondary carina (LC2) with the LUL orifice above and the LLL below.",
    pitfalls: ["Extrinsic pulsation from the aortic arch / LPA is normal here — never needle a pulsatile bulge blindly."],
  },
  {
    id: "RUL",
    name: "Right upper lobe bronchus",
    parent: "RMB",
    side: "R",
    lobe: "RUL",
    level: "lobar",
    dir: [-0.95, 0.25, -0.08],
    length: 11,
    diameter: [10, 9.5],
    rings: 0.35,
    description:
      "Arises from the lateral wall of the RMB just below the carina and runs laterally ~1–2 cm before trifurcating into apical (B1), posterior (B2) and anterior (B3) segments.",
    landmarks: ["Trifurcation (B1/B2/B3) — the classic 'Mercedes-Benz' sign: with the scope flexed up into the RUL, B1 is at the top, B3 to the left and B2 to the right"],
    pitfalls: ["Requires marked up-flexion with clockwise rotation; the apical segment (B1) is the hardest to enter."],
  },
  {
    id: "BI",
    name: "Bronchus intermedius",
    parent: "RMB",
    side: "R",
    level: "lobar",
    dir: [-0.15, -0.98, -0.1],
    length: 22,
    diameter: [11.5, 10.5],
    rings: 0.5,
    description:
      "Continuation of the RMB beyond the RUL, 2–2.5 cm long. Its distal view shows three orifices: the RML (anterior), the superior segment of the RLL (B6, posterior) and the basal trunk, separated by the right second carina (RC2).",
    variations: ["Cardiac bronchus: rare blind-ending accessory bronchus from the medial BI wall."],
  },
  {
    id: "RML",
    name: "Right middle lobe bronchus",
    parent: "BI",
    side: "R",
    lobe: "RML",
    level: "lobar",
    dir: [-0.25, -0.45, 0.86],
    length: 12,
    diameter: [7.5, 6.5],
    rings: 0.15,
    description:
      "Arises from the anterior wall of the distal BI and runs anteriorly/laterally 1–2 cm, dividing into lateral (B4) and medial (B5) segments.",
    pitfalls: [
      "Long, narrow RML bronchus with acute takeoff — prone to extrinsic compression (middle lobe syndrome).",
      "Preferred BAL site in diffuse disease (with the lingula) because return is highest.",
    ],
  },
  {
    id: "RLL",
    name: "Right lower lobe — basal trunk",
    parent: "BI",
    side: "R",
    lobe: "RLL",
    level: "lobar",
    dir: [-0.08, -1, -0.05],
    length: 7,
    diameter: [10, 9.5],
    rings: 0.15,
    description: "RLL bronchus below the B6 takeoff. The medial basal segment (B7) leaves from its medial wall first; the trunk then continues to B8 and the common B9+10 trunk.",
    pitfalls: ["B7 (medial basal / paracardiac) arises first from the medial wall and is often overlooked — and is absent as a separate orifice in some patients."],
  },
  {
    id: "RB-basal",
    name: "Right basal trunk (B8–B10)",
    parent: "RLL",
    side: "R",
    lobe: "RLL",
    level: "lobar",
    dir: [-0.12, -1, -0.02],
    length: 6,
    diameter: [9, 8.5],
    rings: 0.05,
    description: "Distal basal trunk dividing into the anterior basal segment (B8) and the common trunk of the lateral and posterior basal segments (B9+10).",
  },
  {
    id: "RB9+10",
    name: "Right B9+10 common trunk",
    parent: "RB-basal",
    side: "R",
    lobe: "RLL",
    level: "lobar",
    dir: [-0.3, -0.9, -0.32],
    length: 6,
    diameter: [7.5, 7],
    rings: 0,
    description: "Short common trunk that bifurcates into the lateral (B9) and posterior (B10) basal segments.",
  },
  {
    id: "LUL",
    name: "Left upper lobe bronchus",
    parent: "LMB",
    side: "L",
    lobe: "LUL",
    level: "lobar",
    dir: [0.55, 0.35, 0.76],
    length: 9,
    diameter: [10, 9.5],
    rings: 0.3,
    description:
      "Arises anterosuperiorly from the distal LMB and divides at the LC1 carina into the upper division bronchus (UDB: B1+2 and B3) and the lingular bronchus (B4/B5). The LPA arches over its origin.",
  },
  {
    id: "LUL-upper",
    name: "Upper division bronchus (UDB)",
    parent: "LUL",
    side: "L",
    lobe: "LUL",
    level: "lobar",
    dir: [0.25, 0.92, 0.3],
    length: 9,
    diameter: [8, 7.5],
    rings: 0.1,
    description: "Bifurcates into the apicoposterior (B1+2) and anterior (B3) segmental bronchi — B1+2 above, B3 below on the usual view.",
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
    length: 13,
    diameter: [7, 6.5],
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
    dir: [0.2, -0.97, -0.15],
    length: 6,
    diameter: [10, 9.5],
    rings: 0.15,
    description: "Gives off the superior segment (B6) posteriorly almost immediately, then continues ~1 cm as the basal trunk.",
  },
  {
    id: "LB-basal",
    name: "Left basal trunk",
    parent: "LLL",
    side: "L",
    lobe: "LLL",
    level: "lobar",
    dir: [0.15, -1, 0],
    length: 8,
    diameter: [9, 8.5],
    rings: 0.05,
    description: "Divides into the anteromedial basal segment (B7+8, usually labelled B8) and the common B9+10 trunk.",
  },
  {
    id: "LB9+10",
    name: "Left B9+10 common trunk",
    parent: "LB-basal",
    side: "L",
    lobe: "LLL",
    level: "lobar",
    dir: [0.25, -0.9, -0.35],
    length: 6,
    diameter: [7.5, 7],
    rings: 0,
    description: "Short common trunk dividing into the lateral (B9) and posterior (B10) basal segments — the classic stacked B8 / B9 / B10 view.",
  },
];

type SegDef = Omit<AirwayBranchDef, "level" | "rings" | "diameter" | "length"> & {
  length?: number;
  diameter?: [number, number];
};

const SEGMENTS: SegDef[] = [
  // Right upper lobe
  { id: "RB1", boyden: "RB1", name: "RB1 – Apical", jacksonHuber: "Apical", parent: "RUL", side: "R", lobe: "RUL", dir: [-0.25, 0.95, 0.1], description: "Apical segment of the RUL; points cephalad (subsegments a/b)." },
  { id: "RB2", boyden: "RB2", name: "RB2 – Posterior", jacksonHuber: "Posterior", parent: "RUL", side: "R", lobe: "RUL", dir: [-0.45, 0.35, -0.82], description: "Posterior segment of the RUL; a classic site of aspiration in the recumbent patient and of reactivation TB." },
  { id: "RB3", boyden: "RB3", name: "RB3 – Anterior", jacksonHuber: "Anterior", parent: "RUL", side: "R", lobe: "RUL", dir: [-0.45, -0.05, 0.89], description: "Anterior segment of the RUL." },
  // Right middle lobe
  { id: "RB4", boyden: "RB4", name: "RB4 – Lateral (RML)", jacksonHuber: "Lateral", parent: "RML", side: "R", lobe: "RML", dir: [-0.85, -0.35, 0.4], description: "Lateral segment of the RML — visualised over a longer distance than B5." },
  { id: "RB5", boyden: "RB5", name: "RB5 – Medial (RML)", jacksonHuber: "Medial", parent: "RML", side: "R", lobe: "RML", dir: [0.35, -0.5, 0.8], description: "Medial segment of the RML — more oblique course." },
  // Right lower lobe
  { id: "RB6", boyden: "RB6", name: "RB6 – Superior (RLL)", jacksonHuber: "Superior", parent: "BI", side: "R", lobe: "RLL", dir: [-0.15, -0.12, -0.98], length: 9, diameter: [7, 6.5], subsegments: 3, description: "Superior segment of the RLL (Nelson's bronchus), arising posteriorly at the level of the RML orifice; trifurcates into a/b/c. Most dependent segment in the supine patient (aspiration)." },
  { id: "RB7", boyden: "RB7", name: "RB7 – Medial basal", jacksonHuber: "Medial basal", parent: "RLL", side: "R", lobe: "RLL", dir: [0.45, -0.88, 0.15], description: "Medial (paracardiac) basal segment — first and most medial of the basal segments; sometimes not present as a separate orifice." },
  { id: "RB8", boyden: "RB8", name: "RB8 – Anterior basal", jacksonHuber: "Anterior basal", parent: "RB-basal", side: "R", lobe: "RLL", dir: [-0.35, -0.75, 0.56], description: "Anterior basal segment." },
  { id: "RB9", boyden: "RB9", name: "RB9 – Lateral basal", jacksonHuber: "Lateral basal", parent: "RB9+10", side: "R", lobe: "RLL", dir: [-0.75, -0.65, 0.0], description: "Lateral basal segment (shares a trunk with B10)." },
  { id: "RB10", boyden: "RB10", name: "RB10 – Posterior basal", jacksonHuber: "Posterior basal", parent: "RB9+10", side: "R", lobe: "RLL", dir: [-0.15, -0.7, -0.7], subsegments: 3, description: "Posterior basal segment — dependent in the supine patient (subsegments a/b/c)." },
  // Left upper lobe
  { id: "LB1+2", boyden: "LB1+2", name: "LB1+2 – Apicoposterior", jacksonHuber: "Apicoposterior", parent: "LUL-upper", side: "L", lobe: "LUL", dir: [0.25, 0.85, -0.46], subsegments: 3, description: "Apicoposterior segment (B1 and B2 share a common trunk on the left; subsegments a/b/c)." },
  { id: "LB3", boyden: "LB3", name: "LB3 – Anterior", jacksonHuber: "Anterior", parent: "LUL-upper", side: "L", lobe: "LUL", dir: [0.35, 0.25, 0.9], subsegments: 3, description: "Anterior segment of the LUL, accompanied by the anterior segmental artery." },
  // Lingula
  { id: "LB4", boyden: "LB4", name: "LB4 – Superior lingular", jacksonHuber: "Superior lingular", parent: "Lingula", side: "L", lobe: "Lingula", dir: [0.85, -0.15, 0.5], description: "Superior lingular segment." },
  { id: "LB5", boyden: "LB5", name: "LB5 – Inferior lingular", jacksonHuber: "Inferior lingular", parent: "Lingula", side: "L", lobe: "Lingula", dir: [0.3, -0.75, 0.58], description: "Inferior lingular segment." },
  // Left lower lobe
  { id: "LB6", boyden: "LB6", name: "LB6 – Superior (LLL)", jacksonHuber: "Superior", parent: "LLL", side: "L", lobe: "LLL", dir: [0.15, -0.05, -0.99], length: 9, diameter: [7, 6.5], subsegments: 3, description: "Superior segment of the LLL, arising posteriorly immediately on entering the LLL; trifurcates into a/b/c." },
  { id: "LB7+8", boyden: "LB7+8", name: "LB7+8 – Anteromedial basal (\"B8\")", jacksonHuber: "Anteromedial basal", parent: "LB-basal", side: "L", lobe: "LLL", dir: [0.1, -0.75, 0.65], description: "Anteromedial basal segment: on the left B7 is usually absent or fused with B8, so this orifice is commonly labelled B8." },
  { id: "LB9", boyden: "LB9", name: "LB9 – Lateral basal", jacksonHuber: "Lateral basal", parent: "LB9+10", side: "L", lobe: "LLL", dir: [0.75, -0.65, 0.0], description: "Lateral basal segment (shares a trunk with B10)." },
  { id: "LB10", boyden: "LB10", name: "LB10 – Posterior basal", jacksonHuber: "Posterior basal", parent: "LB9+10", side: "L", lobe: "LLL", dir: [0.2, -0.7, -0.7], subsegments: 3, description: "Posterior basal segment (subsegments a/b/c)." },
];

export const AIRWAY_BRANCHES: AirwayBranchDef[] = [
  ...B,
  ...SEGMENTS.map<AirwayBranchDef>((s) => ({
    ...s,
    level: "segmental",
    rings: 0,
    length: s.length ?? 10,
    diameter: s.diameter ?? [6, 5.5],
    subsegments: s.subsegments ?? 2,
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
