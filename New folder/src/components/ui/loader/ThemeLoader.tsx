'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ThemeLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'success' | 'error';
}

const ThemeLoader = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default' 
}: ThemeLoaderProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const variantClasses = {
    default: 'text-emerald-500',
    success: 'text-green-500',
    error: 'text-red-500'
  };

  return (
    <motion.div
      className="flex items-center justify-center space-x-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Loader2 className={`${sizeClasses[size]} ${variantClasses[variant]}`} />
      </motion.div>
      
      {text && (
        <motion.span
          className="text-sm font-medium text-gray-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );
};

export default ThemeLoader;
