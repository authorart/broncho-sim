/** Thai overlays for procedures. Arrays are positional (same order/length as the English data). */

type ProcTh = {
  summary: string;
  indications: string[];
  keyNumbers: { label: string; value: string }[];
  steps: { title: string; detail: string }[];
  tips: string[];
  complications: { name: string; incidence?: string; prevention: string; management: string }[];
  specimens: string[];
};

export const TH_PROCEDURES: Record<string, ProcTh> = {
  bw: {
    summary:
      "ฉีด saline ปริมาณน้อยเข้า bronchus แล้วดูดกลับโดยไม่ wedge มักทำร่วมกับ brushing และ biopsy ในรอยโรคที่มองเห็น มีมาตรฐานน้อยกว่าและปนเปื้อนเชื้อจาก upper airway มากกว่า BAL",
    indications: ["Cytology เสริมสำหรับ endobronchial lesion ที่มองเห็น", "ส่งเชื้อเมื่อทำ BAL ไม่ได้", "เก็บสารคัดหลั่งจาก segment ที่ต้องการ"],
    keyNumbers: [
      { label: "ปริมาณที่ฉีด", value: "5–50 mL (มักแบ่งครั้งละ 5–20 mL)" },
      { label: "Microbiology", value: "ได้กลับ ≈5–15 mL" },
      { label: "Cytology", value: "ได้กลับ ≈10 mL" },
      { label: "ต้อง wedge?", value: "ไม่ต้อง" },
    ],
    steps: [
      { title: "เลือกตำแหน่ง", detail: "เลือก segment จาก CT / รอยโรคที่เห็น; ตรวจ airway ให้ครบก่อน เพื่อไม่ให้ปนเปื้อนบริเวณอื่น" },
      { title: "จัดตำแหน่ง (ไม่ wedge)", detail: "วางปลายกล้องที่รูเปิด segment ก่อนถึงเป้าหมาย โดยไม่อุดทั้ง lumen" },
      { title: "ฉีด sterile saline", detail: "ฉีด 5–20 mL ผ่าน working channel (ซ้ำได้ถึง ~50 mL)" },
      { title: "ดูดกลับด้วยแรงดูดเบาๆ", detail: "ดูดเข้า sterile trap (Lukens) ด้วยแรงดูดต่ำ; หลีกเลี่ยงการทำให้เยื่อบุบาดเจ็บ" },
      { title: "ติดฉลากและส่งตรวจ", detail: "แบ่งส่ง cytology และ microbiology; ระบุ differential diagnosis ในใบส่งตรวจ" },
    ],
    tips: [
      "ใน visible tumour yield ใกล้เคียงกันไม่ว่าจะเก็บ washing ก่อนหรือหลัง biopsy/brushing",
      "Inflammatory atypia (squamous metaplasia) อาจเลียนแบบมะเร็ง — แปลผล cytology ร่วมกับบริบททางคลินิก",
      "หากต้องการ quantitative bacterial culture ให้ใช้ BAL (washing เจือจางและปนเปื้อน)",
    ],
    complications: [
      { name: "Hypoxaemia ชั่วคราว", prevention: "ให้ O₂ เสริม; จำกัดปริมาณ", management: "ดูดเสมหะ เพิ่ม FiO₂" },
      { name: "ไอ / bronchospasm", prevention: "ให้ topical lidocaine เพียงพอ", management: "หยุดพัก ให้ bronchodilator" },
    ],
    specimens: ["Cytology (fixative ตามที่ห้องแล็บกำหนด)", "Bacterial / AFB / fungal culture", "PCR panels ตามข้อบ่งชี้"],
  },
  bal: {
    summary:
      "ฉีดและดูด saline กลับขณะ wedge กล้องใน bronchus ระดับที่ 3–4 เพื่อเก็บตัวอย่างจาก alveolar compartment (~1 ล้าน alveoli) เป็นมาตรฐานในการหาเชื้อในผู้ป่วยภูมิคุ้มกันบกพร่อง และการวิเคราะห์เซลล์ใน ILD",
    indications: [
      "Infiltrates ในผู้ป่วยภูมิคุ้มกันบกพร่อง (PJP sensitivity >90%)",
      "Pneumonia ที่ไม่หาย / VAP (quantitative culture ≥10⁴ cfu/mL)",
      "ILD: cell differential (lymphocytosis, eosinophilia, CD4/CD8)",
      "Alveolar haemorrhage (น้ำล้างแดงขึ้นเรื่อยๆ ในแต่ละ aliquot)",
      "PAP (น้ำขุ่นเหมือนนม, PAS+), Langerhans cell histiocytosis (CD1a >5%)",
    ],
    keyNumbers: [
      { label: "ปริมาณรวมที่ฉีด", value: "100–300 mL (มักใช้ 100–150 mL)" },
      { label: "Aliquots", value: "3–5 × 20–60 mL" },
      { label: "Recovery ปกติ", value: "40–70% ของที่ฉีด" },
      { label: "ปริมาณที่ห้องแล็บต้องการ", value: "≈40–60 mL สำหรับการตรวจส่วนใหญ่" },
      { label: "Cell differential ปกติ", value: "Macrophages ~90%, lymphocytes ~5–10%, PMN ≤3%, eos ≤1%" },
    ],
    steps: [
      { title: "เลือกตำแหน่ง", detail: "Diffuse disease: RML หรือ lingula (ได้น้ำกลับมากที่สุดในท่านอนหงาย) Focal disease: segment ที่ผิดปกติมากที่สุดใน CT" },
      { title: "ลดการดูดใน upper airway และ lidocaine", detail: "ทั้งสองอย่างปนเปื้อนตัวอย่างและลด cellular yield" },
      { title: "Wedge กล้อง", detail: "ดันเข้า bronchus ระดับ 3–4 จนอุด lumen; ยืนยันด้วยการดูดเบาๆ — airway ส่วนปลายควรยุบเล็กน้อย" },
      { title: "หลีกเลี่ยง over-wedging", detail: "การฝืนดันปลายกล้องทำให้เยื่อบุบาดเจ็บ มีเลือดปน และได้น้ำกลับน้อยลง" },
      { title: "ฉีดเป็น aliquots", detail: "Isotonic saline (อุณหภูมิห้อง/ร่างกาย) ครั้งละ 20–60 mL ผ่าน channel" },
      { title: "ดูดกลับทุก aliquot", detail: "ดูดเบาๆ (<100 mmHg) หรือดูดด้วย syringe หลังแต่ละ aliquot; หาก airway ยุบให้ลดแรงดูด" },
      { title: "ทางเลือก: แยก aliquot แรก", detail: "บางสถาบันทิ้ง/แยกส่วน 'bronchial' แรกเพื่อให้ได้ตัวอย่าง alveolar มากขึ้น" },
      { title: "จัดการสิ่งส่งตรวจ", detail: "ใช้ภาชนะ silicone/plastic; ส่งตรวจภายใน 1–4 ชม. หรือแช่เย็น; บันทึกปริมาณที่ฉีดและที่ได้กลับ" },
    ],
    tips: [
      "รักษาการ wedge ตลอด — ถ้าหลุดน้ำจะรั่วย้อนขึ้นและ recovery ลดลง",
      "Recovery ต่ำ (<30%) พบบ่อยใน emphysema และเมื่อทำที่ lower lobe",
      "ตัวอย่างไม่เหมาะสม: ไม่มี alveolar macrophage, bronchial epithelial cell >5% หรือมีหนองจาก central airway",
      "ทำ BAL ก่อน biopsy/brushing เพื่อไม่ให้เลือดปน cell count",
    ],
    complications: [
      { name: "ไข้ (หายเอง)", incidence: "พบบ่อยที่สุด", prevention: "จำกัดปริมาณ", management: "ยาลดไข้; ประเมินซ้ำถ้าไม่ลง" },
      { name: "Hypoxaemia ชั่วคราว", prevention: "ให้ O₂ ก่อนทำ; ผู้ป่วย ICU อาจต้องเพิ่ม support", management: "เพิ่ม FiO₂ / PEEP" },
      { name: "เลือดออก", incidence: "น้อยมาก", prevention: "หลีกเลี่ยง over-wedging", management: "คง wedge, cold saline" },
    ],
    specimens: ["Cell count & differential", "CD4/CD8 (lymphocyte subsets)", "Bacterial (quantitative), AFB, fungal culture", "PJP DFA / silver stain", "Galactomannan", "Cytology / flow cytometry"],
  },
  brush: {
    summary:
      "ดันแปรง cytology ที่อยู่ใน sheath ไปยังรอยโรคแล้วขัดแรงๆ ภายใต้การมองเห็น จากนั้นดึงแปรงกลับเข้า sheath ก่อนถอดออก Yield 50–90% ใน visible tumour; ใช้ protected specimen brush (PSB) สำหรับ VAP",
    indications: ["Visible endobronchial tumour (ร่วมกับ EBBx และ washing)", "รอยโรคส่วนปลายภายใต้ fluoroscopy / RP-EBUS guide sheath", "ส่งเชื้อด้วย PSB (≥10³ cfu/mL สำหรับ VAP)"],
    keyNumbers: [
      { label: "ขนแปรง", value: "3 mm หรือ 7 mm" },
      { label: "ระยะยื่นเลยปลายกล้อง", value: "≈3 cm" },
      { label: "Yield (visible tumour)", value: "50–90%" },
    ],
    steps: [
      { title: "สอดแปรงโดยเก็บไว้ใน sheath", detail: "สอดแปรงที่อยู่ใน sheath ผ่าน working channel" },
      { title: "ดัน sheath ออกจากกล้อง", detail: "ให้เห็นปลาย sheath ยื่นเลยกล้อง ~1–3 cm" },
      { title: "ดันแปรงออก", detail: "ผู้ช่วยดันแปรงออกไปที่รอยโรคภายใต้การมองเห็น" },
      { title: "ขัดรอยโรค", detail: "ขัดไป-มาแรงๆ หลายครั้งพร้อมหมุนบนผิวรอยโรค" },
      { title: "ดึงแปรงกลับเข้า sheath", detail: "สื่อสารให้ชัดเจน: 'เก็บแปรง' ก่อนขยับอย่างอื่น" },
      { title: "ถอด sheath + แปรงออกพร้อมกัน", detail: "ดึงออกเป็นชิ้นเดียวผ่าน channel แล้วป้ายสไลด์ / เขย่าใน fixative หรือตัดปลายใส่ media" },
    ],
    tips: [
      "Brushing ส่วนปลาย/transbronchial ควรทำภายใต้ fluoroscopy เพื่อไม่ให้ทะลุ pleura",
      "การทำ washing + brushing + EBBx ร่วมกันคุ้มค่าสำหรับรอยโรคที่มองเห็น",
      "PSB: ดันอุปกรณ์ ดัน plug ปลายออก ขัด แล้วดึง inner sheath ตามด้วย outer sheath; เช็ดด้วย 70% alcohol แล้วตัดแปรงลงใน non-bacteriostatic saline ≥1 mL",
    ],
    complications: [
      { name: "เลือดออก", prevention: "หลีกเลี่ยงในผู้ป่วย coagulopathy ที่แก้ไขไม่ได้", management: "Cold saline, topical epinephrine, wedge" },
      { name: "Pneumothorax (brushing ส่วนปลาย)", prevention: "Fluoroscopy, อยู่ห่างจาก pleura", management: "เฝ้าดู / ดูดอากาศ / ใส่สายระบาย" },
      { name: "Channel เสียหาย", prevention: "ห้ามสอดหรือถอนแปรงที่ไม่อยู่ใน sheath", management: "แจ้งฝ่ายวิศวกรรมการแพทย์" },
    ],
    specimens: ["Direct smears (alcohol-fixed / air-dried)", "เขย่าแปรงใน CytoLyt / saline", "ตัดปลายแปรงใส่ culture media"],
  },
  ebbx: {
    summary: "ตัดชิ้นเนื้อด้วย forceps จากเยื่อบุหรือก้อนที่มองเห็น Diagnostic yield >80% ใน visible malignancy; เพิ่ม yield ~20% จาก TBLB ใน sarcoidosis",
    indications: ["Visible endobronchial tumour", "เยื่อบุผิดปกติ (sarcoid, TB, amyloid)", "Sarcoidosis (random EBBx จาก secondary carinae)"],
    keyNumbers: [
      { label: "จำนวนชิ้นเนื้อ", value: "3–6 ชิ้นจากตำแหน่งเดียวกัน" },
      { label: "Yield (visible tumour)", value: ">80%" },
      { label: "Topical epinephrine", value: "1:10,000–1:20,000 ครั้งละน้อย" },
      { label: "Cold saline", value: "ครั้งละ ≈20 mL" },
    ],
    steps: [
      { title: "ตรวจปอดทั้งสองข้างก่อน", detail: "ตรวจ airway ให้ครบก่อนเก็บตัวอย่าง เพื่อไม่ให้แพร่เซลล์และไม่พลาด synchronous lesion" },
      { title: "เลือก forceps", detail: "Cup หรือ alligator; forceps ที่มี spike/needle ตรงกลางช่วยยึดรอยโรคที่อยู่แนวเฉียง" },
      { title: "จัดให้ตั้งฉาก", detail: "ที่จุดแยกใช้การเข้าตรงๆ; รอยโรคที่ขนานกับผนัง ให้ปรับมุมกล้องให้ forceps ตั้งฉากกับรอยโรคมากที่สุด" },
      { title: "เคลื่อนกล้อง + forceps เป็นหนึ่งเดียว", detail: "ให้กล้องอยู่ใกล้ forceps เพื่อเพิ่มแรงงัด; อ้า ดันเข้ารอยโรค แล้วหุบให้แน่น" },
      { title: "หลีกเลี่ยง cartilage และเนื้อตาย", detail: "การงับ cartilage rings ได้เนื้อไม่ดี; เนื้อตายผิวหน้าไม่ให้การวินิจฉัย — ให้ตัดลึกลงที่ตำแหน่งเดิม" },
      { title: "ตัดซ้ำ 3–6 ครั้ง", detail: "พิจารณาเข็ม 19/21 G เข้าแกนกลางรอยโรคเพื่อเพิ่ม yield" },
      { title: "ห้ามเลือด", detail: "สังเกต; cold saline → topical epinephrine → wedge/balloon tamponade → blocker หากจำเป็น" },
    ],
    tips: [
      "หลีกเลี่ยงในผู้ป่วย coagulopathy ที่แก้ไม่ได้ เกล็ดเลือด <50 ×10⁹/L หรือได้รับ clopidogrel",
      "รอยโรคที่ดูมีหลอดเลือดมาก (carcinoid, Dieulafoy) — พิจารณาความเสี่ยงก่อนตัด",
      "สื่อสารคำสั่ง 'อ้า' / 'หุบ' กับผู้ช่วยให้ชัดเจน",
    ],
    complications: [
      { name: "เลือดออก", incidence: "มักเล็กน้อย บางครั้งรุนแรงถึงชีวิต", prevention: "ตรวจการแข็งตัวของเลือดก่อน; หลีกเลี่ยงรอยโรคที่มีหลอดเลือดมาก", management: "Cold saline 20 mL, epinephrine 1:10,000–1:20,000, wedge/balloon, นอนตะแคงให้ข้างที่เลือดออกอยู่ด้านล่าง" },
      { name: "Pneumothorax", incidence: "พบน้อย (central)", prevention: "—", management: "รักษาตามมาตรฐาน" },
    ],
    specimens: ["Formalin สำหรับ histology", "ชิ้นเนื้อสดส่งเชื้อ (AFB/fungal) เมื่อมีข้อบ่งชี้"],
  },
  tblb: {
    summary: "สอด forceps เลยจาก airway ที่มองเห็นเพื่อเก็บเนื้อปอดส่วนปลาย ความเสี่ยงหลักคือ pneumothorax (1–6%) และเลือดออกมาก (2–9%)",
    indications: ["Sarcoidosis (yield 50–85% แม้ stage I)", "Lymphangitic carcinoma, PAP, LCH, eosinophilic pneumonia, drug pneumonitis", "Peripheral nodules (≈57% โดยรวม; สูงขึ้นเมื่อ >2 cm หรือมี bronchus sign)", "ติดตาม rejection หลังปลูกถ่ายปอด"],
    keyNumbers: [
      { label: "จำนวนชิ้นเนื้อ", value: "Diffuse 4–6 · focal 7–8 (BTS)" },
      { label: "ระยะห่างจาก pleura", value: "≈1–2 cm" },
      { label: "Pneumothorax", value: "1–6%" },
      { label: "เลือดออกมาก (>50 mL)", value: "2–9%" },
      { label: "Platelets", value: "≥50 ×10⁹/L" },
    ],
    steps: [
      { title: "วางแผนจาก CT", detail: "เลือก segment ที่ผิดปกติมากที่สุด (หรือ bronchus ที่นำไปสู่รอยโรค)" },
      { title: "ตำแหน่งพร้อม wedge", detail: "นำปลายกล้องเข้า subsegment ที่ต้องการ" },
      { title: "ดัน forceps ที่หุบอยู่", detail: "ภายใต้ fluoroscopy ดันจนรู้สึกต้านหรือผู้ป่วยเจ็บแบบ pleuritic (= ถึง pleura)" },
      { title: "ถอยกลับ ~1–2 cm", detail: "ถอยออกจาก pleura ก่อนอ้า forceps" },
      { title: "อ้าขณะหายใจเข้า", detail: "อ้าปาก forceps แล้วดันกลับไปครึ่งหนึ่งของระยะถึงจุดที่ต้าน" },
      { title: "หุบเมื่อสุดหายใจออก", detail: "หุบ forceps เมื่อปริมาตรปอดน้อยที่สุด; ดูการดึงรั้งเนื้อปอดใน fluoroscopy" },
      { title: "ดึงออกอย่างมั่นคง", detail: "หากรั้งมากหรือผู้ป่วยเจ็บ ให้อ้าปล่อยแล้วจัดตำแหน่งใหม่" },
      { title: "เฝ้าระวังเลือดออก", detail: "ผู้เริ่มฝึก: คง wedge กล้องไว้หลังตัดแต่ละครั้ง; ตรวจ PTX ด้วย fluoroscopy เมื่อจบ" },
    ],
    tips: [
      "ใช้ alligator forceps ขนาดกลาง — ยังเหลือช่องใน channel สำหรับดูด",
      "Fluoroscopy เพิ่ม yield ใน focal disease แต่ยังไม่พิสูจน์ว่าลด pneumothorax",
      "RP-EBUS ± navigation เพิ่ม yield ของ peripheral nodule (~70%, สูงถึง ~88% เมื่อใช้ร่วมกัน)",
      "ทำ CXR หลังหัตถการเฉพาะเมื่อมีอาการ (หรือตามนโยบายของสถาบัน)",
    ],
    complications: [
      { name: "Pneumothorax", incidence: "1–6%", prevention: "Fluoroscopy, ห่าง pleura 1–2 cm, ไม่ตัดเมื่อผู้ป่วยเจ็บ", management: "เฝ้าดูหากเล็ก/คงที่; ดูดอากาศหรือใส่ chest drain หากมากหรือมีอาการ" },
      { name: "Haemorrhage", incidence: "2–9% ที่มีนัยสำคัญ", prevention: "หยุด clopidogrel, แก้ INR/เกล็ดเลือด, ระวังใน PH/uraemia", management: "คง wedge + ดูด, iced saline 20 mL, epinephrine 1:20,000, นอนให้ข้างที่เลือดออกอยู่ล่าง, bronchial blocker" },
    ],
    specimens: ["Formalin (≥4–6 ชิ้น, 1–2 mm)", "ชิ้นเนื้อสดส่งเพาะเชื้อหากสงสัยติดเชื้อ"],
  },
  tbna: {
    summary:
      "ใช้เข็มเก็บตัวอย่างจาก mediastinal/hilar nodes และรอยโรคผ่านผนัง airway — แบบ blind (conventional ใช้ CT landmarks) หรือภายใต้ convex-probe EBUS แบบ real time EBUS-TBNA มี sensitivity ≈93% และ specificity เกือบ 100%; ภาวะแทรกซ้อน ≈0.15–0.26%",
    indications: ["วินิจฉัยและ staging NSCLC (เก็บ N3 → N2 → N1)", "Sarcoidosis (พบ granuloma ~80% เทียบกับ 53% จาก TBLB)", "TB lymphadenitis, lymphoma (การตรวจเบื้องต้น)", "Submucosal / peribronchial disease"],
    keyNumbers: [
      { label: "จำนวนครั้งที่เจาะ", value: "≥3 ครั้งต่อ station เมื่อไม่มี ROSE" },
      { label: "การขยับเข็มต่อครั้ง", value: "≈8–20 ครั้ง (ไป-มา)" },
      { label: "Suction", value: "ใช้หรือไม่ใช้ — ได้ผลเท่ากัน" },
      { label: "เข็ม", value: "21 G ≈ 22 G; 19 G สำหรับ histology" },
      { label: "EBUS-TBNA sensitivity", value: "≈93% (pooled)" },
    ],
    steps: [
      { title: "วางแผน stations จาก CT/PET", detail: "ใช้ IASLC nomenclature; วางลำดับ N3 → N2 → N1 เพื่อไม่ให้ upstaging จากการปนเปื้อน" },
      { title: "ทำ TBNA ก่อน", detail: "ก่อน BAL/brush/biopsy ของก้อนหลัก — channel ที่ปนเปื้อนทำให้ cytology ของ node เป็น false-positive ได้" },
      { title: "สำรวจด้วย ultrasound + Doppler", detail: "ระบุ node วัด short axis ดู echo features; ใช้ Doppler หาหลอดเลือดในแนวเข็ม" },
      { title: "ใส่เข็มขณะปลายกล้องตรง", detail: "ล็อกอุปกรณ์; ปรับ sheath ให้เห็นพอดีในภาพ white light" },
      { title: "Golden rule", detail: "ห้ามดันหรือถอน catheter ผ่านกล้องขณะเข็มโผล่อยู่เด็ดขาด" },
      { title: "เจาะ", detail: "งอปลายขึ้นให้เข็มตั้งฉากกับผนัง เทคนิค: jabbing, piggyback, hub-against-wall, cough" },
      { title: "ถอด stylet (และดูดถ้าต้องการ)", detail: "ถ้าดูดได้เลือด → เปลี่ยนตำแหน่ง; ถ้าไม่มี → ขยับเข็มใน node 8–20 ครั้ง" },
      { title: "ปล่อย suction เก็บเข็ม ถอดอุปกรณ์", detail: "ปลายกล้องตรง เก็บเข็มเข้า sheath แล้วดึงออกในจังหวะเดียว" },
      { title: "เตรียมตัวอย่าง / ROSE", detail: "Smears (air-dried + fixed), cell block ใน formalin/CytoLyt; เจาะเพิ่มสำหรับ molecular testing (EGFR, ALK, PD-L1…)" },
    ],
    tips: [
      "4R และ 7 ให้ yield ของ conventional TBNA สูงสุด — ผู้เริ่มฝึกควรเริ่มที่นี่",
      "ใช้คำว่า 'non-diagnostic' แทน 'negative' — หากยังสงสัยให้ทำ mediastinoscopy ต่อ",
      "ROSE ลดตัวอย่างที่ไม่เพียงพอและจำนวนครั้งที่เจาะ แต่ไม่จำเป็นต่อ yield (CHEST 2016); ระวังหยุดก่อนเวลาจาก false-positive ROSE",
      "ลักษณะ ultrasound ที่บ่งชี้มะเร็ง: short axis >1 cm, กลม, ขอบชัด, echo ไม่สม่ำเสมอ, ไม่มี central hilar structure, coagulation necrosis sign",
    ],
    complications: [
      { name: "เลือดออก (เจาะโดนหลอดเลือด)", incidence: "พบน้อย", prevention: "ใช้ Doppler ก่อนเจาะ; ตั้ง stopper ไม่ให้ถึงหลอดเลือด", management: "ถอนเข็ม สังเกต ดูด" },
      { name: "Mediastinitis / abscess", incidence: "พบน้อยมาก (รอยโรคที่เป็นถุงน้ำ)", prevention: "หลีกเลี่ยงการเจาะ cyst; ให้ยาปฏิชีวนะหากผ่าน EUS", management: "ยาปฏิชีวนะ ± ระบาย" },
      { name: "กล้องเสียหาย", prevention: "ล็อกเข็มและเก็บใน sheath; ปลายกล้องตรงเมื่อใส่เข็ม", management: "รายงาน / ส่งซ่อม" },
      { name: "Pneumothorax / pneumomediastinum", incidence: "พบน้อย", prevention: "—", management: "รักษาตามมาตรฐาน" },
    ],
    specimens: ["Air-dried + alcohol-fixed smears (Diff-Quik / Pap)", "Cell block (formalin / CytoLyt)", "Core ใน formalin (19 G)", "Culture (AFB) เมื่อสงสัย granulomatous disease", "Flow cytometry สำหรับ lymphoma"],
  },
};

export const TH_TBNA_TECHNIQUES: Record<string, string> = {
  jab: "ตรึงกล้องไว้ที่จมูก/ปาก แล้วแทงเข็มอย่างแรงและเร็วผ่านช่องระหว่าง cartilage — เป็นวิธีแรกที่ใช้โดยทั่วไป",
  piggy: "ตรึงเข็มไว้ที่ biopsy port แล้วดันกล้องและ catheter ไปพร้อมกัน — กล้องช่วยให้เข็มแข็งขึ้น",
  hub: "วาง hub ของ catheter แนบผนังโดยเก็บเข็มไว้ แล้วจึงดันเข็มเข้าเป้าหมายโดยตรง",
  cough: "วางเข็มแนบผนัง ให้ผู้ป่วยไอ ผนัง airway จะถูกดันเข้าหาเข็ม",
};
