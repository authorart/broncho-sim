export type Reference = {
  id: string;
  short: string;
  citation: string;
  url?: string;
};

/**
 * Bibliography. Content throughout BronchoSim is paraphrased from these sources;
 * nothing is reproduced verbatim. Items reference these ids via `refs: [...]`.
 */
export const REFERENCES: Reference[] = [
  {
    id: "ERNST",
    short: "Ernst 2017",
    citation:
      "Ernst A, ed. Introduction to Bronchoscopy. 2nd ed. Cambridge University Press; 2017 (ch. 4 Airway anatomy, ch. 6 Bronchoscope, ch. 8 Indications, ch. 9 BW/BAL/brush/EBBx, ch. 10 TBLB, ch. 11 TBNA, ch. 13 EBUS).",
  },
  {
    id: "BTS2013",
    short: "BTS 2013",
    citation:
      "Du Rand IA, Blaikley J, Booton R, et al. British Thoracic Society guideline for diagnostic flexible bronchoscopy in adults. Thorax. 2013;68(Suppl 1):i1–i44.",
    url: "https://doi.org/10.1136/thoraxjnl-2013-203618",
  },
  {
    id: "CHEST-EBUS2016",
    short: "CHEST 2016",
    citation:
      "Wahidi MM, Herth F, Yasufuku K, et al. Technical aspects of endobronchial ultrasound-guided transbronchial needle aspiration: CHEST guideline and expert panel report. Chest. 2016;149(3):816–835.",
    url: "https://doi.org/10.1378/chest.15-1216",
  },
  {
    id: "CHEST-LC2013",
    short: "CHEST 2013",
    citation:
      "Silvestri GA, Gonzalez AV, Jantz MA, et al. Methods for staging non-small cell lung cancer: Diagnosis and management of lung cancer, 3rd ed: ACCP evidence-based clinical practice guidelines. Chest. 2013;143(5 Suppl):e211S–e250S.",
    url: "https://doi.org/10.1378/chest.12-2355",
  },
  {
    id: "RIVERA2013",
    short: "Rivera 2013",
    citation:
      "Rivera MP, Mehta AC, Wahidi MM. Establishing the diagnosis of lung cancer: ACCP evidence-based clinical practice guidelines. Chest. 2013;143(5 Suppl):e142S–e165S.",
    url: "https://doi.org/10.1378/chest.12-2353",
  },
  {
    id: "ATS-BAL2012",
    short: "ATS 2012",
    citation:
      "Meyer KC, Raghu G, Baughman RP, et al. An official ATS clinical practice guideline: the clinical utility of bronchoalveolar lavage cellular analysis in interstitial lung disease. Am J Respir Crit Care Med. 2012;185(9):1004–1014.",
    url: "https://doi.org/10.1164/rccm.201202-0320ST",
  },
  {
    id: "IASLC2009",
    short: "IASLC 2009",
    citation:
      "Rusch VW, Asamura H, Watanabe H, et al. The IASLC lung cancer staging project: a proposal for a new international lymph node map. J Thorac Oncol. 2009;4(5):568–577.",
    url: "https://doi.org/10.1097/JTO.0b013e3181a0d82e",
  },
  {
    id: "ESGE-ERS2015",
    short: "ESGE/ERS/ESTS 2015",
    citation:
      "Vilmann P, Clementsen PF, Colella S, et al. Combined endobronchial and esophageal endosonography for the diagnosis and staging of lung cancer: ESGE guideline in cooperation with ERS and ESTS. Eur Respir J. 2015;46(1):40–60.",
    url: "https://doi.org/10.1183/09031936.00064515",
  },
  {
    id: "ALI2017",
    short: "Ali 2017",
    citation:
      "Ali MS, Trick W, Mba BI, et al. Radial endobronchial ultrasound for the diagnosis of peripheral pulmonary lesions: a systematic review and meta-analysis. Respirology. 2017;22(3):443–453.",
    url: "https://doi.org/10.1111/resp.12980",
  },
  {
    id: "KURIMOTO2004",
    short: "Kurimoto 2004",
    citation:
      "Kurimoto N, Miyazawa T, Okimasa S, et al. Endobronchial ultrasonography using a guide sheath increases the ability to diagnose peripheral pulmonary lesions endoscopically. Chest. 2004;126(3):959–965.",
    url: "https://doi.org/10.1378/chest.126.3.959",
  },
  {
    id: "FUJIWARA2010",
    short: "Fujiwara 2010",
    citation:
      "Fujiwara T, Yasufuku K, Nakajima T, et al. The utility of sonographic features during EBUS-TBNA for lymph node staging in patients with lung cancer: a standard endobronchial ultrasound image classification system. Chest. 2010;138(3):641–647.",
    url: "https://doi.org/10.1378/chest.09-2006",
  },
  {
    id: "ABUQAYYAS2017",
    short: "Abuqayyas 2017",
    citation:
      "Abuqayyas S, Raju S, Bartholomew JR, et al. Management of antithrombotic agents in patients undergoing flexible bronchoscopy. Eur Respir Rev. 2017;26(145):170001.",
    url: "https://doi.org/10.1183/16000617.0001-2017",
  },
  {
    id: "ASA",
    short: "ASA PS",
    citation:
      "American Society of Anesthesiologists. ASA Physical Status Classification System (last amended 2020).",
    url: "https://www.asahq.org/standards-and-practice-parameters/statement-on-asa-physical-status-classification-system",
  },
  {
    id: "HERTH2002",
    short: "Herth 2002",
    citation:
      "Herth FJ, Becker HD, Ernst A. Aspirin does not increase bleeding complications after transbronchial biopsy. Chest. 2002;122(4):1461–1464.",
    url: "https://doi.org/10.1378/chest.122.4.1461",
  },
  {
    id: "ERNST2006",
    short: "Ernst 2006",
    citation:
      "Ernst A, Eberhardt R, Wahidi M, Becker HD, Herth FJ. Effect of routine clopidogrel use on bleeding complications after transbronchial biopsy in humans. Chest. 2006;129(3):734–737.",
    url: "https://doi.org/10.1378/chest.129.3.734",
  },
];

export const REF_BY_ID: Record<string, Reference> = Object.fromEntries(
  REFERENCES.map((r) => [r.id, r]),
);
