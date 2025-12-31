"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CustomInlineForm,
  FieldType,
  FormField,
} from "@/components/custom/CustomInlineForm";

export interface ProfileRulesSectionProps {
  profileData: {
    autoReplyEnabled: boolean;
    vacationMessage: string;
    forwardToManager: boolean;
    blockExternalEmails: boolean;
    requireApproval: boolean;
    customRules: string[];
  };
  onInputChange: (field: string, value: string | boolean) => void;
  onAddRule: () => void;
  onRemoveRule: (index: number) => void;
}

export function ProfileRulesSection({
  profileData,
  onInputChange,
  onAddRule,
  onRemoveRule,
}: ProfileRulesSectionProps) {
  // Auto-Reply Fields
  const autoReplyFields: FormField[] = [
    {
      name: "autoReplyEnabled",
      label: "Enable Auto-Reply",
      type: FieldType.SWITCH,
      description: "Automatically respond to incoming emails",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "vacationMessage",
      label: "VACATION MESSAGE",
      type: FieldType.TEXTAREA,
      placeholder: "Enter your vacation message...",
      className: "bg-muted border-border text-foreground min-h-[100px]",
      conditional: {
        field: "autoReplyEnabled",
        value: true,
        operator: "equals",
      },
    },
  ];

  // Email Forwarding Fields
  const forwardingFields: FormField[] = [
    {
      name: "forwardToManager",
      label: "Forward to Manager",
      type: FieldType.SWITCH,
      description: "Automatically forward emails to your manager",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "blockExternalEmails",
      label: "Block External Emails",
      type: FieldType.SWITCH,
      description: "Only allow emails from internal domains",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "requireApproval",
      label: "Require Approval",
      type: FieldType.SWITCH,
      description: "Require manager approval for external emails",
      className: "bg-muted border-border text-foreground",
    },
  ];

  const handleAutoReplySubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handleForwardingSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  return (
    <div className="space-y-6">
      {/* Auto-Reply Rules */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            AUTO-REPLY RULES
          </CardTitle>
          <CardDescription className="text-foreground">
            Configure automatic responses and vacation messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: autoReplyFields,
              onSubmit: handleAutoReplySubmit,
              defaultValues: profileData,
            }}
          />
        </CardContent>
      </Card>

      {/* Email Forwarding Rules */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            EMAIL FORWARDING RULES
          </CardTitle>
          <CardDescription className="text-foreground">
            Configure how emails should be handled and forwarded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: forwardingFields,
              onSubmit: handleForwardingSubmit,
              defaultValues: profileData,
            }}
          />
        </CardContent>
      </Card>

      {/* Custom Rules */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            CUSTOM RULES
          </CardTitle>
          <CardDescription className="text-foreground">
            Define custom email processing rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {profileData.customRules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
              >
                <span className="text-foreground flex-1">{rule}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveRule(index)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={onAddRule}
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
          >
            Add Custom Rule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
