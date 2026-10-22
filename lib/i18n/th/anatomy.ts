/**
 * Thai overlays for anatomy content. Medical / anatomical terms are intentionally kept in English
 * (as used in Thai clinical teaching); surrounding explanation is Thai.
 */

type AirwayTh = { description?: string; landmarks?: string[]; pitfalls?: string[]; variations?: string[] };

export const TH_AIRWAY: Record<string, AirwayTh> = {
  trachea: {
    description:
      "เริ่มที่ระดับ cricoid (≈C6) ยาวประมาณ 10–12 cm ไปจนถึง main carina (≈T5) เส้นผ่านศูนย์กลางภายในในผู้ใหญ่ 16–20 mm มี cartilage rings รูปเกือกม้าสีซีด 18–22 วงทางด้านหน้า และผนังด้านหลังเป็น membranous wall ที่เรียบ มีรอยพับตามยาว",
    landmarks: [
      "Cartilage rings ด้านหน้าเห็นเป็นวงโค้งสีซีดต่อเนื่องลึกลงไปใน lumen",
      "Posterior membranous wall (trachealis) เรียบ มีลายตามยาว และโป่งเข้ามาเวลาไอหรือหายใจออก",
      "เห็น main carina อยู่ไกลออกไป เป็นแผ่นกั้นแนวตั้งที่คม — LMB อยู่ทางซ้ายของจอ RMB อยู่ทางขวา",
    ],
    pitfalls: [
      "อย่าหยุดดูแค่รอยโรคแรกที่พบ ให้ตรวจ airway ทั้งสองข้างให้ครบก่อนเก็บตัวอย่าง — พบ synchronous lesion ได้ถึง ~10% ของ bronchogenic carcinoma",
      "ผนังด้านหลังยุบตัว >50% ขณะหายใจออก บ่งชี้ tracheobronchomalacia / excessive dynamic airway collapse",
      "สังเกต extrinsic compression หรือการเบี่ยงของ trachea จาก paratracheal mass",
    ],
    variations: [
      "Tracheal bronchus (\"bronchus suis\"): RUL หรือ apical segment แยกออกจากผนังขวาของ trachea โดยตรง",
      "Sabre-sheath trachea (พบใน COPD): เส้นผ่านศูนย์กลางแนว coronal แคบลง",
    ],
  },
  RMB: {
    description:
      "สั้น (~1.5 cm) กว้าง และอยู่ในแนวดิ่งกว่าข้างซ้าย จึงเป็นทางที่สิ่งแปลกปลอมสำลักลงบ่อย เมื่อมองลงไปตาม RMB จะเห็นรูเปิด RUL อยู่สูงบนผนังด้านข้าง (มุมขวาบนของจอ) แยกจาก bronchus intermedius ด้วย RC1",
    landmarks: ["RC1: spur ระหว่างรูเปิด RUL กับ bronchus intermedius"],
    pitfalls: [
      "Main carina ที่กว้างหรือทู่ อาจบ่งชี้ subcarinal (station 7) adenopathy",
      "รูเปิด RUL พลาดง่ายถ้าดันกล้องเร็วเกินไป — ให้มองขึ้นและไปทางขวาทันทีที่ผ่าน carina",
    ],
  },
  LMB: {
    description:
      "ยาว (4–4.5 cm) แคบกว่า และวางตัวแนวนอนกว่า วิ่งไปทางด้านหลัง ล่าง และด้านข้าง ใต้ aortic arch ภาพปลายจะเห็น LC2 (left secondary carina) โดยมี LUL อยู่ด้านบนและ LLL อยู่ด้านล่าง",
    pitfalls: ["การเต้นที่ผนังจาก aortic arch / LPA เป็นภาวะปกติ — ห้ามแทงเข็มเข้าส่วนที่เต้นได้โดยไม่ตรวจสอบ"],
  },
  RUL: {
    description:
      "แยกจากผนังด้านข้างของ RMB ใต้ carina เล็กน้อย วิ่งออกด้านข้าง ~1–2 cm ก่อนแตกเป็นสามแขนง: apical (B1), posterior (B2) และ anterior (B3)",
    landmarks: ["Trifurcation (B1/B2/B3) — 'Mercedes-Benz sign': เมื่องอปลายกล้องขึ้นเข้า RUL จะเห็น B1 ด้านบน B3 ด้านซ้าย และ B2 ด้านขวา"],
    pitfalls: ["ต้องงอปลายขึ้นมากร่วมกับหมุนกล้องตามเข็มนาฬิกา — apical segment (B1) เข้ายากที่สุด"],
  },
  BI: {
    description:
      "เป็นส่วนต่อจาก RMB หลังแยก RUL ยาว 2–2.5 cm ภาพปลายเห็นสามรูเปิด: RML (ด้านหน้า), superior segment ของ RLL (B6, ด้านหลัง) และ basal trunk คั่นด้วย RC2",
    variations: ["Cardiac bronchus: แขนงเกินที่ปลายตันจากผนังด้าน medial ของ BI พบได้น้อย"],
  },
  RML: {
    description: "แยกจากผนังด้านหน้าของ BI ส่วนปลาย วิ่งไปด้านหน้า/ด้านข้าง 1–2 cm แล้วแตกเป็น lateral (B4) และ medial (B5) segment",
    pitfalls: [
      "RML bronchus ยาว แคบ และแยกเป็นมุมแหลม — ถูกกดจากภายนอกได้ง่าย (middle lobe syndrome)",
      "เป็นตำแหน่งที่เลือกทำ BAL ใน diffuse disease (ร่วมกับ lingula) เพราะได้ปริมาณน้ำกลับมากที่สุด",
    ],
  },
  RLL: {
    description: "RLL bronchus ใต้ตำแหน่งแยก B6 — medial basal segment (B7) แยกออกจากผนังด้าน medial ก่อน จากนั้น trunk ต่อไปเป็น B8 และ common trunk ของ B9+10",
    pitfalls: ["B7 (medial basal / paracardiac) แยกออกก่อนจากผนังด้าน medial มักถูกมองข้าม และในบางคนไม่เห็นเป็นรูแยก"],
  },
  "RB-basal": { description: "Basal trunk ส่วนปลาย แตกเป็น anterior basal segment (B8) และ common trunk ของ lateral และ posterior basal segment (B9+10)" },
  "RB9+10": { description: "Common trunk สั้นๆ ที่แตกเป็น lateral (B9) และ posterior (B10) basal segment" },
  LUL: {
    description:
      "แยกออกทางด้านหน้า-บนจาก LMB ส่วนปลาย แล้วแตกที่ LC1 เป็น upper division bronchus (UDB: B1+2 และ B3) และ lingular bronchus (B4/B5) โดยมี LPA โค้งข้ามจุดกำเนิด",
  },
  "LUL-upper": {
    description: "แตกเป็น apicoposterior (B1+2) และ anterior (B3) segmental bronchus — ในภาพมาตรฐาน B1+2 อยู่ด้านบน B3 อยู่ด้านล่าง",
    pitfalls: ["Apicoposterior segment ต้องงอปลายขึ้นสุด — เป็นจุดที่ตรวจไม่ครบบ่อย"],
  },
  Lingula: { description: "ยาว 2–3 cm วิ่งลงล่างและออกด้านข้าง แตกเป็น superior (B4) และ inferior (B5) lingular segment" },
  LLL: { description: "ให้แขนง superior segment (B6) ออกทางด้านหลังเกือบทันที จากนั้นต่อไปอีก ~1 cm เป็น basal trunk" },
  "LB-basal": { description: "แตกเป็น anterior basal segment (B8) และ common trunk ของ B9+10 — ต่างจากข้างขวาคือ left lower lobe ไม่มี medial basal segment (B7) แยก" },
  "LB9+10": { description: "Common trunk สั้นๆ แตกเป็น lateral (B9) และ posterior (B10) basal segment — ได้ภาพคลาสสิกที่ B8 / B9 / B10 เรียงซ้อนกัน" },
  RB1: { description: "Apical segment ของ RUL ชี้ขึ้นด้านบน (subsegment a/b)" },
  RB2: { description: "Posterior segment ของ RUL — ตำแหน่งคลาสสิกของ aspiration ในผู้ป่วยนอนราบ และ reactivation TB" },
  RB3: { description: "Anterior segment ของ RUL" },
  RB4: { description: "Lateral segment ของ RML — มองเห็นได้ยาวกว่า B5" },
  RB5: { description: "Medial segment ของ RML — วิ่งเป็นแนวเฉียงกว่า" },
  RB6: { description: "Superior segment ของ RLL (Nelson's bronchus) แยกออกทางด้านหลังที่ระดับเดียวกับรูเปิด RML แตกเป็น a/b/c เป็น segment ที่อยู่ต่ำที่สุดในท่านอนหงาย (aspiration)" },
  RB7: { description: "Medial (paracardiac) basal segment — แยกออกก่อนและอยู่ด้าน medial ที่สุดของกลุ่ม basal บางคนไม่เห็นเป็นรูแยก" },
  RB8: { description: "Anterior basal segment" },
  RB9: { description: "Lateral basal segment (ใช้ trunk ร่วมกับ B10)" },
  RB10: { description: "Posterior basal segment — อยู่ต่ำในท่านอนหงาย (subsegment a/b/c)" },
  "LB1+2": { description: "Apicoposterior segment (ข้างซ้าย B1 และ B2 ใช้ trunk ร่วมกัน; subsegment a/b/c)" },
  LB3: { description: "Anterior segment ของ LUL วิ่งคู่กับ anterior segmental artery" },
  LB4: { description: "Superior lingular segment" },
  LB5: { description: "Inferior lingular segment" },
  LB6: { description: "Superior segment ของ LLL แยกออกทางด้านหลังทันทีที่เข้า LLL แตกเป็น a/b/c" },
  LB8: { description: "Anterior basal segment ของ LLL — left lower lobe ไม่มี medial basal (B7) แยก ดังนั้นกลุ่ม basal คือ B8, B9 และ B10" },
  LB9: { description: "Lateral basal segment (ใช้ trunk ร่วมกับ B10)" },
  LB10: { description: "Posterior basal segment (subsegment a/b/c)" },
};

