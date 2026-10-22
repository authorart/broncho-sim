/** Thai overlays for equipment content (technical terms and part names stay in English). */

type PartTh = { summary: string; details: string[]; pitfall?: string };

export const TH_DEVICES: Record<string, { tagline: string; parts: Record<string, PartTh> }> = {
  flexible: {
    tagline: "จับ control section ในแนวตั้งด้วยมือซ้าย ใช้มือขวาประคอง insertion tube ที่ปากหรือจมูก",
    parts: {
      lever: {
        summary: "ใช้นิ้วโป้งซ้ายควบคุม ดันไปทาง \"U\" ปลายกล้องงอขึ้น ดันไปทาง \"D\" ปลายกล้องงอลง — งอได้ระนาบเดียว",
        details: [
          "BF-H190 / Q190 / P190 / XP190: UP 210°, DOWN 130°; BF-1TH190: UP 180°, DOWN 130°",
          "เป้าหมายด้านซ้าย/ขวาต้องเข้าถึงโดยหมุนกล้อง (rotation ring หรือหมุนทั้งตัวกล้อง) แล้วจึงงอปลาย",
          "คืน lever ให้อยู่ตำแหน่งกลางก่อนถอยกล้องหรือผ่าน vocal cords",
        ],
        pitfall: "ห้ามฝืนงอปลายขณะมีอุปกรณ์ยื่นออกจาก channel — ทำให้ channel และ airway บาดเจ็บได้",
      },
      switches: {
        summary: "ตั้งค่าได้ที่ CV-190 video system center: freeze / release, บันทึกภาพ, NBI, zoom, ปรับความสว่าง",
        details: ["ทำ white balance ก่อนทุกหัตถการ", "NBI ช่วยเน้น submucosal vessels (dysplasia, early tumour)"],
      },
      suction: {
        summary: "อยู่ใน suction cylinder ด้านบนของ control section ใช้นิ้วชี้กดเพื่อดูดผ่าน instrument channel",
        details: [
          "ใช้ล้างของเหลวหรือเศษที่ติดหน้า objective lens ได้ด้วย",
          "หลีกเลี่ยงการดูดขณะปลายกล้องแนบเยื่อบุ — ทำให้เกิดการบาดเจ็บและเลือดออก",
          "ลดการดูดใน upper airway ก่อนทำ BAL (ปนเปื้อน และ cellular yield ลดลง)",
        ],
      },
      port: {
        summary: "อยู่ด้านหน้า control section: อุปกรณ์ หลอดฉีด saline และเข็ม EBUS ใส่ผ่านจุดนี้ แถบสี (color code) บอกความเข้ากันได้ของอุปกรณ์",
        details: [
          "Color code: สีน้ำเงิน = BF-Q190/H190/P190; สีเหลือง = BF-1TH190; สีขาว = BF-XP190",
          "Channel มีสามหน้าที่: ผ่านอุปกรณ์, ดูด และฉีดของเหลว",
          "สอดอุปกรณ์ในสภาพปิด/อยู่ใน sheath จนกว่าจะเห็นที่ปลายกล้อง",
        ],
        pitfall: "Forceps ที่อ้าอยู่หรือเข็มที่โผล่ใน channel เป็นสาเหตุที่พบบ่อยที่สุด (และป้องกันได้) ของ channel เสียหาย",
      },
      ring: {
        summary: "หมุน insertion tube ได้ถึง 120° ทั้งซ้ายและขวาเทียบกับ control section ช่วยลดการบิดข้อมือ",
        details: [
          "UP indication บน insertion tube บอกทิศการงอ; ตรงกับเครื่องหมายบน control section เมื่ออยู่ตำแหน่งกลาง",
          "การหมุนกล้องทำให้ภาพหมุนตาม — จึงเป็นเหตุที่ภาพมาตรฐานของปอดขวาใน atlas มักดูหมุนไป",
        ],
      },
      boot: { summary: "ปกป้องรอยต่อระหว่าง insertion tube และ control section จากการหักงอแรง", details: ["รักษา insertion tube ให้ตรงระหว่างมือกับปาก เพื่อส่งแรงหมุนไปถึงปลายกล้อง"] },
      insertion: {
        summary: "ท่ออ่อน (BF-H190: Ø 5.1 mm, working length 600 mm) ภายในมี channel, light guides, angulation wires และ image cable",
        details: ["ใช้ bite block ทุกครั้งเมื่อสอดทางปาก — การถูกกัดเป็นสาเหตุซ่อมราคาแพงที่พบบ่อย", "ใช้สารหล่อลื่นชนิด water-based เท่านั้น"],
      },
      bending: { summary: "ส่วนปลายที่งอได้ด้วย angulation wires ความโค้งเปลี่ยนตาม lever แบบ real time", details: ["Follow-the-leader: เมื่อดันกล้องขณะงอปลาย ลำกล้องจะเลี้ยวตามทิศใหม่"] },
      tip: {
        summary: "Objective lens, light-guide lens สองตัว และ instrument channel outlet (BF-H190 Ø 5.5 mm)",
        details: [
          "Field of view 120° และ depth of field 3–100 mm (กล้องเล็ก P190/XP190: 110°, 2–50 mm)",
          "ภาพเป็นรูปแปดเหลี่ยม; อุปกรณ์จะโผล่จากขอบขวา (≈3 นาฬิกา)",
          "แสงจากปลายกล้องทำให้เนื้อเยื่อร้อนได้ถ้าส่องใกล้นานๆ",
        ],
      },
      cord: {
        summary: "นำแสงและสัญญาณภาพไปยัง CV-190 / CLV-190 (light guide prong, electrical contacts, venting connector สำหรับ leak test)",
        details: ["Connector มี RFID scope ID และ memory chip ที่ processor อ่านได้", "ใส่ sterilisation cap เฉพาะตอนอบแก๊สหรือขนส่ง — ถอดออกก่อนแช่น้ำ"],
      },
    },
  },
  cpebus: {
    tagline: "Curved linear transducer ที่ปลายกล้องสแกนขนานกับแกนกล้อง: เจาะดูดด้วยเข็มแบบ real time ต่อ nodes นอกผนัง airway",
    parts: {
      transducer: {
        summary: "Electronic convex array ที่ปลายสุด สแกนเป็นรูปพัด 65° ขนานกับทิศการสอด ที่ 5–12 MHz",
        details: [
          "ภาพแสดงเป็นรูปพัดโดยมี transducer อยู่ด้านบนของจอ",
          "กด transducer แนบผนัง (หรือใช้ balloon) เพื่อให้คลื่นผ่านได้ดี",
          "ใช้ H-FLOW/eFLOW Doppler แยก vessels ออกจาก nodes ก่อนเจาะทุกครั้ง",
        ],
      },
      balloon: {
        summary: "Balloon บรรจุน้ำ (MAJ-1351) คลุม transducer ช่วยให้แนบผนังได้ดีขึ้นเมื่อผนังไม่เรียบหรือมี cartilage ทับ (เฉพาะ BF-UC190F)",
        details: ["เติมน้ำปราศจากฟองอากาศผ่าน balloon channel outlet; ตรวจว่าไม่มีฟองอากาศ", "BF-UCP190F ออกแบบให้ใช้ได้โดยไม่ต้องมี balloon"],
      },
      optics: {
        summary: "Objective lens และ light guide อยู่บนส่วนลาดด้านหลัง transducer: field of view 80° มองเฉียงไปด้านหน้า 20° (BF-UCP190F: 14°)",
        details: [
          "ถ้าต้องการมองตรงไปด้านหน้า ให้งอปลายลงเล็กน้อย — ภาพ white light เบี่ยงจากแกนกล้อง",
          "การผ่าน vocal cords และการบังคับกล้องจะรู้สึกต่างจากกล้องปกติ; ส่วนปลายที่แข็ง 25 mm จำกัดการเข้าถึงส่วนปลาย",
        ],
      },
      channel: {
        summary: "Channel 2.2 mm (BF-UCP190F 1.7 mm) ออกมาเป็นมุมเฉียง ทำให้เข็มวิ่งอยู่ในระนาบของ ultrasound",
        details: ["ใส่เข็มขณะปลายกล้องตรง; หลังใส่เข็มแล้วปลายกล้องจะงอได้ยากขึ้น", "Angulation: BF-UC190F UP 160° / DOWN 70°; BF-UCP190F UP 170° / DOWN 70°"],
      },
      sheath: {
        summary: "ปรับระยะที่ sheath ของเข็มยื่นออกมา ให้เห็นปลาย sheath ที่ขอบภาพ white light พอดี",
        details: ["ถ้า sheath อยู่ใน channel → เข็มอาจทะลุ channel เมื่อดันออก", "ถ้า sheath ยาวเกิน → บังภาพและเสียระยะเข็ม"],
      },
      stopper: {
        summary: "ล็อกระยะเข็มสูงสุด (20–40 mm) ตามระยะที่วัดได้ถึงผนังด้านไกลของ node",
        details: ["ตั้ง stopper ให้สั้นกว่า vessel ที่อยู่หลัง node", "ViziShot 2: ปลายเข็มคมขึ้นและด้ามจับถนัดมือ; รุ่น 19 G FLEX สำหรับ core sample"],
      },
      stylet: { summary: "ป้องกันชิ้นเนื้อผนัง bronchus อุดรูเข็มขณะเจาะ; ดึงออกเมื่อเข็มอยู่ใน node แล้ว", details: ["ใส่กลับหรือใช้ลม/stylet ดันตัวอย่างลงสไลด์และ cell-block medium"] },
      syringe: {
        summary: "ต่อเข้ากับ side port ของเข็มหลังถอด stylet เพื่อดูดขณะขยับเข็ม (agitation)",
        details: ["การดูดเป็นทางเลือก — slow-pull capillary sampling ให้ yield ใกล้เคียงกัน (CHEST 2016)", "ปล่อย suction ก่อนดึงเข็มกลับเข้า sheath"],
      },
    },
  },
  rpebus: {
    tagline: "Mechanical mini-probe 360° สอดผ่าน channel ของกล้องเล็กเพื่อยืนยันรอยโรคส่วนปลายก่อนเก็บตัวอย่างผ่าน guide sheath",
    parts: {
      probe: {
        summary: "Transducer หมุน 20 MHz (≈1.4 mm) ขับด้วย probe driving unit ให้ภาพระนาบ 360° ตั้งฉากกับ probe",
        details: [
          "ปอดที่มีอากาศ = 'snowstorm' สว่างพร้อม reverberation; solid lesion = บริเวณเนื้อเดียวกันสีเข้มกว่าและขอบสว่างคม",
          "ต่อกับ EU-ME3 ผ่าน probe driving unit; ไม่เห็นเข็มแบบ real time — ยืนยันตำแหน่งก่อน แล้วจึงเก็บตัวอย่าง",
        ],
      },
      scope: {
        summary: "มักใช้กล้องเล็กกลุ่ม BF-P190 (Ø 4.2 mm, channel 2.0 mm) wedge ใน segmental bronchus ที่นำไปสู่รอยโรค",
        details: ["วางแผนเส้นทาง bronchus จาก CT (bronchus sign) หรือ navigation software", "ตรึงปลายกล้องไว้เมื่อ probe อยู่ในตำแหน่งแล้ว"],
      },
      gs: {
        summary: "ท่อบางที่ครอบ probe; เมื่อพบรอยโรคจะถอด probe ออกและคง sheath ไว้เป็น extended working channel",
        details: ["Brush, forceps และเข็มผ่าน GS ไปยังตำแหน่งเดิม; ใช้ fluoroscopy ยืนยันว่าไม่เลื่อน", "ล็อก GS ที่ biopsy port ขณะเปลี่ยนอุปกรณ์"],
      },
      patterns: {
        summary: "Within (concentric) → probe ถูกรอยโรคล้อมรอบ; eccentric → อยู่ในรอยโรคแต่ไม่อยู่กลาง; adjacent → แตะขอบรอยโรคเท่านั้น",
        details: [
          "ตำแหน่ง within-lesion ให้ yield สูงกว่า adjacent ราวเท่าตัว (≈83% vs ≈61%; concentric ≈84% vs eccentric ≈48% ในบางการศึกษา)",
          "Adjacent/eccentric: ลองเข้า subsegment อื่น เพิ่ม TBNA หรือ cryobiopsy หรือใช้ navigation",
        ],
      },
      fluoro: { summary: "ยืนยันว่าปลาย GS ทับรอยโรค และตรวจระยะถึง pleura ก่อนทำ forceps biopsy", details: ["ให้อุปกรณ์ห่างจาก pleura ~1–2 cm; ตรวจ pneumothorax เมื่อจบหัตถการ"] },
    },
  },
};

