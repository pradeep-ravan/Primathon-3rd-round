"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/ui/layout/Layout";

export default function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, logoutLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've finished initializing and the user is not authenticated
    if (isInitialized && !isAuthenticated && !logoutLoading) {
      router.push("/");
    }
  }, [isAuthenticated, logoutLoading, router, isInitialized]);

  // Show loading screen while checking authentication or initializing
  if (!isInitialized || (!isAuthenticated && !logoutLoading)) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center gradient-card bg-card/90 backdrop-blur-sm rounded-lg p-8 border border-border shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-foreground mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show logout loading screen
  if (logoutLoading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center gradient-card bg-card/90 backdrop-blur-sm rounded-lg p-8 border border-border shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-foreground mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Logging out...</p>
        </div>
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}
