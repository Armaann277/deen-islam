"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function useStaggerReveal(selector: string, containerRef: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll(selector);
    gsap.fromTo(
      els,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: containerRef });
}

export function useFadeIn(containerRef: React.RefObject<HTMLElement | null>, delay = 0) {
  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, delay, ease: "power2.out" }
    );
  }, { scope: containerRef });
}

export function useScaleIn(containerRef: React.RefObject<HTMLElement | null>, delay = 0) {
  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.5, delay, ease: "back.out(1.7)" }
    );
  }, { scope: containerRef });
}

export function useSlideIn(containerRef: React.RefObject<HTMLElement | null>, direction: "left" | "right" = "left", delay = 0) {
  useGSAP(() => {
    if (!containerRef.current) return;
    const x = direction === "left" ? -40 : 40;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x },
      { opacity: 1, x: 0, duration: 0.6, delay, ease: "power3.out" }
    );
  }, { scope: containerRef });
}

export function useParallax(containerRef: React.RefObject<HTMLElement | null>, speed = 0.3) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrolled = window.scrollY;
      gsap.set(el, { y: scrolled * speed });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerRef, speed]);
}
