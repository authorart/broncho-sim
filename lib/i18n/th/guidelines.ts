/** Thai overlays for the guidelines hub. Arrays are positional (same order as the English data). */

export const TH_INDICATIONS: Record<string, { title: string; items: { label: string; detail?: string }[] }> = {
  symptoms: {
    title: "อาการและอาการแสดงของโรคทางเดินหายใจ",
    items: [
      { label: "Haemoptysis (ไอเป็นเลือด)", detail: "หาตำแหน่งเลือดออกและแยก endobronchial tumour (massive haemoptysis ควรใช้ rigid bronchoscopy)" },
      { label: "ไอเรื้อรัง / ไอไม่ทราบสาเหตุ", detail: "โดยเฉพาะผู้สูบบุหรี่ อายุ >55 ปี หรือ CXR ผิดปกติ" },
      { label: "Wheeze เฉพาะที่ / 'asthma' ที่ไม่ตอบสนองต่อการรักษา", detail: "นึกถึงการอุดกั้นบางส่วน: tumour, broncholith, สิ่งแปลกปลอม, stenosis" },
      { label: "Flow–volume loop ผิดปกติ", detail: "บ่งชี้ central airway obstruction" },
      { label: "Stridor", detail: "เป็นข้อบ่งชี้ — แต่ต้องวางแผนแบบ difficult airway; acute stridor ในเด็กเป็นภาวะฉุกเฉิน" },
      { label: "สงสัย vocal cord dysfunction", detail: "Cords หุบผิดปกติตลอดวงจรการหายใจ" },
    ],
  },
  imaging: {
    title: "ภาพถ่ายรังสีผิดปกติ",
    items: [
      { label: "Mass / nodule สงสัยมะเร็งปอด", detail: "วินิจฉัยด้วย EBBx, TBLB, brushing, TBNA; รอยโรคส่วนปลายใช้ guidance (RP-EBUS, navigation)" },
      { label: "Infiltrate ที่คงอยู่หรือเป็นซ้ำตำแหน่งเดิม", detail: "อาจมีรอยโรคอุดกั้น" },
      { label: "Lobar / segmental atelectasis", detail: "แยก endobronchial obstruction หรือ extrinsic compression" },
      { label: "Mediastinal / hilar adenopathy", detail: "Conventional TBNA หรือ EBUS-TBNA เพื่อวินิจฉัยและ staging" },
      { label: "Diffuse parenchymal lung disease", detail: "BAL ± TBLB (เช่น sarcoidosis, lymphangitic carcinoma, PAP)" },
    ],
  },
  infection: {
    title: "การติดเชื้อ",
    items: [
      { label: "Pneumonia ที่ไม่หาย", detail: "เก็บตัวอย่างด้วย BAL / protected brush จาก segment ที่ผิดปกติในภาพรังสี" },
      { label: "Pulmonary infiltrates ในผู้ป่วยภูมิคุ้มกันบกพร่อง", detail: "BAL เป็นหลัก (PJP sensitivity >90%)" },
      { label: "สงสัย TB เมื่อเสมหะ (รวม induced sputum) ไม่ให้การวินิจฉัย", detail: "ทำในห้อง negative pressure และใช้ respirator" },
      { label: "Ventilator-associated pneumonia", detail: "Quantitative BAL (≥10⁴ cfu/mL) หรือ PSB (≥10³ cfu/mL) ควรเก็บก่อนให้ยาปฏิชีวนะ / ภายใน 48 ชม." },
    ],
  },
  staging: {
    title: "Staging มะเร็งปอดและอื่นๆ",
    items: [
      { label: "Mediastinal staging ของ NSCLC", detail: "Endosonography (EBUS ± EUS) เป็นทางเลือกแรกก่อน surgical staging" },
      { label: "การบาดเจ็บของ airway: inhalation / burns, chest trauma", detail: "ประเมิน thermal injury, bronchial disruption" },
      { label: "ประเมินตำแหน่ง ETT / airway ใน ICU", detail: "" },
      { label: "Lung transplant surveillance", detail: "TBLB เพื่อตรวจ acute rejection; ตรวจรอยต่อ anastomosis" },
    ],
  },
  therapeutic: {
    title: "ข้อบ่งชี้เพื่อการรักษา",
    items: [
      { label: "นำสิ่งแปลกปลอมออก", detail: "หากสงสัยชัดเจนใช้ rigid bronchoscopy; flexible ใช้กรณีไม่ชัดเจน / คัดกรอง" },
      { label: "เสมหะคั่ง / mucus plugging (pulmonary toilet)", detail: "เมื่อกายภาพบำบัดและการดูดเสมหะไม่ได้ผล (ผู้ป่วยติดเตียง หลังผ่าตัด บาดเจ็บไขสันหลัง)" },
      { label: "Difficult intubation", detail: "ใส่ ETT โดยใช้กล้องนำทาง" },
      { label: "Central airway obstruction", detail: "Debulking, dilation, stenting (มักใช้ rigid)" },
      { label: "Whole-lung lavage สำหรับ PAP", detail: "ภายใต้ GA ผ่าน double-lumen tube" },
      { label: "ควบคุม haemoptysis", detail: "Cold saline, topical vasoconstrictor, balloon tamponade / blocker" },
    ],
  },
};

