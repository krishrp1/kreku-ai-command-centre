"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GlassPanel } from "@/components/nexus/glass-panel";
import { StatusDot } from "@/components/nexus/status-dot";
import { useMotionSafe } from "@/hooks/use-motion-safe";

const ACCENT = new THREE.Color("#00e5ff");

// Generated once at module load — random calls are impure during render.
const SURFACE_POINTS = (() => {
  const positions = new Float32Array(1400 * 3);
  for (let i = 0; i < 1400; i++) {
    // Uniform sphere sampling
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    positions[i * 3] = r * Math.cos(theta) * 1.6;
    positions[i * 3 + 1] = u * 1.6;
    positions[i * 3 + 2] = r * Math.sin(theta) * 1.6;
  }
  return positions;
})();

/** Point-cloud globe with orbit paths and tracked satellites. */
function Globe() {
  const groupRef = useRef<THREE.Group>(null);

  const orbits = useMemo(() => {
    return [1.95, 2.2, 2.5].map((radius, index) => {
      const points: [number, number, number][] = [];
      for (let a = 0; a <= 128; a++) {
        const angle = (a / 128) * Math.PI * 2;
        points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
      }
      return { radius, points, tilt: index * 0.5 - 0.5 };
    });
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.06;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[SURFACE_POINTS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.022} color={ACCENT} transparent opacity={0.8} />
      </points>
      <mesh>
        <sphereGeometry args={[1.58, 32, 32]} />
        <meshBasicMaterial color="#0a1420" transparent opacity={0.85} />
      </mesh>
      {orbits.map((orbit) => (
        <group key={orbit.radius} rotation={[orbit.tilt, 0, orbit.tilt * 0.6]}>
          <Line points={orbit.points} color="#00e5ff" transparent opacity={0.25} lineWidth={1} />
          <OrbitingSatellite radius={orbit.radius} speed={0.3 + orbit.radius * 0.1} />
        </group>
      ))}
    </group>
  );
}

function OrbitingSatellite({ radius, speed }: { radius: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime * speed;
    mesh.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.06, 0.06, 0.06]} />
      <meshBasicMaterial color={ACCENT} />
    </mesh>
  );
}

const TRACKED = [
  { id: "KH-7 KEYSTONE", orbit: "LEO 540km", status: "success" },
  { id: "VANTA-3", orbit: "MEO 8,200km", status: "success" },
  { id: "HELIOS RELAY", orbit: "GEO 35,786km", status: "warning" },
] as const;

export function SatelliteView() {
  const motionSafe = useMotionSafe();

  return (
    <div className="grid h-full min-h-[70vh] gap-4 lg:grid-cols-[2fr_1fr]">
      <GlassPanel scan className="relative min-h-[420px] overflow-hidden">
        <Canvas
          camera={{ position: [0, 1.4, 5.2], fov: 45 }}
          dpr={[1, 1.75]}
          frameloop={motionSafe ? "always" : "demand"}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <Globe />
          <Sparkles count={90} scale={8} size={1.4} speed={motionSafe ? 0.3 : 0} color={ACCENT} />
          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.2} mipmapBlur />
          </EffectComposer>
        </Canvas>
        <div className="pointer-events-none absolute left-4 top-4 font-mono text-[11px] text-muted-foreground">
          ORBITAL TRACKING — 3 ASSETS LOCKED
        </div>
      </GlassPanel>

      <div className="flex flex-col gap-4">
        {TRACKED.map((satellite) => (
          <GlassPanel key={satellite.id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm text-foreground">{satellite.id}</span>
              <StatusDot tone={satellite.status} />
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{satellite.orbit}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="animate-nexus-shimmer h-full w-full rounded-full bg-gradient-to-r from-transparent via-nexus to-transparent bg-[length:200%_100%]" />
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
