/**
 * Equipment content. Specifications are taken from the Olympus BF-190 series operation manual
 * (BF-H190 / Q190 / 1TH190 / P190 / XP190), the Olympus EBUS-TBNA brochure (BF-UC190F, ViziShot
 * needles, EU-ME3) and the BF-UCP190F brochure. Technique notes paraphrase Ernst 2017 ch. 6, 10, 13
 * and the CHEST 2016 EBUS-TBNA guideline. Always check the IFU of the instrument actually in use.
 */

export type Part = {
  id: string;
  label: string;
  summary: string;
  details: string[];
  pitfall?: string;
};

export type Device = {
  id: "flexible" | "cpebus" | "rpebus";
  name: string;
  tagline: string;
  parts: Part[];
  refs: string[];
};

/* ───────────── Flexible video bronchoscopes (BF-190 series) ───────────── */

export type ScopeModel = {
  id: string;
  name: string;
  use: string;
  fov: number;
  dof: string;
  distalOD: number;
  tubeOD: number;
  channel: number;
  up: number;
  down: number;
};

export const SCOPE_MODELS: ScopeModel[] = [
  { id: "BF-H190", name: "BF-H190", use: "Standard HD diagnostic scope", fov: 120, dof: "3–100 mm", distalOD: 5.5, tubeOD: 5.1, channel: 2.0, up: 210, down: 130 },
  { id: "BF-Q190", name: "BF-Q190", use: "Slimmer standard scope", fov: 120, dof: "3–100 mm", distalOD: 4.8, tubeOD: 4.9, channel: 2.0, up: 210, down: 130 },
  { id: "BF-1TH190", name: "BF-1TH190", use: "Therapeutic scope (large channel)", fov: 120, dof: "3–100 mm", distalOD: 6.2, tubeOD: 6.0, channel: 2.8, up: 180, down: 130 },
  { id: "BF-P190", name: "BF-P190", use: "Thin scope for peripheral / radial EBUS work", fov: 110, dof: "2–50 mm", distalOD: 4.2, tubeOD: 4.1, channel: 2.0, up: 210, down: 130 },
  { id: "BF-XP190", name: "BF-XP190", use: "Ultrathin scope", fov: 110, dof: "2–50 mm", distalOD: 3.1, tubeOD: 2.8, channel: 1.2, up: 210, down: 130 },
];

export const FLEXIBLE_COMMON = [
  { label: "Working length", value: "600 mm (total length 880 mm)" },
  { label: "Direction of view", value: "0° (forward viewing)" },
  { label: "Insertion-tube rotation ring", value: "Right 120° / Left 120°" },
  { label: "Accessory enters the image", value: "From the right (≈3 o'clock), octagonal image" },
  { label: "Minimum visible distance", value: "3 mm (BF-P190/XP190: 3 / 1.5 mm)" },
];

/* ───────────── Convex-probe EBUS bronchoscopes ───────────── */

export type EbusModel = {
  id: string;
  name: string;
  fov: number;
  oblique: number;
  dof: string;
  distalOD: number;
  tubeOD: number;
  channel: number;
  up: number;
  down: number;
  balloon: boolean;
  note: string;
};

export const EBUS_MODELS: EbusModel[] = [
  {
    id: "BF-UC190F",
    name: "BF-UC190F",
    fov: 80,
    oblique: 20,
    dof: "2–50 mm",
    distalOD: 6.6,
    tubeOD: 6.3,
    channel: 2.2,
    up: 160,
    down: 70,
    balloon: true,
    note: "Third-generation linear EBUS scope; 25 mm rigid distal part; 5° steeper puncture angle than its predecessor; accepts 19/21/22/25 G needles.",
  },
  {
    id: "BF-UCP190F",
    name: "BF-UCP190F",
    fov: 80,
    oblique: 14,
    dof: "2–50 mm",
    distalOD: 5.9,
    tubeOD: 5.7,
    channel: 1.7,
    up: 170,
    down: 70,
    balloon: false,
    note: "Thin linear EBUS scope for segmental / subsegmental reach; shorter distal end, no balloon needed; used with the 25 G needle.",
  },
];

