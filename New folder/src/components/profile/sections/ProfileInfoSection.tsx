"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CustomInlineForm,
  FieldType,
  FormField,
} from "@/components/custom/CustomInlineForm";
import { X, Plus, Key } from "lucide-react";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";
import toast from "react-hot-toast";
import { useResetPassword } from "@/hooks/useUsers";

export interface ProfileInfoSectionProps {
  profileData: {
    firstName: string;
    lastName: string;
    username: string;
    description: string;
    aliases: string[];
    domain?: string;
    accountType: string;
    accountState: string;
  };
  onInputChange: (field: string, value: string | string[]) => void;
  domainId?: string;
  accountId?: string;
}

export function ProfileInfoSection({
  profileData,
  onInputChange,
  domainId,
  accountId,
}: ProfileInfoSectionProps) {
  const [aliasInputs, setAliasInputs] = useState<string[]>(() => {
    // Initialize with existing aliases or one empty input
    return profileData.aliases && profileData.aliases.length > 0
      ? [...profileData.aliases, ""]
      : [""];
  });
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const domain = profileData.domain || "";
  
  // Use the reset password mutation hook
  const resetPasswordMutation = useResetPassword();

  // General Information Fields
  const generalFields: FormField[] = [
    {
      name: "firstName",
      label: "FIRST NAME",
      type: FieldType.TEXT,
      placeholder: "Enter first name",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "lastName",
      label: "LAST NAME",
      type: FieldType.TEXT,
      placeholder: "Enter last name",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "username",
      label: "USERNAME",
      type: FieldType.TEXT,
      placeholder: "Enter username",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "description",
      label: "DESCRIPTION",
      type: FieldType.TEXT,
      placeholder: "Enter description",
      className: "bg-muted border-border text-foreground",
    },
  ];

  // Permissions & Rights Fields
  const permissionsFields: FormField[] = [
    {
      name: "accountType",
      label: "ACCOUNT TYPE",
      type: FieldType.SELECT,
      options: [
        { value: "System Administrator", label: "System Administrator" },
        { value: "Domain Administrator", label: "Domain Administrator" },
        { value: "Web Administrator", label: "Web Administrator" },
        { value: "User", label: "User" },
      ],
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "accountState",
      label: "ACCOUNT STATE",
      type: FieldType.SELECT,
      options: [
        { value: "Enabled", label: "Enabled" },
        { value: "Disabled (login)", label: "Disabled (login)" },
        { value: "Disable (login, receive)", label: "Disable (login, receive)" },
        { value: "Spam trap", label: "Spam trap" },
      ],
      className: "bg-muted border-border text-foreground",
    },
  ];

  const handleGeneralSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handlePermissionsSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handleAddAliasInput = () => {
    setAliasInputs((prev) => [...prev, ""]);
  };

  const handleRemoveAliasInput = (index: number) => {
    setAliasInputs((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // If we removed the last input and there are no other inputs, keep at least one empty
      if (updated.length === 0) {
        return [""];
      }
      return updated;
    });
    // Also update the saved aliases
    const updatedAliases = aliasInputs
      .filter((_, i) => i !== index)
      .filter((alias) => alias.trim() !== "");
    onInputChange("aliases", updatedAliases);
  };

  const handleAliasChange = (index: number, value: string) => {
    setAliasInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    // Update saved aliases (filter out empty ones)
    const updatedAliases = [...aliasInputs];
    updatedAliases[index] = value;
    const filteredAliases = updatedAliases.filter((alias) => alias.trim() !== "");
    onInputChange("aliases", filteredAliases);
  };

  const handleChangePassword = async (password: string, forceChange: boolean) => {
    
    if (!domainId || !accountId) {
      toast.error("Domain ID and Account ID are required", {
        duration: 3000,
      });
      throw new Error("Missing domain ID or account ID");
    }

    try {
      const result = await resetPasswordMutation.mutateAsync({
        domainId,
        accountId,
        newPassword: password,
      });
      toast.success("Password changed successfully", {
        duration: 3000,
      });
      setIsChangePasswordModalOpen(false);
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = error?.message || "Failed to change password";
      toast.error(errorMessage, {
        duration: 3000,
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* General Section */}
      <Card className="bg-card/80 backdrop-blur-xl border border-border/40 shadow-2xl hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-primary/10 border-b border-border/30 p-6">
          <CardTitle className="text-foreground text-2xl font-bold text-foreground">
            GENERAL
          </CardTitle>
          <CardDescription className="text-foreground text-base leading-relaxed">
            Enter the account's information. All data presented here will be
            shown also in the user's GAL contact. Users can edit the fields in
            My Details dialog in WebClient. All fields are optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CustomInlineForm
            config={{
              fields: generalFields,
              onSubmit: handleGeneralSubmit,
              defaultValues: profileData,
            }}
          />

          {/* Aliases Section */}
          <div className="pt-4 border-t border-border">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                ALIASES
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter aliases for this account. Messages sent to all these
                addresses will be delivered to this mailbox.
              </p>
            </div>

            {/* Alias Input Fields */}
            <div className="space-y-3 mb-4">
              {aliasInputs.map((alias, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="text"
                    value={alias}
                    onChange={(e) => handleAliasChange(index, e.target.value)}
                    placeholder="Add alias"
                    className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200 flex-1"
                  />
                  {aliasInputs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAliasInput(index)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg p-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Alias Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddAliasInput}
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-200 rounded-lg px-4 py-2 font-medium uppercase"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Alias
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Permissions & Rights Section */}
      <Card className="bg-card/80 backdrop-blur-xl border border-border/40 shadow-2xl hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-primary/10 border-b border-border/30 p-6">
          <CardTitle className="text-foreground text-2xl font-bold text-foreground">
            PERMISSIONS & RIGHTS
          </CardTitle>
          <CardDescription className="text-foreground text-base leading-relaxed">
            Select whether this user is a regular email account or a server
            administrator or a domain administrator. Click Features to enable or
            disable services for this user individually.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CustomInlineForm
            config={{
              fields: permissionsFields,
              onSubmit: handlePermissionsSubmit,
              defaultValues: profileData,
            }}
          />

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="text-foreground font-medium">
                TWO-FACTOR AUTHENTICATION
              </h4>
              <p className="text-sm text-muted-foreground">Disabled</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted"
            >
              RESET
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="text-foreground font-medium">
                PASSWORD
              </h4>
              <p className="text-sm text-muted-foreground">Change user password</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="border-border text-foreground hover:bg-muted"
            >
              <Key className="h-4 w-4 mr-2" />
              CHANGE PASSWORD
            </Button>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              LIST OF MEMBERSHIPS
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              PERMISSIONS
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              FEATURES
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleChangePassword}
        isLoading={resetPasswordMutation.isPending}
      />
    </div>
  );
}
