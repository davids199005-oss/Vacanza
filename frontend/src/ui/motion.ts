/**
 * @fileoverview Framer Motion variants and presets.
 * Layer: UI — shared animation definitions for consistent motion.
 * Notes:
 * - Shared presets avoid duplicated transition config across components.
 */

import type { TargetAndTransition, Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    // Simple opacity transition for non-disruptive reveals.
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeScale: Variants = {
  // Slight zoom + lift entrance.
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeUp: Variants = {
  // Vertical entrance variant with optional stagger delay.
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: custom * 0.08,
      ease: "easeOut",
    },
  }),
};

export const staggerContainer: Variants = {
  // Parent variant that staggers child animations.
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

export const staggerItem: Variants = {
  // Default child reveal for list/grid items.
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const buttonHover: TargetAndTransition = {
  // Micro-interaction for hover state.
  y: -2,
  scale: 1.01,
  transition: { duration: 0.2, ease: "easeOut" as const },
};

export const buttonTap: TargetAndTransition = {
  // Pressed state micro-animation.
  y: 0,
  scale: 0.98,
  transition: { duration: 0.12, ease: "easeOut" as const },
};
