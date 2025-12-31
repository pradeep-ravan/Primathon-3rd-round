"use client";

import React, { ReactNode, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TabContentProps {
  activeTab: string;
  children: (activeTab: string) => ReactNode;
  className?: string;
  padding?: boolean;
}

function TabContentComponent({
  activeTab,
  children,
  className = "",
  padding = true,
}: TabContentProps) {
  // Memoize animation config to prevent recreation on every render
  const animationConfig = useMemo(() => ({
    initial: {
      opacity: 0,
      x: 10,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -10,
    },
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  }), []);

  return (
    <div className={`flex-1 relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          {...animationConfig}
          className={`h-full ${padding ? "p-6 lg:p-8" : ""} overflow-y-auto scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent hover:scrollbar-thumb-border`}
        >
          {children(activeTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const TabContent = memo(TabContentComponent);
