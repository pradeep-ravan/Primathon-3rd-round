"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode, ElementType } from "react";

interface OptimizedMotionProps extends MotionProps {
  children: ReactNode;
  reducedMotion?: boolean;
  optimized?: boolean;
  as?: ElementType;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  [key: string]: unknown; // Allow additional props
}

/**
 * Optimized motion component with performance improvements:
 * - Respects user's motion preferences
 * - Uses optimized animation variants
 * - Better GPU acceleration
 * - Reduced animation complexity when needed
 */
export const OptimizedMotion = ({
  children,
  reducedMotion = false,
  optimized = true,
  as,
  ...props
}: OptimizedMotionProps) => {
  // Check for user's motion preference
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const shouldReduceMotion = reducedMotion || prefersReducedMotion;

  if (shouldReduceMotion) {
    // Return static element when motion should be reduced
    const Element = (as || "div") as ElementType;
    return <Element {...props}>{children}</Element>;
  }

  // Optimize animations for better performance
  const optimizedProps = optimized
    ? {
        ...props,
        style: {
          ...props.style,
          transform: "translateZ(0)", // Force GPU acceleration
          backfaceVisibility: "hidden" as const, // Optimize rendering
          willChange: "transform, opacity", // Hint to browser
        },
      }
    : props;

  // For now, always use motion.div for simplicity
  // TODO: Add support for other motion elements if needed
  return <motion.div {...optimizedProps}>{children}</motion.div>;
};

/**
 * Optimized animation variants for common use cases
 */
export const optimizedVariants = {
  // Fade in with optimized timing
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  },

  // Slide up with optimized timing
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  },

  // Scale in with optimized timing
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  },

  // Stagger children with optimized timing
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  // Hover effects with optimized timing
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },

  // Table row animations with optimized timing
  tableRow: {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut" as const,
      },
    }),
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  },
};

export default OptimizedMotion;
