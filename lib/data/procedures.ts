/**
 * Procedural workflows. Paraphrased from Ernst 2017 (ch. 9 BW/BAL/brush/EBBx, ch. 10 TBLB,
 * ch. 11 TBNA, ch. 13 EBUS), BTS 2013, ATS 2012 (BAL) and CHEST 2016 (EBUS-TBNA).
 */

export type Step = { title: string; detail: string; critical?: boolean };
export type Complication = { name: string; incidence?: string; prevention: string; management: string };

export type Procedure = {
  id: "bw" | "bal" | "brush" | "ebbx" | "tblb" | "tbna";
  abbr: string;
  name: string;
  summary: string;
  indications: string[];
  keyNumbers: { label: string; value: string }[];
  steps: Step[];
  tips: string[];
  complications: Complication[];
  specimens: string[];
  refs: string[];
};

export const PROCEDURES: Procedure[] = [
  {
    id: "bw",
    abbr: "BW",
    name: "Bronchial washing",
    summary:
      "Small-volume saline instilled into a bronchus and aspirated without wedging. Usually combined with brushing and biopsy for visible tumours; less standardised and more contaminated by upper-airway flora than BAL.",
    indications: ["Adjunct cytology for visible endobronchial lesions", "Microbiology when BAL is not feasible", "Sampling of secretions from a specific segment"],
    keyNumbers: [
      { label: "Instilled volume", value: "5–50 mL (typically 5–20 mL aliquots)" },
      { label: "Microbiology", value: "≈5–15 mL return" },
      { label: "Cytology", value: "≈10 mL return" },
      { label: "Wedge?", value: "No" },
    ],
    steps: [
      { title: "Target selection", detail: "Choose the segment from CT / visible lesion; complete the full airway survey first so you don't contaminate other areas." },
      { title: "Position (no wedge)", detail: "Hold the tip in the segmental orifice proximal to the target without occluding the lumen." },
      { title: "Instil sterile saline", detail: "Flush 5–20 mL through the working channel (repeat as needed up to ~50 mL)." },
      { title: "Gentle wall suction recovery", detail: "Aspirate into a sterile trap (Lukens) with gentle suction; avoid traumatising mucosa.", critical: true },
      { title: "Label & route", detail: "Split for cytology vs microbiology; list the differential on request forms." },
    ],
    tips: [
      "Yield is similar whether washings are taken before or after biopsy/brushing in visible tumours.",
      "Inflammatory atypia (squamous metaplasia) can mimic malignancy — interpret cytology in context.",
      "For quantitative bacterial culture prefer BAL (washings are diluted and contaminated).",
    ],
    complications: [
      { name: "Transient hypoxaemia", prevention: "Supplemental O₂; limit volume", management: "Suction, increase FiO₂" },
      { name: "Cough / bronchospasm", prevention: "Adequate topical lidocaine", management: "Pause, bronchodilator" },
    ],
    specimens: ["Cytology (fixative per lab)", "Bacterial / AFB / fungal culture", "PCR panels as indicated"],
    refs: ["ERNST", "BTS2013"],
  },
  {
    id: "bal",
    abbr: "BAL",
    name: "Bronchoalveolar lavage",
    summary:
      "Saline instilled and recovered with the scope wedged in a 3rd–4th order bronchus to sample the alveolar compartment (~1 million alveoli). Standard for infection in the immunocompromised and for ILD cellular analysis.",
    indications: [
      "Infiltrates in the immunocompromised host (PJP sensitivity >90%)",
      "Non-resolving pneumonia / VAP (quantitative culture ≥10⁴ cfu/mL)",
      "ILD: cell differential (lymphocytosis, eosinophilia, CD4/CD8)",
      "Alveolar haemorrhage (increasingly bloody sequential aliquots)",
      "PAP (milky effluent, PAS+), Langerhans cell histiocytosis (CD1a >5%)",
    ],
    keyNumbers: [
      { label: "Total instilled", value: "100–300 mL (commonly 100–150 mL)" },
      { label: "Aliquots", value: "3–5 × 20–60 mL" },
      { label: "Normal recovery", value: "40–70% of instilled" },
      { label: "Lab needs", value: "≈40–60 mL return for most tests" },
      { label: "Normal differential", value: "Macrophages ~90%, lymphocytes ~5–10%, PMN ≤3%, eos ≤1%" },
    ],
    steps: [
      { title: "Choose the site", detail: "Diffuse disease: RML or lingula (best recovery in the supine patient). Focal disease: the most abnormal segment on CT." },
      { title: "Minimise upper airway suction & lidocaine", detail: "Both contaminate the sample and reduce cellular yield." },
      { title: "Wedge the scope", detail: "Advance into a 3rd–4th order bronchus until the lumen is occluded; confirm with gentle suction — the distal airway should slightly collapse.", critical: true },
      { title: "Avoid over-wedging", detail: "Forcing the tip traumatises mucosa, adds blood and reduces recovery.", critical: true },
      { title: "Instil aliquots", detail: "Isotonic saline (room/body temp) in 20–60 mL aliquots through the channel." },
      { title: "Recover each aliquot", detail: "Gentle suction (<100 mmHg) or syringe aspiration after each aliquot; stop if airways collapse — reduce suction." },
      { title: "Optional: separate first aliquot", detail: "Some discard/split the first 'bronchial' fraction to enrich the alveolar sample." },
      { title: "Handle specimens", detail: "Silicone/plastic containers; process within 1–4 h or refrigerate; record instilled vs returned volume." },
    ],
    tips: [
      "Maintain the wedge throughout — losing it leaks fluid proximally and drops recovery.",
      "Low recovery (<30%) is common in emphysema and with lower-lobe sites.",
      "Unsatisfactory sample: no alveolar macrophages, >5% bronchial epithelial cells, or purulent central-airway material.",
      "Perform BAL BEFORE biopsies/brushings to avoid blood contamination of the cell count.",
    ],
    complications: [
      { name: "Fever (self-limited)", incidence: "Most common", prevention: "Limit volume", management: "Antipyretic; reassess if persistent" },
      { name: "Transient hypoxaemia", prevention: "Pre-oxygenate; ICU patients may need more support", management: "Increase FiO₂ / PEEP" },
      { name: "Bleeding", incidence: "Minimal", prevention: "Avoid over-wedging", management: "Maintain wedge, cold saline" },
    ],
    specimens: ["Cell count & differential", "CD4/CD8 (lymphocyte subsets)", "Bacterial (quantitative), AFB, fungal culture", "PJP DFA / silver stain", "Galactomannan", "Cytology / flow cytometry"],
    refs: ["ERNST", "ATS-BAL2012", "BTS2013"],
  },
  {
    id: "brush",
    abbr: "BB",
    name: "Endobronchial brush / bronchial cytology",
    summary:
      "A sheathed cytology brush is advanced to the lesion and rubbed vigorously under direct vision, then retracted into its sheath before withdrawal. Yield 50–90% for visible tumours; protected specimen brush (PSB) for VAP.",
    indications: ["Visible endobronchial tumour (with EBBx & washings)", "Peripheral lesions under fluoroscopy / RP-EBUS guide sheath", "Microbiology via PSB (≥10³ cfu/mL for VAP)"],
    keyNumbers: [
      { label: "Brush bristles", value: "3 mm or 7 mm" },
      { label: "Advance beyond tip", value: "≈3 cm" },
      { label: "Yield (visible tumour)", value: "50–90%" },
    ],
    steps: [
      { title: "Insert brush retracted in sheath", detail: "Pass the sheathed brush through the working channel.", critical: true },
      { title: "Advance sheath out of the scope", detail: "Bring the sheath tip into view ~1–3 cm beyond the scope." },
      { title: "Extend the brush", detail: "Assistant extends the brush onto the lesion under direct vision." },
      { title: "Brush the lesion", detail: "Several vigorous to-and-fro strokes with rotation across the lesion surface." },
      { title: "Retract brush into sheath", detail: "Communicate clearly: 'brush in' before moving anything else.", critical: true },
      { title: "Withdraw sheath + brush together", detail: "Remove as one unit through the channel, then smear / agitate in fixative or cut tip into media." },
    ],
    tips: [
      "Distal/transbronchial brushing should be done under fluoroscopy to avoid breaching the pleura.",
      "Combining washing + brushing + EBBx is cost-effective for visible lesions.",
      "PSB: advance device, eject distal plug, brush, retract inner then outer sheath; wipe with 70% alcohol and cut brush into ≥1 mL non-bacteriostatic saline.",
    ],
    complications: [
      { name: "Bleeding", prevention: "Avoid in irreversible coagulopathy", management: "Cold saline, topical epinephrine, wedge" },
      { name: "Pneumothorax (peripheral brushing)", prevention: "Fluoroscopy, stay away from pleura", management: "Observe / aspirate / drain" },
      { name: "Channel damage", prevention: "Never pass or withdraw an unsheathed brush", management: "Report to biomedical engineering" },
    ],
    specimens: ["Direct smears (alcohol-fixed / air-dried)", "Brush agitated in CytoLyt / saline", "Brush tip in culture media"],
    refs: ["ERNST"],
  },
  {
    id: "ebbx",
    abbr: "EBBx",
    name: "Endobronchial biopsy",
    summary:
      "Forceps biopsy of visible mucosal or tumour lesions. Diagnostic yield >80% for visible malignancy; adds ~20% yield to TBLB in sarcoidosis.",
    indications: ["Visible endobronchial tumour", "Mucosal abnormality (sarcoid, TB, amyloid)", "Sarcoidosis (random EBBx from secondary carinae)"],
    keyNumbers: [
      { label: "Number of biopsies", value: "3–6 from the same site" },
      { label: "Yield (visible tumour)", value: ">80%" },
      { label: "Topical epinephrine", value: "1:10,000–1:20,000, small aliquots" },
      { label: "Cold saline", value: "≈20 mL aliquots" },
    ],
    steps: [
      { title: "Inspect both lungs first", detail: "Complete airway survey before sampling to avoid seeding and missing synchronous lesions." },
      { title: "Choose forceps", detail: "Cup or alligator; forceps with a central spike/needle anchors on tangential lesions." },
      { title: "Orient perpendicular", detail: "At a bifurcation use a straight-on approach; for lesions parallel to the wall, angle the scope so the forceps meet the lesion as perpendicularly as possible.", critical: true },
      { title: "Move scope + forceps as one", detail: "Keep the scope close to the forceps for leverage; open, push into the lesion, close firmly." },
      { title: "Avoid cartilage & necrosis", detail: "Biting cartilage rings yields poor tissue; surface necrosis is non-diagnostic — take deeper bites from the same spot.", critical: true },
      { title: "Repeat 3–6 bites", detail: "Consider a 19/21 G needle into the core of the lesion to add yield." },
      { title: "Haemostasis", detail: "Observe; cold saline → topical epinephrine → wedge/balloon tamponade → blocker if needed." },
    ],
    tips: [
      "Avoid in uncorrectable coagulopathy, platelets <50 ×10⁹/L or patients on clopidogrel.",
      "Vascular-looking lesions (carcinoid, Dieulafoy) — consider risk before biting.",
      "Communicate 'open' / 'close' commands clearly with the assistant.",
    ],
    complications: [
      { name: "Bleeding", incidence: "Usually mild, occasionally life-threatening", prevention: "Pre-check coagulation; avoid vascular lesions", management: "Cold saline 20 mL, epinephrine 1:10,000–1:20,000, wedge/balloon, lateral decubitus bleeding side down" },
      { name: "Pneumothorax", incidence: "Rare (central)", prevention: "—", management: "Standard" },
    ],
    specimens: ["Formalin for histology", "Fresh for microbiology (AFB/fungal) when indicated"],
    refs: ["ERNST", "BTS2013"],
  },
  {
    id: "tblb",
    abbr: "TBLB",
    name: "Transbronchial lung biopsy",
    summary:
      "Forceps passed beyond the visible airways to sample peripheral lung parenchyma. Main risks are pneumothorax (1–6%) and significant bleeding (2–9%).",
    indications: ["Sarcoidosis (yield 50–85% even stage I)", "Lymphangitic carcinoma, PAP, LCH, eosinophilic pneumonia, drug pneumonitis", "Peripheral nodules (≈57% overall; higher >2 cm or bronchus sign)", "Lung transplant rejection surveillance"],
    keyNumbers: [
      { label: "Samples", value: "Diffuse 4–6 · focal 7–8 (BTS)" },
      { label: "Distance from pleura", value: "≈1–2 cm" },
      { label: "Pneumothorax", value: "1–6%" },
      { label: "Significant bleeding (>50 mL)", value: "2–9%" },
      { label: "Platelets", value: "≥50 ×10⁹/L" },
    ],
    steps: [
      { title: "Plan on CT", detail: "Select the segment with the most abnormality (or the lesion's bronchus)." },
      { title: "Wedge-ready position", detail: "Intubate the subsegment of interest with the scope tip." },
      { title: "Advance closed forceps", detail: "Under fluoroscopy, advance until resistance or the patient reports pleuritic pain (= pleura).", critical: true },
      { title: "Withdraw ~1–2 cm", detail: "Pull back from the pleura before opening.", critical: true },
      { title: "Open on inspiration", detail: "Open the jaws and advance half the distance back toward the resistance point." },
      { title: "Close at end-expiration", detail: "Close the forceps when the lung volume is smallest; watch for parenchymal tug on fluoroscopy." },
      { title: "Retract firmly", detail: "If excessive tug/pain, open and release, then reposition." },
      { title: "Observe for bleeding", detail: "Novices: keep the scope wedged after each bite; then fluoroscopic PTX screen at the end." },
    ],
    tips: [
      "Use medium alligator forceps — they leave the channel partly open for suction.",
      "Fluoroscopy increases yield in focal disease; it has not been proven to reduce pneumothorax.",
      "RP-EBUS ± navigation raises peripheral nodule yield (~70%, up to ~88% combined).",
      "Post-procedure CXR only if symptomatic (or per local policy).",
    ],
    complications: [
      { name: "Pneumothorax", incidence: "1–6%", prevention: "Fluoroscopy, stay 1–2 cm from pleura, avoid biopsying on pain", management: "Observe if small/stable; aspiration or chest drain if large/symptomatic" },
      { name: "Haemorrhage", incidence: "2–9% significant", prevention: "Stop clopidogrel, correct INR/platelets, caution in PH/uraemia", management: "Keep wedged + suction, 20 mL iced saline, 1:20,000 epinephrine, bleeding-side down, bronchial blocker" },
    ],
    specimens: ["Formalin (≥4–6 pieces, 1–2 mm)", "Fresh tissue for culture if infection suspected"],
    refs: ["ERNST", "BTS2013", "ERNST2006", "HERTH2002"],
  },
  {
    id: "tbna",
    abbr: "TBNA",
    name: "Transbronchial needle aspiration (conventional & EBUS-TBNA)",
    summary:
      "Needle sampling of mediastinal/hilar nodes and lesions through the airway wall — blind (conventional, CT-guided landmarks) or under real-time convex-probe EBUS. EBUS-TBNA sensitivity ≈93% with near-100% specificity; complication rate ≈0.15–0.26%.",
    indications: ["Diagnosis & staging of NSCLC (sample N3 → N2 → N1)", "Sarcoidosis (granuloma yield ~80% vs 53% TBLB)", "TB lymphadenitis, lymphoma (initial test)", "Submucosal / peribronchial disease"],
    keyNumbers: [
      { label: "Needle passes", value: "≥3 per station without ROSE" },
      { label: "Agitations per pass", value: "≈8–20 (to-and-fro)" },
      { label: "Suction", value: "With or without — equivalent" },
      { label: "Needle", value: "21 G ≈ 22 G; 19 G for histology" },
      { label: "EBUS-TBNA sensitivity", value: "≈93% (pooled)" },
    ],
    steps: [
      { title: "Plan stations on CT/PET", detail: "Use IASLC nomenclature; plan the order N3 → N2 → N1 to avoid upstaging by contamination.", critical: true },
      { title: "Perform TBNA FIRST", detail: "Before BAL/brush/biopsy of the primary — channel contamination can produce false-positive nodal cytology.", critical: true },
      { title: "Survey with ultrasound + Doppler", detail: "Identify node, measure short axis, note echo features; Doppler to identify vessels in the needle path." },
      { title: "Load the needle with tip straight", detail: "Lock the device; adjust the sheath so it is just visible on the white-light image.", critical: true },
      { title: "Golden rule", detail: "NEVER advance or withdraw the catheter through the scope with the needle out.", critical: true },
      { title: "Puncture", detail: "Flex up to bring the needle perpendicular to the wall. Techniques: jabbing, piggyback, hub-against-wall, cough." },
      { title: "Remove stylet, (optionally) apply suction", detail: "Aspirate: blood → reposition; none → agitate 8–20 times within the node." },
      { title: "Release suction, retract needle, withdraw device", detail: "Neutral tip, needle back into the sheath, remove in one smooth motion." },
      { title: "Prepare samples / ROSE", detail: "Smears (air-dried + fixed), cell block in formalin/CytoLyt; extra passes for molecular testing (EGFR, ALK, PD-L1…)." },
    ],
    tips: [
      "4R and 7 have the highest conventional-TBNA yield — start there as a novice.",
      "Use 'non-diagnostic' rather than 'negative' — if suspicion persists, proceed to mediastinoscopy.",
      "ROSE reduces inadequate samples and passes but is not essential for yield (CHEST 2016); beware premature termination on a false-positive ROSE.",
      "Sonographic malignancy features: >1 cm short axis, round, distinct margin, heterogeneous echo, absent central hilar structure, coagulation necrosis sign.",
    ],
    complications: [
      { name: "Bleeding (vascular puncture)", incidence: "Rare", prevention: "Doppler before puncture; stopper set short of vessels", management: "Withdraw, observe, suction" },
      { name: "Mediastinitis / abscess", incidence: "Very rare (cystic lesions)", prevention: "Avoid puncturing cysts; antibiotics if EUS route", management: "Antibiotics ± drainage" },
      { name: "Scope damage", prevention: "Needle locked & sheathed; tip straight when loading", management: "Report / repair" },
      { name: "Pneumothorax / pneumomediastinum", incidence: "Rare", prevention: "—", management: "Standard" },
    ],
    specimens: ["Air-dried + alcohol-fixed smears (Diff-Quik / Pap)", "Cell block (formalin / CytoLyt)", "Core in formalin (19 G)", "Culture (AFB) when granulomatous disease suspected", "Flow cytometry for lymphoma"],
    refs: ["ERNST", "CHEST-EBUS2016", "CHEST-LC2013", "FUJIWARA2010", "IASLC2009"],
  },
];

export const PROC_BY_ID = Object.fromEntries(PROCEDURES.map((p) => [p.id, p])) as Record<Procedure["id"], Procedure>;

export const TBNA_TECHNIQUES = [
  { id: "jab", name: "Jabbing", detail: "Scope held fixed at the nose/mouth; the needle is thrust firmly and quickly through the intercartilaginous space. Default first-line method." },
  { id: "piggy", name: "Piggyback", detail: "Needle fixed at the biopsy port; the scope and catheter are advanced together as a unit — the scope lends rigidity to the needle." },
  { id: "hub", name: "Hub-against-wall", detail: "Catheter hub placed against the wall with the needle retracted, then the needle is deployed directly into the target." },
  { id: "cough", name: "Cough", detail: "Needle positioned against the wall; the patient coughs, pushing the airway wall onto the needle." },
];
