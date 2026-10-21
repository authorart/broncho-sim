/**
 * Indications, contraindications and pre-procedure risk rules for flexible bronchoscopy.
 * Paraphrased from Ernst 2017 (ch. 8, 9, 10), BTS 2013, Abuqayyas 2017 (ERS review) and the ASA classification.
 * These are teaching defaults — local institutional protocols take precedence.
 */

export type IndicationGroup = {
  id: string;
  title: string;
  kind: "diagnostic" | "therapeutic";
  items: { label: string; detail?: string }[];
  refs: string[];
};

export const INDICATIONS: IndicationGroup[] = [
  {
    id: "symptoms",
    title: "Symptoms & signs of airway disease",
    kind: "diagnostic",
    items: [
      { label: "Haemoptysis", detail: "Localise the bleeding source and exclude endobronchial tumour (massive haemoptysis favours rigid bronchoscopy)." },
      { label: "Chronic / unexplained cough", detail: "Especially in smokers or >55 y, or with an abnormal CXR." },
      { label: "Localised / fixed wheeze, refractory 'asthma'", detail: "Consider partial obstruction: tumour, broncholith, foreign body, stenosis." },
      { label: "Abnormal flow–volume loop", detail: "Suggests central airway obstruction." },
      { label: "Stridor", detail: "Indication — but plan as a difficult airway; acute stridor in children is an emergency." },
      { label: "Suspected vocal cord dysfunction", detail: "Paradoxical adduction throughout the respiratory cycle." },
    ],
    refs: ["ERNST", "BTS2013"],
  },
  {
    id: "imaging",
    title: "Imaging abnormalities",
    kind: "diagnostic",
    items: [
      { label: "Mass / nodule suspicious for lung cancer", detail: "Tissue diagnosis via EBBx, TBLB, brushing, TBNA; peripheral lesions with guidance (RP-EBUS, navigation)." },
      { label: "Persistent or recurrent infiltrate in the same region", detail: "May signal an obstructing lesion." },
      { label: "Lobar / segmental atelectasis", detail: "Exclude endobronchial obstruction or extrinsic compression." },
      { label: "Mediastinal / hilar adenopathy", detail: "Conventional TBNA or EBUS-TBNA for diagnosis and staging." },
      { label: "Diffuse parenchymal lung disease", detail: "BAL ± TBLB (e.g., sarcoidosis, lymphangitic carcinoma, PAP)." },
    ],
    refs: ["ERNST", "BTS2013", "RIVERA2013"],
  },
  {
    id: "infection",
    title: "Infection",
    kind: "diagnostic",
    items: [
      { label: "Non-resolving pneumonia", detail: "Sample by BAL / protected brush from the radiologically affected segment." },
      { label: "Pulmonary infiltrates in the immunocompromised host", detail: "BAL is the workhorse (PJP sensitivity >90%)." },
      { label: "Suspected TB when sputum (incl. induced) is non-diagnostic", detail: "Perform in a negative-pressure room with respirators." },
      { label: "Ventilator-associated pneumonia", detail: "Quantitative BAL (≥10⁴ cfu/mL) or PSB (≥10³ cfu/mL), ideally before antibiotics / within 48 h." },
    ],
    refs: ["ERNST", "BTS2013"],
  },
  {
    id: "staging",
    title: "Lung cancer staging & other",
    kind: "diagnostic",
    items: [
      { label: "Mediastinal staging of NSCLC", detail: "Endosonography (EBUS ± EUS) is preferred first over surgical staging." },
      { label: "Airway injury: inhalation / burns, chest trauma", detail: "Assess thermal injury, bronchial disruption." },
      { label: "Assess ETT position / airway in ICU", detail: "" },
      { label: "Lung transplant surveillance", detail: "TBLB for acute rejection; anastomosis inspection." },
    ],
    refs: ["ERNST", "CHEST-LC2013", "ESGE-ERS2015"],
  },
  {
    id: "therapeutic",
    title: "Therapeutic indications",
    kind: "therapeutic",
    items: [
      { label: "Foreign body removal", detail: "Rigid bronchoscopy preferred when suspected; flexible for equivocal cases / screening." },
      { label: "Retained secretions / mucus plugging (pulmonary toilet)", detail: "When physiotherapy and suctioning fail (immobile, post-op, spinal injury)." },
      { label: "Difficult intubation", detail: "Fibreoptic-guided ETT placement." },
      { label: "Central airway obstruction", detail: "Debulking, dilation, stenting (often rigid)." },
      { label: "Whole-lung lavage for PAP", detail: "Under GA via double-lumen tube." },
      { label: "Haemoptysis control", detail: "Cold saline, topical vasoconstrictor, balloon tamponade / blocker." },
    ],
    refs: ["ERNST"],
  },
];

