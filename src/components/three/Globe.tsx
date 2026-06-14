"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlobeProps {
  mousePosition: { x: number; y: number };
}

export function Globe({ mousePosition }: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const dotsRef = useRef<THREE.Points>(null);

  // Globe surface dots
  const dotPositions = useMemo(() => {
    const positions: number[] = [];
    const radius = 1.5;
    const dotCount = 2000;

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;

      positions.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
    }
    return new Float32Array(positions);
  }, []);

  // Connection arcs — representing career connections
  const arcGeometries = useMemo(() => {
    const arcs: THREE.BufferGeometry[] = [];
    const connections = [
      { from: [0.8, 0.5, 1.2], to: [-1.0, 0.3, 1.0] },
      { from: [-0.5, 1.2, 0.6], to: [0.3, -0.8, 1.2] },
      { from: [1.0, -0.3, 1.0], to: [-0.3, 1.0, 1.0] },
      { from: [-1.2, 0.2, 0.8], to: [0.6, 0.8, 1.1] },
    ];

    connections.forEach(({ from, to }) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(from[0], from[1], from[2]),
        new THREE.Vector3(
          (from[0] + to[0]) / 2,
          (from[1] + to[1]) / 2 + 0.8,
          (from[2] + to[2]) / 2 + 0.5
        ),
        new THREE.Vector3(to[0], to[1], to[2])
      );
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      arcs.push(geometry);
    });

    return arcs;
  }, []);

  useFrame((state) => {
    if (!globeRef.current) return;

    // Gentle auto-rotation
    globeRef.current.rotation.y += 0.002;

    // Mouse influence
    const targetRotX = mousePosition.y * 0.3;
    const targetRotX2 = mousePosition.x * 0.3;

    globeRef.current.rotation.x +=
      (targetRotX - globeRef.current.rotation.x) * 0.05;
    globeRef.current.rotation.z +=
      (targetRotX2 - globeRef.current.rotation.z) * 0.05;

    // Glow pulse
    if (glowRef.current) {
      const scale = 1.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={globeRef}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef} scale={1.6}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe sphere */}
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          wireframe
          color="#00D9FF"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Surface dots */}
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dotPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.008}
          color="#00D9FF"
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Connection arcs */}
      {arcGeometries.map((geometry, i) => (
        <line key={i}>
          <primitive object={geometry} attach="geometry" />
          <lineBasicMaterial
            color="#00D9FF"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}

      {/* Core inner glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}
