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
  // Forwarder Fields
  const forwarderFields: FormField[] = [
    {
      name: "forwardTo",
      label: "FORWARD TO",
      type: FieldType.EMAIL,
      placeholder: "Email",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "alternateEmail",
      label: "ALTERNATE EMAIL",
      type: FieldType.EMAIL,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "doNotForwardSpam",
      label: "DO NOT FORWARD SPAM MESSAGES",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "copyIncomingMail",
      label: "COPY INCOMING MAIL",
      type: FieldType.EMAIL,
      placeholder: "Email",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "copyOutgoingMail",
      label: "COPY OUTGOING MAIL",
      type: FieldType.EMAIL,
      placeholder: "Email",
      className: "bg-muted border-border text-foreground",
    },
  ];

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

  const handleForwarderSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

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
            Forward and copy messages. Incoming/outgoing copies cannot be
            modified by the user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: forwarderFields,
              onSubmit: handleForwarderSubmit,
              defaultValues: profileData,
            }}
          />
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
