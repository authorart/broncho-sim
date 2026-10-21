# BronchoSim — Task Tracker

Spec: `broncho-sim-prompt.md` · Primary reference: Ernst A. (ed.) *Introduction to Bronchoscopy*, 2nd ed., Cambridge University Press, 2017 (local only, never committed).

## Decisions (grilling round 1 — all recommended options accepted)
| # | Decision | Choice |
|---|----------|--------|
| Q1 | Language | English only (content isolated in `/lib/data` for later i18n) |
| Q2 | Scope | All 5 modules + simulator, each functional |
| Q3 | Rendering | React Three Fiber 3D: procedural airway tree (trachea → B1–B10), endoscopic fly-through + extraluminal map with IASLC stations |
| Q4 | Images | Procedurally generated (canvas/SVG); CC-licensed only if needed, with attribution |
| Q5 | Content | Paraphrased from the textbook + current guidelines, cited; educational disclaimer; `references/` git-ignored |
| Q6 | Repo | Public `authorart/broncho-sim` |
| Q7 | Deploy | Vercel CLI via `npx vercel` (user runs `! npx vercel login` once) |
| Q8 | Persistence | localStorage via Zustand `persist`; no backend/auth |
| Q9 | Simulator | Free exploration + Task Mode (time, wall contacts, segment ID) feeding dashboard |
| Q10 | Quiz | ~40 vignette MCQs across anatomy / equipment / procedural safety / guidelines |

## Tasks
- [x] Grilling session & decisions
- [x] Extract reference text from the textbook PDF
- [x] Scaffold Next.js (App Router, TS, Tailwind, ESLint) + deps (R3F, drei, three, zustand, lucide-react)
- [x] App shell: dark clinical workstation theme, nav, disclaimer, home dashboard
- [x] `/lib/data`: airway tree, lymph node stations, equipment, guidelines, procedures, quiz bank, references
- [x] `/anatomy`: endoscopic view + 3D extraluminal map, landmark annotations
- [x] `/equipment`: flexible bronchoscope, CP-EBUS, RP-EBUS interactive callouts
- [x] `/guidelines`: indications/contraindications matrix + pre-procedure risk checklist
- [x] `/procedures`: BW, BAL, BB, EBBx, TBLB, TBNA/EBUS-TBNA — steps, tips/complications, mini-sim
- [x] `/simulator`: scope controls, free mode, task mode + scoring
- [x] `/quiz`: MCQ engine, rationale + citations, generated images, performance dashboard
- [x] `npm run build` + lint clean
- [x] git init, `.gitignore` (incl. `references/`), create public GitHub repo, push
- [x] Deploy to Vercel, verify live URL — https://broncho-sim.vercel.app

## Notes
- Next.js 16.4 / React 19 / Tailwind 4 / R3F 9 / drei 10 / Zustand 5. `cacheComponents` disabled (static app; avoids hidden WebGL contexts).
- Endoscopic view = raymarched SDF of tapered capsules (see `docs/adr/0001-sdf-raymarched-endoscopic-view.md`).
- Verified: eslint + tsc clean, `next build` static (18 pages), headless Chrome screenshots of every route with no console errors.

## Round 2 — realism fixes (user feedback: anatomy views and equipment not realistic)
- [x] Study new references: Olympus anatomy poster, BF-190 manual, EBUS-TBNA and BF-UCP190F brochures, bronchoscopyatlas.ch normal anatomy (28 photos), VUmc segmental anatomy video (≈50 annotated frames)
- [x] Rebuild airway tree: B6 at RML level, B7 medial-first, B9+10 common trunks, left B7+8, a/b/c subsegments
- [x] Endoscopic rendering: octagonal Olympus frame, salmon wet mucosa, capillaries, pale rings, striated membranous wall, sharper spurs, hue-preserving exposure
- [x] Standard views calibrated to the poster orientations (shared by atlas, simulator, quiz)
- [x] Scope physics: BF-H190 tip (5.5 mm), 210°/130° angulation, jam-based wedging at subsegmental level
- [x] Equipment redrawn from the manual/brochures: BF-190 control section and rotation ring, model specs; BF-UC190F / UCP190F tip (UP-facing transducer, oblique optics, 65° sector), ViziShot needle handle; radial EBUS set-up
- [x] Build, verify, commit, deploy