export const TH_VIEWS: Record<string, { label: string; expected: string }> = {
  trachea: { label: "Trachea", expected: "Cartilage rings รูปเกือกม้าสีซีดด้านหน้า ผนัง membranous ด้านล่างเรียบมีลายตามยาว และเห็น main carina อยู่ไกลออกไป" },
  carina: { label: "Main carina", expected: "Carina แนวตั้งคม: left main bronchus อยู่ทางซ้ายของจอ right main bronchus อยู่ทางขวา เห็น rings ภายในทั้งสองข้าง" },
  rmb: { label: "Right main bronchus", expected: "รูเปิด RUL อยู่สูงทางขวา (≈1 นาฬิกา) คั่นด้วย RC1 จาก bronchus intermedius ด้านล่างซ้าย" },
  rul: { label: "Right upper lobe (B1/B2/B3)", expected: "Trifurcation: B1 (apical) ด้านบน, B3 (anterior) ด้านซ้าย, B2 (posterior) ด้านขวา" },
  bi: { label: "Bronchus intermedius", expected: "สามรูเปิด: RML (B4–B5) ด้านซ้าย, basal trunk (B7–B10) ตรงกลาง, B6 ขวาบน (กล้องถูกหมุนตามปกติเมื่อส่องข้างขวา)" },
  rml: { label: "Right middle lobe (B4/B5)", expected: "แตกเป็น medial B5 และ lateral B4" },
  rll: { label: "Right lower lobe (B6–B10)", expected: "B6 เปิดไปทางด้านหลัง (ขวาบน) เหนือ basal trunk ขนาดใหญ่ (ซ้ายล่าง)" },
  rbasal: { label: "Right lower lobe basal group", expected: "B7 ด้านซ้าย (medial), B8 ด้านบน, B9+10 ทางขวา" },
  "rb8-10": { label: "Right lower lobe (B8–B10)", expected: "B8 คั่นจาก common trunk B9+10 ด้วย spur บาง; B9 และ B10 อยู่ลึกถัดไป" },
  lmb: { label: "Left main bronchus", expected: "LC2: รูเปิด LUL อยู่ด้านบน LLL อยู่ด้านล่าง" },
  lul: { label: "Left upper lobe", expected: "Upper division (B1+2, B3) ซ้ายบน, lingula (B4–B5) ขวาล่าง คั่นด้วย LC1" },
  udb: { label: "Upper division bronchus", expected: "B1+2 ด้านบน B3 ด้านล่าง" },
  lingula: { label: "Lingula (B4/B5)", expected: "รูเปิด superior (B4) และ inferior (B5) lingular อยู่เคียงกัน" },
  lll: { label: "Left lower lobe (B6–B10)", expected: "Basal trunk (B8–B10) กลางบน, B6 ขวาล่าง" },
  lb6: { label: "Left lower lobe B6 (a/b/c)", expected: "Superior segment แตกสามทางเป็น B6a, B6b และ B6c" },
  lbasal: { label: "Left lower lobe basal group", expected: "รูเปิดเรียงซ้อนกัน: B8 ด้านบน, B9 ตรงกลาง, B10 ด้านล่าง (ข้างซ้ายไม่มี B7)" },
};

