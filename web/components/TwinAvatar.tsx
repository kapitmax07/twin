"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = "#3b82f6";
const ACCENT_2 = "#60a5fa";

function Limb({
  position,
  rotation,
  length = 1.2,
  radius = 0.12,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  length?: number;
  radius?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <capsuleGeometry args={[radius, length, 6, 12]} />
      <meshStandardMaterial
        color="#0f172a"
        emissive={ACCENT}
        emissiveIntensity={0.35}
        roughness={0.35}
        metalness={0.6}
      />
    </mesh>
  );
}

function HoloFigure() {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.2) * 0.06;
      group.current.rotation.y = Math.sin(t * 0.4) * 0.15;
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.6) * 0.25;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.6;
    }
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {/* Head */}
      <mesh ref={head} position={[0, 1.85, 0]} castShadow>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={ACCENT_2}
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.7}
          wireframe={false}
        />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshBasicMaterial color={ACCENT_2} wireframe transparent opacity={0.5} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.34, 0.9, 8, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={ACCENT}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.65}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.36, 0.94, 8, 16]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.35} />
      </mesh>

      {/* Arms */}
      <Limb position={[-0.55, 1.15, 0]} rotation={[0, 0, 0.35]} length={0.9} radius={0.11} />
      <Limb position={[0.55, 1.15, 0]} rotation={[0, 0, -0.35]} length={0.9} radius={0.11} />

      {/* Legs */}
      <Limb position={[-0.22, 0.1, 0]} rotation={[0, 0, 0.06]} length={1} radius={0.13} />
      <Limb position={[0.22, 0.1, 0]} rotation={[0, 0, -0.06]} length={1} radius={0.13} />

      {/* Orbiting data ring */}
      <mesh ref={ring} position={[0, 1.05, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.15, 0.006, 8, 64]} />
        <meshBasicMaterial color={ACCENT_2} transparent opacity={0.6} />
      </mesh>

      {/* Base platform ring */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.8, 48]} />
        <meshBasicMaterial color={ACCENT_2} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.54, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.52, 48]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const count = 120;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.6 + Math.random() * 1.2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 3 - 0.5;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={ACCENT_2} size={0.02} transparent opacity={0.7} />
    </points>
  );
}

export default function TwinAvatar() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.1, 5.4], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0a0e1a"]} />
      <fog attach="fog" args={["#0a0e1a", 6, 12]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 2]} intensity={1} color={ACCENT_2} />
      <pointLight position={[-2, 1, -2]} intensity={0.6} color={ACCENT} />
      <directionalLight position={[0, 4, 3]} intensity={0.5} castShadow />

      <Suspense fallback={null}>
        <HoloFigure />
        <Particles />
        <ContactShadows position={[0, -0.9, 0]} opacity={0.5} scale={5} blur={2.4} far={2} color="#000000" />
      </Suspense>

      <OrbitControls
        target={[0, 0.65, 0]}
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={7.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={1.1}
      />
    </Canvas>
  );
}
