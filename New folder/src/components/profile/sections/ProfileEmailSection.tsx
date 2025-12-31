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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CustomInlineForm,
  FieldType,
  FormField,
} from "@/components/custom/CustomInlineForm";

export interface ProfileEmailSectionProps {
  profileData: {
    forwardTo: string;
    alternateEmail: string;
    doNotForwardSpam: boolean;
    copyIncomingMail: string;
    copyOutgoingMail: string;
    autoRespondEnabled: boolean;
    respondStartDate: string;
    respondEndDate: string;
    respondAfterDays: string;
    spamReportsMode: string;
    spamFolderMode: string;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export function ProfileEmailSection({
  profileData,
  onInputChange,
}: ProfileEmailSectionProps) {
  // Handle forward to input change
  const handleForwardToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('forwardTo', e.target.value);
  };

  // Handle alternate email input change
  const handleAlternateEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('alternateEmail', e.target.value);
  };

  // Handle copy incoming mail input change
  const handleCopyIncomingMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('copyIncomingMail', e.target.value);
  };

  // Handle copy outgoing mail input change
  const handleCopyOutgoingMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('copyOutgoingMail', e.target.value);
  };

  // Handle do not forward spam toggle
  const handleDoNotForwardSpamChange = (checked: boolean) => {
    onInputChange('doNotForwardSpam', checked);
  };

  // Check if Forward To field has value to enable/disable the toggle
  const isForwardToEmpty = !profileData.forwardTo || profileData.forwardTo.trim() === '';

  // Responder Fields
  const responderFields: FormField[] = [
    {
      name: "autoRespondEnabled",
      label: "AUTOMATICALLY RESPOND TO EMAILS RECEIVED BETWEEN",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "respondStartDate",
      label: "START DATE",
      type: FieldType.DATE,
      placeholder: "dd-mm-yyyy",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "respondEndDate",
      label: "END DATE",
      type: FieldType.DATE,
      placeholder: "dd-mm-yyyy",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "respondAfterDays",
      label: "RESPOND TO THE SAME SENDER AGAIN AFTER (DAYS)",
      type: FieldType.NUMBER,
      placeholder: "Days",
      className: "bg-muted border-border text-foreground",
    },
  ];

  // Anti-Spam Fields
  const antiSpamFields: FormField[] = [
    {
      name: "spamReportsMode",
      label: "SPAM REPORTS MODE",
      type: FieldType.SELECT,
      options: [
        { value: "default", label: "Default" },
        { value: "new", label: "New Items" },
        { value: "all", label: "All Items" },
      ],
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "spamFolderMode",
      label: "SPAM FOLDER MODE",
      type: FieldType.SELECT,
      options: [
        { value: "default", label: "Default" },
        { value: "enabled", label: "Enabled" },
        { value: "disabled", label: "Disabled" },
      ],
      className: "bg-muted border-border text-foreground",
    },
  ];


  const handleResponderSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handleAntiSpamSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  return (
    <div className="space-y-6">
      {/* Forwarder Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            FORWARDER
          </CardTitle>
          <CardDescription className="text-foreground">
            Set where messages are to be forwarded or copied, separate several by semicolon. Alternate email is used during password retrieval. Incoming/outgoing copy cannot be modified by user.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Forward To and Alternate Email - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">FORWARD TO</Label>
                <Input
                  type="email"
                  value={profileData.forwardTo}
                  onChange={handleForwardToChange}
                  placeholder="Email"
                  className="bg-muted border-border text-foreground"
                />
              </div>

              {/* Do Not Forward Spam Messages - Below Forward To */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
                <Label 
                  htmlFor="doNotForwardSpam" 
                  className={`text-sm font-medium ${isForwardToEmpty ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  DO NOT FORWARD SPAM MESSAGES
                </Label>
                <Switch
                  id="doNotForwardSpam"
                  checked={profileData.doNotForwardSpam}
                  onCheckedChange={handleDoNotForwardSpamChange}
                  disabled={isForwardToEmpty}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">ALTERNATE EMAIL</Label>
              <Input
                type="email"
                value={profileData.alternateEmail}
                onChange={handleAlternateEmailChange}
                placeholder="Email"
                className="bg-muted border-border text-foreground"
              />
            </div>
          </div>

          {/* Copy Incoming Mail and Copy Outgoing Mail - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">COPY INCOMING MAIL</Label>
              <Input
                type="email"
                value={profileData.copyIncomingMail}
                onChange={handleCopyIncomingMailChange}
                placeholder="Email"
                className="bg-muted border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">COPY OUTGOING MAIL</Label>
              <Input
                type="email"
                value={profileData.copyOutgoingMail}
                onChange={handleCopyOutgoingMailChange}
                placeholder="Email"
                className="bg-muted border-border text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responder Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            RESPONDER
          </CardTitle>
          <CardDescription className="text-foreground">
            Other fields are enabled depending on the responder mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomInlineForm
            config={{
              fields: responderFields,
              onSubmit: handleResponderSubmit,
              defaultValues: profileData,
            }}
          />
          <Button className="bg-blue-600 hover:bg-blue-700 text-foreground">
            MESSAGE
          </Button>
        </CardContent>
      </Card>

      {/* Anti-Spam Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            ANTI-SPAM
          </CardTitle>
          <CardDescription className="text-foreground">
            Options for receiving spam reports (new items, all items) and
            whether a spam folder should be used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: antiSpamFields,
              onSubmit: handleAntiSpamSubmit,
              defaultValues: profileData,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
