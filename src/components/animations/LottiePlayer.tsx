"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

interface LottiePlayerProps {
  animationData?: object;
  path?: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function LottiePlayer({ animationData, path, loop = true, autoplay = true, className, style }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData: animationData,
      path: path,
    });

    return () => {
      animRef.current?.destroy();
    };
  }, [animationData, path, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
}

// Simple animated heart using Lottie canvas
export function AnimatedHeart({ size = 40 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: {
        v: "5.7.4",
        fr: 30,
        ip: 0,
        op: 60,
        w: 100,
        h: 100,
        nm: "Heart",
        ddd: 0,
        assets: [],
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Heart",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              p: { a: 0, k: [50, 50, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: {
                a: 1,
                k: [
                  { i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] }, t: 0, s: [100, 100, 100] },
                  { i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] }, t: 15, s: [120, 120, 100] },
                  { i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] }, t: 30, s: [100, 100, 100] },
                  { t: 60, s: [100, 100, 100] },
                ],
              },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    ty: "sh",
                    d: 1,
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [0, -10],
                          [10, 0],
                          [0, 10],
                        ],
                        o: [
                          [0, 10],
                          [10, 0],
                          [0, -10],
                          [-10, 0],
                        ],
                        v: [
                          [0, -15],
                          [15, 0],
                          [0, 15],
                          [-15, 0],
                        ],
                        c: true,
                      },
                    },
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.902, 0.455, 0.631, 1] },
                    o: { a: 0, k: 100 },
                  },
                ],
                nm: "Heart Shape",
              },
            ],
            ip: 0,
            op: 60,
            st: 0,
          },
        ],
      },
    });
    return () => anim.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}

// Animated star
export function AnimatedStar({ size = 40 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: {
        v: "5.7.4",
        fr: 30,
        ip: 0,
        op: 60,
        w: 100,
        h: 100,
        nm: "Star",
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Star",
            ks: {
              o: { a: 0, k: 100 },
              r: {
                a: 1,
                k: [
                  { i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] }, t: 0, s: [0] },
                  { t: 60, s: [360] },
                ],
              },
              p: { a: 0, k: [50, 50, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: { a: 0, k: [100, 100, 100] },
            },
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    ty: "sr",
                    p: { a: 0, k: [0, 0] },
                    r: { a: 0, k: 0 },
                    ir: { a: 0, k: 15 },
                    is: { a: 0, k: 0 },
                    or: { a: 0, k: 30 },
                    os: { a: 0, k: 0 },
                    pt: { a: 0, k: 5 },
                    d: 1,
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.965, 0.663, 0.537, 1] },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
            ],
            ip: 0,
            op: 60,
            st: 0,
          },
        ],
      },
    });
    return () => anim.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}
