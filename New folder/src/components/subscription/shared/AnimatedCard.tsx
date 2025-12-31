"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  OptimizedMotion,
  optimizedVariants,
} from "@/components/ui/OptimizedMotion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  title: string;
  icon: ReactNode;
  gradientTheme: {
    background: string;
    border: string;
    iconBg: string;
    iconColor: string;
  };
  className?: string;
}

// Use optimized variants
const containerVariants = optimizedVariants.staggerContainer;

const AnimatedCard = ({
  children,
  title,
  icon,
  gradientTheme,
  className = "",
}: AnimatedCardProps) => {
  return (
    <OptimizedMotion
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`relative ${className}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl"></div>

      <Card className="relative gradient-card bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden">
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl opacity-50"></div>

        <CardHeader className="relative pb-4">
          <div className="flex items-center space-x-3">
            <OptimizedMotion
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border border-primary/30 shadow-md"
            >
              {icon}
            </OptimizedMotion>
            <CardTitle className="text-xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="relative">{children}</CardContent>
      </Card>
    </OptimizedMotion>
  );
};

export default AnimatedCard;
