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

export interface ProfileCardSectionProps {
  profileData: {
    phone: string;
    website: string;
    street: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    notes: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProfileCardSection({
  profileData,
  onInputChange,
}: ProfileCardSectionProps) {
  // Contact Information Fields
  const contactFields: FormField[] = [
    {
      name: "phone",
      label: "PHONE NUMBER",
      type: FieldType.TEL,
      placeholder: "+1 (555) 123-4567",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "website",
      label: "WEBSITE",
      type: FieldType.URL,
      placeholder: "https://yourwebsite.com",
      className: "bg-muted border-border text-foreground",
    },
  ];

  // Address Fields
  const addressFields: FormField[] = [
    {
      name: "street",
      label: "STREET ADDRESS",
      type: FieldType.TEXT,
      placeholder: "123 Main Street",
      className: "bg-muted border-border text-foreground",
      gridCols: 2,
    },
    {
      name: "city",
      label: "CITY",
      type: FieldType.TEXT,
      placeholder: "City",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "zip",
      label: "ZIP CODE",
      type: FieldType.TEXT,
      placeholder: "12345",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "state",
      label: "STATE",
      type: FieldType.TEXT,
      placeholder: "State",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "country",
      label: "COUNTRY",
      type: FieldType.TEXT,
      placeholder: "Country",
      className: "bg-muted border-border text-foreground",
    },
  ];

  // Notes Fields
  const notesFields: FormField[] = [
    {
      name: "notes",
      label: "NOTES",
      type: FieldType.TEXTAREA,
      placeholder: "Enter any additional notes...",
      className: "bg-muted border-border text-foreground min-h-[120px]",
      gridCols: 2,
    },
  ];

  const handleContactSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handleAddressSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handleNotesSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            CONTACT INFORMATION
          </CardTitle>
          <CardDescription className="text-foreground">
            Manage your contact details and communication preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: contactFields,
              onSubmit: handleContactSubmit,
              defaultValues: profileData,
            }}
          />
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            ADDRESS
          </CardTitle>
          <CardDescription className="text-foreground">
            Enter your physical address information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: addressFields,
              onSubmit: handleAddressSubmit,
              defaultValues: profileData,
            }}
          />
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">NOTES</CardTitle>
          <CardDescription className="text-foreground">
            Add any additional notes or comments about this profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: notesFields,
              onSubmit: handleNotesSubmit,
              defaultValues: profileData,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
