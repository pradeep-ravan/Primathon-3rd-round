"use client";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, User, Bell, Search, Command, Palette } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchCommand from "./shared/SearchCommand";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside handler for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  // Keydown handler for Search Shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlelogout = () => {
    sessionStorage.clear();
    globalThis.location.href = "/";
  };

  const userMenuItems = [
    { title: "Sign Out", href: "/", onClick: handlelogout },
  ];

  return (
    <>
      <SearchCommand open={isSearchOpen} setOpen={setIsSearchOpen} />
      
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-20 w-full h-16 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-sm flex items-center justify-between px-6 mb-4"
      >
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Toggle */}
          <motion.button
            onClick={toggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-xl hover:bg-muted/60 text-foreground transition-colors"
          >
            <Menu size={22} />
          </motion.button>

          {/* Mobile Logo */}
          <div className="lg:hidden relative">
            <Image
              src="/IcewarpLogo.png"
              alt="IceWarp"
              width={120}
              height={28}
              className="filter drop-shadow-md"
            />
          </div>

          {/* Desktop Search / Command (Trigger) */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
          >
             <Search size={14} className="group-hover:text-primary transition-colors"/>
             <span className="text-xs font-medium">Search...</span>
             <div className="flex items-center gap-0.5 ml-8 px-1.5 py-0.5 rounded bg-background/50 border border-border/50">
               <Command size={10} />
               <span className="text-[10px] font-bold">K</span>
             </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Preview Link */}
          <Link href="/theme-preview">
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
               title="Customize Theme"
            >
               <Palette size={20} />
            </motion.button>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell */}
          <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="relative p-2 rounded-xl hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
          >
             <Bell size={20} />
             <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-card" />
          </motion.button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
                <User size={16} />
              </div>
              <div className="hidden md:flex flex-col items-start">
                 <span className="text-xs font-semibold leading-none">{user?.displayName || "Admin"}</span>
                 <span className="text-[10px] text-muted-foreground leading-none mt-1">View Profile</span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground ml-1" />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-card border border-border shadow-xl overflow-hidden py-1 z-50 ring-1 ring-black/5"
                >
                  <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.displayName || "Admin User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={item.onClick}
                        className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors relative group"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
