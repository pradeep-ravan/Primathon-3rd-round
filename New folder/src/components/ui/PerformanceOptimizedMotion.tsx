"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface PerformanceOptimizedMotionProps extends MotionProps {
  children: ReactNode;
  reducedMotion?: boolean;
}

/**
 * Performance-optimized motion component that reduces animations
 * when performance is critical or user prefers reduced motion
 */
export const PerformanceOptimizedMotion = ({
  children,
  reducedMotion = false,
  ...props
}: PerformanceOptimizedMotionProps) => {
  // Check for user's motion preference
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const shouldReduceMotion = reducedMotion || prefersReducedMotion;

  if (shouldReduceMotion) {
    // Return static div when motion should be reduced
    return <div {...props}>{children}</div>;
  }

  return <motion.div {...props}>{children}</motion.div>;
};

export default PerformanceOptimizedMotion;