export const TH_SCOPE_USE: Record<string, string> = {
  "BF-H190": "กล้องวินิจฉัยมาตรฐานความละเอียดสูง (HD)",
  "BF-Q190": "กล้องมาตรฐานขนาดเล็กลง",
  "BF-1TH190": "กล้องสำหรับรักษา (channel ใหญ่)",
  "BF-P190": "กล้องเล็กสำหรับรอยโรคส่วนปลาย / radial EBUS",
  "BF-XP190": "กล้องขนาดเล็กพิเศษ (ultrathin)",
};

export const TH_EBUS_NOTE: Record<string, string> = {
  "BF-UC190F": "Linear EBUS รุ่นที่ 3; ส่วนปลายแข็ง 25 mm; มุมเจาะชันกว่ารุ่นก่อน 5°; ใช้เข็ม 19/21/22/25 G ได้",
  "BF-UCP190F": "Linear EBUS ขนาดเล็กเพื่อเข้าถึง segmental / subsegmental; ส่วนปลายสั้นกว่า ไม่ต้องใช้ balloon; ใช้กับเข็ม 25 G",
};

export const TH_NEEDLE_USE: Record<string, string> = {
  "19 G": "ข้อบ่งชี้ทั้ง FNA และ FNB; ได้ชิ้นเนื้อ histology สำหรับ sarcoidosis, lymphoma และ molecular testing; yield สูงกว่า 22 G ใน conventional TBNA (Schenk)",
  "21 G": "มาตรฐานสำหรับ EBUS-TBNA; yield เทียบเท่า 22 G สำหรับมะเร็ง (CHEST 2016)",
  "22 G": "มาตรฐานสำหรับ EBUS-TBNA / cytology; ยืดหยุ่นในตำแหน่งที่ต้องงอมาก",
  "25 G": "ยืดหยุ่นที่สุด; node เล็กหรือมุมยาก, BF-UCP190F; เลือดปนน้อยแต่ได้เนื้อเยื่อน้อย",
};

