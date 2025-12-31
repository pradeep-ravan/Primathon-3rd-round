"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  User,
  Users,
  Mail,
  Settings,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

export interface Account {
  id: string;
  name: string;
  email: string;
  type: "System Administrator" | "User" | "Group" | "Mailing list";
  icon: React.ComponentType<{ className?: string }>;
}

interface AccountSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  domainName?: string;
}

// Mock accounts data
const mockAccounts: Account[] = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@icewarpindia.onice.io",
    type: "System Administrator",
    icon: Settings,
  },
  {
    id: "2",
    name: "kamal shah",
    email: "kamal-emor@icewarpindia.onice.io",
    type: "User",
    icon: User,
  },
  {
    id: "3",
    name: "My cool group",
    email: "my.cool.group@icewarpindia.onice.io",
    type: "Group",
    icon: Users,
  },
  {
    id: "4",
    name: "public-folders@icewarpindia...",
    email: "public-folders@icewarpindia.onice.io",
    type: "Group",
    icon: Users,
  },
  {
    id: "5",
    name: "TETS",
    email: "tets@icewarpindia.onice.io",
    type: "Group",
    icon: Users,
  },
  {
    id: "6",
    name: "test",
    email: "test@icewarpindia.onice.io",
    type: "Mailing list",
    icon: Mail,
  },
];

const accountTypes = [
  "ALL TYPES",
  "System Administrator",
  "User",
  "Group",
  "Mailing list",
] as const;

export const AccountSelectionModal: React.FC<AccountSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  domainName = "ICEWARPINDIA.ONICE.IO",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL TYPES");
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const filteredAccounts = useMemo(() => {
    let filtered = [...mockAccounts];

    // Filter by type
    if (selectedType !== "ALL TYPES") {
      filtered = filtered.filter((account) => account.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (account) =>
          account.name.toLowerCase().includes(query) ||
          account.email.toLowerCase().includes(query)
      );
    }

    // Show selected only
    if (showSelectedOnly) {
      filtered = filtered.filter((account) =>
        selectedAccounts.has(account.id)
      );
    }

    return filtered;
  }, [searchQuery, selectedType, showSelectedOnly, selectedAccounts]);

  const handleToggleSelect = (accountId: string) => {
    setSelectedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  const handleAddUser = () => {
    // Select the first selected account (for owner field, we only need one)
    const firstSelected = mockAccounts.find((acc) =>
      selectedAccounts.has(acc.id)
    );
    if (firstSelected) {
      onSelect(firstSelected);
    }
    handleClose();
  };

  const handleAccountClick = (account: Account) => {
    // For single selection (owner field), directly select and close
    onSelect(account);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedType("ALL TYPES");
    setSelectedAccounts(new Set());
    setShowSelectedOnly(false);
    setIsTypeDropdownOpen(false);
    onClose();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isTypeDropdownOpen) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTypeDropdownOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={handleClose}
    >
      <div
        className="flex h-auto max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3.5">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-primary">
              {domainName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="shrink-0 border-b border-border px-6 py-2.5">
          <p className="text-xs text-muted-foreground">
            Select accounts or click back arrow to choose a domain.
          </p>
        </div>

        {/* Filter Section */}
        <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-2.5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">NAME</p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              {selectedType}
              <ChevronDown className="h-4 w-4" />
            </button>
            {/* Dropdown menu */}
            {isTypeDropdownOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-background shadow-lg">
                {accountTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSelectedType(type);
                      setIsTypeDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition hover:bg-muted ${
                      selectedType === type
                        ? "bg-primary/10 text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="shrink-0 border-b border-border px-6 py-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Accounts List */}
        <div className="flex-1 overflow-y-auto min-h-0 max-h-[400px]">
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => {
              const Icon = account.icon;
              const isSelected = selectedAccounts.has(account.id);

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => handleAccountClick(account)}
                  className="flex w-full items-center gap-3 border-b border-border/60 px-6 py-3.5 text-left transition hover:bg-primary/5 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(account.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(account.id);
                    }}
                    className="h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {account.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {account.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {account.type}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No accounts found
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-6 py-3.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSelectedOnly(!showSelectedOnly)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {selectedAccounts.size} items selected.{" "}
              <span className="underline">Show selected</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleAddUser}
                disabled={selectedAccounts.size === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD USER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

