'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InfoSectionProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  gradientTheme: {
    background: string;
    border: string;
    iconBg: string;
    iconColor: string;
  };
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const InfoSection = ({
  icon,
  title,
  description,
  children,
  gradientTheme,
  className = '',
}: InfoSectionProps) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 },
      }}
      className={`group relative ${className}`}
    >
      <div
        className={`absolute inset-0 ${gradientTheme.background} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>

      <div
        className={`relative ${gradientTheme.background} rounded-xl p-4 border ${gradientTheme.border} hover:border-border transition-all duration-500 backdrop-blur-sm`}
      >
        <div className="flex items-start space-x-4">
          <motion.div
            className={`p-3 rounded-xl ${gradientTheme.iconBg} border ${gradientTheme.iconColor} group-hover:shadow-lg group-hover:shadow-primary/20 flex-shrink-0`}
            whileHover={{
              rotate: [0, -5, 5, 0],
              scale: 1.1,
              transition: { duration: 0.3 },
            }}
          >
            <div className="w-6 h-6 text-chart-2 drop-shadow-sm">{icon}</div>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="text-lg font-bold text-foreground tracking-wide">
                {title}
              </h3>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="p-1 rounded-lg bg-gradient-to-br from-chart-2/20 to-primary/20 border border-chart-2/30"
              >
                <div className="w-3 h-3 text-chart-2">⚡</div>
              </motion.div>
            </div>
            {description && (
              <p className="text-foreground mb-4 text-sm leading-relaxed">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>

        {/* Enhanced glow effect */}
        <div
          className={`absolute inset-0 rounded-2xl ${gradientTheme.background} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm`}
        ></div>
      </div>
    </motion.div>
  );
};

export default InfoSection;
