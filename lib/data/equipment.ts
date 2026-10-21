/** Equipment callouts. Paraphrased from Ernst 2017 ch. 6, 10, 13; CHEST 2016 EBUS guideline; RP-EBUS literature. */

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
  specs: { label: string; value: string }[];
  parts: Part[];
  refs: string[];
};

export const DEVICES: Device[] = [
  {
    id: "flexible",
    name: "Flexible video bronchoscope",
    tagline: "Control section · insertion tube · universal cord — held in the LEFT hand.",
    specs: [
      { label: "Outer diameter (adult)", value: "≈4–6 mm" },
      { label: "Working channel", value: "2.0–3.0 mm" },
      { label: "Tip angulation", value: "≈180° up / 130° down" },
      { label: "Field of view", value: "≈120°" },
      { label: "Depth of field", value: "3–100 mm" },
      { label: "Accessory exit on screen", value: "≈3 o'clock" },
    ],
    parts: [
      {
        id: "lever",
        label: "Thumb (angulation) lever",
        summary: "Moved by the left thumb; pulls/pushes two wires to bend the distal bending section in one plane.",
        details: [
          "Lever DOWN → tip UP (anterior relative to the scope); lever UP → tip DOWN.",
          "Bending is uni-planar: reach left/right targets by rotating the whole scope (wrist + shaft), not by twisting the control body alone.",
          "Cables stretch with use — angulation loss means the scope needs service.",
        ],
        pitfall: "Never force angulation with an accessory deployed through the channel — it can perforate the channel.",
      },
      {
        id: "suction",
        label: "Suction valve",
        summary: "Pressed with the index finger to apply wall vacuum through the working channel.",
        details: [
          "Valves snap onto a seat and are usually single-use (hard to clean).",
          "Minimise suction in the upper airway before BAL — it contaminates and reduces cellular yield.",
          "Use gentle, intermittent suction for BAL recovery to avoid airway collapse.",
        ],
      },
      {
        id: "port",
        label: "Biopsy port / working channel inlet",
        summary: "Self-sealing valve through which forceps, brushes, needles, saline and probes are passed.",
        details: [
          "The valve opens just enough for the device, so suction still works with a tool in the channel.",
          "Pass accessories CLOSED / sheathed until seen at the distal tip.",
          "If an accessory sticks, straighten the tip and withdraw the whole scope before freeing it.",
        ],
        pitfall: "Opened forceps/needles in the channel are the commonest (preventable) cause of channel damage.",
      },
      {
        id: "buttons",
        label: "Remote switches",
        summary: "Programmable buttons: image capture, freeze, magnification, narrow-band / special light modes.",
        details: ["Perform white balance before every procedure (processor learns what 'white' is)."],
      },
      {
        id: "cord",
        label: "Universal (umbilical) cord",
        summary: "Carries light fibres and electronic signal between the control body, light source and video processor.",
        details: ["Exits on the left of the control body; the processor should sit on the patient's left so cables do not drape over the patient."],
      },
      {
        id: "insertion",
        label: "Insertion tube",
        summary: "Flexible shaft containing the working channel, two light-guide bundles, angulation wires and the image cable within a metal braid and waterproof sheath.",
        details: [
          "Hold close to the nose/mouth with the right hand; keep the shaft straight to transmit rotation.",
          "Use a bite block on every oral intubation — bite damage is a leading costly, preventable repair.",
          "Use water-based lubricant (oil-based degrades the sheath).",
        ],
      },
      {
        id: "bending",
        label: "Bending section",
        summary: "Hinged distal segment that flexes in response to the thumb lever.",
        details: ["Assistant should warn if the scope is bent too acutely outside the patient."],
      },
      {
        id: "tip",
        label: "Distal tip",
        summary: "Objective lens (CCD/CMOS), two light-guide lenses and the working-channel outlet.",
        details: [
          "Two light guides give even illumination; a damaged bundle causes a bright/dark crescent.",
          "Tools emerge at ~3 o'clock on the monitor.",
          "Lens ~1 mm wide yet wide-angle (~120°) — expect barrel distortion near the periphery.",
        ],
      },
    ],
    refs: ["ERNST"],
  },
  {
    id: "cpebus",
    name: "Convex-probe EBUS (CP-EBUS) bronchoscope",
    tagline: "Curvilinear transducer at the tip for real-time needle aspiration of nodes adjacent to the trachea and main bronchi.",
    specs: [
      { label: "Transducer", value: "Curvilinear array 7.5–12 MHz" },
      { label: "Scope OD", value: "≈6.3–6.9 mm" },
      { label: "Working channel", value: "≈2.0–2.2 mm" },
      { label: "Optics", value: "Forward-oblique ≈20–35°" },
      { label: "Needle exit angle", value: "≈20–45° (model-dependent)" },
      { label: "Needles", value: "19 / 21 / 22 / 25 G" },
    ],
    parts: [
      {
        id: "transducer",
        label: "Convex transducer",
        summary: "Linear array scanning parallel to the scope axis; image displayed as a fan with the transducer at the top.",
        details: [
          "Press the tip against the mucosa (or use the balloon) for acoustic coupling.",
          "Colour/power Doppler distinguishes vessels from nodes before every puncture.",
        ],
      },
      {
        id: "balloon",
        label: "Balloon (water-inflatable)",
        summary: "Saline-filled balloon over the transducer improves contact where mucosa is irregular or cartilage overlies the node.",
        details: ["Especially helpful in the trachea under light sedation to reduce coughing."],
      },
      {
        id: "optics",
        label: "Forward-oblique optics",
        summary: "The white-light view looks ~20–35° off-axis, so passing the cords and navigating feels different from a standard scope.",
        details: ["Angle the tip down slightly to see straight ahead; the scope is stiffer and wider so distal access is limited."],
      },
      {
        id: "channel",
        label: "Working channel & needle exit",
        summary: "Needle exits obliquely and appears in the ultrasound plane from the upper-left of the image.",
        details: ["Insert the needle with the tip STRAIGHT to avoid damaging the channel; flexion is harder with the needle loaded."],
      },
      {
        id: "sheath",
        label: "Sheath adjuster",
        summary: "Sets how far the plastic sheath protrudes; adjust so the sheath is just visible in the endoscopic image.",
        details: ["Too short → needle exits inside the channel (damage). Too long → sheath obscures view / reduces needle reach."],
      },
      {
        id: "stopper",
        label: "Needle stopper (depth lock)",
        summary: "Limits the maximum needle excursion (typically up to ~40 mm) based on the measured node depth.",
        details: ["Measure distance to the far wall of the node and set the stopper short of vessels behind it."],
      },
      {
        id: "stylet",
        label: "Stylet",
        summary: "Prevents a bronchial-mucosa plug in the needle lumen; withdrawn after the needle enters the node.",
        details: ["Re-insert or 'clean' the stylet to expel the sample onto slides."],
      },
      {
        id: "vacutainer",
        label: "Vacutainer / suction syringe lock",
        summary: "Luer-lock syringe (≈20 mL) attached after stylet removal to apply suction during agitation.",
        details: [
          "Suction is optional — capillary 'slow-pull' sampling gives comparable yield (CHEST 2016).",
          "Release suction BEFORE withdrawing the needle into the sheath.",
        ],
      },
    ],
    refs: ["ERNST", "CHEST-EBUS2016"],
  },
  {
    id: "rpebus",
    name: "Radial-probe EBUS (RP-EBUS) with guide sheath",
    tagline: "A miniature 360° mechanical probe passed through the working channel to confirm peripheral lesions before sampling.",
    specs: [
      { label: "Frequency", value: "≈20 MHz" },
      { label: "Probe OD", value: "≈1.4 mm (1.7 mm with balloon variants)" },
      { label: "Penetration", value: "≈4–5 cm radius" },
      { label: "Image", value: "360° circular, probe at centre" },
      { label: "Guide sheath", value: "≈1.9–2.6 mm, locks position for tools" },
      { label: "Pooled yield", value: "≈70% (higher if probe within lesion)" },
    ],
    parts: [
      {
        id: "probe",
        label: "Rotating mini-probe",
        summary: "Mechanical transducer spinning inside a catheter to produce a 360° image perpendicular to the probe.",
        details: [
          "Aerated lung = bright 'snowstorm' with reverberation; solid lesion = homogeneous, darker area with a sharp border.",
          "No real-time needle visualisation — confirm, then sample through the sheath.",
        ],
      },
      {
        id: "gs",
        label: "Guide sheath (GS)",
        summary: "Thin catheter over the probe; when the lesion is found, the probe is removed and the sheath stays as an extended working channel.",
        details: ["Forceps, brush and needle are passed through the GS to the exact same position; fluoroscopy confirms nothing moved."],
      },
      {
        id: "patterns",
        label: "Probe–lesion relationship",
        summary: "Within (concentric) → probe surrounded by lesion; eccentric → probe inside but off-centre; adjacent → probe touches lesion edge only.",
        details: [
          "Within-lesion position roughly doubles yield versus adjacent (≈83% vs ≈61% in one series; concentric ≈84% vs eccentric ≈48% in another).",
          "Adjacent/eccentric: re-angle into a different subsegment, add TBNA or cryobiopsy, or use navigation.",
        ],
      },
      {
        id: "fluoro",
        label: "Fluoroscopy correlation",
        summary: "Confirms the probe/GS tip overlies the lesion and checks distance to the pleura before forceps biopsy.",
        details: ["Keep tools ~1–2 cm from the pleura; screen for pneumothorax at the end."],
      },
    ],
    refs: ["ERNST", "ALI2017", "KURIMOTO2004"],
  },
];

export const NEEDLES = [
  { gauge: "19 G", use: "Histology core; benign disease, lymphoma, sarcoid — higher yield than 22 G in conventional TBNA (Schenk).", stiffness: 3 },
  { gauge: "21 G", use: "Standard EBUS-TBNA; equivalent diagnostic yield to 22 G for malignancy.", stiffness: 2 },
  { gauge: "22 G", use: "Standard EBUS-TBNA / cytology; flexible, good in angulated positions.", stiffness: 2 },
  { gauge: "25 G", use: "Very flexible; small or difficult-angle nodes, less blood contamination; lower tissue volume.", stiffness: 1 },
];
