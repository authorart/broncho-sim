"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import {
  SEGMENTS,
  cross,
  dot,
  len,
  lumenSDF,
  nearbySegments,
  norm,
  scale,
  add,
  sub,
  type Pose,
  type Segment,
  type V3,
} from "@/lib/airway/geometry";
import { MAX_CAPSULES, endoscopeFragment, endoscopeVertex } from "./endoscopeShader";
import { cn } from "@/lib/utils";

export const HALF_FOV = (120 / 2) * (Math.PI / 180);
const MAX_LABELS = 8;

export type Lesion = { center: V3; radius: number } | null;

export type EndoscopeViewProps = {
  poseRef: RefObject<Pose>;
  lesion?: Lesion;
  /** 0..1 blood in the field */
  bleedRef?: RefObject<number>;
  /** 0..1 wall-contact flash */
  flashRef?: RefObject<number>;
  annotations?: boolean;
  /** Called every frame before rendering (simulation step). */
  onTick?: (dt: number) => void;
  /** Render on demand only (stills). */
  still?: boolean;
  quality?: "low" | "high";
  className?: string;
  children?: ReactNode;
  onLabelClick?: (segId: string) => void;
};

export function EndoscopeView({
  poseRef,
  lesion = null,
  bleedRef,
  flashRef,
  annotations = false,
  onTick,
  still = false,
  quality = "high",
  className,
  children,
  onLabelClick,
}: EndoscopeViewProps) {
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <Canvas
        frameloop={still ? "demand" : "always"}
        dpr={quality === "high" ? [1, 1.5] : [0.6, 0.8]}
        gl={{ antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: false }}
        className="!absolute inset-0"
      >
        <ScopeQuad
          poseRef={poseRef}
          lesion={lesion}
          bleedRef={bleedRef}
          flashRef={flashRef}
          onTick={onTick}
          labelRefs={annotations ? labelRefs : undefined}
          steps={quality === "high" ? 96 : 64}
        />
      </Canvas>
      {annotations && (
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: MAX_LABELS }).map((_, i) => (
            <button
              key={i}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              onClick={(e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.seg;
                if (id && onLabelClick) onLabelClick(id);
              }}
              className="pointer-events-auto absolute left-0 top-0 hidden rounded border border-cyan-300/60 bg-slate-950/75 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-cyan-200 shadow-lg backdrop-blur-sm hover:bg-cyan-500/30"
            />
          ))}
        </div>
      )}
      {/* orientation notch: marks image "up" like the real bronchoscope display */}
      <div className="pointer-events-none absolute left-1/2 top-[3%] h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-cyan-400/70" />
      {children}
    </div>
  );
}

function labelPoint(s: Segment): V3 {
  return add(s.a, scale(s.dir, Math.min(5, s.length * 0.4)));
}

