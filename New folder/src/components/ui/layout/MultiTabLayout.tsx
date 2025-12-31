'use client';

import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface MultiTabLayoutProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  tabs: Tab[];
  defaultTab?: string;
  onClose?: () => void;
  onSave?: () => void;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  children: (activeTab: string) => ReactNode;
  className?: string;
}

export function MultiTabLayout({
  title,
  subtitle,
  icon,
  tabs,
  defaultTab,
  onClose,
  onSave,
  saveButtonText = 'Save',
  saveButtonDisabled = false,
  children,
  className = '',
}: MultiTabLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div className={`w-full ${className}`}>
      {/* Page Header - Works within existing layout */}
      <div className="bg-card border-b border-border backdrop-blur-sm px-6 py-4 shadow-lg rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2 bg-primary rounded-lg shadow-lg [&>svg]:text-primary-foreground">
                  {icon}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {onSave && (
            <Button
              onClick={onSave}
              disabled={saveButtonDisabled}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveButtonText}
            </Button>
          )}
        </div>
      </div>

      <div className="flex bg-background backdrop-blur-sm rounded-b-xl">
        {/* Tab Navigation Sidebar */}
        <div className="w-80 bg-card/30 border-r border-border backdrop-blur-sm rounded-bl-xl">
          <div className="p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-md'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-foreground/20'
                          : 'bg-muted group-hover:bg-muted-foreground/20'
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

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full"
            >
              {children(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
