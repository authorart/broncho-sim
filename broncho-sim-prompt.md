# Role & Clinical Objective
You are an expert Interventional Pulmonologist and full-stack software engineer. Your task is to build a modern, high-fidelity, interactive web-based simulator and training suite: **"BronchoSim: Interactive Bronchoscopy & Interventional Pulmonology Training Platform"**.

The application must be production-ready, fully responsive, and deployable seamlessly to Vercel via GitHub (Next.js 14+ App Router, TypeScript, Tailwind CSS, Lucide Icons, and Three.js / React Three Fiber for interactive 3D simulations).

---

## Technical Stack & Architecture
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui component patterns
- **3D Graphics & Simulation**: Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`) or canvas-based vector procedural rendering for airway navigation
- **State Management**: Zustand (for scope controls, camera position, procedure tracking, and quiz scoring)
- **Deployment**: Vercel-ready (zero-config static/edge deployment, clean ESLint/TypeScript builds)

---

## Core Functional Modules to Implement

### 1. Interactive Airway Anatomy Atlas (Tracheobronchial Tree)
- Dynamic visualization of normal anatomy from vocal cords/subglottis down to subsegmental bronchi (Boyden classification: B1–B10 bilaterally).
- Interactive toggle modes:
  - **Endoscopic View**: Realistic intraluminal perspective with mucosal vascularity, cartilaginous rings, and carina landmarks.
  - **Extraluminal / 3D Anatomical Map**: 3D branch model showing spatial relations to mediastinal lymph node stations (IASLC stations: 2R/2L, 4R/4L, 7, 10R/10L, 11R/11L, etc.).
- Hover/Click annotations highlighting anatomical landmarks, physiological variations, and common pitfalls.

### 2. Endoscope & Tool Anatomy Interactive Guide
- Explorable models/diagrams with interactive callouts for:
  - **Standard Flexible Video Bronchoscope**: Control body, thumb deflection lever (up/down flex angles), suction valve, biopsy port/working channel, light guide, distal tip lens & nozzle.
  - **Convex-Probe EBUS (CP-EBUS)**: Curved ultrasound transducer, balloon cuff, working channel angle (oblique 35-45° exit), Doppler/gain controls, dedicated EBUS-TBNA needle mechanism (sheath adjuster, needle stopper, vacutainer lock).
  - **Radial Probe EBUS (RP-EBUS)**: 360° mechanical rotating mini-probe (20 MHz), guide sheath (GS) technique, fluoroscopy correlation, acoustic signal patterns (concentric vs. eccentric vs. adjacent).

### 3. Clinical Guidelines & Decision-Support Hub
- **Indications & Contraindications Matrix**:
  - Diagnostic vs. Therapeutic indications.
  - Absolute vs. Relative contraindications (e.g., refractory hypoxemia, severe hemodynamic instability, malignant arrhythmias, uncorrected coagulopathy, recent MI, severe pulmonary hypertension).
  - Pre-procedural risk checklist (platelet count, INR, anticoagulants/antiplatelet cessation windows, ASA physical status).

### 4. Interactive Procedural Simulators & Virtual Step-by-Step Trainer
Each procedure must feature a "Step-by-Step Interactive Workflow", "Tips & Complications Checklist", and a mini-simulation interaction:
1. **Bronchial Washing (BW)**:
   - Target selection, instillation of sterile saline (5–20 mL), gentle wall suction recovery, diagnostic yields for microbiology vs. cytology.
2. **Bronchoalveolar Lavage (BAL)**:
   - Wedge position confirmation (avoiding trauma or incomplete seal), volume instillation (typically 100–150 mL in aliquots), recovery fraction targets, cell differential handling.
3. **Endobronchial Brush / Bronchial Cytology (BB)**:
   - Sheathed advancement, brushing under direct vision, withdrawing brush into sheath prior to scope removal.
4. **Endobronchial Biopsy (EBBx)**:
   - Forceps orientation perpendicular to tumor/mucosal lesion, avoiding cartilage biting, hemostasis protocol (cold saline, topical epinephrine 1:10,000/1:20,000, balloon tamponade principles).
5. **Transbronchial Lung Biopsy (TBLB)**:
   - Fluoroscopic/RP-EBUS correlation, distance to pleura (1–2 cm margin), respiratory cycle timing (fire/bite on expiration), pneumothorax and hemorrhage mitigation.
6. **Transbronchial Needle Aspiration (Conventional TBNA & CP-EBUS-TBNA)**:
   - Needle selection (19G vs. 21G vs. 22G vs. 25G).
   - "Jabbing" vs. "Piggyback" vs. "Cough" technique.
   - ROSE (Rapid On-Site Evaluation) integration and needle cytology prep.

### 5. Quiz & Self-Assessment Engine
- High-yield clinical vignette MCQs with endoscopic still images and EBUS sonograms.
- Instant feedback with rationale, referencing CHEST, ATS, and ERS guidelines.
- Performance dashboard summarizing scores across anatomy, equipment, and procedural safety.

---

## UI/UX & Code Quality Guidelines
- Sleek, modern medical UI: Dark/Slate mode inspired by modern clinical workstation software.
- High accessibility, smooth framerates (60 FPS on Three.js canvases).
- Modular folder structure:
  - `/app` (routes: `/anatomy`, `/equipment`, `/procedures`, `/simulator`, `/quiz`)
  - `/components/simulator` (scope controls, canvas rendering, camera controls)
  - `/components/ui` (shadcn components)
  - `/lib/data` (standardized medical content data structures)
- Write clean, modular, self-contained TypeScript components with minimal external runtime baggage.