"use client";

import { LucideIcon } from "lucide-react";

export type TopTabItem<T extends string = string> = {
  id: T;
  label: string;
  icon?: LucideIcon;
};

interface TopTabsProps<T extends string = string> {
  tabs: TopTabItem<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
  className?: string;
  compact?: boolean;
  sticky?: boolean;
}

export function TopTabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  compact = false,
  sticky = false,
}: TopTabsProps<T>) {
  return (
    <div
      className={`flex items-center gap-2 px-2 sm:px-3 ${
        compact ? "py-1.5" : "py-2"
      } overflow-x-auto scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent bg-muted/60 backdrop-blur-sm border-b border-border/60 ${
        sticky ? "sticky top-0 z-20" : ""
      } ${className}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 ${
              compact ? "py-2" : "py-2.5"
            } rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            {Icon && (
              <Icon
                className={`h-4 w-4 ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              />
            )}
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary-foreground" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default TopTabs;

