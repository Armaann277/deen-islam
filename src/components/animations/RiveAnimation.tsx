"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const RiveComponent = dynamic(() => import("@rive-app/react-canvas").then(mod => mod.default), { ssr: false });

interface RiveAnimationProps {
  src?: string;
  stateMachine?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RiveAnimation({ src, stateMachine, className, style }: RiveAnimationProps) {
  return (
    <div className={className} style={style}>
      {src && (
        <RiveComponent
          src={src}
          stateMachines={stateMachine}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

// Animated loading spinner using Rive-style CSS animation
export function AnimatedSpinner({ size = 40, color = "#933B5B" }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Animated wave loader
export function AnimatedWave({ color = "#6BB1AD" }: { color?: string }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", height: 30 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 20,
            backgroundColor: color,
            borderRadius: 2,
            animation: `wave 1s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 10px; }
          50% { height: 25px; }
        }
      `}</style>
    </div>
  );
}

// Floating dots animation
export function FloatingDots({ count = 20 }: { count?: number }) {
  const [dots] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }))
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map((dot) => (
        <div
          key={dot.id}
          style={{
            position: "absolute",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            backgroundColor: "#E6748E",
            opacity: 0.3,
            animation: `float ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-20px) translateX(3px); }
        }
      `}</style>
    </div>
  );
}
