import {
  START_POSE,
  add,
  capsuleDist,
  cross,
  dot,
  lumenGradient,
  lumenSDF,
  nearbySegments,
  nearestSegment,
  norm,
  rotate,
  scale,
  sub,
  type Pose,
  type V3,
} from "./geometry";

/**
 * Simplified flexible-bronchoscope kinematics.
 * - Thumb lever bends the distal tip: up to +180° / −130° (Ernst ch. 6); the view tilts with it.
 * - Advancing follows the tip ("follow-the-leader"), so a flexed tip steers the shaft.
 * - Rotation of the whole scope (wrist/torque) rolls the image.
 * - The tip (Ø ~5 mm) cannot pass lumens narrower than itself: it wedges.
 */

export const TIP_RADIUS = 2.4;
export const FLEX_UP_MAX = 180;
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
};

export const emptyInput = (): ScopeInput => ({ advance: 0, roll: 0, flex: 0, straighten: false, slow: false });

export function createScope(pose: Pose = START_POSE): ScopeState {
  return {
    pos: [...pose.pos] as V3,
    heading: norm(pose.forward),
    headingUp: norm(pose.up),
    flex: 0,
    rollDeg: 0,
    insertedMm: 0,
    contacts: 0,
    wedged: false,
    lastContactAt: -10,
    flash: 0,
    time: 0,
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
  if (ds !== 0) {
    if (s.insertedMm + ds < MIN_INSERT) return s;
    const view = scopeView(s);
    const segs = nearbySegments(s.pos, 16);
    let next = add(s.pos, scale(view.forward, ds));
    let w = -lumenSDF(next, segs);

    if (w < TIP_RADIUS) {
      const local = nearestSegment(next);
      const [, h] = capsuleDist(next, local.seg);
      const localR = local.seg.r1 + (local.seg.r2 - local.seg.r1) * h;
      if (ds > 0 && localR < TIP_RADIUS + 0.5) {
        // Lumen narrower than the scope: wedge position (tip fills the airway).
        s.wedged = true;
        return s;
      }
      // Push back toward the lumen centre.
      const g = lumenGradient(next, segs); // points out of lumen
      const pen = TIP_RADIUS - w;
      next = sub(next, scale(g, pen));
      w = -lumenSDF(next, segs);
      if (ds > 0 && pen > 0.35 && s.time - s.lastContactAt > 0.8) {
        s.contacts += 1;
        s.lastContactAt = s.time;
        s.flash = 1;
      }
      if (w < TIP_RADIUS * 0.5) return s; // could not resolve — refuse move
      // Passive compliance: the wall guides the shaft along the lumen.
      const axis = local.seg.dir;
      const sign = dot(axis, s.heading) >= 0 ? 1 : -1;
      s.heading = norm(add(scale(s.heading, 0.92), scale(axis, 0.08 * sign)));
    }

    // Follow-the-leader: the shaft heading drifts toward where the tip points.
    if (ds > 0) {
      const k = Math.min(1, ds / BEND_LENGTH);
      s.heading = norm(add(scale(s.heading, 1 - k), scale(view.forward, k)));
    }
    // keep up-vector orthonormal
    s.headingUp = norm(sub(s.headingUp, scale(s.heading, dot(s.headingUp, s.heading))));
    s.pos = next;
    s.insertedMm += ds;
  }
  return s;
}

/** Insertion depth from the incisors, approximating ~18 cm teeth-to-subglottis at the start pose. */
export function insertionCm(s: ScopeState) {
  return 18 + s.insertedMm / 10;
}
