"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingParticles({ count = 50, color = "#E6748E" }: { count?: number; color?: string }) {
  const mesh = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[-2, 1, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#933B5B" transparent opacity={0.4} />
      </mesh>
      <mesh position={[2, -1, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#6BB1AD" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 2, -1]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#E6748E" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function ThreeBackground({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", ...style }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingParticles count={80} color="#E6748E" />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}

export function ThreeBackgroundMinimal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", ...style }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
        <ambientLight intensity={0.3} />
        <FloatingParticles count={40} color="#933B5B" />
      </Canvas>
    </div>
  );
}
