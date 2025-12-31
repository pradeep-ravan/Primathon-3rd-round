"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeColors, LIGHT_THEMES, DARK_THEMES } from "@/config/themes";
import { useTheme } from "next-themes";

interface ThemeContextType {
  activeLightTheme: string;
  setActiveLightTheme: (name: string) => void;
  activeDarkTheme: string;
  setActiveDarkTheme: (name: string) => void;
  
  customLightColors: ThemeColors;
  updateCustomLightColor: (key: keyof ThemeColors, value: string) => void;

  customDarkColors: ThemeColors;
  updateCustomDarkColor: (key: keyof ThemeColors, value: string) => void;
  
  currentColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a CustomThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const CustomThemeProvider = ({ children }: ThemeProviderProps) => {
  const { resolvedTheme } = useTheme();
  
  const [activeLightTheme, setActiveLightTheme] = useState<string>("Corporate Light");
  const [activeDarkTheme, setActiveDarkTheme] = useState<string>("Midnight Blue");

  const [customLightColors, setCustomLightColors] = useState<ThemeColors>(
    LIGHT_THEMES["Corporate Light"]
  );
  
  const [customDarkColors, setCustomDarkColors] = useState<ThemeColors>(
    DARK_THEMES["Midnight Blue"]
  );

  // Load from local storage on mount
  useEffect(() => {
    const savedLight = localStorage.getItem("app-light-theme");
    const savedDark = localStorage.getItem("app-dark-theme");
    
    // Attempt to load custom colors
    const savedCustomLight = localStorage.getItem("app-custom-light-colors");
    const savedCustomDark = localStorage.getItem("app-custom-dark-colors");

    if (savedLight) setActiveLightTheme(savedLight);
    if (savedDark) setActiveDarkTheme(savedDark);
    
    if (savedCustomLight) {
      try { setCustomLightColors(JSON.parse(savedCustomLight)); } catch (e) { console.error(e); }
    }
    if (savedCustomDark) {
      try { setCustomDarkColors(JSON.parse(savedCustomDark)); } catch (e) { console.error(e); }
    }
  }, []);

  // Save to local storage when changed
  useEffect(() => {
    localStorage.setItem("app-light-theme", activeLightTheme);
  }, [activeLightTheme]);

  useEffect(() => {
    localStorage.setItem("app-dark-theme", activeDarkTheme);
  }, [activeDarkTheme]);

  useEffect(() => {
    localStorage.setItem("app-custom-light-colors", JSON.stringify(customLightColors));
  }, [customLightColors]);

  useEffect(() => {
    localStorage.setItem("app-custom-dark-colors", JSON.stringify(customDarkColors));
  }, [customDarkColors]);

  const updateCustomLightColor = (key: keyof ThemeColors, value: string) => {
    setCustomLightColors(prev => ({ ...prev, [key]: value }));
  };

  const updateCustomDarkColor = (key: keyof ThemeColors, value: string) => {
    setCustomDarkColors(prev => ({ ...prev, [key]: value }));
  };

  // Determine current colors
  const isDark = resolvedTheme === 'dark';
  let currentColors: ThemeColors;

  if (isDark) {
     if (activeDarkTheme === 'custom') {
       currentColors = customDarkColors;
     } else {
       currentColors = DARK_THEMES[activeDarkTheme] || DARK_THEMES["Midnight Blue"];
     }
  } else {
     if (activeLightTheme === 'custom') {
       currentColors = customLightColors;
     } else {
       currentColors = LIGHT_THEMES[activeLightTheme] || LIGHT_THEMES["Corporate Light"];
     }
  }

  // Apply CSS variables
  useEffect(() => {
    const root = document.documentElement;

    Object.entries(currentColors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, `hsl(${value})`);
    });
  }, [currentColors]);
  

  return (
    <ThemeContext.Provider
      value={{
        activeLightTheme,
        setActiveLightTheme,
        activeDarkTheme,
        setActiveDarkTheme,
        customLightColors,
        updateCustomLightColor,
        customDarkColors,
        updateCustomDarkColor,
        currentColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
