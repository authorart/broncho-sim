import { rng } from "@/lib/utils";

/** Procedural ultrasound rendering (no external images). All geometry in millimetres. */

export type Ellipse = { x: number; y: number; rx: number; ry: number; rot?: number };

export type ConvexNode = Ellipse & {
  echo: number; // relative echogenicity 0..1 (lower = darker)
  heterogeneity: number; // 0..1
  hilum?: boolean;
  necrosis?: Ellipse | null;
  margin?: number; // 0..1 sharpness of border
};

export type ConvexVessel = Ellipse & { flow: "toward" | "away" };

export type ConvexParams = {
  seed: number;
  nodes: ConvexNode[];
  vessels: ConvexVessel[];
  doppler: boolean;
  gain: number; // 0.5..1.5
  needle?: { depth: number; angleDeg: number } | null;
  wall?: boolean; // bright airway wall / cartilage line at top
  balloon?: boolean;
};

const APEX = 10; // virtual apex above transducer face (mm)
const MAX_R = 52;
const HALF_SECTOR = (36 * Math.PI) / 180;

function inEllipse(px: number, py: number, e: Ellipse) {
  const c = Math.cos(-(e.rot ?? 0));
  const s = Math.sin(-(e.rot ?? 0));
  const dx = px - e.x;
  const dy = py - e.y;
  const u = (dx * c - dy * s) / e.rx;
  const v = (dx * s + dy * c) / e.ry;
  return u * u + v * v; // <1 inside
}

/** Hash noise for speckle (stable per pixel/seed). */
function makeNoise(seed: number) {
  const r = rng(seed);
  const table = new Float32Array(4096);
  for (let i = 0; i < table.length; i++) table[i] = r();
  return (x: number, y: number) => {
    const xi = Math.floor(x) & 63;
    const yi = Math.floor(y) & 63;
    return table[(xi * 64 + yi) & 4095];
  };
}

/** Slight blur so speckle reads like a real scanner rather than pixel noise. */
function softenInPlace(ctx: CanvasRenderingContext2D, W: number, H: number) {
  if (typeof document === "undefined") return;
  const tmp = document.createElement("canvas");
  tmp.width = W;
  tmp.height = H;
  tmp.getContext("2d")?.drawImage(ctx.canvas, 0, 0);
  ctx.save();
  ctx.filter = "blur(0.7px)";
  ctx.drawImage(tmp, 0, 0);
  ctx.restore();
}

/** Needle geometry: enters from the upper-left (working channel exit) toward lower-right. */
export function needleSegment(n: { depth: number; angleDeg: number }) {
  const a = (n.angleDeg * Math.PI) / 180;
  const start = { x: -15, y: 2 };
  const end = { x: start.x + Math.cos(a) * n.depth, y: start.y + Math.sin(a) * n.depth };
  return { start, end };
}

function distToSeg(px: number, py: number, a: { x: number; y: number }, b: { x: number; y: number }) {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((px - a.x) * vx + (py - a.y) * vy) / (vx * vx + vy * vy || 1)));
  return Math.hypot(px - (a.x + vx * t), py - (a.y + vy * t));
}