export const NOT_HELPFUL = [
  "Isolated pleural effusion without other findings",
  "Chronic cough in a non-smoker <55 y with a normal CXR and no cancer risk factors",
  "Uncomplicated community- or hospital-acquired pneumonia (rarely changes management)",
  "Peripheral nodule beyond reach of the scope without guidance technology",
  "Massive haemoptysis with a flexible scope alone (too small to clear blood — rigid preferred)",
];

export type Contraindication = {
  label: string;
  kind: "absolute" | "relative";
  detail: string;
  refs: string[];
};

export const CONTRAINDICATIONS: Contraindication[] = [
  { label: "Refractory hypoxaemia", kind: "absolute", detail: "Inability to maintain adequate oxygenation during the procedure — especially in a non-intubated patient (consider elective intubation).", refs: ["ERNST", "BTS2013"] },
  { label: "Severe haemodynamic instability", kind: "absolute", detail: "Uncorrected shock or unstable cardiovascular status.", refs: ["ERNST"] },
  { label: "Malignant / unstable arrhythmias", kind: "absolute", detail: "Hypoxaemia and vagal stimulation can precipitate arrest.", refs: ["ERNST"] },
  { label: "Lack of informed consent", kind: "absolute", detail: "Unless emergency / surrogate consent per local law.", refs: ["ERNST"] },
  { label: "Status asthmaticus", kind: "absolute", detail: "Listed as absolute for TBLB.", refs: ["ERNST"] },
  { label: "Inadequate facilities / personnel", kind: "absolute", detail: "Must be able to manage arrest, pneumothorax and bleeding.", refs: ["ERNST"] },
  { label: "Uncorrected coagulopathy / thrombocytopenia", kind: "relative", detail: "Postpone biopsy if it cannot be corrected; inspection/BAL usually acceptable.", refs: ["ERNST", "BTS2013"] },
  { label: "Recent myocardial infarction / unstable angina", kind: "relative", detail: "BTS suggests delaying elective bronchoscopy ≥4 weeks (≥6 weeks traditionally) after MI.", refs: ["ERNST", "BTS2013"] },
  { label: "Severe pulmonary hypertension", kind: "relative", detail: "Higher bleeding risk with TBLB; assess individually.", refs: ["ERNST", "BTS2013"] },
  { label: "Uraemia", kind: "relative", detail: "Platelet dysfunction; consider desmopressin before TBLB.", refs: ["ERNST"] },
  { label: "Partial tracheal obstruction", kind: "relative", detail: "Risk of complete obstruction with sedation/scope — plan rigid backup.", refs: ["ERNST"] },
  { label: "Hypercapnia / moderate–severe hypoxaemia", kind: "relative", detail: "Sedation may precipitate respiratory failure.", refs: ["ERNST"] },
  { label: "Severe COPD / poorly controlled asthma", kind: "relative", detail: "Pre-treat with bronchodilator; risk of bronchospasm.", refs: ["BTS2013"] },
  { label: "Morbid obesity, severe OSA", kind: "relative", detail: "Airway / sedation risk depending on facilities.", refs: ["ERNST"] },
  { label: "Lack of patient cooperation", kind: "relative", detail: "May need deep sedation or GA.", refs: ["ERNST"] },
];

export type AntithromboticRule = {
  drug: string;
  klass: string;
  lowRisk: string;
  biopsy: string;
  restart: string;
  refs: string[];
};

