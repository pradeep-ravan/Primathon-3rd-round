"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CustomInlineForm,
  FieldType,
  FormField,
} from "@/components/custom/CustomInlineForm";
import { X } from "lucide-react";

interface PhoneEntry {
  number: string;
  type: string;
}

interface EmailEntry {
  address: string;
  type: string;
}

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
    phones: PhoneEntry[];
    emails: EmailEntry[];
    website: string;
    // Work address
    workStreet: string;
    workCity: string;
    workZip: string;
    workState: string;
    workCountry: string;
    // Home address
    homeStreet: string;
    homeCity: string;
    homeZip: string;
    homeState: string;
    homeCountry: string;
    notes: string;
  };
  onInputChange: (field: string, value: any) => void;
}

export function ProfileCardSection({
  profileData,
  onInputChange,
}: ProfileCardSectionProps) {
  const [phones, setPhones] = useState<PhoneEntry[]>(
    profileData.phones?.length > 0 ? profileData.phones : [{ number: '', type: 'Home 1' }]
  );
  const [emails, setEmails] = useState<EmailEntry[]>(
    profileData.emails?.length > 0 ? profileData.emails : [{ address: '', type: 'Email 1' }]
  );

  // Update local state when profileData changes
  React.useEffect(() => {
    if (profileData.phones?.length > 0) {
      setPhones(profileData.phones);
    }
  }, [profileData.phones]);

  React.useEffect(() => {
    if (profileData.emails?.length > 0) {
      setEmails(profileData.emails);
    }
  }, [profileData.emails]);

  // Phone handlers
  const handleAddPhone = () => {
    const newPhones = [...phones, { number: '', type: `Home ${phones.length + 1}` }];
    setPhones(newPhones);
    onInputChange('phones', newPhones);
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
    onInputChange('phones', newPhones);
  };

  const handlePhoneChange = (index: number, field: 'number' | 'type', value: string) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
    onInputChange('phones', newPhones);
  };

  // Email handlers
  const handleAddEmail = () => {
    // Limit to 4 emails max (3 regular emails + 1 IM address)
    if (emails.length >= 4) {
      return;
    }
    const newEmails = [...emails, { address: '', type: `Email ${emails.length + 1}` }];
    setEmails(newEmails);
    onInputChange('emails', newEmails);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
    onInputChange('emails', newEmails);
  };

  const handleEmailChange = (index: number, field: 'address' | 'type', value: string) => {
    const newEmails = [...emails];
    newEmails[index][field] = value;
    setEmails(newEmails);
    onInputChange('emails', newEmails);
  };

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

  // Website field (allow 2 websites)
  const [websites, setWebsites] = useState<string[]>(
    profileData.website ? [profileData.website, ''] : ['', '']
  );

  const handleWebsiteChange = (index: number, value: string) => {
    const newWebsites = [...websites];
    newWebsites[index] = value;
    setWebsites(newWebsites);
    // Store only the first non-empty website for now
    onInputChange('website', newWebsites[0] || newWebsites[1] || '');
  };

  // Website field (single field, we can keep it simple)
  const websiteFields: FormField[] = [
    {
      name: "website",
      label: "WEBSITE",
      type: FieldType.URL,
      placeholder: "https://yourwebsite.com",
      className: "bg-muted border-border text-foreground",
    },
  ];

  // Address Fields - Remove old addressFields
  // We'll create inline fields for work and home addresses

  // Notes Fields - Remove notesFields since we now use textarea
  // We'll handle notes separately

  const handleGeneralSubmit = (data: any) => {
    Object.keys(data).forEach((key) => {
      onInputChange(key, data[key]);
    });
  };

  const handleWebsiteSubmit = (data: any) => {
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

      {/* Phone Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold">
              PHONE
            </CardTitle>
            <CardDescription className="text-foreground">
              Enter the user's phone number(s).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {phones.map((phone, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="tel"
                  value={phone.number}
                  onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                  placeholder="Phone"
                  className="flex-1 bg-muted border-border text-foreground"
                />
                <Select
                  value={phone.type}
                  onValueChange={(value) => handlePhoneChange(index, 'type', value)}
                >
                  <SelectTrigger className="w-[140px] bg-muted border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home 1">Home 1</SelectItem>
                    <SelectItem value="Home 2">Home 2</SelectItem>
                    <SelectItem value="Assistant">Assistant</SelectItem>
                    <SelectItem value="Work 1">Work 1</SelectItem>
                    <SelectItem value="Work 2">Work 2</SelectItem>
                    <SelectItem value="Fax home">Fax home</SelectItem>
                    <SelectItem value="Fax work">Fax work</SelectItem>
                    <SelectItem value="Callback">Callback</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="ISDN">ISDN</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Other fax">Other fax</SelectItem>
                    <SelectItem value="Pager">Pager</SelectItem>
                    <SelectItem value="Primary">Primary</SelectItem>
                    <SelectItem value="Radio">Radio</SelectItem>
                    <SelectItem value="Telex">Telex</SelectItem>
                    <SelectItem value="Hearing">Hearing</SelectItem>
                    <SelectItem value="SIP">SIP</SelectItem>
                  </SelectContent>
                </Select>
                {phones.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePhone(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={handleAddPhone}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              ADD PHONE
            </Button>
          </CardContent>
        </Card>

        {/* Email Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold">
              EMAIL
            </CardTitle>
            <CardDescription className="text-foreground">
              Enter the user's email address(es).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="email"
                  value={email.address}
                  onChange={(e) => handleEmailChange(index, 'address', e.target.value)}
                  placeholder="Email"
                  className="flex-1 bg-muted border-border text-foreground"
                />
                <Select
                  value={email.type}
                  onValueChange={(value) => handleEmailChange(index, 'type', value)}
                >
                  <SelectTrigger className="w-[140px] bg-muted border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email 1">Email 1</SelectItem>
                    <SelectItem value="Email 2">Email 2</SelectItem>
                    <SelectItem value="Email 3">Email 3</SelectItem>
                    <SelectItem value="IM address">IM address</SelectItem>
                  </SelectContent>
                </Select>
                {emails.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEmail(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={handleAddEmail}
              disabled={emails.length >= 4}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ADD EMAIL
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Website and Notes Section - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold">
              WEBSITE
            </CardTitle>
            <CardDescription className="text-foreground">
              Enter the user's website address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {websites.map((website, index) => (
              <Input
                key={index}
                type="url"
                value={website}
                onChange={(e) => handleWebsiteChange(index, e.target.value)}
                placeholder="Website"
                className="bg-muted border-border text-foreground"
              />
            ))}
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold">
              NOTE
            </CardTitle>
            <CardDescription className="text-foreground">
              Note to a contact (this field is usually edited by a user).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={profileData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              placeholder="Note"
              className="w-full min-h-[120px] max-h-[400px] resize-y bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              style={{ resize: 'vertical' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Address Information - Work and Home side by side */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            ADDRESS
          </CardTitle>
          <CardDescription className="text-foreground">
            Enter a street address or place of work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Work Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Work address</h3>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">STREET</Label>
                <Input
                  value={profileData.workStreet}
                  onChange={(e) => onInputChange('workStreet', e.target.value)}
                  placeholder="Street"
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">CITY</Label>
                  <Input
                    value={profileData.workCity}
                    onChange={(e) => onInputChange('workCity', e.target.value)}
                    placeholder="City"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">ZIP</Label>
                  <Input
                    value={profileData.workZip}
                    onChange={(e) => onInputChange('workZip', e.target.value)}
                    placeholder="ZIP"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">STATE / COUNTY</Label>
                  <Input
                    value={profileData.workState}
                    onChange={(e) => onInputChange('workState', e.target.value)}
                    placeholder="State / County"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">COUNTRY</Label>
                  <Input
                    value={profileData.workCountry}
                    onChange={(e) => onInputChange('workCountry', e.target.value)}
                    placeholder="Country"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Home Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Home address</h3>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">STREET</Label>
                <Input
                  value={profileData.homeStreet}
                  onChange={(e) => onInputChange('homeStreet', e.target.value)}
                  placeholder="Street"
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">CITY</Label>
                  <Input
                    value={profileData.homeCity}
                    onChange={(e) => onInputChange('homeCity', e.target.value)}
                    placeholder="City"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">ZIP</Label>
                  <Input
                    value={profileData.homeZip}
                    onChange={(e) => onInputChange('homeZip', e.target.value)}
                    placeholder="ZIP"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">STATE / COUNTY</Label>
                  <Input
                    value={profileData.homeState}
                    onChange={(e) => onInputChange('homeState', e.target.value)}
                    placeholder="State / County"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">COUNTRY</Label>
                  <Input
                    value={profileData.homeCountry}
                    onChange={(e) => onInputChange('homeCountry', e.target.value)}
                    placeholder="Country"
                    className="bg-muted border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
