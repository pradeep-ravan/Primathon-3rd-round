"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowLeftRight, Globe } from "lucide-react";
import { User } from "@/types/user";
import { Domain } from "@/types/domain";
import { useDomains } from "@/hooks/useDomains";
import toast from "react-hot-toast";

interface MoveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetDomainName: string) => Promise<void>;
  user: User;
  currentDomainId: string;
  isLoading?: boolean;
}

export function MoveUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  currentDomainId,
  isLoading = false,
}: MoveUserModalProps) {
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");

  // Fetch all domains
  const { data: domainsData } = useDomains({
    page: 0,
    limit: 250,
    search_query: "",
    sort: "name:asc",
  });

  // Filter out current domain from options
  const availableDomains = useMemo(() => {
    if (!domainsData?.items) return [];
    return domainsData.items.filter((domain) => domain.id !== currentDomainId);
  }, [domainsData?.items, currentDomainId]);

  const handleConfirm = async () => {
    if (!selectedDomainId) {
      toast.error("Please select a target domain", {
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }

    // Find the selected domain to get its name
    const selectedDomain = availableDomains.find((domain) => domain.id === selectedDomainId);
    if (!selectedDomain) {
      toast.error("Selected domain not found", {
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }

    // Ensure we use the domain name, not the ID
    const domainName = selectedDomain.name;
    if (!domainName) {
      toast.error("Domain name not found", {
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }

    try {
      // Pass domain name (not ID) for transfer_to parameter
      // domainName should be plain text like "testpk", not base64 encoded ID
      await onConfirm(domainName);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  if (!isOpen) return null;

  return (
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
          transition={{ type: "spring", duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-md bg-card/95 border-primary/20 backdrop-blur-xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ArrowLeftRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">MOVE USER</h2>
                    <p className="text-sm text-muted-foreground">
                      Transfer user to another domain
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">User</p>
                <p className="font-medium text-foreground">
                  {user.v_card?.classify_as || user.alias || user.display_email}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.display_email}
                </p>
              </div>

              {/* Domain Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Target Domain <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <select
                    value={selectedDomainId}
                    onChange={(e) => setSelectedDomainId(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 h-10 bg-card border border-border rounded-md text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a domain...</option>
                    {availableDomains.map((domain) => (
                      <option key={domain.id} value={domain.id}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {availableDomains.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No other domains available
                  </p>
                )}
              </div>

              {/* Warning Message */}
              <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  <strong>Warning:</strong> This will move the user from the current
                  domain to the selected domain. The user's account will be transferred
                  and removed from the current domain.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading || !selectedDomainId || availableDomains.length === 0}
                  className="min-w-[100px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                >
                  {isLoading ? "Moving..." : "Move User"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

