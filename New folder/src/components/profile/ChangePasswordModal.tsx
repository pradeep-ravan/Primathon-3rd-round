"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, RefreshCw, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (password: string, forceChange: boolean) => Promise<void>;
  isLoading?: boolean;
}

// Password generation function
const generatePassword = (): string => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password.split("").sort(() => Math.random() - 0.5).join("");
};

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [forceChange, setForceChange] = useState(false);
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);

  const handleGeneratePassword = () => {
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);
    setIsPasswordGenerated(true);
  };

  const handleCopyToClipboard = async () => {
    if (!password) {
      toast.error("No password to copy", {
        duration: 3000,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard", {
        duration: 2000,
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard", {
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    if (!password || password.trim() === "") {
      toast.error("Please enter a password", {
        duration: 3000,
      });
      return;
    }

    if (password.length < 12) {
      toast.error("Password must be at least 12 characters long", {
        duration: 3000,
      });
      return;
    }

    try {
      await onSave(password, forceChange);
      // Reset form
      setPassword("");
      setForceChange(false);
      setIsPasswordGenerated(false);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    setPassword("");
    setForceChange(false);
    setIsPasswordGenerated(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-md bg-card/95 border-primary/20 backdrop-blur-xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">CHANGE PASSWORD</h2>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  PASSWORD
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!e.target.value) {
                        setIsPasswordGenerated(false);
                      }
                    }}
                    placeholder="Enter password"
                    className="flex-1 bg-muted border-border text-foreground"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGeneratePassword}
                    disabled={isLoading}
                    className="text-primary hover:text-primary/90 border-primary/20 hover:border-primary/40"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>

              {/* Copy to Clipboard Button */}
              <Button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={!password || isLoading}
                className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Copy className="h-4 w-4 mr-2" />
                COPY TO CLIPBOARD
              </Button>

              {/* Password Requirements */}
              <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                <p>Password cannot contain username or alias</p>
                <p>Minimal password length: 12</p>
                <p>Number of numeric characters in password [0-9]: 1</p>
                <p>Number of alpha characters in password [a-z][A-Z]: 1</p>
              </div>

              {/* Force Password Change Toggle */}
              <div className="mb-6 flex items-center space-x-2">
                <Switch
                  id="force-change"
                  checked={forceChange}
                  onCheckedChange={setForceChange}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="force-change"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  FORCE PASSWORD CHANGE AFTER FIRST LOGIN
                </Label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="min-w-[100px]"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !password || password.length < 12}
                  className="min-w-[100px] bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? "Saving..." : "SAVE"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