/** Holding windows before bleeding-risk procedures (EBBx, TBLB, TBNA, brushing). */
export const ANTITHROMBOTICS: AntithromboticRule[] = [
  { drug: "Aspirin (low dose)", klass: "Antiplatelet", lowRisk: "Continue", biopsy: "Continue — no excess TBLB bleeding shown", restart: "—", refs: ["HERTH2002", "BTS2013"] },
  { drug: "Clopidogrel / prasugrel / ticagrelor", klass: "P2Y12 inhibitor", lowRisk: "Continue for inspection/BAL", biopsy: "Stop 5–7 days before (clopidogrel markedly increases TBLB bleeding). Never stop without cardiology input if recent stent.", restart: "Next day if haemostasis", refs: ["ERNST2006", "BTS2013", "ERNST"] },
  { drug: "Warfarin", klass: "VKA", lowRisk: "Continue; check INR", biopsy: "Stop ~5 days before; INR ≤1.5 on the day (bridge if high thrombotic risk)", restart: "Evening of procedure / next day", refs: ["BTS2013", "ERNST"] },
  { drug: "Unfractionated heparin (IV)", klass: "Heparin", lowRisk: "—", biopsy: "Stop ~6 h before", restart: "12 h after (inpatients)", refs: ["ERNST"] },
  { drug: "Enoxaparin — therapeutic", klass: "LMWH", lowRisk: "—", biopsy: "Last dose ≥24 h before", restart: "12–24 h after", refs: ["ERNST"] },
  { drug: "Enoxaparin — prophylactic", klass: "LMWH", lowRisk: "—", biopsy: "Omit the morning dose", restart: "Evening / next day", refs: ["ERNST"] },
  { drug: "DOACs (apixaban, rivaroxaban, edoxaban, dabigatran)", klass: "DOAC", lowRisk: "Consider continuing for inspection only", biopsy: "Hold 24–48 h (longer — up to 5 days — with renal/hepatic impairment or high bleeding risk; dabigatran depends on CrCl)", restart: "24–48 h after if haemostasis", refs: ["ERNST", "ABUQAYYAS2017"] },
];

export const ASA_CLASSES = [
  { cls: "I", label: "Normal healthy patient" },
  { cls: "II", label: "Mild systemic disease" },
  { cls: "III", label: "Severe systemic disease" },
  { cls: "IV", label: "Severe systemic disease that is a constant threat to life" },
  { cls: "V", label: "Moribund — not expected to survive without the operation" },
];

export type PlannedProcedure = "inspection" | "bal" | "brush" | "ebbx" | "tblb" | "tbna";

export const PLANNED_LABEL: Record<PlannedProcedure, string> = {
  inspection: "Airway inspection / washing only",
  bal: "BAL",
  brush: "Brushing",
  ebbx: "Endobronchial biopsy",
  tblb: "Transbronchial lung biopsy",
  tbna: "TBNA / EBUS-TBNA",
};

export type RiskInput = {
  procedure: PlannedProcedure;
  platelets: number | null; // x10^9/L
  inr: number | null;
  anticoag: "none" | "aspirin" | "p2y12" | "warfarin" | "doac" | "lmwh-therapeutic" | "heparin";
  daysHeld: number | null;
  asa: number; // 1..5
  spo2: number | null; // on current O2
  o2Lpm: number | null;
  recentMIWeeks: number | null;
  pulmHtn: boolean;
  creatinine: number | null; // mg/dL
  fasting: boolean;
  consent: boolean;
};

export type RiskFlag = { level: "stop" | "caution" | "ok"; text: string; ref?: string };

const BIOPSY = new Set<PlannedProcedure>(["brush", "ebbx", "tblb", "tbna"]);

