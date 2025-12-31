"use client";

import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import AnimatedBackground from "../ui/login/AnimatedBackground";
import LoginCard from "../ui/login/LoginCard";
import PoweredByFooter from "../ui/login/PoweredByFooter";
import RedirectLoader from "../ui/loader/RedirectLoader";
import ThemeToggle from "../ui/ThemeToggle";

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const {
    user,
    sessionDetails,
    loading,
    error,
    isAuthenticated,
    login,
    clearError,
  } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  /**
   * Handle login process
   */
  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }): Promise<void> => {
    clearError();

    const loginData = {
      email: credentials.email,
      password: credentials.password,
      method: "plain" as const,
    };

    const success = await login(loginData);

    if (success) {
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  const getErrorMessage = (): string => {
    return error || "An error occurred during authentication";
  };

  // Show redirect loader if user is authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-background p-4 relative overflow-hidden">
        <AnimatedBackground />
        <motion.div
          className="max-w-md w-full z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="gradient-card bg-card/90 backdrop-blur-xl rounded-xl p-8 border border-border shadow-lg">
            <RedirectLoader
              message="Login successful!"
              redirectText="Redirecting to dashboard..."
              variant="success"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background p-4 relative overflow-hidden">
      <AnimatedBackground />

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        className="max-w-md w-full z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <LoginCard
          handleLogin={handleLogin}
          loading={loading}
          error={error}
          user={user}
          sessionDetails={sessionDetails}
          getErrorMessage={getErrorMessage}
        />
        <PoweredByFooter />
      </motion.div>
    </div>
  );
};

export default LoginPage;
