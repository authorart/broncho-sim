import type { V3 } from "@/lib/airway/geometry";

/**
 * IASLC lymph node stations (Rusch 2009) placed schematically around the airway model.
 * Positions use the airway patient frame (mm; +x left, +y superior, +z anterior; carina at origin).
 * EBUS maneuvers are paraphrased from Ernst 2017 ch. 13.
 */

export type Access = "EBUS" | "EUS" | "Mediastinoscopy" | "Surgical";
export type Zone =
  | "Supraclavicular"
  | "Upper"
  | "Aortopulmonary"
  | "Subcarinal"
  | "Lower"
  | "Hilar / Interlobar"
  | "Peripheral";

export type NodeStation = {
  id: string;
  name: string;
  zone: Zone;
  positions: V3[];
  radius: number;
  access: Access[];
  boundaries: string;
  ebusTechnique?: string;
  landmarkVessel?: string;
  pearl?: string;
};

export const NODE_STATIONS: NodeStation[] = [
  {
    id: "1",
    name: "Low cervical, supraclavicular & sternal notch",
    zone: "Supraclavicular",
    positions: [[-13, 95, 14], [13, 95, 14]],
    radius: 4,
    access: ["EBUS", "Mediastinoscopy"],
    boundaries: "From the lower margin of the cricoid to the clavicles and upper border of the manubrium; midline of the trachea divides 1R/1L.",
    ebusTechnique: "High in the trachea just below the cords; often hard to visualise (Ernst ch. 13).",
  },
  {
    id: "2R",
    name: "Right upper paratracheal",
    zone: "Upper",
    positions: [[-15, 55, 10]],
    radius: 4.5,
    access: ["EBUS", "Mediastinoscopy"],
    boundaries: "Upper border of manubrium to the intersection of the caudal margin of the innominate (brachiocephalic) vein with the trachea; extends to the LEFT lateral tracheal border.",
    ebusTechnique: "Withdraw into the mid/upper trachea keeping the transducer at ~2–3 o'clock.",
    landmarkVessel: "Innominate artery / brachiocephalic vein",
  },
  {
    id: "2L",
    name: "Left upper paratracheal",
    zone: "Upper",
    positions: [[14, 58, 9]],
    radius: 4,
    access: ["EBUS", "EUS", "Mediastinoscopy"],
    boundaries: "Upper border of manubrium to the superior border of the aortic arch; left of the left lateral tracheal border.",
    ebusTechnique: "Upper trachea, rotate anticlockwise to ~11 o'clock; the node lies ABOVE the aortic arch.",
    landmarkVessel: "Aortic arch (below)",
  },
  {
    id: "3a",
    name: "Prevascular",
    zone: "Upper",
    positions: [[-2, 44, 40]],
    radius: 4,
    access: ["Surgical"],
    boundaries: "Anterior to the SVC/great vessels, behind the sternum.",
    pearl: "Not accessible from the airway lumen.",
  },
  {
    id: "3p",
    name: "Retrotracheal (prevertebral)",
    zone: "Upper",
    positions: [[0, 44, -11]],
    radius: 3.5,
    access: ["EUS"],
    boundaries: "Posterior to the trachea, from the apex of the chest to the carina.",
    pearl: "Best reached via the oesophagus (EUS / EUS-B).",
  },
  {
    id: "4R",
    name: "Right lower paratracheal",
    zone: "Upper",
    positions: [[-16, 14, 4]],
    radius: 6,
    access: ["EBUS", "Mediastinoscopy"],
    boundaries: "From the caudal margin of the innominate vein to the LOWER border of the azygos vein; includes right paratracheal and pretracheal nodes to the left tracheal border.",
    ebusTechnique: "From the RUL/10R position, withdraw and rotate slightly anticlockwise — found just above the level of the main carina.",
    landmarkVessel: "Azygos vein (lower border = 4R/10R boundary), SVC",
    pearl: "4R and 7 have the highest conventional-TBNA yield — the first stations a novice should attempt (Ernst ch. 11).",
  },
  {
    id: "4L",
    name: "Left lower paratracheal",
    zone: "Upper",
    positions: [[11, 6, 1]],
    radius: 5,
    access: ["EBUS", "EUS", "Mediastinoscopy"],
    boundaries: "Left of the left tracheal border, medial to the ligamentum arteriosum, from the upper margin of the aortic arch to the upper rim of the left main pulmonary artery.",
    ebusTechnique: "In the distal trachea / proximal LMB at the level of the main carina, rotate anticlockwise to ~10 o'clock; lies between the aorta and the LPA.",
    landmarkVessel: "Aorta (above) and left pulmonary artery (below)",
    pearl: "Wang's older map called 4L the 'AP window' — but IASLC stations 5 and 6 are the true AP-window/para-aortic nodes and are NOT reachable by TBNA.",
  },
  {
    id: "5",
    name: "Subaortic (aortopulmonary window)",
    zone: "Aortopulmonary",
    positions: [[33, 16, 7]],
    radius: 4.5,
    access: ["Surgical"],
    boundaries: "Lateral to the ligamentum arteriosum, between the aortic arch and the LPA.",
    pearl: "Requires Chamberlain (anterior) mediastinotomy, VATS, or transaortic EUS — not EBUS.",
  },
  {
    id: "6",
    name: "Para-aortic (ascending aorta / phrenic)",
    zone: "Aortopulmonary",
    positions: [[16, 38, 34]],
    radius: 4,
    access: ["Surgical"],
    boundaries: "Anterior and lateral to the ascending aorta and arch.",
  },
  {
    id: "7",
    name: "Subcarinal",
    zone: "Subcarinal",
    positions: [[0, -17, -8]],
    radius: 7,
    access: ["EBUS", "EUS", "Mediastinoscopy"],
    boundaries: "Caudal to the main carina, upper border of the LLL bronchus on the left and lower border of the BI on the right.",
    ebusTechnique: "Transducer at the medial wall of the proximal RMB or LMB at ~9 o'clock (LMB) / 3 o'clock (RMB) just beyond the carina.",
    pearl: "Widened or blunted main carina on white light is a clue to station 7 enlargement.",
  },
  {
    id: "8",
    name: "Paraoesophageal (below carina)",
    zone: "Lower",
    positions: [[7, -46, -22]],
    radius: 4,
    access: ["EUS"],
    boundaries: "Adjacent to the oesophageal wall, below the subcarinal station.",
  },
  {
    id: "9",
    name: "Pulmonary ligament",
    zone: "Lower",
    positions: [[-20, -78, -16], [24, -78, -16]],
    radius: 3.5,
    access: ["EUS"],
    boundaries: "Within the pulmonary ligament, from the inferior pulmonary vein to the diaphragm.",
  },
  {
    id: "10R",
    name: "Right hilar",
    zone: "Hilar / Interlobar",
    positions: [[-17, -6, 3]],
    radius: 4.5,
    access: ["EBUS"],
    boundaries: "From the LOWER border of the azygos vein to the interlobar region, around the RMB.",
    ebusTechnique: "Tip into the RUL orifice, rotate clockwise to ~3 o'clock and withdraw slightly.",
    landmarkVessel: "Azygos vein (upper boundary), right PA",
  },
  {
    id: "10L",
    name: "Left hilar",
    zone: "Hilar / Interlobar",
    positions: [[23, -12, 5]],
    radius: 4.5,
    access: ["EBUS"],
    boundaries: "From the upper rim of the LPA to the interlobar region, around the LMB.",
    ebusTechnique: "Retract into the LMB at ~10 o'clock; node lies in close proximity to the pulmonary artery.",
  },
  {
    id: "11R",
    name: "Right interlobar (11Rs / 11Ri)",
    zone: "Hilar / Interlobar",
    positions: [[-19, -17, -1], [-19, -40, 3]],
    radius: 4,
    access: ["EBUS"],
    boundaries: "Between the origins of lobar bronchi: 11Rs between RUL and BI; 11Ri between RML and RLL.",
    ebusTechnique: "From the BI, turn clockwise and press the tip against the RUL carina; adjacent to the interlobar PA.",
  },
  {
    id: "11L",
    name: "Left interlobar",
    zone: "Hilar / Interlobar",
    positions: [[41, -31, -3]],
    radius: 4,
    access: ["EBUS"],
    boundaries: "Between the LUL and LLL bronchial origins.",
    ebusTechnique: "Push against the LUL/LLL secondary carina; node visualised next to the PA.",
  },
  {
    id: "12R",
    name: "Right lobar",
    zone: "Peripheral",
    positions: [[-20, -50, -1]],
    radius: 3.5,
    access: ["EBUS"],
    boundaries: "Adjacent to the lobar bronchi.",
    ebusTechnique: "Advance into the lower lobe bronchus proximal to the basal division; adjacent to the interlobar PA.",
  },
  {
    id: "12L",
    name: "Left lobar",
    zone: "Peripheral",
    positions: [[40, -42, -7]],
    radius: 3.5,
    access: ["EBUS"],
    boundaries: "Adjacent to the lobar bronchi.",
    ebusTechnique: "Advance into the basal segment and rotate slightly clockwise / anticlockwise; can be difficult to identify.",
  },
];