function ScopeQuad({
  poseRef,
  lesion,
  bleedRef,
  flashRef,
  onTick,
  labelRefs,
  steps,
}: {
  poseRef: RefObject<Pose>;
  lesion: Lesion;
  bleedRef?: RefObject<number>;
  flashRef?: RefObject<number>;
  onTick?: (dt: number) => void;
  labelRefs?: RefObject<(HTMLButtonElement | null)[]>;
  steps: number;
}) {
  const { gl, size } = useThree();
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: endoscopeVertex,
      fragmentShader: endoscopeFragment,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uA: { value: Array.from({ length: MAX_CAPSULES }, () => new THREE.Vector3()) },
        uB: { value: Array.from({ length: MAX_CAPSULES }, () => new THREE.Vector3()) },
        uR: { value: Array.from({ length: MAX_CAPSULES }, () => new THREE.Vector2()) },
        uRing: { value: new Float32Array(MAX_CAPSULES) },
        uCount: { value: 0 },
        uCamPos: { value: new THREE.Vector3() },
        uRight: { value: new THREE.Vector3() },
        uUp: { value: new THREE.Vector3() },
        uFwd: { value: new THREE.Vector3() },
        uRes: { value: new THREE.Vector2(1, 1) },
        uHalfFov: { value: HALF_FOV },
        uTime: { value: 0 },
        uLesion: { value: new THREE.Vector4(0, 0, 0, 0) },
        uBleed: { value: 0 },
        uFlash: { value: 0 },
        uLight: { value: 1 },
        uSteps: { value: steps },
      },
    });
  }, [steps]);

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    onTick?.(Math.min(dt, 0.05));
    const pose = poseRef.current;
    const mesh = meshRef.current;
    if (!pose || !mesh) return;
    // Uniforms are mutated through the mounted mesh (render-loop side effect, not render-time).
    const u = (mesh.material as THREE.ShaderMaterial).uniforms;
    const fwd = norm(pose.forward);
    const right = norm(cross(fwd, pose.up));
    const up = cross(right, fwd);

    const near = nearbySegments(pose.pos, MAX_CAPSULES);
    near.forEach((s, i) => {
      (u.uA.value[i] as THREE.Vector3).set(...s.a);
      (u.uB.value[i] as THREE.Vector3).set(...s.b);
      (u.uR.value[i] as THREE.Vector2).set(s.r1, s.r2);
      (u.uRing.value as Float32Array)[i] = s.rings;
    });
    u.uCount.value = near.length;
    (u.uCamPos.value as THREE.Vector3).set(...pose.pos);
    (u.uRight.value as THREE.Vector3).set(...right);
    (u.uUp.value as THREE.Vector3).set(...up);
    (u.uFwd.value as THREE.Vector3).set(...fwd);
    gl.getDrawingBufferSize(u.uRes.value as THREE.Vector2);
    u.uTime.value = state.clock.elapsedTime;
    if (lesion) (u.uLesion.value as THREE.Vector4).set(...lesion.center, lesion.radius);
    else (u.uLesion.value as THREE.Vector4).set(0, 0, 0, 0);
    u.uBleed.value = bleedRef?.current ?? 0;
    u.uFlash.value = flashRef?.current ?? 0;

    if (labelRefs?.current) updateLabels(labelRefs.current, pose.pos, fwd, right, up, near, size.width, size.height);
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

const LABEL_CANDIDATES = SEGMENTS.filter((s) => s.level !== "subsegmental" && s.level !== "trachea");

function occluded(from: V3, to: V3, segs: Segment[]): boolean {
  const d = sub(to, from);
  const L = len(d);
  const dir = scale(d, 1 / L);
  let t = 0.5;
  for (let i = 0; i < 40 && t < L - 1.5; i++) {
    const w = -lumenSDF(add(from, scale(dir, t)), segs);
    if (w < 0.05) return true;
    t += Math.max(w * 0.9, 0.3);
  }
  return false;
}

function updateLabels(
  els: (HTMLButtonElement | null)[],
  pos: V3,
  fwd: V3,
  right: V3,
  up: V3,
  near: Segment[],
  W: number,
  H: number,
) {
  const R = 0.5 * Math.min(W, H);
  const visible: { s: Segment; x: number; y: number; dist: number; jd: number }[] = [];
  for (const s of LABEL_CANDIDATES) {
    const p = labelPoint(s);
    const d = sub(p, pos);
    const dist = len(d);
    if (dist > 48 || dist < 2) continue;
    const dn = scale(d, 1 / dist);
    const z = dot(dn, fwd);
    if (z < 0.2) continue;
    const theta = Math.acos(Math.min(1, z));
    const rr = theta / HALF_FOV;
    if (rr > 0.9) continue;
    // Only label orifices whose lumen is actually seen from here.
    if (occluded(pos, p, near)) continue;
    const phi = Math.atan2(dot(dn, up), dot(dn, right));
    const jd = len(sub(s.a, pos));
    visible.push({ s, x: W / 2 + Math.cos(phi) * rr * R, y: H / 2 - Math.sin(phi) * rr * R, dist, jd });
  }
  // Only label the next division(s) ahead, and avoid overlapping tags.
  const nearestJunction = Math.min(...visible.map((v) => v.jd));
  const placed: typeof visible = [];
  for (const v of visible.sort((a, b) => a.jd - b.jd || a.dist - b.dist)) {
    if (v.jd > nearestJunction + 9) continue;
    if (placed.some((p) => Math.hypot(p.x - v.x, p.y - v.y) < 30)) continue;
    placed.push(v);
  }
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    if (!el) continue;
    const v = placed[i];
    if (!v) {
      el.style.display = "none";
      continue;
    }
    const short = v.s.def?.boyden ?? v.s.id;
    if (el.textContent !== short) el.textContent = short;
    el.dataset.seg = v.s.id;
    el.title = v.s.name;
    el.style.display = "block";
    el.style.transform = `translate(${v.x}px, ${v.y}px) translate(-50%, -50%)`;
  }
}
