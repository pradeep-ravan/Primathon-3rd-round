"use client";

import { useState, KeyboardEvent, ChangeEvent, JSX } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  loading: boolean;
  handleLogin: (credentials: {
    email: string;
    password: string;
  }) => Promise<void>;
}

const LoginForm = ({ loading, handleLogin }: LoginFormProps): JSX.Element => {
  const [username, setUsername] = useState<string>(
    "admin@icewarpindia.onice.io"
  );
  const [password, setPassword] = useState<string>("dSDaWcjIhB2748968882");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<"username" | "password" | null>(null);

  // Check if both fields have content
  const isFormValid = username.trim() !== "" && password.trim() !== "";

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmailValid = isValidEmail(username);
  const isFormValidWithEmail = isFormValid && isEmailValid;

  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !loading) {
      handleLogin({ email: username, password });
    }
  };

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
    <motion.div
      className="space-y-6"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-2 group" variants={itemVariants}>
        <Label 
          htmlFor="username" 
          className={cn(
            "text-sm font-medium transition-colors duration-200", 
            focusedField === "username" ? "text-primary" : "text-foreground/70"
          )}
        >
          Email Address
        </Label>
        <div className="relative transform transition-all duration-200 focus-within:scale-[1.01]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
            <User className={cn(
              "h-5 w-5 transition-colors duration-200", 
              focusedField === "username" ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <Input
            id="username"
            type="email"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            onKeyDown={handleKeyDown}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
            className={cn(
              "pl-11 h-12 bg-muted/10 border-border/60 text-foreground transition-all duration-200 shadow-sm",
              "focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg",
              username && !isEmailValid && "border-destructive focus:border-destructive focus:ring-destructive/10"
            )}
            placeholder="name@company.com"
            required
          />
          {username && !isEmailValid && (
            <p className="text-destructive text-xs mt-1.5 ml-1 font-medium animate-in slide-in-from-top-1 fade-in">
              Please enter a valid email address
            </p>
          )}
        </div>
      </motion.div>

      <motion.div className="space-y-2 group" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <Label 
            htmlFor="password" 
            className={cn(
              "text-sm font-medium transition-colors duration-200", 
              focusedField === "password" ? "text-primary" : "text-foreground/70"
            )}
          >
            Password
          </Label>
          <a href="#" className="text-xs text-primary/80 hover:text-primary hover:underline transition-all">
            Forgot password?
          </a>
        </div>
        
        <div className="relative transform transition-all duration-200 focus-within:scale-[1.01]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
            <Lock className={cn(
              "h-5 w-5 transition-colors duration-200", 
              focusedField === "password" ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            onKeyDown={handleKeyDown}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            className="pl-11 pr-11 h-12 bg-muted/10 border-border/60 text-foreground transition-all duration-200 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground transition-colors z-10 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-2">
        <motion.button
          type="button"
          disabled={loading || !isFormValidWithEmail}
          className={cn(
            "w-full h-12 font-semibold rounded-lg shadow-lg flex items-center justify-center transition-all duration-200 relative overflow-hidden group",
            loading || !isFormValidWithEmail
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-80"
              : "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-primary/25 hover:scale-[1.01] hover:brightness-110"
          )}
          whileTap={!loading && isFormValidWithEmail ? { scale: 0.98 } : {}}
          onClick={() => handleLogin({ email: username, password })}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