export const EBUS_ULTRASOUND = [
  { label: "Scanning method", value: "Electronic curved linear array" },
  { label: "Scanning direction", value: "Parallel to the insertion direction" },
  { label: "Frequency", value: "5 / 7.5 / 10 / 12 MHz" },
  { label: "Scanning range", value: "65° sector" },
  { label: "Contact", value: "Balloon (saline) or direct contact" },
  { label: "Processors", value: "EU-ME3 (B-mode, H-FLOW Doppler, THE, elastography) or Hitachi Arietta 850" },
];

export const NEEDLES = [
  { gauge: "19 G", product: "ViziShot 2 FLEX (NA-U403SX-4019)", channel: "≥2.2 mm", use: "FNA + FNB indication; histology for sarcoidosis, lymphoma and molecular work. Higher yield than 22 G in conventional TBNA (Schenk).", stiffness: 3 },
  { gauge: "21 G", product: "ViziShot / ViziShot 2 (NA-201SX-4021, NA-U401SX-4021)", channel: "≥2.0 mm", use: "Standard EBUS-TBNA; yield equivalent to 22 G for malignancy (CHEST 2016).", stiffness: 2 },
  { gauge: "22 G", product: "ViziShot / ViziShot 2 (NA-201SX-4022, NA-U401SX-4022)", channel: "≥2.0 mm", use: "Standard EBUS-TBNA / cytology; flexible in angulated positions.", stiffness: 2 },
  { gauge: "25 G", product: "ViziShot 2 25G (NA-U401SX-4025N)", channel: "≥1.7 mm", use: "Most flexible; small or awkwardly angled nodes, BF-UCP190F; less blood but less tissue.", stiffness: 1 },
];

/* ───────────── Callouts ───────────── */

