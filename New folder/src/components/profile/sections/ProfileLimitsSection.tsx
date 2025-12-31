"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

export interface ProfileLimitsSectionProps {
  profileData: {
    accountDiskQuota: boolean;
    diskQuotaValue: string;
    diskQuotaUnit: string;
    dailySendOutLimits: boolean;
    sendOutDataLimit: string;
    sendOutDataUnit: string;
    sendOutMessagesLimit: string;
    maxMessageSize: string;
    maxMessageSizeUnit: string;
    deleteMailOlderThan: boolean;
    deleteMailOlderThanDays: string;
    deleteSpamOlderThan: boolean;
    deleteSpamOlderThanDays: string;
    userCanSendToLocalDomainsOnly: boolean;
    disableAccessToPop3: boolean;
    expirationStatus: string;
    expiresIfInactiveFor: string;
    expiresOn: boolean;
    expiresOnDate?: string;
    notifyBeforeExpiration: boolean;
    notifyBeforeExpirationDays?: string;
    deleteAccountWhenExpired: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
}

export function ProfileLimitsSection({
  profileData,
  onInputChange,
}: ProfileLimitsSectionProps) {
  
  const handleAccountDiskQuotaToggle = (checked: boolean) => {
    onInputChange('accountDiskQuota', checked);
  };

  const handleDiskQuotaValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('diskQuotaValue', e.target.value);
  };

  const handleDiskQuotaUnitChange = (value: string) => {
    onInputChange('diskQuotaUnit', value);
  };

  const handleDailySendOutLimitsToggle = (checked: boolean) => {
    onInputChange('dailySendOutLimits', checked);
  };

