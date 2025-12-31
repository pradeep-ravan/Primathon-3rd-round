"use client";

import React from "react";
import { useAppTheme } from "@/context/ThemeContext";
import { LIGHT_THEMES, DARK_THEMES, ThemeColors } from "@/config/themes";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Moon, Sun, Palette, RotateCcw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hexToHsl, hslToHex } from "@/lib/color-utils";

const QUICK_COLORS = [
  { name: "Blue", hex: "#3b82f6" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Orange", hex: "#f97316" },
  { name: "Red", hex: "#ef4444" },
  { name: "Slate", hex: "#64748b" },
];

const ThemeSettings = () => {
  const { 
    activeLightTheme, 
    setActiveLightTheme, 
    activeDarkTheme, 
    setActiveDarkTheme,
    customLightColors,
    updateCustomLightColor,
    customDarkColors,
    updateCustomDarkColor
  } = useAppTheme();
  
  const getPreviewColor = (hsl: string) => `hsl(${hsl})`;

  const ThemeCard = ({ 
     name, 
     theme, 
     isActive, 
     onClick 
  }: { 
     name: string, 
     theme: ThemeColors, 
     isActive: boolean, 
     onClick: () => void 
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border-2 overflow-hidden ${
        isActive ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-border/80"
      }`}
    >
      <div className="h-24 bg-card p-3 relative" style={{ backgroundColor: getPreviewColor(theme.background) }}>
         <div className="flex h-full gap-2">
           <div className="w-1/4 h-full rounded bg-muted/20" style={{ backgroundColor: getPreviewColor(theme.card) }} />
           <div className="flex-1 flex flex-col gap-2">
             <div className="h-2 w-3/4 rounded bg-foreground/20" style={{ backgroundColor: getPreviewColor(theme.foreground) }} />
             <div className="h-8 rounded bg-primary/20 flex items-center justify-center p-1" style={{ backgroundColor: getPreviewColor(theme.primary) }}>
                <div className="h-2 w-8 rounded bg-primary-foreground/50" style={{ backgroundColor: getPreviewColor(theme.primaryForeground) }} />
             </div>
           </div>
         </div>
         
         {/* Custom Badge */}
         {name === 'custom' && (
             <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                 <Settings2 className="text-foreground opacity-50" />
             </div>
         )}
      </div>
      <div className="p-3 bg-card border-t border-border">
         <div className="flex items-center justify-between">
            <span className="font-medium capitalize text-sm">{name === 'custom' ? 'Custom Theme' : name}</span>
            {isActive && <Check size={16} className="text-primary" />}
         </div>
      </div>
    </motion.div>
  );

  const CustomizerPanel = ({ 
    colors, 
    updateColor, 
    resetTo 
  }: { 
    colors: ThemeColors, 
    updateColor: (key: keyof ThemeColors, val: string) => void,
    resetTo: ThemeColors
  }) => {
    
    const handleQuickColor = (hex: string) => {
        const hsl = hexToHsl(hex);
        updateColor("primary", hsl);
        // Also update ring to match
        updateColor("ring", hsl);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="border-t border-border mt-6 pt-6"
      >
         <div className="flex items-center justify-between mb-6">
            <h4 className="font-medium">Theme Customization</h4>
            <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                   Object.entries(resetTo).forEach(([k, v]) => updateColor(k as keyof ThemeColors, v));
                }}
                className="h-8 gap-2"
            >
                <RotateCcw size={14} /> Reset Defaults
            </Button>
         </div>

         {/* Quick Colors */}
         <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
           <div className="flex items-center gap-2 mb-3">
              <Palette size={16} className="text-muted-foreground" />
              <span className="text-sm font-semibold">Recommended Brand Colors</span>
           </div>
           <div className="flex gap-3 flex-wrap">
              {QUICK_COLORS.map(color => (
                 <button
                    key={color.name}
                    onClick={() => handleQuickColor(color.hex)}
                    title={`Apply ${color.name}`}
                    className="w-8 h-8 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform ring-2 ring-transparent hover:ring-offset-2 hover:ring-primary/50"
                    style={{ backgroundColor: color.hex }}
                 />
              ))}
           </div>
         </div>

         {/* Detailed Colors */}
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(colors) as Array<keyof ThemeColors>).map((key) => {
               const currentHsl = colors[key];
               const currentHex = hslToHex(currentHsl);

               return (
                  <div key={key} className="space-y-2">
                     <label className="text-xs font-medium capitalize text-muted-foreground flex items-center justify-between">
                       {key.replace(/([A-Z])/g, " $1")}
                     </label>
                     <div className="flex gap-2">
                        {/* Native Color Picker Wrapper */}
                        <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-md border border-input shadow-sm p-0">
                           <input
                              type="color"
                              value={currentHex}
                              onChange={(e) => updateColor(key, hexToHsl(e.target.value))}
                              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                           />
                        </div>
                        {/* Text Input for HSL */}
                        <input
                           type="text"
                           value={colors[key]}
                           onChange={(e) => updateColor(key, e.target.value)}
                           className="flex-1 min-w-0 text-sm font-mono px-3 py-2 rounded-md bg-transparent border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                     </div>
                  </div>
               );
            })}
         </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Light Mode Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <Sun className="text-orange-500" size={24} />
           <div>
              <h3 className="text-lg font-medium">Light Mode Theme</h3>
              <p className="text-sm text-muted-foreground">Select default look for light mode.</p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(LIGHT_THEMES).map(([name, theme]) => (
             <ThemeCard 
               key={name}
               name={name}
               theme={theme}
               isActive={activeLightTheme === name}
               onClick={() => setActiveLightTheme(name)}
             />
          ))}
          {/* Custom Card */}
          <ThemeCard 
             name="custom" 
             theme={customLightColors} 
             isActive={activeLightTheme === 'custom'}
             onClick={() => setActiveLightTheme('custom')}
          />
        </div>

        <AnimatePresence>
            {activeLightTheme === 'custom' && (
                <CustomizerPanel 
                   colors={customLightColors}
                   updateColor={updateCustomLightColor}
                   resetTo={LIGHT_THEMES["Corporate Light"]}
                />
            )}
        </AnimatePresence>
      </section>

      <div className="w-full h-px bg-border/50" />

      {/* Dark Mode Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <Moon className="text-blue-500" size={24} />
           <div>
              <h3 className="text-lg font-medium">Dark Mode Theme</h3>
              <p className="text-sm text-muted-foreground">Select default look for dark mode.</p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {Object.entries(DARK_THEMES).map(([name, theme]) => (
             <ThemeCard 
               key={name}
               name={name}
               theme={theme}
               isActive={activeDarkTheme === name}
               onClick={() => setActiveDarkTheme(name)}
             />
          ))}
          {/* Custom Card */}
          <ThemeCard 
             name="custom" 
             theme={customDarkColors} 
             isActive={activeDarkTheme === 'custom'}
             onClick={() => setActiveDarkTheme('custom')}
          />
        </div>

        <AnimatePresence>
            {activeDarkTheme === 'custom' && (
                <CustomizerPanel 
                   colors={customDarkColors}
                   updateColor={updateCustomDarkColor}
                   resetTo={DARK_THEMES["Midnight Blue"]}
                />
            )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default ThemeSettings;
