"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusAlert from "./StatusAlert";
import LoginForm from "./LoginForm";
import SessionDetails from "./SessionDetails";
import { JSX } from "react";

interface LoginCardProps {
  handleLogin: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  user?: { isAuthenticated: boolean; email?: string } | null;
  sessionDetails?: {
    sid: string;
    userCreated: boolean;
    lastActive?: string;
  } | null;
  getErrorMessage?: () => string;
}

const LoginCard = ({
  handleLogin,
  loading = false,
  error = null,
  user = null,
  sessionDetails = null,
  getErrorMessage = () => "An error occurred",
}: LoginCardProps): JSX.Element => {
  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <Card className="border-0 shadow-2xl gradient-card bg-card/60 backdrop-blur-2xl text-card-foreground border-white/20 dark:border-white/10 ring-1 ring-white/30 dark:ring-white/10 rounded-2xl overflow-hidden relative">
      {/* Decorative top sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />
      
      <CardHeader className="space-y-4 text-center pb-6 pt-8">
        <motion.div
          className="mx-auto flex flex-col items-center gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring" as const,
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
        >
          {/* Logo Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative h-16 px-6 bg-background/50 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-sm">
              <Image
                src="/IcewarpLogo.png"
                alt="Icewarp Logo"
                width={180}
                height={50}
                className="w-auto h-8 object-contain"
                priority
              />
            </div>
          </div>
        </motion.div>
        
        <div className="space-y-2 mt-2">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription className="text-muted-foreground text-base">
              Sign in to access your secure dashboard
            </CardDescription>
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-8">
        <StatusAlert
          error={error}
          user={user}
          getErrorMessage={getErrorMessage}
        />
        <LoginForm loading={loading} handleLogin={handleLogin} />
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 border-t border-border/30 px-8 py-6 bg-muted/10">
        <SessionDetails sessionDetails={sessionDetails} />
        <p className="text-xs text-center text-muted-foreground/60">
          Protected by enterprise-grade security
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