export function drawConvex(ctx: CanvasRenderingContext2D, W: number, H: number, p: ConvexParams) {
  const img = ctx.createImageData(W, H);
  const scale = (H - 8) / (MAX_R - APEX + 2); // px per mm
  const ox = W / 2;
  const oy = 4 - APEX * scale;
  const noise = makeNoise(p.seed);
  const r2 = rng(p.seed + 7);
  const jitter = new Float32Array(W * H);
  for (let i = 0; i < jitter.length; i++) jitter[i] = r2();
  const needle = p.needle ? needleSegment(p.needle) : null;

  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const x = (i - ox) / scale;
      const yA = (j - oy) / scale; // from apex
      const r = Math.hypot(x, yA);
      const th = Math.atan2(x, yA);
      const idx = (j * W + i) * 4;
      if (r < APEX || r > MAX_R || Math.abs(th) > HALF_SECTOR) {
        img.data[idx + 3] = 255;
        continue;
      }
      const y = r - APEX; // depth below transducer (along beam)
      // speckle: Rayleigh-like, correlated along the beam
      const sp = -Math.log(1e-3 + 0.5 * jitter[j * W + i] + 0.5 * noise(th * 220, y * 3));
      let refl = 0.42 + 0.18 * noise(x * 0.6 + 40, y * 0.6);

      // airway wall / cartilage: bright band near transducer
      if (p.wall !== false) {
        if (y < 2.2) refl = p.balloon ? 0.08 : 1.25;
        else if (y < 3.2) refl = 0.75;
      }
      if (p.balloon && y < 4) refl = 0.06;

      let colour: [number, number, number] | null = null;
      for (const n of p.nodes) {
        const q = inEllipse(x, y, n);
        const edge = 1 - (n.margin ?? 0.7) * 0.6;
        if (q < 1) {
          const het = n.heterogeneity * (noise(x * 1.5 + 9, y * 1.5) - 0.5) * 0.6;
          refl = n.echo + het;
          if (n.hilum) {
            // central echogenic hilar structure
            const hq = inEllipse(x, y, { x: n.x - n.rx * 0.1, y: n.y + n.ry * 0.05, rx: n.rx * 0.55, ry: n.ry * 0.16, rot: (n.rot ?? 0) + 0.25 });
            if (hq < 1) refl = 0.95;
          }
          if (n.necrosis && inEllipse(x, y, n.necrosis) < 1) refl = 0.04;
        } else if (q < 1 + edge * 0.25) {
          refl = Math.max(refl, 0.55 + 0.4 * (n.margin ?? 0.7));
        }
      }
      for (const v of p.vessels) {
        const q = inEllipse(x, y, v);
        if (q < 1) {
          refl = 0.02;
          if (p.doppler && y > 3) {
            const vel = 1 - q;
            const pulse = 0.6 + 0.4 * noise(x * 2, y * 2);
            colour = v.flow === "toward" ? [210 * vel * pulse + 45, 30, 20] : [20, 60, 200 * vel * pulse + 55];
          }
        } else if (q < 1.15) {
          refl = Math.max(refl, 0.9);
        }
      }
      // posterior acoustic enhancement below fluid-filled vessels
      for (const v of p.vessels) {
        if (Math.abs(x - v.x) < v.rx * 0.8 && y > v.y + v.ry && y < v.y + v.ry + 10) refl *= 1.25;
      }
      if (needle) {
        const d = distToSeg(x, y, needle.start, needle.end);
        if (d < 0.45) refl = 1.8;
        else if (d < 1.2) refl = Math.max(refl, 0.9 - d * 0.4);
      }

      const atten = Math.exp(-y * 0.022);
      let v = sp * refl * atten * p.gain * 150;
      v = Math.min(255, v);
      if (colour) {
        img.data[idx] = Math.min(255, colour[0]);
        img.data[idx + 1] = Math.min(255, colour[1]);
        img.data[idx + 2] = Math.min(255, colour[2]);
      } else {
        img.data[idx] = v;
        img.data[idx + 1] = v;
        img.data[idx + 2] = v;
      }
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  softenInPlace(ctx, W, H);

  // depth scale (1 cm ticks) + Doppler box
  ctx.strokeStyle = "rgba(148,163,184,0.7)";
  ctx.fillStyle = "rgba(148,163,184,0.85)";
  ctx.font = "10px ui-monospace, monospace";
  for (let cm = 1; cm <= 4; cm++) {
    const yy = oy + (APEX + cm * 10) * scale;
    ctx.beginPath();
    ctx.moveTo(W - 14, yy);
    ctx.lineTo(W - 6, yy);
    ctx.stroke();
    ctx.fillText(`${cm}`, W - 24, yy + 3);
  }
  if (p.doppler) {
    ctx.strokeStyle = "rgba(250,204,21,0.7)";
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(W * 0.22, oy + (APEX + 3) * scale, W * 0.56, 28 * scale);
    ctx.setLineDash([]);
  }
}

export type RadialPattern = "concentric" | "eccentric" | "adjacent" | "aerated";

export type RadialParams = { seed: number; pattern: RadialPattern; gain: number; offset?: number };

