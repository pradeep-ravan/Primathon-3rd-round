"use client";

import React, { memo, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export interface LoginPolicyState {
  blockFailedAttempts: boolean;
  failedAttemptsCount: string;
  blockDuration: string;
  loginPolicyMode: string;
  requireAdminAuth: boolean;
  usersLoginWith: string;
  convertCharacters: boolean;
  useAccountLoginIPRestriction: boolean;
}

interface LoginPolicyTabProps {
  state: LoginPolicyState;
  setState: React.Dispatch<React.SetStateAction<LoginPolicyState>>;
}

export const LoginPolicyTab = memo(function LoginPolicyTab({
  state,
  setState,
}: LoginPolicyTabProps) {
  // Helper to update state fields
  const updateField = useCallback(<K extends keyof LoginPolicyState>(
    field: K,
    value: LoginPolicyState[K]
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, [setState]);

  const {
    blockFailedAttempts,
    failedAttemptsCount,
    blockDuration,
    loginPolicyMode,
    requireAdminAuth,
    usersLoginWith,
    convertCharacters,
    useAccountLoginIPRestriction,
  } = state;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">
          LOGIN POLICY
        </h2>

        {/* Block User Login for Failed Attempts */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-4 flex-1">
              <Switch
                checked={blockFailedAttempts}
                onCheckedChange={(value) => updateField('blockFailedAttempts', value)}
              />
              <Label className="text-sm font-medium text-foreground cursor-pointer">
                BLOCK USER LOGIN FOR ACCOUNTS THAT EXCEED A NUMBER OF FAILED
                LOGIN ATTEMPTS
              </Label>
            </div>
            <Input
              type="number"
              value={failedAttemptsCount}
              onChange={(e) => updateField('failedAttemptsCount', e.target.value)}
              className="w-20"
              disabled={!blockFailedAttempts}
            />
          </div>

          {/* Block Duration */}
          <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground whitespace-nowrap">
              BLOCK USER LOGIN FOR
            </Label>
            <Input
              type="number"
              value={blockDuration}
              onChange={(e) => updateField('blockDuration', e.target.value)}
              className="w-20"
              disabled={!blockFailedAttempts}
            />
            <Label className="text-sm font-medium text-foreground">
              min
            </Label>
          </div>
        </div>

        {/* Login Policy Mode */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-foreground">
            LOGIN POLICY MODE
          </Label>
          <Select
            value={loginPolicyMode}
            onValueChange={(value) => updateField('loginPolicyMode', value)}
          >
            <SelectTrigger className="w-full border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Do not block but delay authentication process">
                Do not block but delay authentication process
              </SelectItem>
              <SelectItem value="Block account for specified amount of time">
                Block account for specified amount of time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Administrator Authentication */}
        <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 mb-6">
          <Switch
            checked={requireAdminAuth}
            onCheckedChange={(value) => updateField('requireAdminAuth', value)}
          />
          <Label className="text-sm font-medium text-foreground cursor-pointer flex-1">
            REQUIRE ADMINISTRATOR AUTHENTICATION TO ACCESS THE SYSTEM
            SETTINGS
          </Label>
        </div>

        {/* Users Login With Their */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-foreground">
            USERS LOGIN WITH THEIR
          </Label>
          <RadioGroup
            value={usersLoginWith}
            onValueChange={(value) => updateField('usersLoginWith', value)}
            className="flex gap-3"
          >
            <div className="flex items-center space-x-3 bg-card border border-border rounded-lg p-4 flex-1">
              <RadioGroupItem value="usernames" id="usernames" />
              <Label
                htmlFor="usernames"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                USERNAMES
              </Label>
            </div>
            <div className="flex items-center space-x-3 bg-card border border-border rounded-lg p-4 flex-1">
              <RadioGroupItem value="email-addresses" id="email-addresses" />
              <Label
                htmlFor="email-addresses"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                EMAIL ADDRESSES
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Convert Characters in Usernames and Account Login IP Restriction */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 flex-1">
              <Switch
                checked={convertCharacters}
                onCheckedChange={(value) => updateField('convertCharacters', value)}
              />
              <Label className="text-sm font-medium text-foreground cursor-pointer flex-1">
                CONVERT % AND / TO @ IN USERNAMES
              </Label>
            </div>
            <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 flex-1">
              <Switch
                checked={useAccountLoginIPRestriction}
                onCheckedChange={(value) => updateField('useAccountLoginIPRestriction', value)}
              />
              <Label className="text-sm font-medium text-foreground cursor-pointer flex-1">
                USE ACCOUNT LOGIN IP RESTRICTION
              </Label>
            </div>
          </div>
          <Button
            variant="outline"
            disabled={!useAccountLoginIPRestriction}
            className="w-full bg-muted text-muted-foreground border-border disabled:opacity-50"
          >
            LOGIN RESTRICTION
          </Button>
        </div>
      </div>
    </div>
  );
});
