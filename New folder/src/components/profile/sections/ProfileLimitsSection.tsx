"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CustomInlineForm,
  FieldType,
  FormField,
} from "@/components/custom/CustomInlineForm";

export interface ProfileLimitsSectionProps {
  profileData: {
    accountDiskQuota: boolean;
    diskQuotaValue: string;
    diskQuotaUnit: string;
    dailySendOutLimits: boolean;
    deleteMailOlderThan: boolean;
    deleteSpamOlderThan: boolean;
    userCanSendToLocalDomainsOnly: boolean;
    disableAccessToPop3: boolean;
    expirationStatus: string;
    expiresIfInactiveFor: string;
    expiresOn: boolean;
    notifyBeforeExpiration: boolean;
    deleteAccountWhenExpired: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export function ProfileLimitsSection({
  profileData,
  onInputChange,
}: ProfileLimitsSectionProps) {
  // Limits Fields
  const limitsFields: FormField[] = [
    {
      name: "accountDiskQuota",
      label: "ACCOUNT DISK QUOTA",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "diskQuotaValue",
      label: "DISK QUOTA VALUE",
      type: FieldType.NUMBER,
      placeholder: "0",
      className: "bg-muted border-border text-foreground w-20",
      conditional: {
        field: "accountDiskQuota",
        value: true,
        operator: "equals",
      },
    },
    {
      name: "diskQuotaUnit",
      label: "DISK QUOTA UNIT",
      type: FieldType.SELECT,
      options: [
        { value: "kb", label: "kB" },
        { value: "mb", label: "MB" },
        { value: "gb", label: "GB" },
      ],
      className: "bg-muted border-border text-foreground w-20",
      conditional: {
        field: "accountDiskQuota",
        value: true,
        operator: "equals",
      },
    },
    {
      name: "dailySendOutLimits",
      label: "DAILY SEND OUT LIMITS",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "deleteMailOlderThan",
      label: "DELETE MAIL OLDER THAN",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "deleteSpamOlderThan",
      label: "DELETE SPAM OLDER THAN",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "userCanSendToLocalDomainsOnly",
      label: "USER CAN SEND TO LOCAL DOMAINS ONLY",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "disableAccessToPop3",
      label: "DISABLE ACCESS TO POP3 (IMAP ONLY ACCOUNT)",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
  ];

  // Expiration Fields
  const expirationFields: FormField[] = [
    {
      name: "expirationStatus",
      label: "STATUS",
      type: FieldType.SELECT,
      options: [
        { value: "enabled", label: "Enabled" },
        { value: "disabled", label: "Disabled" },
      ],
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "expiresIfInactiveFor",
      label: "EXPIRES IF INACTIVE FOR (DAYS)",
      type: FieldType.NUMBER,
      placeholder: "0",
      className: "bg-muted border-border text-foreground w-20",
    },
    {
      name: "expiresOn",
      label: "EXPIRES ON",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "notifyBeforeExpiration",
      label: "NOTIFY BEFORE EXPIRATION",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "deleteAccountWhenExpired",
      label: "DELETE ACCOUNT WHEN EXPIRED",
      type: FieldType.SWITCH,
      className: "bg-muted border-border text-foreground",
    },
  ];

  const handleLimitsSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handleExpirationSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Limits Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold">
              LIMITS
            </CardTitle>
            <CardDescription className="text-foreground">
              Turn the toggles on and enter the appropriate values for the
              account limits you want to set.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomInlineForm
              config={{
                fields: limitsFields,
                onSubmit: handleLimitsSubmit,
                defaultValues: profileData,
              }}
            />
          </CardContent>
        </Card>

        {/* Expiration Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold">
              EXPIRATION
            </CardTitle>
            <CardDescription className="text-foreground">
              Set expiration of the user's account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomInlineForm
              config={{
                fields: expirationFields,
                onSubmit: handleExpirationSubmit,
                defaultValues: profileData,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
