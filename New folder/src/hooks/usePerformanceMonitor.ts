"use client";

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  isSlowRender: boolean;
}

/**
 * Hook to monitor component performance and detect slow renders
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStartTime.current;

      // Log slow renders (> 16ms for 60fps)
      if (renderTime > 16) {
        console.warn(`Slow render detected in ${componentName}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          renderCount: renderCount.current,
        });
      }

      // Log memory usage if available
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        console.log(`${componentName} memory usage:`, {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        });
      }
    };
  });

  return {
    renderCount: renderCount.current,
  };
};

export default usePerformanceMonitor;
