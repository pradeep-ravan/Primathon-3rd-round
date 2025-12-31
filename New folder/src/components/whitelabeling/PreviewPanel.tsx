"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, X } from "lucide-react";

import { colorOptions, wallpapers } from "./constants";

interface PreviewPanelProps {
  selectedBackground: string;
  backgroundType: 'color' | 'wallpaper';
  customBackground: string | null;
}

export function PreviewPanel({
  selectedBackground,
  backgroundType,
  customBackground,
}: PreviewPanelProps) {
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenPreview) {
        setIsFullscreenPreview(false);
      }
    };
    if (isFullscreenPreview) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFullscreenPreview]);

  const getPreviewBackground = () => {
    if (selectedBackground === 'custom' && customBackground) {
      return `url(${customBackground})`;
    }
    if (backgroundType === 'color') {
      const color = colorOptions.find((c) => c.id === selectedBackground);
      return color?.gradient || colorOptions[0].gradient;
    }
    // Attempt to find in wallpapers list (incomplete list here is fine if logic holds)
    // For specific wallpapers logic you might want to export the full list from a constant file or pass it in.
    // For now I'm defaulting to a basic gradient if not found to save space.
    const wallpaper = wallpapers.find((w) => w.id === selectedBackground);
    return wallpaper?.thumbnail || wallpapers[0].thumbnail; 
  };

  const LoginPreviewCard = ({ scale = 1 }: { scale?: number }) => (
     <div className="w-full max-w-[380px] rounded-2xl shadow-2xl p-8 bg-[#2a2538]/95 backdrop-blur-md border border-white/10" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Sign in to WebClient</h2>
          <p className="text-sm text-gray-300">account@domain.com</p>
        </div>

        {/* Password Field */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              disabled
              className="w-full h-11 rounded-md bg-white/5 border border-white/20 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              value="••••••••••"
            />
          </div>
        </div>

        {/* Keep me signed in */}
        <div className="flex items-center space-x-2 mb-5">
          <div className="h-4 w-4 rounded bg-white/10 border border-white/30 flex items-center justify-center">
             <div className="h-2 w-2 bg-white/40 rounded-sm"></div>
          </div>
          <span className="text-xs text-gray-300">Keep me signed in</span>
        </div>

        {/* Sign In Button */}
        <button disabled className="w-full h-11 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm shadow-md transition-colors">
          Sign In
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Not yet? <span className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium">Choose a different account</span> ›
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 flex items-center justify-between text-[10px] text-gray-400">
          <span>Powered by icewarp © 2025</span>
          <div className="flex space-x-1.5">
             <div className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"></div>
             <div className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"></div>
             <div className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"></div>
             <div className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"></div>
          </div>
          <span>www.icewarp.com</span>
        </div>
        
        {/* Language Selector Top Right */}
        <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 rounded-md bg-white/10 backdrop-blur-sm text-xs font-medium text-white border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
             EN ▼
            </div>
        </div>
     </div>
  );

  return (
    <>
      <Card className="shadow-lg border-border/50 sticky top-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-xl">PREVIEW</CardTitle>
            <CardDescription className="mt-1.5">See how your login page will look</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreenPreview(true)}
            className="flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Fullscreen
          </Button>
        </CardHeader>
        <CardContent>
          <div
            className="relative rounded-lg overflow-hidden shadow-2xl border border-border/50 flex items-center justify-center aspect-[16/10]"
            style={{
              background: getPreviewBackground(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              // height removed to let aspect-ratio control it, or set a max-height
            }}
          >
             <LoginPreviewCard scale={0.55} />
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Preview Modal */}
      {mounted && isFullscreenPreview && createPortal(
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center p-8"
          style={{ zIndex: 999999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreenPreview(false);
          }}
        >
          <button
            onClick={() => setIsFullscreenPreview(false)}
            className="absolute top-4 right-4 text-white hover:text-white text-sm px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors shadow-lg z-10 font-medium flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Close (ESC)
          </button>
          <div
            className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl flex items-center justify-center"
            style={{
              background: getPreviewBackground(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <LoginPreviewCard scale={1} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
