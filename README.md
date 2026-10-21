# BronchoSim — Interactive Bronchoscopy & Interventional Pulmonology Training

A browser-based training suite for flexible bronchoscopy, built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · React Three Fiber · Zustand**.

## Modules

| Route | Module |
| --- | --- |
| `/anatomy` | Airway atlas: raymarched endoscopic view (trachea → B1–B10) with clickable orifices, a 3D extraluminal map with IASLC lymph node stations and great vessels, larynx diagram, Boyden ↔ Jackson–Huber table |
| `/simulator` | Virtual bronchoscopy: tip flexion (+180°/−130°), rotation, advance/withdraw, wall-contact detection, wedging; free mode, scored navigation & identification tasks |
| `/equipment` | Flexible bronchoscope, convex-probe EBUS (balloon, needle stopper, Doppler, live generated sonogram), radial-probe EBUS with guide sheath (concentric / eccentric / adjacent patterns) |
| `/guidelines` | Indications & contraindications matrix, antithrombotic holding windows, ASA classes, interactive pre-procedural risk checklist |
| `/procedures/[id]` | BW, BAL, brushing, EBBx, TBLB, TBNA/EBUS-TBNA: step-by-step workflow, tips & complications checklist, scored mini-simulation |
| `/quiz` | 40 vignette MCQs (anatomy, equipment, safety, guidelines) with simulated endoscopic stills and generated EBUS images |
| `/dashboard` | Performance across quiz domains, simulator tasks and procedure sims (stored in `localStorage`) |

All imagery is generated procedurally (GLSL raymarching for the airway, canvas speckle synthesis for ultrasound) — no copyrighted figures are included.

### Anatomical and equipment references
- Airway branching and the orientation of the standard views were calibrated against the Olympus *Nomenclature and Anatomy of the Bronchial Tree* poster, the Lausanne Bronchoscopy Atlas (normal anatomy) and the VUmc *Segmental anatomy and bronchoscopy* video. The views were compared side by side; no images were copied.
- Instrument specifications come from the Olympus BF-190 series operation manual, the EBUS-TBNA brochure (BF-UC190F, ViziShot needles) and the BF-UCP190F brochure.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

### Project layout

```
app/                    routes
components/airway       endoscope shader + view, 3D map, minimap
components/simulator    simulator UI
components/imaging      convex & radial ultrasound synthesis
components/procedures   workflows + mini-simulations
components/ui           shared UI primitives
lib/airway              tree geometry (SDF), scope kinematics
lib/data                medical content (airway, mediastinum, equipment, guidelines, procedures, quiz, references)
lib/store               persisted progress (Zustand)
```

## Sources & disclaimer

Content is paraphrased from Ernst A (ed.), *Introduction to Bronchoscopy*, 2nd ed. (Cambridge University Press, 2017) and BTS 2013, CHEST 2013/2016, ATS 2012, IASLC 2009 and ESGE/ERS/ESTS 2015 guidance — full list at `/references`.
**Educational use only.** Not medical advice and not a substitute for supervised training or local protocols. The anatomical model is schematic.