export const TH_NOT_HELPFUL = [
  "Pleural effusion เดี่ยวๆ โดยไม่มีความผิดปกติอื่น",
  "ไอเรื้อรังในผู้ไม่สูบบุหรี่อายุ <55 ปี ที่ CXR ปกติและไม่มีปัจจัยเสี่ยงมะเร็ง",
  "Community- หรือ hospital-acquired pneumonia ที่ไม่มีภาวะแทรกซ้อน (แทบไม่เปลี่ยนการรักษา)",
  "Peripheral nodule ที่อยู่ไกลเกินกล้องจะเข้าถึงโดยไม่มี guidance technology",
  "Massive haemoptysis ด้วย flexible scope อย่างเดียว (เล็กเกินจะดูดเลือดได้ทัน — ควรใช้ rigid)",
];

export const TH_CONTRAINDICATIONS: Record<string, { label: string; detail: string }> = {
  "Refractory hypoxaemia": { label: "Refractory hypoxaemia", detail: "ไม่สามารถรักษาระดับออกซิเจนได้เพียงพอระหว่างหัตถการ — โดยเฉพาะผู้ป่วยที่ไม่ได้ใส่ท่อช่วยหายใจ (พิจารณาใส่ท่อแบบ elective)" },
  "Severe haemodynamic instability": { label: "Haemodynamic ไม่คงที่รุนแรง", detail: "Shock หรือระบบหัวใจหลอดเลือดไม่คงที่ที่ยังไม่ได้แก้ไข" },
  "Malignant / unstable arrhythmias": { label: "Malignant / unstable arrhythmias", detail: "Hypoxaemia และการกระตุ้น vagus อาจทำให้หัวใจหยุดเต้น" },
  "Lack of informed consent": { label: "ไม่มี informed consent", detail: "ยกเว้นภาวะฉุกเฉิน / ความยินยอมจากผู้แทนตามกฎหมาย" },
  "Status asthmaticus": { label: "Status asthmaticus", detail: "เป็นข้อห้ามเด็ดขาดสำหรับ TBLB" },
  "Inadequate facilities / personnel": { label: "สถานที่ / บุคลากรไม่พร้อม", detail: "ต้องรับมือ cardiac arrest, pneumothorax และเลือดออกได้" },
  "Uncorrected coagulopathy / thrombocytopenia": { label: "Coagulopathy / thrombocytopenia ที่ยังไม่แก้ไข", detail: "เลื่อน biopsy ถ้าแก้ไขไม่ได้; การส่องดู/BAL มักทำได้" },
  "Recent myocardial infarction / unstable angina": { label: "Myocardial infarction ไม่นาน / unstable angina", detail: "BTS แนะนำเลื่อนหัตถการ elective ≥4 สัปดาห์ (เดิม ≥6 สัปดาห์) หลัง MI" },
  "Severe pulmonary hypertension": { label: "Severe pulmonary hypertension", detail: "เสี่ยงเลือดออกจาก TBLB สูงขึ้น; ประเมินรายบุคคล" },
  Uraemia: { label: "Uraemia", detail: "เกล็ดเลือดทำงานผิดปกติ; พิจารณา desmopressin ก่อน TBLB" },
  "Partial tracheal obstruction": { label: "Partial tracheal obstruction", detail: "เสี่ยงอุดกั้นสมบูรณ์จาก sedation/กล้อง — เตรียม rigid สำรอง" },
  "Hypercapnia / moderate–severe hypoxaemia": { label: "Hypercapnia / hypoxaemia ปานกลาง–รุนแรง", detail: "Sedation อาจทำให้เกิดภาวะหายใจล้มเหลว" },
  "Severe COPD / poorly controlled asthma": { label: "Severe COPD / asthma ที่ควบคุมไม่ได้", detail: "ให้ bronchodilator ก่อน; เสี่ยง bronchospasm" },
  "Morbid obesity, severe OSA": { label: "Morbid obesity, severe OSA", detail: "ความเสี่ยงด้าน airway / sedation ขึ้นกับความพร้อมของสถานที่" },
  "Lack of patient cooperation": { label: "ผู้ป่วยไม่ให้ความร่วมมือ", detail: "อาจต้องใช้ deep sedation หรือ GA" },
};

