"use client";

import { ReactNode, useMemo, memo } from "react";
import { LucideIcon } from "lucide-react";
import { TopTabs, TopTabItem } from "./TopTabs";

type TabItem<T extends string = string> = {
  id: T;
  label: string;
  icon: LucideIcon;
};

interface SideTabsLayoutProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
  header?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  tabsClassName?: string;
}

function SideTabsLayoutComponent<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  header,
  actions,
  children,
  className = "",
  contentClassName = "",
  tabsClassName = "",
}: SideTabsLayoutProps<T>) {
  // Memoize tabs conversion to prevent unnecessary re-renders
  const topTabs: TopTabItem<T>[] = useMemo(() => 
    tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
    })),
    [tabs]
  );

  return (
    <div className={`w-full flex flex-col h-full ${className}`}>
      {/* Header Bar (optional) */}
      {(header || actions) && (
        <div className="flex-shrink-0 bg-card border-b border-border/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 rounded-t-xl">
          <div className="min-w-0 flex-1">{header}</div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}

      {/* Tabs Bar - Using TopTabs component */}
      <TopTabs
        tabs={topTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        sticky={true}
        className={tabsClassName}
      />

      {/* Content Area - Scrollable */}
      <section className={`flex-1 flex flex-col min-w-0 bg-card overflow-hidden ${contentClassName}`}>
        {children}
      </section>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const SideTabsLayout = memo(SideTabsLayoutComponent) as typeof SideTabsLayoutComponent;

export default SideTabsLayout;

