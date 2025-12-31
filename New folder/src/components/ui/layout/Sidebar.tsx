"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { menuGroups } from "@/config/navigation";
import {
  ChevronDown,
  ChevronLeft,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SidebarItem from "./shared/SidebarItem";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed?: boolean;
  toggleCollapsed?: () => void;
}

const Sidebar = ({
  isOpen = true,
  toggleSidebar = () => {},
  isCollapsed = false,
  toggleCollapsed = () => {},
}: SidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "core-management",
    "security-compliance",
    "administration",
  ]);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Initial Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isMenuItemActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      width: isMobile ? 280 : isCollapsed ? 80 : 260,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    closed: {
      x: isMobile ? -280 : -20, // Clean exit
      opacity: isMobile ? 0 : 0,
      width: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <AnimatePresence mode="wait">
        {(isOpen || !isMobile) && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`
              fixed z-50 flex flex-col
              bg-card/90 dark:bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl
              ${
                isMobile
                  ? "inset-y-0 left-0 h-full rounded-r-2xl"
                  : "top-4 bottom-4 left-4 h-[calc(100vh-2rem)] rounded-2xl"
              }
            `}
          >
            {/* Header / Logo Area */}
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-6"} h-16 mb-2`}>
               {/* Logo Placeholer or Brand Name */}
               {!isCollapsed && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="flex items-center"
                 >
                   <Image
                      src="/IcewarpLogo.png"
                      alt="IceWarp"
                      width={140}
                      height={30}
                      className="filter drop-shadow-sm"
                      priority
                   />
                 </motion.div>
               )}
               {/* Desktop Collapse Toggle */}
               {!isMobile && (
                 <button
                   onClick={toggleCollapsed}
                   className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${
                     isCollapsed ? "rotate-180" : ""
                   }`}
                 >
                   <ChevronLeft size={18} />
                 </button>
               )}
            </div>

            {/* Scrollable Content */}
            <div className={`flex-1 px-3 py-2 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isCollapsed ? "overflow-visible" : "overflow-y-auto"}`}>
              
              {/* Dashboard */}
              <div>
                <SidebarItem
                  title="Dashboard"
                  href="/dashboard"
                  icon={LayoutDashboard}
                  isActive={isMenuItemActive("/dashboard")}
                  isCollapsed={isCollapsed}
                />
              </div>

              {/* Menu Groups */}
              {menuGroups.map((group) => (
                <div key={group.id}>
                  {!isCollapsed && (
                    <div
                      className="flex items-center justify-between px-3 mb-1 mt-6 cursor-pointer group/header"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover/header:text-foreground transition-colors">
                        {group.title}
                      </span>
                      <ChevronDown
                        size={12}
                        className={`text-muted-foreground transition-transform duration-200 ${
                          expandedGroups.includes(group.id) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  )}
                  
                  <AnimatePresence initial={false}>
                    {(expandedGroups.includes(group.id) || isCollapsed) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-0.5"
                      >
                        {group.items.map((item) => (
                          <SidebarItem
                            key={item.id}
                            title={item.title}
                            href={item.href}
                            icon={item.icon}
                            isActive={isMenuItemActive(item.href)}
                            isCollapsed={isCollapsed}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Footer / User Profile (Optional Mini Section) */}
            <div className="p-2 mt-auto border-t border-border/50">
               {!isCollapsed && (
                  <div className="mt-0 px-3 py-2 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs ring-2 ring-background">
                       A
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <p className="text-sm font-medium truncate">Admin User</p>
                       <p className="text-xs text-muted-foreground truncate">admin@icewarp.com</p>
                     </div>
                  </div>
               )}
            </div>
            
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