export const DEVICES: Device[] = [
  {
    id: "flexible",
    name: "Flexible video bronchoscope (BF-190 series)",
    tagline: "Control section held vertically in the LEFT hand; insertion tube guided by the right hand at the mouth/nose.",
    parts: [
      {
        id: "lever",
        label: "UP/DOWN angulation control lever",
        summary: "Moved by the left thumb. Lever toward \"U\" bends the tip UP, toward \"D\" bends it DOWN — one plane only.",
        details: [
          "BF-H190 / Q190 / P190 / XP190: UP 210°, DOWN 130°; BF-1TH190: UP 180°, DOWN 130°.",
          "Left/right targets are reached by rotating the scope (rotation ring or the whole instrument), then flexing.",
          "Return the lever to neutral before withdrawing or inserting through the cords.",
        ],
        pitfall: "Never force angulation with an accessory protruding — it can damage the channel and the airway.",
      },
      {
        id: "switches",
        label: "Remote switches 1–4",
        summary: "Programmable on the CV-190 video system centre: freeze / release, image capture, NBI, zoom, brightness.",
        details: ["Perform white balance before every procedure.", "NBI accentuates submucosal vessels (dysplasia, early tumour)."],
      },
      {
        id: "suction",
        label: "Suction valve (MAJ-209 single-use / MAJ-207)",
        summary: "Sits in the suction cylinder at the top of the control section; press with the index finger to aspirate through the instrument channel.",
        details: [
          "Also used to clear fluid or debris from the objective lens.",
          "Avoid suction with the tip against the mucosa — it causes trauma and bleeding.",
          "Minimise upper-airway suction before BAL (contamination, lower cellular yield).",
        ],
      },
      {
        id: "port",
        label: "Instrument channel port + biopsy valve (MAJ-210 / MD-495)",
        summary: "On the front of the control section: accessories, saline syringes and the EBUS needle enter here. Colour code shows accessory compatibility.",
        details: [
          "Colour code: blue = BF-Q190/H190/P190; yellow = BF-1TH190; white = BF-XP190.",
          "The channel serves three functions: accessory passage, suction and fluid instillation.",
          "Pass accessories closed/sheathed until seen at the distal end.",
        ],
        pitfall: "Open forceps or an exposed needle in the channel is the commonest (preventable) cause of channel damage.",
      },
      {
        id: "ring",
        label: "Insertion-tube rotation ring",
        summary: "Turns the insertion tube up to 120° left or right relative to the control section, reducing wrist torque.",
        details: [
          "The UP indication on the insertion tube shows the bending direction; align it with the mark on the control section for neutral.",
          "Rotating the scope rotates the endoscopic image — that is why standard atlas views of the right side often appear turned.",
        ],
      },
      {
        id: "boot",
        label: "Boot",
        summary: "Protects the junction between the insertion tube and control section from sharp bending.",
        details: ["Keep the insertion tube straight between hand and mouth so rotation is transmitted to the tip."],
      },
      {
        id: "insertion",
        label: "Insertion tube",
        summary: "Flexible shaft (BF-H190: Ø 5.1 mm, working length 600 mm) containing the channel, light guides, angulation wires and image cable.",
        details: [
          "Always use a bite block for oral insertion — bite damage is a leading costly repair.",
          "Use water-based lubricant only.",
        ],
      },
      {
        id: "bending",
        label: "Bending section",
        summary: "Hinged distal segment moved by the angulation wires; its curve follows the lever position in real time.",
        details: ["Follow-the-leader: as you advance with the tip flexed, the shaft follows the new direction."],
      },
      {
        id: "tip",
        label: "Distal end",
        summary: "Objective lens, two light-guide lenses and the instrument channel outlet (BF-H190 Ø 5.5 mm).",
        details: [
          "Field of view 120° with depth of field 3–100 mm (thin P190/XP190: 110°, 2–50 mm).",
          "The image is octagonal; accessories appear from the right edge (≈3 o'clock).",
          "Light from the distal end can heat tissue during prolonged close viewing.",
        ],
      },
      {
        id: "cord",
        label: "Universal cord & endoscope connector",
        summary: "Carries light and video signals to the CV-190 / CLV-190 (light guide prong, electrical contacts, venting connector for leak testing).",
        details: [
          "The connector carries an RFID scope ID and a memory chip read by the processor.",
          "Attach the sterilisation cap only for gas sterilisation or shipping — remove it before immersion.",
        ],
      },
    ],
    refs: ["OLY-BF190", "ERNST"],
  },
  {
    id: "cpebus",
    name: "Convex-probe EBUS bronchoscope (BF-UC190F / BF-UCP190F)",
    tagline: "Curved linear transducer at the tip scanning parallel to the scope axis: real-time needle aspiration of nodes beyond the airway wall.",
    parts: [
      {
        id: "transducer",
        label: "Curved linear-array transducer",
        summary: "Electronic convex array at the very tip; scans a 65° sector parallel to the insertion direction at 5–12 MHz.",
        details: [
          "The image is displayed as a fan with the transducer at the top of the screen.",
          "Press the transducer against the wall (or use the balloon) for acoustic coupling.",
          "Use H-FLOW/eFLOW Doppler to separate vessels from nodes before every puncture.",
        ],
      },
      {
        id: "balloon",
        label: "Balloon & balloon channel outlet",
        summary: "A water-filled balloon (MAJ-1351) over the transducer improves contact on irregular walls or over cartilage (BF-UC190F only).",
        details: ["Fill via the balloon channel outlet with de-aerated water; check for air bubbles.", "The thin BF-UCP190F is designed to work without a balloon."],
      },
      {
        id: "optics",
        label: "Forward-oblique optics",
        summary: "Objective lens and light guide sit on the slope behind the transducer: 80° field of view looking 20° forward-oblique (BF-UCP190F: 14°).",
        details: [
          "To look straight ahead, flex the tip slightly DOWN — the white-light view is offset from the scope axis.",
          "Passing the cords and steering feel different from a standard scope; the 25 mm rigid tip limits distal reach.",
        ],
      },
      {
        id: "channel",
        label: "Instrument channel outlet",
        summary: "2.2 mm channel (BF-UCP190F 1.7 mm) emerging obliquely so the needle travels within the ultrasound plane.",
        details: ["Load the needle with the tip straight; flexion is stiffer once the needle is in the channel.", "Angulation: BF-UC190F UP 160° / DOWN 70°; BF-UCP190F UP 170° / DOWN 70°."],
      },
      {
        id: "sheath",
        label: "Sheath adjuster",
        summary: "Sets how far the needle sheath protrudes; adjust so the sheath is just visible at the edge of the white-light image.",
        details: ["Sheath inside the channel → the needle can puncture the channel when advanced.", "Sheath too long → obscures the view and wastes needle reach."],
      },
      {
        id: "stopper",
        label: "Needle slider & stopper",
        summary: "Locks the maximum needle excursion (20–40 mm) based on the measured distance to the far wall of the node.",
        details: ["Set the stopper short of any vessel behind the node.", "ViziShot 2: sharper tip and ergonomic handle; 19 G FLEX version for core samples."],
      },
      {
        id: "stylet",
        label: "Stylet",
        summary: "Keeps the needle lumen free of bronchial-wall plugs during puncture; withdrawn once inside the node.",
        details: ["Re-insert or use air/stylet to expel the sample onto slides and into cell-block medium."],
      },
      {
        id: "syringe",
        label: "Suction syringe (Luer lock)",
        summary: "Attached to the needle's side port after stylet removal to apply suction during agitation.",
        details: ["Suction is optional — slow-pull capillary sampling gives comparable yield (CHEST 2016).", "Release suction BEFORE retracting the needle into the sheath."],
      },
    ],
    refs: ["OLY-EBUS", "OLY-UCP", "ERNST", "CHEST-EBUS2016"],
  },
  {
    id: "rpebus",
    name: "Radial-probe EBUS with guide sheath",
    tagline: "A 360° mechanical mini-probe passed through a thin scope's channel to confirm a peripheral lesion before sampling through a guide sheath.",
    parts: [
      {
        id: "probe",
        label: "Radial miniature probe",
        summary: "Rotating 20 MHz transducer (≈1.4 mm) driven by a probe driving unit; images a full 360° plane perpendicular to the probe.",
        details: [
          "Aerated lung = bright 'snowstorm' with reverberation; solid lesion = homogeneous darker area with a sharp bright border.",
          "Connects to the EU-ME3 via a probe driving unit; no real-time needle view — confirm first, then sample.",
        ],
      },
      {
        id: "scope",
        label: "Thin bronchoscope",
        summary: "Usually a BF-P190 class scope (Ø 4.2 mm, 2.0 mm channel) wedged in the segmental bronchus leading to the lesion.",
        details: ["Plan the bronchial path on CT (bronchus sign) or with navigation software.", "Keep the scope tip fixed once the probe is in position."],
      },
      {
        id: "gs",
        label: "Guide sheath (GS) with radiopaque tip",
        summary: "Thin catheter over the probe; once the lesion is found the probe is removed and the sheath stays as an extended working channel.",
        details: ["Brush, forceps and needle pass through the GS to the same location; fluoroscopy confirms nothing moved.", "Lock the GS at the biopsy port while exchanging tools."],
      },
      {
        id: "patterns",
        label: "Probe–lesion relationship",
        summary: "Within (concentric) → probe surrounded by lesion; eccentric → inside but off-centre; adjacent → touching the edge only.",
        details: [
          "Within-lesion position roughly doubles yield versus adjacent (≈83% vs ≈61%; concentric ≈84% vs eccentric ≈48% in individual series).",
          "Adjacent/eccentric: re-angle into a different subsegment, add TBNA or cryobiopsy, or use navigation.",
        ],
      },
      {
        id: "fluoro",
        label: "Fluoroscopy correlation",
        summary: "Confirms the GS tip overlies the lesion and checks the distance to the pleura before forceps biopsy.",
        details: ["Keep tools ~1–2 cm from the pleura; screen for pneumothorax at the end."],
      },
    ],
    refs: ["OLY-EBUS", "ERNST", "ALI2017", "KURIMOTO2004"],
  },
];
