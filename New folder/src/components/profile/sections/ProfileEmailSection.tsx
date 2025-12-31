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
    respondAfterDaysEnabled?: boolean;
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

  // Handle auto respond toggle
  const handleAutoRespondToggle = (checked: boolean) => {
    onInputChange('autoRespondEnabled', checked);
    // If disabling, also disable the respond after days feature
    if (!checked) {
      onInputChange('respondAfterDaysEnabled', false);
    }
  };

  // Handle respond start date change
  const handleRespondStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('respondStartDate', e.target.value);
  };

  // Handle respond end date change
  const handleRespondEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('respondEndDate', e.target.value);
  };

  // Handle respond after days toggle (new field)
  const handleRespondAfterDaysToggle = (checked: boolean) => {
    onInputChange('respondAfterDaysEnabled', checked);
  };

  // Handle respond after days input
  const handleRespondAfterDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('respondAfterDays', e.target.value);
  };

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
            Select the responder mode for this account. Other fields are enabled depending on this mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Automatically Respond Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <Label 
              htmlFor="autoRespondEnabled" 
              className="text-sm font-medium text-foreground"
            >
              AUTOMATICALLY RESPOND TO EMAILS RECEIVED BETWEEN
            </Label>
            <Switch
              id="autoRespondEnabled"
              checked={profileData.autoRespondEnabled}
              onCheckedChange={handleAutoRespondToggle}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>

          {/* Start Date and End Date - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className={`text-sm font-medium ${!profileData.autoRespondEnabled ? 'text-muted-foreground' : 'text-foreground'}`}>
                START DATE
              </Label>
              <Input
                type="date"
                value={profileData.respondStartDate || ''}
                onChange={handleRespondStartDateChange}
                placeholder="dd/mm/yyyy"
                disabled={!profileData.autoRespondEnabled}
                className="bg-muted border-border text-foreground [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label className={`text-sm font-medium ${!profileData.autoRespondEnabled ? 'text-muted-foreground' : 'text-foreground'}`}>
                END DATE
              </Label>
              <Input
                type="date"
                value={profileData.respondEndDate || ''}
                onChange={handleRespondEndDateChange}
                placeholder="dd/mm/yyyy"
                disabled={!profileData.autoRespondEnabled}
                className="bg-muted border-border text-foreground [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Respond to Same Sender Again After (Days) Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
              <Label 
                htmlFor="respondAfterDaysEnabled" 
                className={`text-sm font-medium ${!profileData.autoRespondEnabled ? 'text-muted-foreground' : 'text-foreground'}`}
              >
                RESPOND TO THE SAME SENDER AGAIN AFTER (DAYS)
              </Label>
              <Switch
                id="respondAfterDaysEnabled"
                checked={profileData.respondAfterDaysEnabled || false}
                onCheckedChange={handleRespondAfterDaysToggle}
                disabled={!profileData.autoRespondEnabled}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>

            {/* Days Input */}
            <div className="space-y-2">
              <Input
                type="number"
                value={profileData.respondAfterDays || ''}
                onChange={handleRespondAfterDaysChange}
                placeholder="Days"
                disabled={!profileData.autoRespondEnabled || !profileData.respondAfterDaysEnabled}
                className="bg-muted border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Message Button */}
          <Button 
            disabled={!profileData.autoRespondEnabled}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
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