export const TH_ANTITHROMBOTICS: Record<string, { lowRisk: string; biopsy: string; restart: string }> = {
  "Aspirin (low dose)": { lowRisk: "ให้ต่อได้", biopsy: "ให้ต่อได้ — ไม่พบว่าเพิ่มเลือดออกจาก TBLB", restart: "—" },
  "Clopidogrel / prasugrel / ticagrelor": { lowRisk: "ให้ต่อได้สำหรับการส่องดู/BAL", biopsy: "หยุด 5–7 วันก่อน (clopidogrel เพิ่มเลือดออกจาก TBLB อย่างมาก) ห้ามหยุดเองโดยไม่ปรึกษาแพทย์โรคหัวใจหากเพิ่งใส่ stent", restart: "วันรุ่งขึ้นถ้าเลือดหยุดดี" },
  Warfarin: { lowRisk: "ให้ต่อได้; ตรวจ INR", biopsy: "หยุด ~5 วันก่อน; INR ≤1.5 ในวันทำ (bridging หากเสี่ยง thrombosis สูง)", restart: "เย็นวันทำ / วันรุ่งขึ้น" },
  "Unfractionated heparin (IV)": { lowRisk: "—", biopsy: "หยุด ~6 ชม. ก่อน", restart: "12 ชม. หลังทำ (ผู้ป่วยใน)" },
  "Enoxaparin — therapeutic": { lowRisk: "—", biopsy: "ขนาดสุดท้าย ≥24 ชม. ก่อน", restart: "12–24 ชม. หลังทำ" },
  "Enoxaparin — prophylactic": { lowRisk: "—", biopsy: "งดขนาดเช้าวันทำ", restart: "เย็นวันทำ / วันรุ่งขึ้น" },
  "DOACs (apixaban, rivaroxaban, edoxaban, dabigatran)": { lowRisk: "พิจารณาให้ต่อได้หากส่องดูอย่างเดียว", biopsy: "หยุด 24–48 ชม. (นานขึ้นถึง 5 วันหากไต/ตับบกพร่องหรือเสี่ยงเลือดออกสูง; dabigatran ขึ้นกับ CrCl)", restart: "24–48 ชม. หลังทำถ้าเลือดหยุดดี" },
};

export const TH_ASA = [
  "ผู้ป่วยสุขภาพปกติ",
  "มีโรคทางระบบเล็กน้อย",
  "มีโรคทางระบบรุนแรง",
  "มีโรคทางระบบรุนแรงที่คุกคามชีวิตตลอดเวลา",
  "ใกล้เสียชีวิต — ไม่คาดว่าจะรอดหากไม่ผ่าตัด",
];

export const TH_PLANNED: Record<string, string> = {
  inspection: "ส่องตรวจ airway / washing อย่างเดียว",
  bal: "BAL",
  brush: "Brushing",
  ebbx: "Endobronchial biopsy",
  tblb: "Transbronchial lung biopsy",
  tbna: "TBNA / EBUS-TBNA",
};
