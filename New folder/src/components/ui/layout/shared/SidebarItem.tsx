"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  className?: string;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  title,
  href,
  isActive = false,
  isCollapsed = false,
  className = "",
  onClick,
}: SidebarItemProps) => {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className={`block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl ${className}`}
    >
      <motion.div
        className={`relative flex items-center ${
          isCollapsed ? "justify-center p-2.5" : "px-4 py-2"
        } rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Active Background Gradient (Subtle) */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        )}

        {/* Icon */}
        <div className={`relative z-10 flex flex-shrink-0 items-center justify-center transition-colors duration-200`}>
          <Icon size={isCollapsed ? 22 : 20} className={isActive ? "stroke-[2.5]" : "stroke-[2]"} />
        </div>

        {/* Title (Hidden if collapsed) */}
        {!isCollapsed && (
          <span className={`ml-3 text-sm font-medium tracking-wide truncate relative z-10 ${isActive ? "font-semibold" : ""}`}>
            {title}
          </span>
        )}

        {/* Active Indicator Dot (Optional: could be used instead of full background for a different variant) */}
        {/* {isActive && isCollapsed && (
          <motion.div
            layoutId="activeDot"
            className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
          />
        )} */}
        {/* Tooltip for Collapsed State */}
        {isCollapsed && (
          <motion.div
             initial={{ opacity: 0, x: 10, scale: 0.95 }}
             whileHover={{ opacity: 1, x: 0, scale: 1 }}
             transition={{ duration: 0.2 }}
             className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-md shadow-lg border border-border/50 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 hidden group-hover:block"
          >
            {title}
            {/* Arrow */}
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-popover rotate-45 border-l border-b border-border/50" />
          </motion.div>
        )}
      </motion.div>
    </Link>
  );
};

export default SidebarItem;
