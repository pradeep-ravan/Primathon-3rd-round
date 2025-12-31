"use client";

import {
  OptimizedMotion,
  optimizedVariants,
} from "@/components/ui/OptimizedMotion";
import { ReactNode } from "react";

interface MetricItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  status?: string;
  trend?: string;
  trendIcon?: ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  index: number;
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const MetricItem = ({
  icon,
  label,
  value,
  status,
  trend,
  trendIcon,
  color,
  bgColor,
  borderColor,
  index,
  className = "",
}: MetricItemProps) => {
  return (
    <OptimizedMotion
      variants={optimizedVariants.fadeIn}
      whileHover={optimizedVariants.hover}
      className={`group relative ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex items-center space-x-3 p-4 rounded-xl gradient-accent bg-card/60 dark:bg-card/40 hover:bg-card/70 transition-all duration-200 border border-border/50 hover:border-primary/30 backdrop-blur-sm">
        {/* Animated icon container */}
        <OptimizedMotion
          className={`p-2.5 rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor} group-hover:shadow-lg group-hover:shadow-primary/10 flex-shrink-0`}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          <div className={`w-5 h-5 ${color} drop-shadow-sm`}>{icon}</div>
        </OptimizedMotion>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1.5 space-y-1 sm:space-y-0">
            <p className="text-xs text-foreground font-semibold tracking-wide uppercase break-words">
              {label}
            </p>
            {trend && trendIcon && (
              <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                {trendIcon}
                <span className="break-words">{trend}</span>
              </div>
            )}
          </div>
          <OptimizedMotion
            as="p"
            className="text-lg font-bold text-foreground group-hover:text-foreground/90 transition-colors duration-200"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            {value}
          </OptimizedMotion>
          {status && (
            <div className="flex items-center space-x-2 mt-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  status === "active" ? "bg-chart-1" : "bg-muted-foreground"
                } animate-pulse flex-shrink-0`}
              ></div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider break-words">
                {status}
              </span>
            </div>
          )}
        </div>

        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}
        ></div>
      </div>
    </OptimizedMotion>
  );
};

export default MetricItem;
