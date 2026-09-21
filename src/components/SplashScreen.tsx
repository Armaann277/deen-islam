"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ease-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#E3D6BF" }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Heart icon with spring entrance */}
        <span
          className="text-6xl transition-all duration-700 ease-out"
          style={{
            color: "#933B5B",
            transform: mounted ? "scale(1)" : "scale(0.8)",
            opacity: mounted ? 1 : 0,
            transitionDelay: "100ms",
          }}
        >
          ☪
        </span>

        {/* Greeting text with stagger */}
        <div className="text-center space-y-2">
          <p
            className="text-lg tracking-wide transition-all duration-600 ease-out"
            style={{
              color: "#562747",
              fontFamily: "Georgia, serif",
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              opacity: mounted ? 1 : 0,
              transitionDelay: "300ms",
            }}
          >
            Assalamu Alaikum,
          </p>
          <p
            className="text-2xl font-light transition-all duration-600 ease-out"
            style={{
              color: "#933B5B",
              fontFamily: "Georgia, serif",
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              opacity: mounted ? 1 : 0,
              transitionDelay: "450ms",
            }}
          >
            Deen Islam.
          </p>
        </div>

        {/* Tagline with delayed entrance */}
        <p
          className="text-sm tracking-widest uppercase mt-4 transition-all duration-600 ease-out"
          style={{
            color: "#9F9679",
            fontFamily: "system-ui, sans-serif",
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            opacity: mounted ? 1 : 0,
            transitionDelay: "700ms",
          }}
        >
          your daily companion for prayer
        </p>
      </div>
    </div>
  );
}
