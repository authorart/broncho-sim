"use client";

import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { SEGMENTS, type Segment } from "@/lib/airway/geometry";
import { NODE_STATIONS, VESSELS, ZONE_COLORS, type Access, type NodeStation } from "@/lib/data/mediastinum";

export type MapSelection = { type: "airway"; id: string } | { type: "node"; id: string } | null;

export type MapOptions = {
  showVessels: boolean;
  showNodes: boolean;
  showLabels: boolean;
  accessFilter: Access | "all";
};

const UP = new THREE.Vector3(0, 1, 0);

/** Text label as a camera-facing sprite (canvas texture) — cheaper than DOM overlays. */
function Label({ text, position, bg, fg }: { text: string; position: [number, number, number]; bg: string; fg: string }) {
  const { texture, aspect } = useMemo(() => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;
    const font = "bold 44px ui-monospace, Menlo, monospace";
    ctx.font = font;
    const w = Math.ceil(ctx.measureText(text).width) + 28;
    c.width = w;
    c.height = 64;
    ctx.font = font;
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, 64, 12);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 14, 34);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return { texture: t, aspect: w / 64 };
  }, [text, bg, fg]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite position={position} scale={[5.5 * aspect, 5.5, 1]} renderOrder={10}>
      <spriteMaterial map={texture} depthTest={false} transparent />
    </sprite>
  );
}

function AirwayTube({ s, selected, onSelect }: { s: Segment; selected: boolean; onSelect: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...s.a);
    const b = new THREE.Vector3(...s.b);
    const dir = b.clone().sub(a);
    const length = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
    return { position: a.clone().add(b).multiplyScalar(0.5), quaternion: q, length };
  }, [s]);
  const target = s.level === "subsegmental" ? s.segmentId! : s.id;
  const color = selected ? "#22d3ee" : hover ? "#fda4af" : s.level === "subsegmental" ? "#e7a3a0" : "#f2b8b0";
  return (
    <group>
      <mesh
        position={position}
        quaternion={quaternion}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(target);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        <cylinderGeometry args={[s.r2, s.r1, length, 20, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={s.b}>
        <sphereGeometry args={[s.r2, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      {hover && (
        <Label text={s.level === "subsegmental" ? s.segmentId! : s.id} position={s.b} bg="#020617" fg="#fecdd3" />
      )}
    </group>
  );
}

function VesselTube({ points, radius, color }: { points: [number, number, number][]; radius: number; color: string }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 64, radius, 16, false);
  }, [points, radius]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} transparent opacity={0.32} roughness={0.4} depthWrite={false} />
    </mesh>
  );
}

function NodeBlob({
  st,
  selected,
  dimmed,
  showLabel,
  onSelect,
}: {
  st: NodeStation;
  selected: boolean;
  dimmed: boolean;
  showLabel: boolean;
  onSelect: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const color = ZONE_COLORS[st.zone];
  return (
    <>
      {st.positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh
            scale={selected ? 1.25 : 1}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(st.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHover(true);
            }}
            onPointerOut={() => setHover(false)}
          >
            <sphereGeometry args={[st.radius, 20, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={selected || hover ? 0.6 : 0.15}
              transparent
              opacity={dimmed ? 0.15 : 0.95}
              roughness={0.35}
            />
          </mesh>
          {(showLabel || hover || selected) && !dimmed && (
            <Label text={st.id} position={[0, st.radius + 4, 0]} bg={color} fg="#020617" />
          )}
        </group>
      ))}
    </>
  );
}

export function AirwayMap3D({
  selection,
  onSelect,
  options,
}: {
  selection: MapSelection;
  onSelect: (s: MapSelection) => void;
  options: MapOptions;
}) {
  return (
    <Canvas
      camera={{ position: [-50, 20, 300], fov: 40, near: 1, far: 2000 }}
      dpr={[1, 2]}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#060a11"]} />
      <hemisphereLight args={["#e2e8f0", "#0f172a", 0.9]} />
      <directionalLight position={[60, 120, 150]} intensity={1.3} />
      <directionalLight position={[-80, -40, -100]} intensity={0.4} />
      <group position={[0, -15, 0]}>
        {SEGMENTS.map((s) => (
          <AirwayTube
            key={s.id}
            s={s}
            selected={selection?.type === "airway" && (selection.id === s.id || selection.id === s.segmentId)}
            onSelect={(id) => onSelect({ type: "airway", id })}
          />
        ))}
        {options.showVessels && VESSELS.map((v) => <VesselTube key={v.id} points={v.points} radius={v.radius} color={v.color} />)}
        {options.showNodes &&
          NODE_STATIONS.map((st) => (
            <NodeBlob
              key={st.id}
              st={st}
              selected={selection?.type === "node" && selection.id === st.id}
              dimmed={options.accessFilter !== "all" && !st.access.includes(options.accessFilter)}
              showLabel={options.showLabels}
              onSelect={(id) => onSelect({ type: "node", id })}
            />
          ))}
      </group>
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={60} maxDistance={600} />
    </Canvas>
  );
}
