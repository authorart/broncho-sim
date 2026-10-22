import {
  START_POSE,
  add,
  capsuleDist,
  cross,
  dot,
  len,
  lumenGradient,
  lumenSDF,
  nearbySegments,
  nearestSegment,
  norm,
  rotate,
  scale,
  sub,
  treeDepth,
  type Pose,
  type V3,
} from "./geometry";

/**
 * Simplified flexible-bronchoscope kinematics.
 * - Thumb lever bends the distal tip: up to +210° / −130° (Olympus BF-H190; Ernst ch. 6 quotes ~180°/130°); the view tilts with it.
 * - Advancing follows the tip ("follow-the-leader"), so a flexed tip steers the shaft.
 * - Rotation of the whole scope (wrist/torque) rolls the image.
 * - The tip (Ø ~5 mm) cannot pass lumens narrower than itself: it wedges.
 */

export const TIP_RADIUS = 2.6;
export const FLEX_UP_MAX = 210;
export const FLEX_DOWN_MAX = -130;
/** Fraction of lever angle that appears as camera tilt (bending section geometry). */
const VIEW_TILT = 0.32;
const BEND_LENGTH = 14;

export type ScopeInput = {
  advance: number; // -1..1
  roll: number; // -1..1 (positive = clockwise as seen on screen)
  flex: number; // -1..1 (positive = tip up)
  straighten: boolean;
  slow: boolean;
};

export type ScopeState = {
  pos: V3;
  heading: V3;
  headingUp: V3;
  flex: number;
  rollDeg: number;
  insertedMm: number;
  contacts: number;
  wedged: boolean;
  lastContactAt: number;
  flash: number;
  time: number;
  /** recorded tip positions along the insertion path (oldest first) */
  path: V3[];
};

export const emptyInput = (): ScopeInput => ({ advance: 0, roll: 0, flex: 0, straighten: false, slow: false });

export function createScope(pose: Pose = START_POSE): ScopeState {
  return {
    pos: [...pose.pos] as V3,
    heading: norm(pose.forward),
    headingUp: norm(pose.up),
    flex: 0,
    rollDeg: 0,
    // a scope placed at a landmark is already inserted that far down the airway
    insertedMm: Math.max(0, treeDepth(pose.pos)),
    contacts: 0,
    wedged: false,
    lastContactAt: -10,
    flash: 0,
    time: 0,
    path: [],
  };
}

/** Camera pose = heading tilted by the bent tip. */
export function scopeView(s: ScopeState): Pose {
  const right = norm(cross(s.heading, s.headingUp));
  const tilt = (s.flex * VIEW_TILT * Math.PI) / 180;
  const forward = norm(rotate(s.heading, right, tilt));
  const up = norm(rotate(s.headingUp, right, tilt));
  return { pos: s.pos, forward, up };
}

/** Distance from the start of the trachea that the user may not withdraw beyond. */
const MIN_INSERT = -6;
/** Spacing of the recorded insertion path (mm). */
const CRUMB = 0.6;
/** Contact is registered when the tip touches the wall while being pushed into it. */
const CONTACT_PUSH = 0.3;
const CONTACT_COOLDOWN = 0.9;

export function stepScope(s: ScopeState, input: ScopeInput, dt: number): ScopeState {
  s.time += dt;
  s.flash = Math.max(0, s.flash - dt * 2.5);

  // Lever
  if (input.straighten) s.flex += (0 - s.flex) * Math.min(1, dt * 6);
  s.flex = Math.max(FLEX_DOWN_MAX, Math.min(FLEX_UP_MAX, s.flex + input.flex * 110 * dt));

  // Rotation of the whole instrument about its long axis
  if (input.roll !== 0) {
    const ang = ((input.roll * 75 * dt) * Math.PI) / 180;
    // positive roll = clockwise on screen => rotate up vector toward right
    s.headingUp = norm(rotate(s.headingUp, s.heading, -ang));
    s.rollDeg += input.roll * 75 * dt;
  }

  const speed = input.slow ? 6 : 16;
  const ds = input.advance * speed * dt;
  s.wedged = false;
  if (ds > 0) advance(s, ds);
  else if (ds < 0) withdraw(s, -ds);
  // keep up-vector orthonormal
  s.headingUp = norm(sub(s.headingUp, scale(s.heading, dot(s.headingUp, s.heading))));
  return s;
}