export const TH_SPEC_LABEL: Record<string, string> = {
  "Field of view": "Field of view (มุมมอง)",
  "Depth of field": "Depth of field (ระยะชัด)",
  "Distal end OD": "เส้นผ่านศูนย์กลางปลายกล้อง",
  "Insertion tube OD": "เส้นผ่านศูนย์กลาง insertion tube",
  "Channel inner diameter": "เส้นผ่านศูนย์กลางภายใน channel",
  Angulation: "มุมงอปลาย (angulation)",
  "Working length": "Working length (ความยาวใช้งาน)",
  "Direction of view": "ทิศทางการมอง",
  "Insertion-tube rotation ring": "Rotation ring",
  "Accessory enters the image": "ตำแหน่งที่อุปกรณ์โผล่ในภาพ",
  "Minimum visible distance": "ระยะมองเห็นใกล้สุด",
  Balloon: "Balloon",
  "Scanning method": "วิธีสแกน",
  "Scanning direction": "ทิศการสแกน",
  Frequency: "ความถี่",
  "Scanning range": "ช่วงการสแกน",
  Contact: "การสัมผัสผนัง",
  Processors: "เครื่องประมวลผล",
  Probe: "Probe",
  Image: "ภาพ",
  Penetration: "ความลึกที่คลื่นทะลุถึง",
  Scope: "กล้อง",
  "Guide sheath": "Guide sheath",
  Processor: "เครื่องประมวลผล",
  "Pooled yield": "Pooled yield",
};
