

import type { TargetAndTransition, Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeScale: Variants = {
  
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeUp: Variants = {
  
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
  
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

export const staggerItem: Variants = {
  
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const buttonHover: TargetAndTransition = {
  
  y: -2,
  scale: 1.01,
  transition: { duration: 0.2, ease: "easeOut" as const },
};

export const buttonTap: TargetAndTransition = {
  
  y: 0,
  scale: 0.98,
  transition: { duration: 0.12, ease: "easeOut" as const },
};