function registerContact(s: ScopeState) {
  if (s.time - s.lastContactAt < CONTACT_COOLDOWN) return;
  s.contacts += 1;
  s.lastContactAt = s.time;
  s.flash = 1;
}

function advance(s: ScopeState, ds: number) {
  const view = scopeView(s);
  const segs = nearbySegments(s.pos, 16);
  let next = add(s.pos, scale(view.forward, ds));
  let w = -lumenSDF(next, segs);

  if (w < TIP_RADIUS + 0.05) {
    const local = nearestSegment(next);
    const [, h] = capsuleDist(next, local.seg);
    const localR = local.seg.r1 + (local.seg.r2 - local.seg.r1) * h;
    if (localR < TIP_RADIUS + 0.15) {
      // Lumen narrower than the scope: wedge position (tip fills the airway).
      s.wedged = true;
      return;
    }
    const g = lumenGradient(next, segs); // points out of the lumen (into the wall)
    // Tip driven into the mucosa (not just sliding along it) = wall contact.
    if (dot(view.forward, g) > CONTACT_PUSH) registerContact(s);
    if (w < TIP_RADIUS) {
      // Push back toward the lumen centre.
      next = sub(next, scale(g, TIP_RADIUS - w));
      w = -lumenSDF(next, segs);
      if (w < TIP_RADIUS * 0.5) return; // could not resolve — refuse move
      // Tip jammed into a lumen barely wider than the scope: it has wedged rather than advanced.
      const progress = dot(sub(next, s.pos), view.forward);
      if (progress < 0.25 * ds && localR < TIP_RADIUS + 0.9) {
        s.wedged = true;
        return;
      }
    }
    // Passive compliance: the wall guides the shaft along the lumen.
    const axis = local.seg.dir;
    const sign = dot(axis, s.heading) >= 0 ? 1 : -1;
    s.heading = norm(add(scale(s.heading, 0.92), scale(axis, 0.08 * sign)));
  }

  // Follow-the-leader: the shaft heading drifts toward where the tip points.
  const k = Math.min(1, ds / BEND_LENGTH);
  s.heading = norm(add(scale(s.heading, 1 - k), scale(view.forward, k)));

  // Record the insertion path so the scope can be withdrawn along it.
  const last = s.path[s.path.length - 1];
  if (!last || len(sub(s.pos, last)) >= CRUMB) {
    s.path.push([...s.pos] as V3);
    if (s.path.length > 6000) s.path.shift();
  }
  s.insertedMm += Math.max(0, dot(sub(next, s.pos), view.forward));
  s.pos = next;
}

/**
 * Withdrawal: the shaft retraces the path it was inserted along (as a real scope does), so the tip
 * can always come back to the trachea — even out of a wedged subsegment. If there is no recorded
 * path (e.g. after jumping to a landmark) the tip slides back along the airway centre line.
 */
function withdraw(s: ScopeState, dist: number) {
  let d = Math.min(dist, s.insertedMm - MIN_INSERT);
  if (d <= 0) return;
  let moved = 0;
  while (d > 1e-6 && s.path.length) {
    const target = s.path[s.path.length - 1];
    const v = sub(target, s.pos);
    const L = len(v);
    if (L > 1e-6) s.heading = norm(add(scale(s.heading, 0.85), scale(v, -0.15 / L)));
    if (L <= d) {
      s.pos = target;
      s.path.pop();
      d -= L;
      moved += L;
    } else {
      s.pos = add(s.pos, scale(v, d / L));
      moved += d;
      d = 0;
    }
  }
  if (d > 1e-6) {
    // No recorded path: back out along the nearest airway's axis, re-centring the tip.
    const { seg } = nearestSegment(s.pos);
    let next = sub(s.pos, scale(seg.dir, d));
    const [, h] = capsuleDist(next, seg);
    const axisPt = add(seg.a, scale(sub(seg.b, seg.a), h));
    next = add(next, scale(sub(axisPt, next), 0.25));
    s.heading = norm(add(scale(s.heading, 0.9), scale(seg.dir, 0.1)));
    moved += d;
    s.pos = next;
  }
  s.insertedMm -= moved;
}

/** Insertion depth from the incisors, approximating ~18 cm teeth-to-subglottis at the start pose. */
export function insertionCm(s: ScopeState) {
  return 18 + s.insertedMm / 10;
}
