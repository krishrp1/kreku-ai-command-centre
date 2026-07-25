"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useMotionSafe } from "@/hooks/use-motion-safe";
import { useAssistantStore } from "@/store/assistant-store";

const ACCENT = new THREE.Color("#00e5ff");
const ACCENT_DIM = new THREE.Color("#0891b2");

/** Central pulsing energy sphere. Distortion speeds up while the AI works. */
function EnergySphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const status = useAssistantStore((s) => s.status);

  useFrame(({ clock, pointer }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    // Idle breathing plus a gentle lean toward the cursor.
    const breath = 1 + Math.sin(t * 1.2) * 0.035;
    mesh.scale.setScalar(breath);
    mesh.rotation.y = t * 0.15;
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, pointer.y * 0.3, 0.05);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, -pointer.x * 0.3, 0.05);
  });

  const busy = status === "thinking" || status === "responding";

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.1, 24]} />
      <MeshDistortMaterial
        color={ACCENT_DIM}
        emissive={ACCENT}
        emissiveIntensity={busy ? 0.9 : 0.45}
        roughness={0.15}
        metalness={0.8}
        distort={busy ? 0.45 : 0.28}
        speed={busy ? 4 : 1.6}
        wireframe
      />
    </mesh>
  );
}

/** Inner solid glow core behind the wireframe shell. */
function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const pulse = 0.72 + Math.sin(clock.elapsedTime * 2.1) * 0.05;
    mesh.scale.setScalar(pulse);
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={ACCENT} transparent opacity={0.16} />
    </mesh>
  );
}

/** Three tilted rings slowly counter-rotating around the core. */
function OrbitRings() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const t = clock.elapsedTime;
    group.children.forEach((ring, index) => {
      ring.rotation.z = t * 0.12 * (index % 2 === 0 ? 1 : -1);
    });
  });
  const rings = useMemo(
    () => [
      { radius: 1.7, tilt: [Math.PI / 2.2, 0.2, 0] as const, opacity: 0.5 },
      { radius: 2.1, tilt: [Math.PI / 1.8, -0.4, 0.3] as const, opacity: 0.3 },
      { radius: 2.5, tilt: [Math.PI / 2.6, 0.6, -0.2] as const, opacity: 0.2 },
    ],
    [],
  );
  return (
    <group ref={groupRef}>
      {rings.map((ring) => (
        <mesh key={ring.radius} rotation={ring.tilt}>
          <torusGeometry args={[ring.radius, 0.008, 8, 128]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  );
}

/** Small satellites orbiting on the outer ring plane. */
function Satellites() {
  const groupRef = useRef<THREE.Group>(null);
  const satellites = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        angle: (i / 4) * Math.PI * 2,
        radius: 2.1 + (i % 2) * 0.4,
        speed: 0.25 + i * 0.08,
        y: (i - 1.5) * 0.14,
      })),
    [],
  );
  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const t = clock.elapsedTime;
    group.children.forEach((child, i) => {
      const s = satellites[i];
      child.position.set(
        Math.cos(s.angle + t * s.speed) * s.radius,
        s.y + Math.sin(t * 0.8 + i) * 0.1,
        Math.sin(s.angle + t * s.speed) * s.radius,
      );
    });
  });
  return (
    <group ref={groupRef}>
      {satellites.map((s) => (
        <mesh key={s.angle}>
          <octahedronGeometry args={[0.055]} />
          <meshBasicMaterial color={ACCENT} />
        </mesh>
      ))}
    </group>
  );
}

/** Camera drifts slightly with the pointer for a parallax feel. */
function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.35, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface AiCoreProps {
  className?: string;
  /** Disable bloom for small embedded instances. */
  bloom?: boolean;
}

/** Holographic AI core scene. Falls back to a static frame under reduced motion. */
export function AiCore({ className, bloom = true }: AiCoreProps) {
  const motionSafe = useMotionSafe();

  return (
    <div className={className} role="img" aria-label="Holographic AI core visualization">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.75]}
        frameloop={motionSafe ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={12} color={ACCENT} />
        <Float speed={motionSafe ? 1.4 : 0} rotationIntensity={0.2} floatIntensity={0.4}>
          <EnergySphere />
          <InnerCore />
        </Float>
        <OrbitRings />
        <Satellites />
        <Sparkles count={70} scale={5.5} size={1.6} speed={motionSafe ? 0.35 : 0} color={ACCENT} />
        {motionSafe && <CameraRig />}
        {bloom && (
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.18} mipmapBlur radius={0.7} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
