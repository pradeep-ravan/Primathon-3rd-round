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
    firstName: string;
    lastName: string;
    birthday: string;
    gender: string;
    anniversary: string;
    company: string;
    department: string;
    job: string;
    manager: string;
    assistant: string;
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
  // General Fields
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
      name: "birthday",
      label: "BIRTHDAY",
      type: FieldType.TEXT,
      placeholder: "dd/mm/yyyy",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "gender",
      label: "GENDER",
      type: FieldType.SELECT,
      options: [
        { value: "Unknown", label: "Unknown" },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "anniversary",
      label: "ANNIVERSARY",
      type: FieldType.TEXT,
      placeholder: "dd/mm/yyyy",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "company",
      label: "COMPANY",
      type: FieldType.TEXT,
      placeholder: "Company",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "department",
      label: "DEPARTMENT",
      type: FieldType.TEXT,
      placeholder: "Department",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "job",
      label: "JOB",
      type: FieldType.TEXT,
      placeholder: "Job",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "manager",
      label: "MANAGER",
      type: FieldType.TEXT,
      placeholder: "Manager",
      className: "bg-muted border-border text-foreground",
    },
    {
      name: "assistant",
      label: "ASSISTANT",
      type: FieldType.TEXT,
      placeholder: "Assistant",
      className: "bg-muted border-border text-foreground",
    },
  ];

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

  const handleGeneralSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

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
      {/* General Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            GENERAL
          </CardTitle>
          <CardDescription className="text-foreground">
            Enter the account's information. All data presented here will be
            shown also in the user's GAL contact. Users can edit the fields in
            My Details dialog in WebClient. All fields are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomInlineForm
            config={{
              fields: generalFields,
              onSubmit: handleGeneralSubmit,
              defaultValues: profileData,
            }}
          />
        </CardContent>
      </Card>

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
