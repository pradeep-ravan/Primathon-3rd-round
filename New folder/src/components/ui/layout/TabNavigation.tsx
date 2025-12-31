"use client";

import React from "react";
import { motion } from "framer-motion";

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavigationProps) {
  return (
    <div
      className={`bg-card/50 border-r border-border/50 backdrop-blur-sm ${className}`}
    >
      <div className="p-6">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-foreground/20"
                      : "bg-muted/50 group-hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-primary-foreground rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
