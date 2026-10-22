/** Thai overlays for the quiz. `options` keep the same order as the English bank (answer index unchanged). */

export const TH_CATEGORY: Record<string, string> = {
  anatomy: "กายวิภาค airway และ mediastinum",
  equipment: "อุปกรณ์และภาพ ultrasound",
  safety: "ความปลอดภัยในการทำหัตถการ",
  guidelines: "แนวทางเวชปฏิบัติและหลักฐาน",
};

export const TH_QUIZ: Record<string, { stem: string; options: string[]; rationale: string }> = {
  a1: {
    stem: "หลังหมุนกล้องตามเข็มนาฬิกาและงอปลายขึ้น ผู้ฝึกได้ภาพดังรูป (ไม่มีป้ายกำกับ) Lobar bronchus ใดที่แตกสามทางเป็น apical, posterior และ anterior segment แบบนี้?",
    options: ["Right upper lobe bronchus", "Left upper lobe — upper division", "Right lower lobe basal trunk", "Right middle lobe bronchus"],
    rationale: "RUL bronchus วิ่งออกด้านข้าง 1–2 cm แล้วแตกเป็น B1 (apical, ด้านบนของภาพ), B3 (anterior, ซ้าย) และ B2 (posterior, ขวา) — 'Mercedes-Benz sign' ข้างซ้าย B1 และ B2 ใช้ trunk ร่วมกัน upper division จึงแตกเป็นสองทาง (B1+2, B3)",
  },
  a2: {
    stem: "ข้อใดถูกต้องเกี่ยวกับ main bronchi?",
    options: [
      "Right main bronchus ยาว ~1.5 cm และอยู่ในแนวดิ่งกว่า; ข้างซ้ายยาว ~4–4.5 cm และอยู่แนวนอนกว่า",
      "Main bronchi ทั้งสองยาว ~3 cm และทำมุมกับ carina เท่ากัน",
      "Left main bronchus สั้นกว่า จึงอธิบายการสำลักลงปอดซ้าย",
      "RUL แยกออกจากผนัง medial ห่างใต้ carina ~3 cm",
    ],
    rationale: "RMB (≈1.5 cm, ID 10–12 mm) สั้นและชัน RUL แยกออกจากผนังด้านข้างเกือบทันที LMB (≈4–4.5 cm) วิ่งไปด้านหลัง ล่าง และด้านข้าง ใต้ aortic arch",
  },
  a3: {
    stem: "มองจาก bronchus intermedius ส่วนปลายในทิศมาตรฐาน (anterior อยู่ด้านบนของภาพ) รูเปิดที่อยู่ด้านหน้า (≈12 นาฬิกา) นำไปสู่:",
    options: ["Right middle lobe", "Superior segment ของ RLL (B6)", "Right upper lobe", "Medial basal segment (B7)"],
    rationale: "RML แยกจากผนังด้านหน้า-ข้างของ BI ส่วน B6 แยกไปทางด้านหลังจาก RLL ประมาณตรงข้ามกับรูเปิด RML",
  },
  a4: {
    stem: "ผู้ป่วยที่สำลักขณะนอนหงาย segment ใดอยู่ต่ำที่สุดจึงได้รับผลกระทบบ่อยที่สุด?",
    options: ["Superior segment ของ right lower lobe (RB6)", "Medial segment ของ RML (RB5)", "Anterior segment ของ RUL (RB3)", "Superior lingular segment (LB4)"],
    rationale: "ในท่านอนหงาย posterior segment ของ upper lobe และ superior segment ของ lower lobe อยู่ต่ำสุด และมักเป็นข้างขวาเพราะ RMB ตรงและกว้างกว่า",
  },
  a5: {
    stem: "ตาม IASLC map ขอบเขตที่แยก station 4R ออกจาก station 10R คือ:",
    options: ["ขอบล่างของ azygos vein", "ขอบบนของ aortic arch", "ขอบบนของ left pulmonary artery", "ขอบล่างของ innominate vein"],
    rationale: "เหนือขอบล่างของ azygos vein คือ 4R; ต่ำกว่านั้นคือ 10R (right hilar) ข้างซ้ายใช้ขอบบนของ LPA แยก 4L จาก 10L",
  },
  a6: {
    stem: "Node ที่จับ PET อยู่ด้านข้างต่อ ligamentum arteriosum ใน aortopulmonary window (station 5) วิธีใดเก็บตัวอย่างได้?",
    options: ["Anterior (Chamberlain) mediastinotomy หรือ VATS", "EBUS-TBNA จาก trachea ส่วนปลาย", "Conventional TBNA ที่ตำแหน่ง 4L", "Cervical mediastinoscopy"],
    rationale: "Station 5 และ 6 เข้าถึงด้วย EBUS-TBNA หรือ cervical mediastinoscopy ไม่ได้ แผนที่ Wang เดิมเรียก 4L ว่า 'AP window' ซึ่งทำให้สับสนบ่อย — ควรใช้ IASLC nomenclature",
  },
  a7: {
    stem: "Trachea ของผู้ใหญ่โดยทั่วไปมี:",
    options: ["เส้นผ่านศูนย์กลางภายใน 16–20 mm และ cartilage rings รูปเกือกม้า 18–22 วง", "เส้นผ่านศูนย์กลาง 10–12 mm และ rings ครบวง 8–10 วง", "เส้นผ่านศูนย์กลาง 25–30 mm และ 30 วง", "Cartilage รอบวงรวมถึงผนังด้านหลัง"],
    rationale: "Cartilage รูปเกือกม้ารองรับผนังด้านหน้าและด้านข้าง ผนัง membranous ด้านหลัง (trachealis) ไม่มี cartilage และเป็นตำแหน่งที่ยุบใน excessive dynamic airway collapse",
  },
  a8: {
    stem: "ตาม Boyden nomenclature RB7 ตรงกับ segment ใดของ Jackson–Huber?",
    options: ["Medial basal", "Anterior basal", "Superior", "Lateral"],
    rationale: "Right lower lobe: B6 superior, B7 medial basal, B8 anterior basal, B9 lateral basal, B10 posterior basal ส่วน left lower lobe ไม่มี B7 แยก: basal segments คือ B8, B9 และ B10",
  },
  a9: {
    stem: "Station 4L (left lower paratracheal) อยู่ระหว่างโครงสร้างใด?",
    options: ["Aortic arch (ด้านบน) และ left main pulmonary artery (ด้านล่าง)", "Azygos vein และ SVC", "Innominate vein และ aortic arch", "LUL และ LLL bronchi"],
    rationale: "EBUS: จาก trachea ส่วนปลาย/LMB ส่วนต้นที่ระดับ carina หมุนทวนเข็มนาฬิกาไป ~10 นาฬิกา — 4L อยู่ระหว่าง aorta และ LPA",
  },
  a10: {
    stem: "ภาพแสดง left main bronchus ส่วนปลาย (ทิศมาตรฐานของ atlas) รูเปิดของ lobe สองรูที่คั่นด้วย secondary carina คือ:",
    options: ["Left upper lobe (ด้านบน) และ left lower lobe (ด้านล่าง)", "Upper division และ lingula", "LB6 และ basal trunk", "Left upper lobe และ cardiac bronchus"],
    rationale: "LMB สิ้นสุดที่ secondary carina แยกเป็น LUL (ด้านหน้า/บน) และ LLL (ด้านหลัง/ล่าง) จากนั้น LUL แยกเป็น upper division และ lingula",
  },
  e1: {
    stem: "ช่วงการงอปลาย (angulation) ทั่วไปของ bending section ใน flexible bronchoscope ผู้ใหญ่คือ:",
    options: ["≈180° ขึ้น / 130° ลง", "≈90° ขึ้น / 90° ลง", "≈360° ทุกทิศทาง", "≈60° ขึ้น / 30° ลง"],
    rationale: "การงอเป็นระนาบเดียวด้วยลวดสองเส้น เป้าหมายด้านข้างต้องหมุนกล้องทั้งตัว (รุ่นใหม่อย่าง BF-H190 งอขึ้นได้ถึง 210°) ลวดที่ยืดออกตามการใช้งานทำให้มุมงอลดลง",
  },
  e2: {
    stem: "บนจอภาพ อุปกรณ์ที่สอดผ่าน working channel มักโผล่ที่ตำแหน่ง:",
    options: ["≈3 นาฬิกา", "≈12 นาฬิกา", "≈6 นาฬิกา", "ตรงกลางภาพพอดี"],
    rationale: "การรู้ตำแหน่งที่อุปกรณ์ออก (≈3 นาฬิกา) ช่วยให้หมุนกล้องเตรียมไว้ให้อุปกรณ์ตรงเป้าหมาย",
  },
  e3: {
    stem: "สาเหตุที่พบบ่อยที่สุดและป้องกันได้ทั้งหมดของ working channel เสียหายคืออะไร?",
    options: ["สอด biopsy forceps/เข็มขณะอ้าอยู่หรือไม่อยู่ใน sheath", "ใช้สารหล่อลื่นชนิด water-based", "ทำ white balance ก่อนทุกเคส", "ทำ leak test ก่อนแช่น้ำ"],
    rationale: "ให้อุปกรณ์หุบ/อยู่ใน sheath จนเห็นที่ปลายกล้อง ห้ามฝืน และเก็บเข้า sheath ทุกครั้งก่อนถอน Bite block ป้องกันการซ่อมใหญ่อีกสาเหตุหนึ่ง (การถูกกัด)",
  },
  e4: {
    stem: "การจับคู่ความถี่ใดถูกต้อง?",
    options: ["Convex EBUS 7.5–12 MHz; radial probe ≈20 MHz", "Convex EBUS 20 MHz; radial probe 5 MHz", "ทั้งสอง ≈3.5 MHz", "Convex EBUS 30 MHz; radial 12 MHz"],
    rationale: "ความถี่สูงให้ความละเอียดดีแต่ทะลุได้ตื้น: radial mini-probe (≈20 MHz) ดูรัศมี ~4–5 cm สำหรับรอยโรคส่วนปลาย ส่วน curvilinear EBUS array (5–12 MHz) ดู mediastinal nodes",
  },
  e5: {
    stem: "ก่อนเจาะ node 4R ได้เปิด Doppler (ดังรูป) ขั้นตอนถัดไปที่ดีที่สุดคือ?",
    options: ["ขยับตำแหน่งให้แนวเข็มหลบสัญญาณการไหล แล้วตั้ง stopper ไม่ให้ถึง", "แทงผ่านสัญญาณสี — คือ hilum ของ node", "เลิกทำ EBUS; เก็บตัวอย่าง node นี้ไม่ได้", "ขยาย balloon เต็มที่แล้วแทงแบบไม่เห็น"],
    rationale: "Doppler แยกหลอดเลือด (SVC, azygos, PA) ออกจากเนื้อเยื่อ ให้เลือกช่องที่ไม่มีหลอดเลือดและจำกัดความลึกเข็มด้วย stopper",
  },
  e6: {
    stem: "Radial EBUS ผ่าน guide sheath ให้ภาพดังรูป Probe อยู่ตำแหน่งใดเทียบกับรอยโรค?",
    options: ["อยู่ในรอยโรค (concentric) — เก็บตัวอย่างผ่าน guide sheath", "อยู่ติดรอยโรค (adjacent)", "อยู่ในปอดที่มีอากาศ — ไม่มีรอยโรค", "อยู่ใน pulmonary artery"],
    rationale: "รอยโรค hypoechoic เนื้อเดียวกันล้อมรอบ probe ทั้งหมด บ่งชี้ตำแหน่ง within (concentric) ซึ่งให้ diagnostic yield สูงสุด",
  },
  e7: {
    stem: "ภาพ radial probe เป็น 'snowstorm' สว่างเป็นจุดๆ มี reverberation และไม่มีก้อนชัดเจน แปลผลว่าอย่างไร?",
    options: ["ปอดปกติที่มีอากาศ — probe ไม่ได้อยู่ที่รอยโรค", "Concentric solid lesion", "Pleural effusion", "มีอากาศใน guide sheath — probe เสีย"],
    rationale: "Alveoli ที่มีอากาศสะท้อนคลื่นแรง ให้เปลี่ยนไปยัง subsegment อื่น (ใช้ CT/navigation/fluoroscopy) จนพบลักษณะ solid",
  },
  e8: {
    stem: "บนอุปกรณ์เข็ม EBUS-TBNA ควรตั้ง sheath adjuster ให้:",
    options: ["เห็นปลาย sheath ในภาพ white light พอดีก่อนดันเข็ม", "Sheath อยู่ลึกใน channel 2 cm", "เข็มโผล่จาก sheath ขณะสอด", "Sheath แตะ node"],
    rationale: "ถ้า sheath อยู่ใน channel เข็มอาจทำให้กล้องเสียหายเมื่อดันออก ให้ปรับขณะปลายกล้องตรง",
  },
  e9: {
    stem: "การดูแลกล้องหลังหัตถการ: ควรทำ leak test เมื่อใด?",
    options: ["ก่อนแช่กล้องลงในน้ำยาทั้งหมด", "หลัง high-level disinfection เท่านั้น", "เฉพาะเมื่อสงสัยว่ามีรอยรั่ว", "ไม่ควรทำ — leak test ทำให้กล้องเสีย"],
    rationale: "Leak test ก่อนแช่ป้องกันน้ำเข้ากล้องที่รั่ว ให้งอ bending section ใต้น้ำเพื่อหารอยรั่วเล็กๆ",
  },
  e10: {
    stem: "ภาพ convex EBUS แสดง node ที่มีลักษณะตามรูป ข้อใดเป็นลักษณะ ultrasound ที่บ่งชี้ว่าไม่ใช่มะเร็ง (BENIGN)?",
    options: ["รูปรีและเห็น central hilar structure", "รูปกลม short axis >1 cm", "Coagulation necrosis sign", "Echo ไม่สม่ำเสมอและขอบชัด"],
    rationale: "เกณฑ์ Fujiwara สำหรับมะเร็ง: >1 cm, กลม, ขอบชัด, echo ไม่สม่ำเสมอ, ไม่มี central hilar structure, coagulation necrosis ลักษณะเหล่านี้ช่วยเลือก node แต่ยังต้องได้ชิ้นเนื้อ",
  },
  s1: {
    stem: "ผู้ป่วยรับประทาน clopidogrel สำหรับ peripheral arterial disease นัดทำ TBLB แผนที่ดีที่สุดคือ?",
    options: ["หยุด clopidogrel ≥5–7 วันก่อน (หลังชั่งข้อบ่งชี้)", "ให้ต่อ — clopidogrel ไม่เพิ่มเลือดออก", "หยุด 24 ชั่วโมงก่อน", "เปลี่ยนเป็น warfarin"],
    rationale: "ในการศึกษาของ Ernst และคณะ เลือดออกมากหลัง TBLB เกิด 89% ในผู้ที่ได้ clopidogrel เทียบกับ 3.4% ในกลุ่มควบคุม (100% เมื่อได้ยาสองตัว) ให้หยุด ≥5–7 วัน และห้ามหยุด dual antiplatelet หลังใส่ stent ไม่นานโดยไม่ปรึกษาแพทย์โรคหัวใจ",
  },
  s2: {
    stem: "ผู้ป่วยรับประทาน low-dose aspirin สำหรับ TBLB ควร:",
    options: ["ให้ aspirin ต่อ", "หยุด 7 วัน", "ให้เกล็ดเลือด", "ยกเลิกหัตถการ"],
    rationale: "การศึกษาไปข้างหน้าขนาดใหญ่ (Herth และคณะ) ไม่พบว่า aspirin เพิ่มเลือดออกจาก TBLB",
  },
  s3: {
    stem: "ระหว่าง TBLB ขณะดัน forceps ที่หุบอยู่ ผู้ป่วยบอกว่าเจ็บแปลบที่หน้าอก ขั้นตอนถัดไปคือ?",
    options: ["ถอยกลับ 1–2 cm ก่อนอ้า forceps (ถึง pleura แล้ว)", "อ้าและตัดชิ้นเนื้อทันที", "ดันลึกขึ้นเพื่อให้ได้ชิ้นเนื้อ", "เพิ่ม sedation แล้วทำต่อ"],
    rationale: "อาการเจ็บบ่งชี้ว่าสัมผัส pleura การตัดตรงนี้เสี่ยง pneumothorax (1–6%) ให้ถอยกลับ อ้าขณะหายใจเข้า ดันกลับครึ่งทาง แล้วหุบเมื่อสุดหายใจออก",
  },
  s4: {
    stem: "เลือดออกมากเต็มภาพหลัง TBLB ลำดับใดเหมาะสมที่สุด?",
    options: [
      "คง wedge กล้องพร้อมดูด ฉีด iced saline 20 mL ตามด้วย epinephrine 1:20,000; ให้นอนข้างที่เลือดออกอยู่ล่าง; ใช้ blocker หากยังไม่หยุด",
      "ถอยกล้องกลับไปที่ trachea ทันทีแล้วสังเกต",
      "ให้ผู้ป่วยนั่งตรงและให้ tranexamic acid ทางปาก",
      "ฉีด saline 200 mL เพื่อล้างเลือด",
    ],
    rationale: "Wedge tamponade แยก segment ที่เลือดออกและป้องกันปอดอีกข้าง cold saline และ topical vasoconstrictor หยุดเลือดได้เกือบทั้งหมด bronchial blocker เป็นขั้นตอนช่วยชีวิต",
  },
  s5: {
    stem: "จำนวนเกล็ดเลือดต่ำสุดที่มักใช้ก่อน TBLB คือ:",
    options: ["≈50 ×10⁹/L", "≈10 ×10⁹/L", "≈150 ×10⁹/L", "ไม่ต้องมีเกณฑ์เกล็ดเลือด"],
    rationale: "แพทย์ระบบหายใจส่วนใหญ่ถือว่า ≥50,000/µL เพียงพอสำหรับ TBLB; สำหรับ BAL/การส่องดู อาจยอมรับค่าที่ต่ำกว่าได้",
  },
  s6: {
    stem: "'Golden Rule' ของ TBNA คืออะไร?",
    options: ["ห้ามดันหรือถอน catheter ผ่านกล้องขณะเข็มโผล่อยู่", "ใช้เข็ม 19 G เสมอ", "เก็บตัวอย่างก้อนหลักก่อนเสมอ", "ดูดแรงสุดขณะถอนเข็ม"],
    rationale: "เข็มที่โผล่ทำลาย working channel หากไม่เห็นปลายเข็มก่อนถึงผนัง ให้เก็บเข็มทันที",
  },
  s7: {
    stem: "ก้อน LUL ขนาด T2 มี 4L, 4R และ 7 โต ควรเก็บตัวอย่าง node ใดก่อน?",
    options: ["4R", "4L", "7", "ก้อนหลักที่ LUL"],
    rationale: "สำหรับก้อนด้านซ้าย 4R เป็น contralateral (N3, stage IIIB) ให้เก็บ station ที่ให้ stage สูงสุดก่อน (N3 → N2 → N1) และทำ TBNA ก่อนเก็บตัวอย่างก้อนหลักเพื่อไม่ให้ปนเปื้อน",
  },
  s8: {
    stem: "ระหว่าง BAL ได้น้ำกลับเพียง 15% และมีเลือดปน ปลายกล้องถูกดันแน่นเข้า subsegment สาเหตุที่น่าจะเป็นคือ?",
    options: ["Over-wedging ทำให้เยื่อบุบาดเจ็บและ airway ยุบ", "BAL ปกติใน sarcoidosis", "Lidocaine ไม่เพียงพอ", "น้ำที่ฉีดเย็นเกินไป"],
    rationale: "Over-wedging ทำให้เยื่อบุบาดเจ็บ มีเลือดปน และ recovery ลดลง ยืนยันการ wedge ด้วยการดูดเบาๆ (airway ส่วนปลายยุบเล็กน้อย) และใช้แรงดูดเบาในการเก็บน้ำกลับ",
  },
  s9: {
    stem: "ตัดชิ้นเนื้อรอยโรคชนิด exophytic ภาพแสดงผิวซีดและมีเนื้อตาย เพื่อเพิ่ม yield ควร:",
    options: ["ตัด 3–6 ครั้งที่ตำแหน่งเดิมให้ถึงเนื้อที่ยังมีชีวิต", "ตัดเนื้อตายที่ผิวเพียงครั้งเดียว", "ตัดเยื่อบุปกติข้างรอยโรค", "Brush อย่างเดียว — biopsy เป็นข้อห้าม"],
    rationale: "เนื้อตาย/บวมที่ผิวมักไม่ให้การวินิจฉัย การตัดซ้ำที่ตำแหน่งเดิม เข้าตรงๆ และ ± ใช้เข็มดูดจากแกนกลาง ช่วยเพิ่ม yield (>80%)",
  },
  s10: {
    stem: "ระหว่างทำ flexible bronchoscopy BTS แนะนำให้รักษาระดับ oxygen saturation:",
    options: [">90% (ให้ O₂ เสริมเพื่อลดความเสี่ยง arrhythmia)", ">80%", ">98% ไม่ว่าอย่างไร", "ไม่มีเป้าหมาย — การ monitor เป็นทางเลือก"],
    rationale: "Desaturation เพิ่มโอกาสเกิด arrhythmia ต้องใช้ pulse oximetry เสมอ และให้ O₂ เมื่อ desaturation ต่อเนื่อง",
  },
  g1: {
    stem: "ตาม CHEST guideline ปี 2016 เรื่องเทคนิค EBUS-TBNA ข้อใดถูกต้องเกี่ยวกับเข็ม?",
    options: ["เข็ม 21 G และ 22 G ให้ yield ใกล้เคียงกัน", "ใช้ได้เฉพาะเข็ม 19 G", "ต้องใช้ 25 G สำหรับ staging", "ขนาดเข็มเป็นตัวกำหนดว่าต้องใช้ ROSE"],
    rationale: "ใช้ได้ทั้ง 21 หรือ 22 G; เข็มใหญ่ (19 G) หรืออุปกรณ์ core อาจช่วยในโรคที่ไม่ใช่มะเร็ง/lymphoma",
  },
  g2: {
    stem: "เมื่อไม่มี ROSE จำนวนครั้งที่เจาะต่ำสุดต่อ station ที่แนะนำสำหรับวินิจฉัย/staging NSCLC คือ:",
    options: ["3", "1", "7", "10"],
    rationale: "อย่างน้อยสามครั้งต่อตำแหน่งเมื่อไม่มี ROSE และเจาะเพิ่มสำหรับ molecular testing",
  },
  g3: {
    stem: "เกี่ยวกับการดูด (suction) ระหว่าง EBUS-TBNA:",
    options: ["เก็บตัวอย่างโดยใช้หรือไม่ใช้ suction ก็ได้", "ต้องใช้ suction เสมอ", "Suction ต้องใช้ syringe 60 mL", "Suction เพิ่ม yield สามเท่า"],
    rationale: "ข้อมูลแบบสุ่ม (Casal และคณะ) ไม่พบความแตกต่างของ yield หรือคุณภาพระหว่างใช้และไม่ใช้ suction",
  },
  g4: {
    stem: "BAL พบ lymphocytosis และ CD4/CD8 ratio >4 สนับสนุนโรคใดมากที่สุด?",
    options: ["Sarcoidosis", "Hypersensitivity pneumonitis", "Idiopathic pulmonary fibrosis", "Acute eosinophilic pneumonia"],
    rationale: "BAL lymphocytosis ร่วมกับ CD4/CD8 >4 มีรายงาน PPV ≈94% สำหรับ sarcoidosis ส่วน HP มัก lymphocytosis ร่วมกับ ratio ต่ำ (<1)",
  },
  g5: {
    stem: "เกณฑ์ quantitative BAL ที่มักใช้วินิจฉัย VAP คือ:",
    options: ["≥10⁴ cfu/mL", "≥10² cfu/mL", "≥10⁶ cfu/mL", "พบเชื้อขึ้นเท่าใดก็ได้"],
    rationale: "BAL ≥10⁴ cfu/mL (PSB ≥10³ cfu/mL); ควรเก็บก่อนหรือภายใน 48 ชม. หลังเริ่มยาปฏิชีวนะ",
  },
  g6: {
    stem: "สถานการณ์ใดที่ flexible bronchoscopy มีประโยชน์น้อยที่สุด?",
    options: ["Pleural effusion เดี่ยวๆ ไม่มีความผิดปกติอื่น", "Infiltrate เป็นซ้ำใน segment เดิม", "Haemoptysis ในผู้สูบบุหรี่อายุ 60 ปี", "Lobar atelectasis"],
    rationale: "Bronchoscopy ช่วยได้น้อยใน isolated effusion, uncomplicated pneumonia หรือไอเรื้อรังในคนอายุน้อยที่ไม่สูบบุหรี่และ CXR ปกติ",
  },
  g7: {
    stem: "สำหรับ invasive mediastinal staging ในผู้ที่สงสัย NSCLC และมี mediastinal nodes ผิดปกติ แนวทางปัจจุบันแนะนำ:",
    options: ["Needle techniques (EBUS ± EUS) เป็นการตรวจแรกก่อน surgical staging", "ทำ mediastinoscopy ก่อนในผู้ป่วยทุกราย", "PET-CT อย่างเดียวเพียงพอ", "Thoracotomy พร้อม nodal dissection"],
    rationale: "CHEST 2013 และ ESGE/ERS/ESTS 2015 แนะนำ endosonography ก่อน และทำ surgical staging หากผลลบแต่ยังสงสัยสูง",
  },
  g8: {
    stem: "EBUS-TBNA ที่ 4R และ 7 ให้ผล non-diagnostic แต่ยังสงสัย N2 สูง ขั้นตอนถัดไปคือ?",
    options: ["Surgical staging (เช่น mediastinoscopy)", "ทำ lobectomy เลย", "ตรวจ CT ซ้ำใน 6 เดือน", "ถือว่า mediastinum ผลลบ"],
    rationale: "TBNA ไม่มี NPV 100% — ควรรายงานว่า 'non-diagnostic' แทน 'negative' และยืนยันด้วยการผ่าตัดเมื่อยังสงสัย",
  },
  g9: {
    stem: "หลัง acute myocardial infarction ควรเลื่อน elective bronchoscopy ออกไปอย่างน้อย:",
    options: ["4–6 สัปดาห์", "48 ชั่วโมง", "1 สัปดาห์", "6 เดือน"],
    rationale: "MI ที่เพิ่งเกิดเป็นข้อห้ามสัมพัทธ์ BTS แนะนำให้เลื่อนหัตถการ elective หลายสัปดาห์หลัง MI",
  },
  g10: {
    stem: "ผู้ป่วยที่ไตทำงานปกติและได้รับ apixaban ระยะเวลาหยุดยาก่อน TBLB ที่ใช้ทั่วไปคือ:",
    options: ["24–48 ชั่วโมง", "1 ชั่วโมง", "7 วัน", "ไม่จำเป็นต้องหยุด"],
    rationale: "DOACs มักหยุด 24–48 ชม. ก่อนหัตถการ invasive และนานขึ้น (ถึง ~5 วัน) หากไต/ตับบกพร่องหรือหัตถการเสี่ยงเลือดออกสูง",
  },
};
