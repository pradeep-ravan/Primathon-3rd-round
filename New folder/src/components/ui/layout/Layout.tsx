"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Sidebar from "./Sidebar";
import OptimizedAnimatedBackground from "@/components/ui/OptimizedAnimatedBackground";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on resize and initial load
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full bg-background/50 selection:bg-primary/20">
      {/* Optimized animated background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <OptimizedAnimatedBackground />
      </div>

      {/* Sidebar: fixed position */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        toggleCollapsed={toggleCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={`relative flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isMobile 
            ? "w-full" 
            : isCollapsed 
              ? "ml-[112px] mr-4" // 16px (left) + 80px (sidebar) + 16px (gap)
              : "ml-[292px] mr-4" // 16px (left) + 260px (sidebar) + 16px (gap)
        }`}
      >
        <div className="py-4 flex flex-col min-h-screen">
            {/* Floating Header */}
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            {/* Content Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 mt-4 relative z-10"
            >
              {children}
            </motion.div>

            {/* Footer */}
            <footer className="mt-8 py-6 text-center">
              <p className="text-sm text-muted-foreground/60 font-medium">
                © 2025 IceWarp Admin Panel
              </p>
            </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
