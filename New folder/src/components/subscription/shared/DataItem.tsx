"use client";

import {
  OptimizedMotion,
  optimizedVariants,
} from "@/components/ui/OptimizedMotion";
import { ReactNode } from "react";

interface DataItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  status?: string;
  color: string;
  bgColor: string;
  borderColor: string;
  index: number;
  className?: string;
}

// Removed unused itemVariants - using optimizedVariants instead

const DataItem = ({
  icon,
  label,
  value,
  status,
  color,
  bgColor,
  borderColor,
  index,
  className = "",
}: DataItemProps) => {
  return (
    <OptimizedMotion
      variants={optimizedVariants.fadeIn}
      whileHover={optimizedVariants.hover}
      className={`group relative ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 px-4 gradient-accent bg-card/60 dark:bg-card/40 hover:bg-card/70 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200 backdrop-blur-sm space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <OptimizedMotion
            className={`p-2.5 rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor} group-hover:shadow-lg group-hover:shadow-primary/10 flex-shrink-0`}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <div className={`w-5 h-5 ${color} drop-shadow-sm`}>{icon}</div>
          </OptimizedMotion>
          <div>
            <span className="text-foreground font-semibold text-sm tracking-wide">
              {label}
            </span>
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
        </div>
        <OptimizedMotion
          as="div"
          className="text-foreground font-bold text-lg sm:text-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: index * 0.05 + 0.3,
            type: "spring",
            stiffness: 200,
          }}
        >
          {value}
        </OptimizedMotion>
      </div>

      {/* Subtle glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}
      >
        {" "}
      </div>
    </OptimizedMotion>
  );
};

export default DataItem;