  const handleSendOutDataLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('sendOutDataLimit', e.target.value);
  };

  const handleSendOutDataUnitChange = (value: string) => {
    onInputChange('sendOutDataUnit', value);
  };

  const handleSendOutMessagesLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('sendOutMessagesLimit', e.target.value);
  };

  const handleMaxMessageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('maxMessageSize', e.target.value);
  };

  const handleMaxMessageSizeUnitChange = (value: string) => {
    onInputChange('maxMessageSizeUnit', value);
  };

  const handleDeleteMailOlderThanToggle = (checked: boolean) => {
    onInputChange('deleteMailOlderThan', checked);
  };

  const handleDeleteMailOlderThanDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('deleteMailOlderThanDays', e.target.value);
  };

  const handleDeleteSpamOlderThanToggle = (checked: boolean) => {
    onInputChange('deleteSpamOlderThan', checked);
  };

  const handleDeleteSpamOlderThanDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('deleteSpamOlderThanDays', e.target.value);
  };

  const handleUserCanSendToLocalDomainsOnlyToggle = (checked: boolean) => {
    onInputChange('userCanSendToLocalDomainsOnly', checked);
  };

  const handleDisableAccessToPop3Toggle = (checked: boolean) => {
    onInputChange('disableAccessToPop3', checked);
  };

  // Expiration handlers
  const handleExpirationStatusChange = (value: string) => {
    onInputChange('expirationStatus', value);
  };

  const handleExpiresIfInactiveForChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('expiresIfInactiveFor', e.target.value);
  };

  const handleExpiresOnToggle = (checked: boolean) => {
    onInputChange('expiresOn', checked);
  };

  const handleExpiresOnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('expiresOnDate', e.target.value);
  };

  const handleNotifyBeforeExpirationToggle = (checked: boolean) => {
    onInputChange('notifyBeforeExpiration', checked);
  };

  const handleNotifyBeforeExpirationDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('notifyBeforeExpirationDays', e.target.value);
  };

  const handleDeleteAccountWhenExpiredToggle = (checked: boolean) => {
    onInputChange('deleteAccountWhenExpired', checked);
  };

  return (
    <div className="space-y-6">
      {/* Limits Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            LIMITS
          </CardTitle>
          <CardDescription className="text-foreground">
            Turn the toggles on and enter the appropriate values for the account limits you want to set.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Disk Quota */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
              <Label htmlFor="accountDiskQuota" className="text-sm font-medium text-foreground">
                ACCOUNT DISK QUOTA
              </Label>
              <Switch
                id="accountDiskQuota"
                checked={profileData.accountDiskQuota}
                onCheckedChange={handleAccountDiskQuotaToggle}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>
            
            {profileData.accountDiskQuota && (
              <div className="flex gap-4">
                <Input
                  type="number"
                  value={profileData.diskQuotaValue}
                  onChange={handleDiskQuotaValueChange}
                  placeholder="0"
                  className="flex-1 bg-muted border-border text-foreground"
                />
                <Select value={profileData.diskQuotaUnit} onValueChange={handleDiskQuotaUnitChange}>
                  <SelectTrigger className="w-[120px] bg-muted border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kB">kB</SelectItem>
                    <SelectItem value="MB">MB</SelectItem>
                    <SelectItem value="GB">GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Daily Send Out Limits */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
              <Label htmlFor="dailySendOutLimits" className="text-sm font-medium text-foreground">
                DAILY SEND OUT LIMITS
              </Label>
              <Switch
                id="dailySendOutLimits"
                checked={profileData.dailySendOutLimits}
                onCheckedChange={handleDailySendOutLimitsToggle}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>
            
            {profileData.dailySendOutLimits && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">SEND OUT DATA LIMIT</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={profileData.sendOutDataLimit}
                        onChange={handleSendOutDataLimitChange}
                        placeholder="0"
                        className="flex-1 bg-muted border-border text-foreground"
                      />
                      <Select value={profileData.sendOutDataUnit} onValueChange={handleSendOutDataUnitChange}>
                        <SelectTrigger className="w-[120px] bg-muted border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MB">MB</SelectItem>
                          <SelectItem value="GB">GB</SelectItem>
                          <SelectItem value="GB">TB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">SEND OUT MESSAGES LIMIT</Label>
                    <Input
                      type="number"
                      value={profileData.sendOutMessagesLimit}
                      onChange={handleSendOutMessagesLimitChange}
                      placeholder="# per day"
                      className="bg-muted border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Max Message Size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">MAX MESSAGE SIZE</Label>
            <div className="flex gap-4">
              <Input
                type="number"
                value={profileData.maxMessageSize}
                onChange={handleMaxMessageSizeChange}
                placeholder="0"
                className="flex-1 bg-muted border-border text-foreground"
              />
              <Select value={profileData.maxMessageSizeUnit} onValueChange={handleMaxMessageSizeUnitChange}>
                <SelectTrigger className="w-[120px] bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kB">kB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                  <SelectItem value="GB">GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delete Mail Older Than */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
              <Label htmlFor="deleteMailOlderThan" className="text-sm font-medium text-foreground">
                DELETE MAIL OLDER THAN
              </Label>
              <Switch
                id="deleteMailOlderThan"
                checked={profileData.deleteMailOlderThan}
                onCheckedChange={handleDeleteMailOlderThanToggle}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>
            
            {profileData.deleteMailOlderThan && (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={profileData.deleteMailOlderThanDays}
                  onChange={handleDeleteMailOlderThanDaysChange}
                  placeholder="Days"
                  className="bg-muted border-border text-foreground"
                />
              </div>
            )}
          </div>

          {/* Delete Spam Older Than */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
              <Label htmlFor="deleteSpamOlderThan" className="text-sm font-medium text-foreground">
                DELETE SPAM OLDER THAN
              </Label>
              <Switch
                id="deleteSpamOlderThan"
                checked={profileData.deleteSpamOlderThan}
                onCheckedChange={handleDeleteSpamOlderThanToggle}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>
            
            {profileData.deleteSpamOlderThan && (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={profileData.deleteSpamOlderThanDays}
                  onChange={handleDeleteSpamOlderThanDaysChange}
                  placeholder="Days"
                  className="bg-muted border-border text-foreground"
                />
              </div>
            )}
          </div>

          {/* User Can Send To Local Domains Only */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <Label htmlFor="userCanSendToLocalDomainsOnly" className="text-sm font-medium text-foreground">
              USER CAN SEND TO LOCAL DOMAINS ONLY
            </Label>
            <Switch
              id="userCanSendToLocalDomainsOnly"
              checked={profileData.userCanSendToLocalDomainsOnly}
              onCheckedChange={handleUserCanSendToLocalDomainsOnlyToggle}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>

          {/* Disable Access To POP3 */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <Label htmlFor="disableAccessToPop3" className="text-sm font-medium text-foreground">
              DISABLE ACCESS TO POP3 (IMAP ONLY ACCOUNT)
            </Label>
            <Switch
              id="disableAccessToPop3"
              checked={profileData.disableAccessToPop3}
              onCheckedChange={handleDisableAccessToPop3Toggle}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>
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
        <CardContent className="space-y-6">
          {/* Status and Expires If Inactive For - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">STATUS</Label>
              <Select value={profileData.expirationStatus} onValueChange={handleExpirationStatusChange}>
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled (login)</SelectItem>
                  <SelectItem value="disabled_receive">Disable (login, receive)</SelectItem>
                  <SelectItem value="spam_trap">Spam trap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">EXPIRES IF INACTIVE FOR</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={profileData.expiresIfInactiveFor}
                  onChange={handleExpiresIfInactiveForChange}
                  placeholder="Days"
                  className="flex-1 bg-muted border-border text-foreground"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>

          {/* Expires On */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
              <Label htmlFor="expiresOn" className="text-sm font-medium text-foreground">
                EXPIRES ON
              </Label>
              <Switch
                id="expiresOn"
                checked={profileData.expiresOn}
                onCheckedChange={handleExpiresOnToggle}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>
            
            {profileData.expiresOn && (
              <div className="relative">
                <Input
                  type="date"
                  value={profileData.expiresOnDate || ''}
                  onChange={handleExpiresOnDateChange}
                  placeholder="dd/mm/yyyy"
                  className="bg-muted border-border text-foreground relative pr-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-100"
                />
              </div>
            )}
          </div>

          {/* Notify Before Expiration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
              <Label htmlFor="notifyBeforeExpiration" className="text-sm font-medium text-foreground">
                NOTIFY BEFORE EXPIRATION
              </Label>
              <Switch
                id="notifyBeforeExpiration"
                checked={profileData.notifyBeforeExpiration}
                onCheckedChange={handleNotifyBeforeExpirationToggle}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>
            
            {profileData.notifyBeforeExpiration && (
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={profileData.notifyBeforeExpirationDays || ''}
                  onChange={handleNotifyBeforeExpirationDaysChange}
                  placeholder="Days"
                  className="flex-1 bg-muted border-border text-foreground"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            )}
          </div>

          {/* Delete Account When Expired */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <Label htmlFor="deleteAccountWhenExpired" className="text-sm font-medium text-foreground">
              DELETE ACCOUNT WHEN EXPIRED
            </Label>
            <Switch
              id="deleteAccountWhenExpired"
              checked={profileData.deleteAccountWhenExpired}
              onCheckedChange={handleDeleteAccountWhenExpiredToggle}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
