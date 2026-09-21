"use client";

import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, direction = "left", delay = 0 }: { children: ReactNode; direction?: "left" | "right" | "up" | "down"; delay?: number }) {
  const dirs = { left: { x: -40 }, right: { x: 40 }, up: { y: -40 }, down: { y: 40 } };
  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, staggerDelay = 0.1 }: { children: ReactNode; staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function PulseGlow({ children }: { children: ReactNode }) {
  return (
    <motion.div
      animate={{ boxShadow: ["0 0 0 0 rgba(147,59,91,0)", "0 0 20px 10px rgba(147,59,91,0.15)", "0 0 0 0 rgba(147,59,91,0)"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function TapScale({ children, onTap }: { children: ReactNode; onTap?: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onTap}
      style={{ cursor: "pointer" }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatePresenceWrapper({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
