"use client";

import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  onClose,
  onSave,
  saveButtonText = "Save",
  saveButtonDisabled = false,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`gradient-header bg-card/90 backdrop-blur-sm border-b border-border/50 px-6 py-4 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-lg shadow-lg">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {title}
              </h1>
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
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-6 py-2 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