export const TH_NODES: Record<string, { boundaries?: string; ebusTechnique?: string; landmarkVessel?: string; pearl?: string }> = {
  "1": { boundaries: "จากขอบล่างของ cricoid ถึง clavicle และขอบบนของ manubrium; แนวกึ่งกลาง trachea แบ่ง 1R/1L", ebusTechnique: "อยู่สูงใน trachea ใต้ vocal cords; มักมองเห็นยาก (Ernst ch. 13)" },
  "2R": { boundaries: "จากขอบบนของ manubrium ถึงจุดที่ขอบล่างของ innominate (brachiocephalic) vein ตัดกับ trachea; ขยายถึงขอบด้านซ้ายของ trachea", ebusTechnique: "ถอยกล้องมาที่ trachea ส่วนกลาง/บน โดยวาง transducer ที่ ~2–3 นาฬิกา", landmarkVessel: "Innominate artery / brachiocephalic vein" },
  "2L": { boundaries: "จากขอบบนของ manubrium ถึงขอบบนของ aortic arch ทางซ้ายของขอบซ้ายของ trachea", ebusTechnique: "ที่ trachea ส่วนบน หมุนทวนเข็มนาฬิกาไป ~11 นาฬิกา; node อยู่เหนือ aortic arch", landmarkVessel: "Aortic arch (ด้านล่าง)" },
  "3a": { boundaries: "อยู่หน้าต่อ SVC/great vessels หลัง sternum", pearl: "เข้าถึงจากใน airway ไม่ได้" },
  "3p": { boundaries: "อยู่หลัง trachea ตั้งแต่ยอดทรวงอกถึง carina", pearl: "เข้าถึงได้ดีที่สุดผ่าน esophagus (EUS / EUS-B)" },
  "4R": {
    boundaries: "จากขอบล่างของ innominate vein ถึงขอบล่างของ azygos vein; รวม right paratracheal และ pretracheal nodes ถึงขอบซ้ายของ trachea",
    ebusTechnique: "จากตำแหน่ง RUL/10R ถอยกล้องและหมุนทวนเข็มนาฬิกาเล็กน้อย — พบเหนือระดับ main carina",
    landmarkVessel: "Azygos vein (ขอบล่าง = รอยต่อ 4R/10R), SVC",
    pearl: "4R และ 7 ให้ yield ของ conventional TBNA สูงสุด — เป็น station แรกที่ผู้เริ่มฝึกควรลอง (Ernst ch. 11)",
  },
  "4L": {
    boundaries: "อยู่ซ้ายต่อขอบซ้ายของ trachea, medial ต่อ ligamentum arteriosum ตั้งแต่ขอบบนของ aortic arch ถึงขอบบนของ left main pulmonary artery",
    ebusTechnique: "ที่ trachea ส่วนปลาย / LMB ส่วนต้น ระดับ main carina หมุนทวนเข็มนาฬิกาไป ~10 นาฬิกา; อยู่ระหว่าง aorta และ LPA",
    landmarkVessel: "Aorta (ด้านบน) และ left pulmonary artery (ด้านล่าง)",
    pearl: "แผนที่ของ Wang เดิมเรียก 4L ว่า 'AP window' — แต่ IASLC station 5 และ 6 คือ AP-window/para-aortic nodes จริง และเข้าถึงด้วย TBNA ไม่ได้",
  },
  "5": { boundaries: "อยู่ด้านข้างต่อ ligamentum arteriosum ระหว่าง aortic arch และ LPA", pearl: "ต้องใช้ Chamberlain (anterior) mediastinotomy, VATS หรือ transaortic EUS — ไม่ใช่ EBUS" },
  "6": { boundaries: "อยู่ด้านหน้าและด้านข้างของ ascending aorta และ arch" },
  "7": {
    boundaries: "อยู่ใต้ main carina, ขอบบนของ LLL bronchus ด้านซ้าย และขอบล่างของ BI ด้านขวา",
    ebusTechnique: "วาง transducer ที่ผนัง medial ของ RMB หรือ LMB ส่วนต้น (~9 นาฬิกาใน LMB / 3 นาฬิกาใน RMB) เลย carina เล็กน้อย",
    pearl: "Main carina กว้างหรือทู่ใน white light เป็นเบาะแสของ station 7 โต",
  },
  "8": { boundaries: "ติดกับผนัง esophagus ใต้ subcarinal station" },
  "9": { boundaries: "อยู่ใน pulmonary ligament ตั้งแต่ inferior pulmonary vein ถึง diaphragm" },
  "10R": { boundaries: "จากขอบล่างของ azygos vein ถึงบริเวณ interlobar รอบ RMB", ebusTechnique: "นำปลายกล้องเข้ารูเปิด RUL หมุนตามเข็มนาฬิกาไป ~3 นาฬิกาแล้วถอยเล็กน้อย", landmarkVessel: "Azygos vein (ขอบบน), right PA" },
  "10L": { boundaries: "จากขอบบนของ LPA ถึงบริเวณ interlobar รอบ LMB", ebusTechnique: "ถอยเข้า LMB ที่ ~10 นาฬิกา; node อยู่ใกล้ pulmonary artery" },
  "11R": { boundaries: "อยู่ระหว่างจุดกำเนิดของ lobar bronchi: 11Rs ระหว่าง RUL และ BI; 11Ri ระหว่าง RML และ RLL", ebusTechnique: "จาก BI หมุนตามเข็มนาฬิกาแล้วกดปลายกล้องที่ RUL carina; อยู่ติด interlobar PA" },
  "11L": { boundaries: "อยู่ระหว่างจุดกำเนิดของ LUL และ LLL bronchi", ebusTechnique: "กดที่ LUL/LLL secondary carina; เห็น node ข้าง PA" },
  "12R": { boundaries: "อยู่ติด lobar bronchi", ebusTechnique: "ดันเข้า lower lobe bronchus ก่อนถึงจุดแยก basal; อยู่ติด interlobar PA" },
  "12L": { boundaries: "อยู่ติด lobar bronchi", ebusTechnique: "ดันเข้า basal segment แล้วหมุนตาม/ทวนเข็มนาฬิกาเล็กน้อย; ระบุได้ยาก" },
};

export const TH_LARYNX: Record<string, string> = {
  epiglottis: "Epiglottis — สอดกล้องผ่านด้านหลังของปลาย epiglottis; vallecula อยู่ด้านหน้า (เป็นจุดที่สิ่งแปลกปลอมติดได้)",
  cords: "True vocal cords — ควรกางออกเมื่อหายใจเข้าและหุบเมื่อออกเสียง ('อี') การหุบผิดปกติจนเหลือช่องรูปข้าวหลามตัดด้านหลังบ่งชี้ vocal cord dysfunction",
  vestibular: "Vestibular (false) folds — อยู่เหนือ true cords",
  arytenoids: "Arytenoids — จุดสังเกตด้านหลัง; ผ่าน glottis ตรงกลางระหว่าง cords โดยเฉพาะขณะหายใจเข้า",
  pyriform: "Pyriform recesses — อยู่ด้านข้าง larynx; การกระตุ้น (superior laryngeal nerve) ทำให้เกิด laryngospasm ได้ จึงควรพ่น topical lidocaine ก่อน",
};
