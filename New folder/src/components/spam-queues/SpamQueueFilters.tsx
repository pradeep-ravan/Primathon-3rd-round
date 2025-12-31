"use client";

import React from "react";
import { Globe, Search, User, X } from "lucide-react";

interface SpamQueueFiltersProps {
  domains?: string[];
  onFilter?: (filters: {
    sender: string;
    owner: string;
    domain: string;
  }) => void;
}

export const SpamQueueFilters: React.FC<SpamQueueFiltersProps> = ({
  domains,
  onFilter,
}) => {
  const [filters, setFilters] = React.useState({
    sender: "",
    owner: "",
    domain: "",
  });
  const [isDomainModalOpen, setDomainModalOpen] = React.useState(false);
  const [domainSearch, setDomainSearch] = React.useState("");

  const availableDomains = React.useMemo(() => {
    const fallback = ["icewarpindia.onice.io", "newdm.com"];
    const list = domains?.length ? domains : fallback;
    return Array.from(new Set(list));
  }, [domains]);

  const filteredDomains = React.useMemo(() => {
    if (!domainSearch.trim()) return availableDomains;
    const search = domainSearch.toLowerCase();
    return availableDomains.filter((domain) =>
      domain.toLowerCase().includes(search),
    );
  }, [availableDomains, domainSearch]);

  const handleInputChange =
    (key: "sender" | "owner") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleDomainSelect = (domain: string) => {
    setFilters((prev) => ({ ...prev, domain }));
    setDomainModalOpen(false);
  };

  const handleFilterClick = () => {
    onFilter?.(filters);
  };

  React.useEffect(() => {
    if (!isDomainModalOpen) {
      setDomainSearch("");
    }
  }, [isDomainModalOpen]);

  return (
    <>
      <div className="bg-card/50 border border-border rounded-xl p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Filter sender
            </label>
            <input
              type="text"
              placeholder="Filter sender"
              value={filters.sender}
              onChange={handleInputChange("sender")}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Filter owner
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter owner"
                value={filters.owner}
                onChange={handleInputChange("owner")}
                className="w-full px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Filter domain
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter domain"
                value={filters.domain}
                readOnly
                className="w-full px-4 py-2 pr-12 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setDomainModalOpen(true)}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
                aria-label="Select domain"
              >
                <Globe className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleFilterClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200"
        >
          FILTER RESULTS
        </button>
      </div>

      {isDomainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-primary">
                  DOMAINS
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDomainModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
                aria-label="Close domain selection"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search domains"
                  value={domainSearch}
                  onChange={(event) => setDomainSearch(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-2 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="max-h-72 overflow-y-auto rounded-2xl border border-border">
                {filteredDomains.length ? (
                  filteredDomains.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => handleDomainSelect(domain)}
                      className="flex w-full items-center justify-between border-b border-border/60 px-5 py-3 text-left text-sm font-medium text-foreground transition hover:bg-primary/5 last:border-b-0"
                    >
                      {domain}
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-6 text-center text-sm text-muted-foreground">
                    No domains found
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-border px-6 py-3 text-right">
              <button
                type="button"
                onClick={() => setDomainModalOpen(false)}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

