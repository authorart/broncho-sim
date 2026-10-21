import { AIRWAY_BRANCHES, TRACHEA_TOP, type AirwayBranchDef, type AirwayLevel } from "@/lib/data/airway";

export type V3 = [number, number, number];

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a: V3): V3 => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const lerp3 = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Rotate v around unit axis k by angle (Rodrigues). */
export function rotate(v: V3, k: V3, angle: number): V3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const kv = cross(k, v);
  const kd = dot(k, v);
  return [
    v[0] * c + kv[0] * s + k[0] * kd * (1 - c),
    v[1] * c + kv[1] * s + k[1] * kd * (1 - c),
    v[2] * c + kv[2] * s + k[2] * kd * (1 - c),
  ];
}

export type Segment = {
  index: number;
  id: string;
  name: string;
  level: AirwayLevel;
  parent: string | null;
  /** the segmental bronchus this belongs to (itself for segmental, parent for subsegmental) */
  segmentId: string | null;
  side: AirwayBranchDef["side"];
  lobe?: AirwayBranchDef["lobe"];
  a: V3;
  b: V3;
  dir: V3;
  length: number;
  r1: number;
  r2: number;
  rings: number;
  def?: AirwayBranchDef;
};

function buildTree(): Segment[] {
  const out: Segment[] = [];
  const byId = new Map<string, Segment>();
  for (const def of AIRWAY_BRANCHES) {
    const parent = def.parent ? byId.get(def.parent) : undefined;
    const a: V3 = parent ? parent.b : TRACHEA_TOP;
    const dir = norm(def.dir);
    const b = add(a, scale(dir, def.length));
    const seg: Segment = {
      index: out.length,
      id: def.id,
      name: def.name,
      level: def.level,
      parent: def.parent,
      segmentId: def.level === "segmental" ? def.id : null,
      side: def.side,
      lobe: def.lobe,
      a,
      b,
      dir,
      length: def.length,
      r1: def.diameter[0] / 2,
      r2: def.diameter[1] / 2,
      rings: def.rings,
      def,
    };
    out.push(seg);
    byId.set(def.id, seg);
  }
  // Procedurally add two subsegmental bronchi (a/b) to every segment so lumens
  // don't end blindly. Purely visual; named generically.
  const segmentals = out.filter((s) => s.level === "segmental");
  for (const s of segmentals) {
    const helper: V3 = Math.abs(s.dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const perp = norm(cross(s.dir, helper));
    for (const [suffix, sign] of [["a", 1], ["b", -1]] as const) {
      const dir = norm(rotate(s.dir, perp, sign * 0.5));
      const a = s.b;
      const length = 10;
      const sub: Segment = {
        index: out.length,
        id: `${s.id}${suffix}`,
        name: `${s.id}${suffix} – subsegment`,
        level: "subsegmental",
        parent: s.id,
        segmentId: s.id,
        side: s.side,
        lobe: s.lobe,
        a,
        b: add(a, scale(dir, length)),
        dir,
        length,
        r1: s.r2 * 0.78,
        r2: s.r2 * 0.55,
        rings: 0,
      };
      out.push(sub);
    }
  }
  return out;
}

export const SEGMENTS: Segment[] = buildTree();
export const SEG_BY_ID: Record<string, Segment> = Object.fromEntries(SEGMENTS.map((s) => [s.id, s]));
export const CHILDREN: Record<string, Segment[]> = {};
for (const s of SEGMENTS) {
  if (s.parent) (CHILDREN[s.parent] ??= []).push(s);
}

/** Smooth-min blend radius (mm) used for bifurcation spurs. Shared with the GLSL shader. */
export const SMOOTH_K = 1.6;

function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

/** Signed distance to one tapered capsule (negative inside). Returns [distance, h]. */
export function capsuleDist(p: V3, s: Segment): [number, number] {
  const pa = sub(p, s.a);
  const ba = sub(s.b, s.a);
  const h = Math.min(1, Math.max(0, dot(pa, ba) / dot(ba, ba)));
  const d = len(sub(pa, scale(ba, h))) - (s.r1 + (s.r2 - s.r1) * h);
  return [d, h];
}

/** Signed distance to the lumen union: negative inside the airway. */
export function lumenSDF(p: V3, segs: Segment[] = SEGMENTS): number {
  let d = 1e9;
  for (const s of segs) {
    d = smin(d, capsuleDist(p, s)[0], SMOOTH_K);
  }
  return d;
}

/** Nearest segment by axis distance (used to name the scope location). */
export function nearestSegment(p: V3): { seg: Segment; dist: number; h: number } {
  let best = SEGMENTS[0];
  let bestD = Infinity;
  let bestH = 0;
  for (const s of SEGMENTS) {
    const [d, h] = capsuleDist(p, s);
    // prefer the deeper (more distal) branch when inside overlapping junctions
    const score = d + (h < 0.05 ? 0.6 : 0);
    if (score < bestD) {
      bestD = score;
      best = s;
      bestH = h;
    }
  }
  return { seg: best, dist: bestD, h: bestH };
}

/** Capsules sorted by distance from p, capped — what the shader receives. */
export function nearbySegments(p: V3, max: number): Segment[] {
  return SEGMENTS.map((s) => ({ s, d: capsuleDist(p, s)[0] }))
    .sort((x, y) => x.d - y.d)
    .slice(0, max)
    .map((x) => x.s);
}

export function lumenGradient(p: V3, segs: Segment[]): V3 {
  const e = 0.05;
  return norm([
    lumenSDF([p[0] + e, p[1], p[2]], segs) - lumenSDF([p[0] - e, p[1], p[2]], segs),
    lumenSDF([p[0], p[1] + e, p[2]], segs) - lumenSDF([p[0], p[1] - e, p[2]], segs),
    lumenSDF([p[0], p[1], p[2] + e], segs) - lumenSDF([p[0], p[1], p[2] - e], segs),
  ]);
}

/** Human-friendly location label for a point. */
export function locationLabel(p: V3) {
  const { seg } = nearestSegment(p);
  if (seg.level === "subsegmental") {
    const parent = SEG_BY_ID[seg.parent!];
    return { id: parent.id, label: `${parent.name} (subsegmental)`, seg: parent, level: seg.level };
  }
  return { id: seg.id, label: seg.name, seg, level: seg.level };
}

export type Pose = { pos: V3; forward: V3; up: V3 };

const ANTERIOR: V3 = [0, 0, 1];
const SUPERIOR: V3 = [0, 1, 0];

export function orthoUp(forward: V3, preferred: V3 = ANTERIOR): V3 {
  let up = sub(preferred, scale(forward, dot(preferred, forward)));
  if (len(up) < 0.15) up = sub(SUPERIOR, scale(forward, dot(SUPERIOR, forward)));
  return norm(up);
}

/** Camera placed back along `segId`, looking at its distal division (or at a child). */
export function poseLookingInto(segId: string, back: number, lookAt?: string): Pose {
  const s = SEG_BY_ID[segId];
  const pos = sub(s.b, scale(s.dir, back));
  let target = s.b;
  if (lookAt) {
    const c = SEG_BY_ID[lookAt];
    target = add(c.a, scale(c.dir, Math.min(6, c.length * 0.5)));
  }
  const forward = norm(sub(target, pos));
  return { pos, forward, up: orthoUp(forward) };
}

export const START_POSE: Pose = (() => {
  const t = SEG_BY_ID.trachea;
  const pos = add(t.a, scale(t.dir, 8));
  return { pos, forward: t.dir, up: orthoUp(t.dir) };
})();

/** Frontal (coronal) projection for 2D maps: viewer's left = patient's right. */
export function frontal(p: V3): [number, number] {
  return [p[0], -p[1]];
}

/** Axis point at fraction t of a segment. */
export function along(segId: string, t: number): V3 {
  const s = SEG_BY_ID[segId];
  return lerp3(s.a, s.b, t);
}