/** Rule engine for the pre-procedure checklist. Thresholds paraphrased from cited sources. */
export function assessRisk(i: RiskInput): RiskFlag[] {
  const f: RiskFlag[] = [];
  const biopsy = BIOPSY.has(i.procedure);

  if (!i.consent) f.push({ level: "stop", text: "Informed consent not documented — obtain before any sedation.", ref: "ERNST" });
  if (!i.fasting) f.push({ level: "caution", text: "Not fasted: elective sedation is preferred ≥6–8 h after solids and ≥2 h after clear fluids.", ref: "ERNST" });

  if (i.platelets !== null) {
    if (i.procedure === "tblb" && i.platelets < 50) f.push({ level: "stop", text: `Platelets ${i.platelets} ×10⁹/L: below the ~50 threshold commonly used for TBLB — transfuse or defer.`, ref: "ERNST" });
    else if (biopsy && i.platelets < 50) f.push({ level: "stop", text: `Platelets ${i.platelets} ×10⁹/L: EBBx/brushing not recommended with significant thrombocytopenia (<50).`, ref: "ERNST" });
    else if (i.platelets < 20) f.push({ level: "caution", text: `Platelets ${i.platelets} ×10⁹/L: consider transfusion even for BAL/inspection.`, ref: "BTS2013" });
    else f.push({ level: "ok", text: `Platelets ${i.platelets} ×10⁹/L acceptable for the planned procedure.` });
  } else if (biopsy) {
    f.push({ level: "caution", text: "Check platelet count before biopsy procedures.", ref: "BTS2013" });
  }

  if (i.inr !== null) {
    if (biopsy && i.inr > 1.5) f.push({ level: "stop", text: `INR ${i.inr}: >1.5 — correct before biopsy (target ≤1.5).`, ref: "ERNST" });
    else f.push({ level: "ok", text: `INR ${i.inr} acceptable.` });
  } else if (biopsy && (i.anticoag === "warfarin")) {
    f.push({ level: "caution", text: "On warfarin: INR must be checked on the day.", ref: "BTS2013" });
  }

  const held = i.daysHeld ?? 0;
  switch (i.anticoag) {
    case "aspirin":
      f.push({ level: "ok", text: "Aspirin: may continue — no increase in TBLB bleeding demonstrated.", ref: "HERTH2002" });
      break;
    case "p2y12":
      if (biopsy && held < 5) f.push({ level: "stop", text: `P2Y12 inhibitor held ${held} d: hold ≥5–7 days before biopsy (clopidogrel → ~89% significant TBLB bleeding in one study). Discuss with cardiology if recent stent.`, ref: "ERNST2006" });
      else f.push({ level: "ok", text: biopsy ? "P2Y12 inhibitor held long enough." : "P2Y12 inhibitor: acceptable for non-biopsy procedures." });
      break;
    case "warfarin":
      if (biopsy && held < 5) f.push({ level: "caution", text: `Warfarin held ${held} d: usually stopped ~5 days before biopsy; confirm INR ≤1.5 and bridging plan.`, ref: "BTS2013" });
      break;
    case "doac":
      if (biopsy && held < 2) f.push({ level: "stop", text: `DOAC held ${held} d: hold 24–48 h before biopsy (longer with renal/hepatic impairment).`, ref: "ERNST" });
      else f.push({ level: "ok", text: "DOAC holding window adequate (re-check if CrCl reduced)." });
      break;
    case "lmwh-therapeutic":
      if (biopsy && held < 1) f.push({ level: "stop", text: "Therapeutic LMWH: last dose must be ≥24 h before biopsy.", ref: "ERNST" });
      break;
    case "heparin":
      if (biopsy) f.push({ level: "caution", text: "IV heparin: stop ~6 h before; restart ≥12 h after.", ref: "ERNST" });
      break;
  }

  if (i.asa >= 4) f.push({ level: "caution", text: `ASA ${i.asa}: high-risk — consider anaesthesia support / ICU setting; ECG within 6 months for ASA ≥ III.`, ref: "ASA" });
  else if (i.asa === 3) f.push({ level: "caution", text: "ASA III: many centres require a recent ECG and closer monitoring.", ref: "ERNST" });

  if (i.spo2 !== null) {
    if (i.spo2 < 90) f.push({ level: "stop", text: `SpO₂ ${i.spo2}%: hypoxaemic despite supplemental O₂ — consider elective intubation / defer.`, ref: "BTS2013" });
    else f.push({ level: "ok", text: `SpO₂ ${i.spo2}% — keep >90% throughout (BTS).`, ref: "BTS2013" });
  }
  if (i.o2Lpm !== null && i.o2Lpm > 5 && i.procedure === "tblb") f.push({ level: "caution", text: `O₂ ${i.o2Lpm} L/min: consider elective intubation before TBLB when >5 L/min nasal cannula is needed.`, ref: "ERNST" });

  if (i.recentMIWeeks !== null && i.recentMIWeeks < 6) f.push({ level: i.recentMIWeeks < 4 ? "stop" : "caution", text: `MI ${i.recentMIWeeks} weeks ago: defer elective bronchoscopy (≥4–6 weeks).`, ref: "BTS2013" });
  if (i.pulmHtn && (i.procedure === "tblb")) f.push({ level: "caution", text: "Pulmonary hypertension: increased TBLB bleeding risk — weigh benefit, consider alternatives.", ref: "BTS2013" });
  if (i.creatinine !== null && i.creatinine > 3 && biopsy) f.push({ level: "caution", text: `Creatinine ${i.creatinine} mg/dL: uraemic platelet dysfunction — consider desmopressin (DDAVP) before biopsy.`, ref: "ERNST" });

  if (!f.some((x) => x.level !== "ok")) f.push({ level: "ok", text: "No blocking risk factors identified for the planned procedure." });
  return f;
}
