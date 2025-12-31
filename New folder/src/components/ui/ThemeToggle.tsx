import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

const themes = ['light', 'dark', 'system'] as const;
const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    const current = theme ?? 'system';
    const currentIndex = themes.indexOf(current as (typeof themes)[number]);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  let Icon = icons['system'];
  const themeStr = String(theme);
  if (themeStr === 'light' || themeStr === 'dark' || themeStr === 'system') {
    Icon = icons[themeStr];
  }

  return (
    <div className="flex items-center justify-center px-1 py-0">
      {mounted ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-2 rounded-lg bg-muted hover:bg-muted/70 text-muted-foreground transition-colors cursor-pointer border border-border"
          onClick={cycleTheme}
          aria-label={`Current theme: ${theme}. Click to cycle themes.`}
          title={`Current: ${theme}. Click to cycle.`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-4 h-4 text-inherit" />
          </motion.div>
        </motion.button>
      ) : (
        <div className="p-2 w-6 h-6"></div>
      )}
    </div>
  );
}
