"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { flatMenuItems } from "@/config/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchCommand = ({ open, setOpen }: SearchCommandProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query) return flatMenuItems;
    const lowerQuery = query.toLowerCase();
    return flatMenuItems.filter((item) => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex].href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredItems, selectedIndex]);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-xl bg-card border-none shadow-2xl overflow-hidden [&>button]:hidden">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search for pages and commands
        </DialogDescription>
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-border/50">
          <Search className="mr-3 h-5 w-5 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent outline-none text-lg text-foreground placeholder:text-muted-foreground"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No results found.
            </p>
          ) : (
            <div className="px-2">
              <span className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                Suggestions
              </span>
              <ul className="space-y-1 mt-1">
                {filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <li
                      key={item.id}
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-accent text-accent-foreground" 
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isSelected && (
                         <motion.div 
                           layoutId="activeIndicator"
                           className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                         />
                      )}
                      
                      <div className={`flex items-center justify-center w-6 h-6 rounded ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                         <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} />
                      </div>
                      <span className={`flex-1 ${isSelected ? "font-medium" : ""}`}>
                        {item.title}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-muted-foreground">Jump to</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/20">
            <span className="text-[10px] text-muted-foreground">
              Navigation
            </span>
            <div className="flex items-center gap-2">
               <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                 <kbd className="p-0.5 rounded bg-background border border-border">↑</kbd>
                 <kbd className="p-0.5 rounded bg-background border border-border">↓</kbd>
                 to navigate
               </span>
               <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                 <kbd className="px-1 py-0.5 rounded bg-background border border-border">↵</kbd>
                 to select
               </span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchCommand;
