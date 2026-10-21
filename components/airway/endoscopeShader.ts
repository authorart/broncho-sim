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

// Lumen SDF (negative inside). ringOut = cartilage ridge intensity at p.
float mapL(vec3 p, out float ringOut) {
  float d = 1e5;
  float best = 1e5;
  ringOut = 0.0;
  for (int i = 0; i < MAXC; i++) {
    if (i >= uCount) break;
    vec3 pa = p - uA[i];
    vec3 ba = uB[i] - uA[i];
    float L2 = dot(ba, ba);
    float h = clamp(dot(pa, ba) / L2, 0.0, 1.0);
    vec3 q = pa - ba * h;
    float di = length(q) - mix(uR[i].x, uR[i].y, h);
    float rv = 0.0;
    if (uRing[i] > 0.0) {
      // Horseshoe rings: anterior & lateral only; posterior membranous wall stays smooth.
      float post = dot(normalize(q + vec3(1e-4)), vec3(0.0, 0.0, -1.0));
      float mask = uRing[i] * (1.0 - smoothstep(0.25, 0.7, post));
      float s = h * sqrt(L2) / 4.8;
      float r = pow(0.5 + 0.5 * cos(6.2831 * s), 3.0);
      rv = mask * r;
      di += rv * 0.55;
    }
    if (di < best) { best = di; ringOut = rv; }
    d = smin(d, di, K);
  }
  d += (noise(p * 0.7) - 0.5) * 0.28;
  float ls = lesionSDF(p);
  d = max(d, -ls);
  return d;
}

float mapOnly(vec3 p) { float r; return mapL(p, r); }

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(0.06, -0.06);
  // gradient of lumen SDF points out of the lumen; the visible wall faces inward.
  return -normalize(e.xyy * mapOnly(p + e.xyy) + e.yyx * mapOnly(p + e.yyx) +
                    e.yxy * mapOnly(p + e.yxy) + e.xxx * mapOnly(p + e.xxx));
}

void main() {
  vec2 c = (gl_FragCoord.xy - 0.5 * uRes) / (0.5 * min(uRes.x, uRes.y));
  float rr = length(c);
  if (rr > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  float theta = rr * uHalfFov;
  float phi = atan(c.y, c.x);
  vec3 rd = normalize(uRight * sin(theta) * cos(phi) + uUp * sin(theta) * sin(phi) + uFwd * cos(theta));
  vec3 ro = uCamPos;

  float t = 0.0;
  bool hit = false;
  float ring = 0.0;
  int steps = int(uSteps);
  for (int i = 0; i < 128; i++) {
    if (i >= steps) break;
    vec3 p = ro + rd * t;
    float w = -mapL(p, ring);
    if (w < 0.02 + t * 0.002) { hit = true; break; }
    t += max(w * 0.85, 0.04);
    if (t > 150.0) break;
  }

  vec3 col = vec3(0.012, 0.004, 0.004);
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);

    vec3 base = vec3(0.84, 0.36, 0.32);
    float v1 = noise(p * 0.32 + 3.1);
    float v2 = noise(p * 0.85 + 11.7);
    float vessels = 1.0 - smoothstep(0.0, 0.03, abs(v1 - 0.5));
    float fine = 1.0 - smoothstep(0.0, 0.025, abs(v2 - 0.5));
    base = mix(base, vec3(0.62, 0.11, 0.13), vessels * 0.45 + fine * 0.18);
    base = mix(base, vec3(0.97, 0.76, 0.70), ring * 0.55);
    base *= 0.88 + 0.24 * noise(p * 2.3);

    float ls = lesionSDF(p);
    if (ls < 0.8) {
      float m = noise(p * 1.4);
      vec3 tumour = mix(vec3(0.74, 0.62, 0.50), vec3(0.62, 0.24, 0.22), smoothstep(0.3, 0.8, m));
      tumour = mix(tumour, vec3(0.42, 0.34, 0.26), smoothstep(0.7, 0.9, noise(p * 3.0)));
      base = mix(base, tumour, 1.0 - smoothstep(0.0, 0.8, ls));
    }

    vec3 lit = vec3(0.0);
    for (int k = 0; k < 2; k++) {
      vec3 Lp = ro + uRight * (k == 0 ? 1.4 : -1.4) - uUp * 0.6;
      vec3 l = Lp - p;
      float dist = length(l);
      l /= dist;
      // Near field is compressed (auto-brightness control); far field falls off ~1/d.
      float atten = uLight * (55.0 / (dist * dist + 28.0) + 2.3 / (dist + 6.0));
      float diff = max(dot(n, l), 0.0);
      vec3 hv = normalize(l - rd);
      float spec = pow(max(dot(n, hv), 0.0), 70.0);
      lit += base * diff * atten + vec3(1.0, 0.96, 0.93) * spec * atten * 0.55;
    }
    col = base * 0.025 + lit;
    col = mix(col, vec3(0.03, 0.006, 0.006), smoothstep(45.0, 140.0, t));
  }

  // Blood in the field and wall-contact "red-out".
  col = mix(col, vec3(0.32, 0.02, 0.02) * (0.6 + 0.4 * noise(vec3(c * 6.0, uTime * 0.6))), clamp(uBleed, 0.0, 1.0) * 0.75);
  col = mix(col, vec3(0.75, 0.08, 0.06), uFlash * 0.55);

  // Auto-brightness style tonemap + optical vignette.
  col = vec3(1.0) - exp(-col * 1.15);
  col *= 1.0 - smoothstep(0.82, 1.0, rr) * 0.75;
  col = pow(col, vec3(0.92));
  gl_FragColor = vec4(col, 1.0);
}
`;
