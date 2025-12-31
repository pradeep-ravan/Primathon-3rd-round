'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RedirectLoaderProps {
  message?: string;
  redirectText?: string;
  variant?: 'success' | 'info';
}

const RedirectLoader = ({ 
  message = 'Login successful!', 
  redirectText = 'Redirecting to dashboard...',
  variant = 'success'
}: RedirectLoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="flex flex-col items-center justify-center p-12 bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl">
        {/* Success Icon Animation */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
             <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <Check className="h-8 w-8 text-white stroke-[3px]" />
             </div>
          </div>
        </motion.div>
        
        {/* Text Content */}
        <div className="text-center space-y-3">
          <motion.h3
            className="text-2xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.h3>
          
          <motion.div
            className="flex items-center justify-center space-x-2 text-muted-foreground font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
             <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></span>
             <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></span>
             <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"></span>
            <span className="pl-1">{redirectText}</span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RedirectLoader;