export const ZONE_COLORS: Record<Zone, string> = {
  Supraclavicular: "#a78bfa",
  Upper: "#38bdf8",
  Aortopulmonary: "#f472b6",
  Subcarinal: "#fbbf24",
  Lower: "#fb923c",
  "Hilar / Interlobar": "#34d399",
  Peripheral: "#a3e635",
};

export type Vessel = {
  id: string;
  name: string;
  color: string;
  radius: number;
  points: V3[];
};

/** Schematic great vessels for spatial orientation — not to scale. */
export const VESSELS: Vessel[] = [
  {
    id: "aorta",
    name: "Aorta (ascending → arch → descending)",
    color: "#ef4444",
    radius: 11,
    points: [[4, -45, 32], [4, 0, 32], [8, 30, 26], [16, 42, 12], [26, 36, -8], [28, 14, -24], [26, -30, -27], [24, -95, -26]],
  },
  {
    id: "pa",
    name: "Pulmonary trunk",
    color: "#3b82f6",
    radius: 11,
    points: [[10, -55, 44], [8, -30, 34], [6, -16, 24]],
  },
  {
    id: "lpa",
    name: "Left pulmonary artery",
    color: "#3b82f6",
    radius: 8,
    points: [[6, -16, 24], [22, -8, 16], [36, -14, 4], [44, -26, -6], [48, -44, -10]],
  },
  {
    id: "rpa",
    name: "Right pulmonary artery",
    color: "#3b82f6",
    radius: 8,
    points: [[6, -16, 24], [-10, -16, 16], [-24, -22, 10], [-30, -38, 8], [-30, -55, 2]],
  },
  {
    id: "svc",
    name: "Superior vena cava",
    color: "#6366f1",
    radius: 8,
    points: [[-26, 70, 18], [-26, 30, 18], [-26, -25, 18]],
  },
  {
    id: "azygos",
    name: "Azygos vein (arch over RMB)",
    color: "#818cf8",
    radius: 3.5,
    points: [[-10, -70, -24], [-12, -20, -22], [-14, 2, -16], [-18, 6, -4], [-24, 4, 10]],
  },
  {
    id: "esophagus",
    name: "Oesophagus",
    color: "#d6a28a",
    radius: 7,
    points: [[3, 105, -10], [5, 40, -12], [6, -10, -18], [8, -60, -24], [12, -100, -26]],
  },
];
