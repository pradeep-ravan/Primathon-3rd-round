'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  itemType?: string;
  isLoading?: boolean;
  warningMessage?: string;
  additionalInfo?: {
    label: string;
    value: string | number;
  }[];
  features?: {
    label: string;
    value: boolean;
    color: string;
  }[];
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType = 'item',
  isLoading = false,
  warningMessage,
  additionalInfo = [],
  features = [],
}: DeleteDialogProps) {
  // Portal state for client-side rendering
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  const dialogContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-md bg-card/95 border-destructive/20 backdrop-blur-xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <p className="text-foreground text-sm">{description}</p>
                  {warningMessage && (
                    <p className="text-destructive text-xs mt-2">
                      {warningMessage}
                    </p>
                  )}
                  {warningMessage && (
                    <ul className="text-destructive/80 text-xs mt-2 space-y-1 ml-4">
                      <li>• All associated data will be permanently removed</li>
                      <li>• This action cannot be reversed</li>
                      <li>• Make sure you have backups if needed</li>
                    </ul>
                  )}
                </div>

                {/* Item Info */}
                {(additionalInfo.length > 0 || features.length > 0) && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {additionalInfo.map((info, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            {info.label}
                          </span>
                          <span className="text-foreground font-medium">
                            {info.value}
                          </span>
                        </div>
                      ))}
                      {features.length > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Features
                          </span>
                          <div className="flex gap-1">
                            {features.map((feature, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs rounded ${
                                  feature.value
                                    ? feature.color
                                    : 'bg-muted-foreground/20 text-muted-foreground'
                                }`}
                              >
                                {feature.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  variant="destructive"
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete {itemType}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(dialogContent, document.body);
}
