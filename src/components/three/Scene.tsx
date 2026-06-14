"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Globe } from "./Globe";
import { ParticleField } from "./ParticleField";

interface SceneProps {
  className?: string;
}

export function Scene({ className }: SceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLowEnd, setIsLowEnd] = useState(false);

  // Detect low-end devices
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // Basic heuristic for mobile/low-end GPUs
        if (
          /SwiftShader|Mali-4|Adreno \(TM\) 3|PowerVR/i.test(renderer) ||
          window.innerWidth < 768
        ) {
          setIsLowEnd(true);
        }
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    },
    []
  );

  if (isLowEnd) {
    // Fallback for low-end devices — CSS gradient orb
    return (
      <div className={className}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-accent/20 via-accent/5 to-transparent blur-3xl animate-pulse-glow" />
        </div>
      </div>
    );
  }

  return (
    <div className={className} onMouseMove={handleMouseMove}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Subtle ambient light */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00D9FF" />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.2}
            color="#6366f1"
          />

          <Globe mousePosition={mousePosition} />
          <ParticleField count={600} radius={3.5} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
