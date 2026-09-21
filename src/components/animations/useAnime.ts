"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function useAnimeBounce(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, {
      scale: [
        { value: 1, duration: 100 },
        { value: 1.1, duration: 100 },
        { value: 1, duration: 100 },
      ],
      easing: "easeInOutQuad",
    });
  }, [ref]);
}

export function useAnimeShake(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, {
      translateX: [
        { value: -5, duration: 50 },
        { value: 5, duration: 50 },
        { value: -3, duration: 50 },
        { value: 3, duration: 50 },
        { value: 0, duration: 50 },
      ],
      easing: "easeInOutQuad",
    });
  }, [ref]);
}

export function useAnimePulse(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, {
      scale: [1, 1.05, 1],
      duration: 1500,
      loop: true,
      easing: "easeInOutQuad",
    });
  }, [ref]);
}

export function useAnimeFloat(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    animate(ref.current, {
      translateY: [
        { value: -10, duration: 1000 },
        { value: 0, duration: 1000 },
      ],
      duration: 2000,
      loop: true,
      easing: "easeInOutQuad",
    });
  }, [ref]);
}

export function animateButton(el: HTMLElement) {
  animate(el, {
    scale: [
      { value: 0.95, duration: 100 },
      { value: 1, duration: 100 },
    ],
    easing: "easeInOutQuad",
  });
}

export function animateCardFlip(el: HTMLElement) {
  animate(el, {
    rotateY: [
      { value: 0, duration: 200 },
      { value: 180, duration: 300 },
      { value: 360, duration: 200 },
    ],
    easing: "easeInOutQuad",
  });
}

export function animateStagger(selector: string, container: HTMLElement) {
  const elements = container.querySelectorAll(selector);
  animate(elements, {
    opacity: [0, 1],
    translateY: [20, 0],
    delay: stagger(100),
    easing: "easeOutCubic",
  });
}
