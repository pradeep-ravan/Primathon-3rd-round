"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface OptimizedAnimatedBackgroundProps {
  children?: ReactNode;
  reducedMotion?: boolean;
}

/**
 * Optimized animated background with performance improvements:
 * - Respects user's motion preferences
 * - Uses CSS transforms instead of layout properties
 * - Reduced animation complexity
 * - Better GPU acceleration
 */
const OptimizedAnimatedBackground = ({
  children,
  reducedMotion = false,
}: OptimizedAnimatedBackgroundProps) => {
  // Check for user's motion preference
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const shouldReduceMotion = reducedMotion || prefersReducedMotion;

  // Optimized animation variants
  const blobVariants = {
    animate: shouldReduceMotion
      ? {}
      : {
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        },
  };

  const transition = shouldReduceMotion
    ? {}
    : {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const,
      };

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      {/* Base gradient - Enhanced with gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30 text-foreground"
        style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }}
      ></div>

      {/* Optimized gradient blobs with enhanced colors - more visible now */}
      <motion.div
        className="absolute -top-[20%] -right-[10%] w-[70vh] h-[70vh] rounded-full bg-primary/30 blur-[100px] will-change-transform mix-blend-multiply dark:mix-blend-screen"
        animate={blobVariants.animate}
        transition={transition}
        style={{
          transform: "translateZ(0)", // Force GPU acceleration
          backfaceVisibility: "hidden", // Optimize rendering
        }}
      />
      
      <motion.div
        className="absolute bottom-0 -left-[10%] w-[60vh] h-[60vh] rounded-full bg-accent/30 blur-[100px] will-change-transform mix-blend-multiply dark:mix-blend-screen"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -25, 0],
                y: [0, 30, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          ...transition,
          duration: 25,
        }}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] rounded-full bg-secondary/30 blur-[100px] will-change-transform mix-blend-multiply dark:mix-blend-screen"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }
        }
        transition={{
          ...transition,
          duration: 30,
        }}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Noise Texture for premium feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnPjxmaWx0ZXIgaWQ9J25vaXNlJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC42JyBzdGl0Y2hUaWxlcz0nc3RGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbm9pc2UpJyBvcGFjaXR5PScwLjAzJy8+PC9zdmc+')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      {children}
    </div>
  );
};

export default OptimizedAnimatedBackground;
