'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import domainApi from '@/services/domainApi';
import { domainKeys } from '@/hooks/useDomains';

interface DNSValidationModalProps {
  domainId: string;
  domainName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DNSValidationModal({
  domainId,
  domainName,
  isOpen,
  onClose,
}: DNSValidationModalProps) {
  const { data: dnsData, isLoading, error } = useQuery({
    queryKey: [...domainKeys.dkim(domainId), 'dns-validation'],
    queryFn: () => domainApi.getDNSValidation(domainId),
    enabled: isOpen && !!domainId,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Container with proper spacing */}
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        {/* Modal */}
        <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0 bg-primary/10">
            <h2 className="text-xl font-semibold text-primary">DNS VALIDATION</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              CURRENT DNS RECORDS
            </h1>

            <p className="text-muted-foreground mb-6">
              Current DNS settings for your domain are listed below. Incorrect or missing entries are marked in red color.
            </p>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
                <p className="font-medium">Failed to load DNS records</p>
                <p className="text-sm mt-1">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
              </div>
            )}

            {/* DNS Records List */}
            {!isLoading && !error && dnsData && (
              <div className="space-y-4">
                {dnsData.records && dnsData.records.length > 0 ? (
                  dnsData.records.map((record, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-4 bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-foreground">
                              {record.type}
                            </span>
                            <span className="text-muted-foreground">({record.name})</span>
                          </div>
                          {record.value && (
                            <p className="text-sm text-foreground font-mono break-all">
                              {record.value}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {record.status === 'valid' ? (
                            <span className="text-green-500 text-sm font-medium">
                              {record.value || 'Valid'}
                            </span>
                          ) : (
                            <span className="text-destructive text-sm font-medium">
                              {record.message || 'No DNS records'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No DNS records found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer - Fixed */}
          <div className="flex items-center justify-center p-6 border-t border-border bg-muted/50 flex-shrink-0">
            <Button
              onClick={onClose}
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
            >
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