/** 360° radial mini-probe image (probe at centre). */
export function drawRadial(ctx: CanvasRenderingContext2D, S: number, p: RadialParams) {
  const img = ctx.createImageData(S, S);
  const c = S / 2;
  const scale = c / 30; // 30 mm radius displayed
  const noise = makeNoise(p.seed);
  const r2 = rng(p.seed + 3);
  const jit = new Float32Array(S * S);
  for (let i = 0; i < jit.length; i++) jit[i] = r2();

  // lesion description in mm (probe at origin)
  let lesion: Ellipse | null = null;
  const off = p.offset ?? 0;
  if (p.pattern === "concentric") lesion = { x: off * 0.3, y: off * 0.3, rx: 13, ry: 11, rot: 0.3 };
  if (p.pattern === "eccentric") lesion = { x: 7 + off * 0.2, y: -4, rx: 12, ry: 10, rot: 0.5 };
  if (p.pattern === "adjacent") lesion = { x: 12 + off * 0.2, y: -6, rx: 10, ry: 8.5, rot: 0.2 };

  for (let j = 0; j < S; j++) {
    for (let i = 0; i < S; i++) {
      const x = (i - c) / scale;
      const y = (j - c) / scale;
      const r = Math.hypot(x, y);
      const th = Math.atan2(y, x);
      const idx = (j * S + i) * 4;
      img.data[idx + 3] = 255;
      if (r > 30) continue;
      if (r < 1.1) continue; // probe
      const sp = -Math.log(1e-3 + 0.5 * jit[j * S + i] + 0.5 * noise(th * 160, r * 2.5));

      // aerated lung: bright snowstorm, reverberation streaks, falls off with depth
      const streak = 0.8 + 1.1 * Math.pow(noise(th * 90, 1), 3);
      let refl = 1.7 * streak * Math.exp(-(r - 1) * 0.05);
      let inLesion = false;
      if (lesion) {
        const q = inEllipse(x, y, lesion);
        // lesion blocks air → solid homogeneous grey with bright irregular border
        const border = 1 + 0.18 * (noise(th * 30, 5) - 0.5);
        if (q < border * 0.92) {
          inLesion = true;
          refl = 0.45 + 0.15 * noise(x * 1.2, y * 1.2);
        } else if (q < border * 1.08) {
          refl = 2.2;
        } else {
          // beyond lesion along the beam (shadowed air): only if beam passes through lesion first
          refl *= 0.9;
        }
      }
      if (r < 2.4) refl = inLesion ? refl : 1.4; // ring-down near probe
      const v = Math.min(255, sp * refl * p.gain * 105);
      img.data[idx] = v;
      img.data[idx + 1] = v;
      img.data[idx + 2] = v;
    }
  }
  ctx.putImageData(img, 0, 0);
  softenInPlace(ctx, S, S);
  ctx.strokeStyle = "rgba(34,211,238,0.35)";
  for (const cm of [1, 2, 3]) {
    ctx.beginPath();
    ctx.arc(c, c, cm * 10 * scale, 0, Math.PI * 2);
    ctx.setLineDash([2, 4]);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.arc(c, c, 1.1 * scale, 0, Math.PI * 2);
  ctx.fill();
}

export const CONVEX_PRESETS: Record<string, Omit<ConvexParams, "gain">> = {
  "doppler-vessel": {
    seed: 11,
    nodes: [{ x: 6, y: 17, rx: 9, ry: 7, rot: 0.2, echo: 0.24, heterogeneity: 0.4, margin: 0.8 }],
    vessels: [{ x: -6, y: 15, rx: 6.5, ry: 6, flow: "toward" }],
    doppler: true,
  },
  "malignant-node": {
    seed: 23,
    nodes: [
      {
        x: 2,
        y: 19,
        rx: 11,
        ry: 10.5,
        rot: 0,
        echo: 0.28,
        heterogeneity: 0.9,
        margin: 0.95,
        necrosis: { x: 4, y: 21, rx: 3.5, ry: 2.6, rot: 0.6 },
      },
    ],
    vessels: [{ x: -14, y: 30, rx: 5, ry: 5, flow: "away" }],
    doppler: false,
  },
  "benign-node": {
    seed: 31,
    nodes: [{ x: 3, y: 17, rx: 10, ry: 4.8, rot: 0.15, echo: 0.3, heterogeneity: 0.15, hilum: true, margin: 0.35 }],
    vessels: [],
    doppler: false,
  },
  "needle-in-node": {
    seed: 41,
    nodes: [{ x: 4, y: 18, rx: 10, ry: 8, rot: 0.1, echo: 0.24, heterogeneity: 0.5, margin: 0.8 }],
    vessels: [{ x: -2, y: 34, rx: 7, ry: 5, flow: "away" }],
    doppler: false,
    needle: { depth: 25, angleDeg: 38 },
  },
};
