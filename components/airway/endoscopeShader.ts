import { SMOOTH_K } from "@/lib/airway/geometry";

/** Number of nearest capsules streamed to the GPU each frame. */
export const MAX_CAPSULES = 28;

export const endoscopeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Raymarched intraluminal view. The lumen is a smooth union of tapered capsules
 * (negative SDF inside). Rendering mimics a video bronchoscope: ~120° equidistant
 * fisheye optic, two light guides beside the lens with inverse-square falloff,
 * wet specular mucosa, horseshoe cartilage rings, submucosal vascular network.
 */
export const endoscopeFragment = /* glsl */ `
precision highp float;
#define MAXC ${MAX_CAPSULES}
uniform vec3 uA[MAXC];
uniform vec3 uB[MAXC];
uniform vec2 uR[MAXC];
uniform float uRing[MAXC];
uniform int uCount;
uniform vec3 uCamPos;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform vec2 uRes;
uniform float uHalfFov;
uniform float uTime;
uniform vec4 uLesion;
uniform float uBleed;
uniform float uFlash;
uniform float uLight;
uniform float uSteps;
varying vec2 vUv;

const float K = ${SMOOTH_K.toFixed(2)};

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
                 mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                 mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}

float lesionSDF(vec3 p) {
  if (uLesion.w <= 0.0) return 1e5;
  return length(p - uLesion.xyz) - uLesion.w + (noise(p * 0.9) - 0.5) * 1.6;
}

// Lumen SDF (negative inside). ringOut = cartilage ridge intensity, membOut = posterior
// membranous-wall weight (trachea / main bronchi only).
float mapL(vec3 p, out float ringOut, out float membOut) {
  float d = 1e5;
  float best = 1e5;
  ringOut = 0.0;
  membOut = 0.0;
  for (int i = 0; i < MAXC; i++) {
    if (i >= uCount) break;
    vec3 pa = p - uA[i];
    vec3 ba = uB[i] - uA[i];
    float L2 = dot(ba, ba);
    float h = clamp(dot(pa, ba) / L2, 0.0, 1.0);
    vec3 q = pa - ba * h;
    float di = length(q) - mix(uR[i].x, uR[i].y, h);
    float rv = 0.0;
    float mv = 0.0;
    if (uRing[i] > 0.0) {
      // Horseshoe rings: anterior & lateral only; the posterior membranous wall stays smooth.
      float post = dot(normalize(q + vec3(1e-4)), vec3(0.0, 0.0, -1.0));
      mv = uRing[i] * smoothstep(0.35, 0.75, post);
      float mask = uRing[i] - mv;
      float s = h * sqrt(L2) / 4.6;
      float r = pow(0.5 + 0.5 * cos(6.2831 * s), 4.0);
      rv = mask * r;
      di += rv * 0.16;
    }
    if (di < best) { best = di; ringOut = rv; membOut = mv; }
    d = smin(d, di, K);
  }
  d += (noise(p * 0.55) - 0.5) * 0.16;
  float ls = lesionSDF(p);
  d = max(d, -ls);
  return d;
}

float mapOnly(vec3 p) { float r; float m; return mapL(p, r, m); }

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(0.05, -0.05);
  // gradient of lumen SDF points out of the lumen; the visible wall faces inward.
  return -normalize(e.xyy * mapOnly(p + e.xyy) + e.yyx * mapOnly(p + e.yyx) +
                    e.yxy * mapOnly(p + e.yxy) + e.xxx * mapOnly(p + e.xxx));
}

// Thin branching capillary network: ridges of two warped noise octaves.
float capillaries(vec3 p) {
  vec3 w = p + vec3(noise(p * 0.21), noise(p * 0.21 + 7.0), noise(p * 0.21 + 13.0)) * 6.0;
  float a = 1.0 - smoothstep(0.0, 0.018, abs(noise(w * 0.45) - 0.5));
  float b = 1.0 - smoothstep(0.0, 0.014, abs(noise(w * 1.15 + 5.0) - 0.5));
  return a * 0.7 + b * 0.35;
}

void main() {
  // Octagonal video frame (Olympus-style clipped corners); c spans [-1,1] on the short side.
  vec2 c = (gl_FragCoord.xy - 0.5 * uRes) / (0.5 * min(uRes.x, uRes.y));
  vec2 ac = abs(c);
  float oct = max(max(ac.x, ac.y), (ac.x + ac.y) / 1.42);
  if (oct > 0.985) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  float rr = length(c);

  float theta = rr * uHalfFov;
  float phi = atan(c.y, c.x);
  vec3 rd = normalize(uRight * sin(theta) * cos(phi) + uUp * sin(theta) * sin(phi) + uFwd * cos(theta));
  vec3 ro = uCamPos;

  float t = 0.0;
  bool hit = false;
  float ring = 0.0;
  float memb = 0.0;
  int steps = int(uSteps);
  for (int i = 0; i < 128; i++) {
    if (i >= steps) break;
    vec3 p = ro + rd * t;
    float w = -mapL(p, ring, memb);
    if (w < 0.02 + t * 0.002) { hit = true; break; }
    t += max(w * 0.85, 0.04 + t * 0.004);
    if (t > 150.0) break;
  }
  // Rays skimming a wall can run out of steps just above it: treat as a hit.
  if (!hit && t < 150.0) { float r2; float m2; hit = -mapL(ro + rd * t, r2, m2) < 1.5; }

  vec3 col = vec3(0.02, 0.006, 0.004);
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);

    // Salmon / orange-pink mucosa with gentle regional variation.
    float region = noise(p * 0.08);
    vec3 base = mix(vec3(0.98, 0.55, 0.36), vec3(0.96, 0.50, 0.40), region);
    base *= 0.92 + 0.12 * noise(p * 1.7);
    // Submucosal capillaries.
    base = mix(base, vec3(0.72, 0.20, 0.17), clamp(capillaries(p), 0.0, 1.0) * 0.55);
    // Pale cartilage rings; striated posterior membranous wall.
    base = mix(base, vec3(1.0, 0.82, 0.68), ring * 0.45);
    float stria = noise(vec3(p.x * 2.2, p.y * 0.12, p.z * 2.2));
    base = mix(base, base * (0.82 + 0.3 * stria), memb);

    float ls = lesionSDF(p);
    if (ls < 0.8) {
      float m = noise(p * 1.4);
      vec3 tumour = mix(vec3(0.80, 0.66, 0.52), vec3(0.66, 0.26, 0.22), smoothstep(0.3, 0.8, m));
      tumour = mix(tumour, vec3(0.45, 0.36, 0.27), smoothstep(0.7, 0.9, noise(p * 3.0)));
      base = mix(base, tumour, 1.0 - smoothstep(0.0, 0.8, ls));
    }

    // Wet mucus film: occasional tiny bright secretion droplets.
    vec3 cell = floor(p * 1.6);
    float dropSeed = hash(cell + 3.7);
    vec3 dropPos = (cell + vec3(hash(cell + 1.1), hash(cell + 2.3), hash(cell + 5.9))) / 1.6;
    float droplet = step(0.985, dropSeed) * (1.0 - smoothstep(0.03, 0.09, length(p - dropPos)));

    // Lighting is accumulated as scalars and tone-mapped before tinting, so the mucosa keeps its
    // salmon/orange hue instead of washing out to white near the lens (video auto-exposure).
    float D = 0.0;
    float S = 0.0;
    for (int k = 0; k < 2; k++) {
      vec3 Lp = ro + uRight * (k == 0 ? 1.4 : -1.4) - uUp * 0.5;
      vec3 l = Lp - p;
      float dist = length(l);
      l /= dist;
      float atten = uLight * (70.0 / (dist * dist + 26.0) + 3.2 / (dist + 6.0));
      float diff = max(dot(n, l), 0.0);
      vec3 hv = normalize(l - rd);
      float nh = max(dot(n, hv), 0.0);
      D += (0.3 + 0.7 * diff) * diff * atten;
      S += (pow(nh, 90.0) * 0.9 + pow(nh, 18.0) * 0.06) * atten;
    }
    float Dm = 1.0 - exp(-D * 1.6);
    col = base * (0.03 + 1.25 * Dm) + vec3(1.0, 0.97, 0.94) * (1.0 - exp(-S * 1.2));
    col += vec3(1.0, 0.98, 0.95) * droplet * 0.8 * smoothstep(60.0, 8.0, t);
    // Deep lumen fades to dark brown.
    col = mix(col, vec3(0.05, 0.016, 0.01), smoothstep(30.0, 110.0, t));
  }

  // Blood in the field and wall-contact "red-out".
  col = mix(col, vec3(0.32, 0.02, 0.02) * (0.6 + 0.4 * noise(vec3(c * 6.0, uTime * 0.6))), clamp(uBleed, 0.0, 1.0) * 0.75);
  col = mix(col, vec3(0.75, 0.08, 0.06), uFlash * 0.55);

  // Gentle shoulder only (main exposure handled above); very mild optical vignette.
  col = col / (1.0 + 0.18 * col);
  col *= 1.0 - smoothstep(0.75, 1.0, oct) * 0.25;
  col = pow(col, vec3(0.9));
  // anti-aliased octagon edge
  col *= 1.0 - smoothstep(0.97, 0.985, oct);
  gl_FragColor = vec4(col, 1.0);
}
`;
