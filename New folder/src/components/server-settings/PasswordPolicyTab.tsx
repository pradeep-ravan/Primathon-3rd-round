"use client";

import React, { memo, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface PasswordPolicyState {
  passwordPolicyActive: boolean;
  passwordCannotContainUsername: boolean;
  enablePasswordEncryption: boolean;
  minimalPasswordLength: string;
  numericCharactersCount: string;
  nonAlphaNumericCharactersCount: string;
  alphaCharactersCount: string;
  uppercaseAlphaCharactersCount: string;
  passwordExpirationActive: boolean;
  passwordExpiresAfter: string;
  notifyBeforeExpiration: boolean;
  notifyBeforeExpirationDays: string;
  adminAutologoutTimeout: string;
}

interface PasswordPolicyTabProps {
  state: PasswordPolicyState;
  setState: React.Dispatch<React.SetStateAction<PasswordPolicyState>>;
}

export const PasswordPolicyTab = memo(function PasswordPolicyTab({
  state,
  setState,
}: PasswordPolicyTabProps) {
  // Helper to update state fields
  const updateField = useCallback(<K extends keyof PasswordPolicyState>(
    field: K,
    value: PasswordPolicyState[K]
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, [setState]);

  const {
    passwordPolicyActive,
    passwordCannotContainUsername,
    enablePasswordEncryption,
    minimalPasswordLength,
    numericCharactersCount,
    nonAlphaNumericCharactersCount,
    alphaCharactersCount,
    uppercaseAlphaCharactersCount,
    passwordExpirationActive,
    passwordExpiresAfter,
    notifyBeforeExpiration,
    notifyBeforeExpirationDays,
    adminAutologoutTimeout,
  } = state;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">
          PASSWORD POLICY
        </h2>

        {/* General Section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            General
          </h3>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Switch
              checked={state.passwordPolicyActive}
              onCheckedChange={(value) => updateField('passwordPolicyActive', value)}
            />
            <Label className="text-sm font-medium text-foreground cursor-pointer flex-1">
              ACTIVE
            </Label>
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Switch
              checked={state.passwordCannotContainUsername}
              onCheckedChange={(value) => updateField('passwordCannotContainUsername', value)}
            />
            <Label className="text-sm font-medium text-foreground cursor-pointer flex-1">
              PASSWORD CANNOT CONTAIN USERNAME OR ALIAS
            </Label>
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Switch
              checked={state.enablePasswordEncryption}
              onCheckedChange={(value) => updateField('enablePasswordEncryption', value)}
            />
            <Label className="text-sm font-medium text-foreground cursor-pointer flex-1">
              ENABLE PASSWORD ENCRYPTION
            </Label>
          </div>
        </div>

        {/* Password format Section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Password format
          </h3>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground whitespace-nowrap">
              MINIMAL PASSWORD LENGTH
            </Label>
            <Input
              type="number"
              value={state.minimalPasswordLength}
              onChange={(e) => updateField('minimalPasswordLength', e.target.value)}
              className="w-32"
            />
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground">
              NUMBER OF NUMERIC CHARACTERS IN PASSWORD [0-9]
            </Label>
            <Input
              type="number"
              value={state.numericCharactersCount}
              onChange={(e) => updateField('numericCharactersCount', e.target.value)}
              className="w-32"
            />
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground">
              NUMBER OF NON ALPHA-NUMERIC CHARACTERS IN PASSWORD
              [!@#$%...]
            </Label>
            <Input
              type="number"
              value={state.nonAlphaNumericCharactersCount}
              onChange={(e) => updateField('nonAlphaNumericCharactersCount', e.target.value)}
              className="w-32"
            />
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground">
              NUMBER OF ALPHA CHARACTERS IN PASSWORD [A-Z][A-Z]
            </Label>
            <Input
              type="number"
              value={state.alphaCharactersCount}
              onChange={(e) => updateField('alphaCharactersCount', e.target.value)}
              className="w-32"
            />
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground">
              NUMBER OF UPPERCASE ALPHA CHARACTERS IN PASSWORD [A-Z]
            </Label>
            <Input
              type="number"
              value={state.uppercaseAlphaCharactersCount}
              onChange={(e) => updateField('uppercaseAlphaCharactersCount', e.target.value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Password expiration Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Password expiration
          </h3>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Switch
              checked={state.passwordExpirationActive}
              onCheckedChange={(value) => updateField('passwordExpirationActive', value)}
            />
            <Label className="text-sm font-medium text-foreground cursor-pointer flex-1">
              ACTIVE
            </Label>
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground whitespace-nowrap">
              PASSWORD EXPIRES AFTER
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={state.passwordExpiresAfter}
                onChange={(e) => updateField('passwordExpiresAfter', e.target.value)}
                className="w-32"
                disabled={!state.passwordExpirationActive}
              />
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                days
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-4 flex-1">
              <Switch
                checked={state.notifyBeforeExpiration}
                onCheckedChange={(value) => updateField('notifyBeforeExpiration', value)}
              />
              <Label className="text-sm font-medium text-foreground cursor-pointer">
                NOTIFY BEFORE EXPIRATION
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={state.notifyBeforeExpirationDays}
                onChange={(e) => updateField('notifyBeforeExpirationDays', e.target.value)}
                className="w-32"
                disabled={!state.notifyBeforeExpiration}
              />
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                days
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
            <Label className="text-sm font-medium text-foreground whitespace-nowrap">
              ADMIN AUTOLOGOUT TIMEOUT
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={state.adminAutologoutTimeout}
                onChange={(e) => updateField('adminAutologoutTimeout', e.target.value)}
                className="w-32"
              />
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
                min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
