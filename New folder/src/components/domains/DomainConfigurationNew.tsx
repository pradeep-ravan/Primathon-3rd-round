"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Shield,
  Settings,
  Users,
  Smartphone,
  FileText,
  List,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { MultiTabLayout, Tab } from "@/components/ui/layout/MultiTabLayout";
import { Domain, DomainConfigurationRequest } from "@/types/domain";
import { useUpdateDomainConfiguration } from "@/hooks/useDomains";
import toast from "react-hot-toast";

interface DomainConfigurationProps {
  domain: Domain;
  onClose: () => void;
  onSave?: (updatedDomain: Domain) => void;
}

const tabs: Tab[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "permissions", label: "Permissions", icon: Shield },
  { id: "limits", label: "Limits", icon: BarChart3 },
  { id: "features", label: "Features", icon: List },
  { id: "devices", label: "Devices", icon: Smartphone },
  { id: "statistics", label: "Statistics", icon: BarChart3 },
];

export function DomainConfigurationNew({
  domain,
  onClose,
  onSave,
}: DomainConfigurationProps) {
  const updateDomainConfiguration = useUpdateDomainConfiguration();
  const [formData, setFormData] = useState({
    // General
    name: domain.name,
    description: domain.description || "",
    domain_type: domain.domain_type,
    administrator_email: "",
    verification: "default",
    password: "",

    // Permissions
    max_subscription_plan: "any",
    unknown_accounts: "reject",
    target_email: "",
    two_factor_auth: false,
    instant_messaging: false,

    // Limits
    domain_admin_limit: "",
    disk_quota_enabled: false,
    disk_quota: "",
    disk_quota_unit: "kB",
    daily_send_limit_enabled: false,
    disable_login: false,
    account_size: "",
    account_size_unit: "kB",
    max_message_size: "",
    max_message_size_unit: "kB",
    default_daily_send_limit: false,
    delete_spam_older_than: false,

    // Expiration
    expires_on: false,
    notify_before_expiration: false,
    delete_domain_when_expired: false,
  });

  const handleSave = async () => {
    try {
      const configurationData: DomainConfigurationRequest = {
        domain_limits: {
          domain_admin_limit: formData.domain_admin_limit
            ? parseInt(formData.domain_admin_limit)
            : undefined,
          disk_quota_enabled: formData.disk_quota_enabled,
          disk_quota: formData.disk_quota
            ? parseInt(formData.disk_quota)
            : undefined,
          disk_quota_unit: formData.disk_quota_unit as "kB" | "MB" | "GB",
          daily_send_limit_enabled: formData.daily_send_limit_enabled,
          disable_login: formData.disable_login,
          expires_on: formData.expires_on
            ? new Date().toISOString()
            : undefined,
          notify_before_expiration: formData.notify_before_expiration,
          delete_domain_when_expired: formData.delete_domain_when_expired,
        },
        user_limits: {
          account_size: formData.account_size
            ? parseInt(formData.account_size)
            : undefined,
          account_size_unit: formData.account_size_unit as "kB" | "MB" | "GB",
          max_message_size: formData.max_message_size
            ? parseInt(formData.max_message_size)
            : undefined,
          max_message_size_unit: formData.max_message_size_unit as
            | "kB"
            | "MB"
            | "GB",
          default_daily_send_limit: formData.default_daily_send_limit,
          delete_spam_older_than: formData.delete_spam_older_than,
        },
        features: {
          two_factor_auth: formData.two_factor_auth,
          instant_messaging: formData.instant_messaging,
          shared_roster: formData.instant_messaging,
          public_folders: true,
          team_chat: true,
          global_address_list: true,
          mobile_sync: true,
          outlook_sync: true,
          webmail: true,
          calendar: true,
          contacts: true,
          tasks: true,
          notes: true,
        },
      };

      await updateDomainConfiguration.mutateAsync({
        id: domain.id,
        config: configurationData,
      });

      toast.success("Domain configuration saved successfully", {
        duration: 4000,
        style: {
          background: "#10b981",
          color: "#fff",
        },
      });

      onSave?.(domain);
      onClose();
    } catch (error) {
      toast.error("Failed to save domain configuration", {
        duration: 4000,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderGeneralSection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-gray-200 mb-2 block"
            >
              Domain Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200"
              placeholder="Enter domain name"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-200 mb-2 block"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200 resize-none"
              placeholder="Enter domain description"
              rows={3}
            />
          </div>

          <div>
            <Label
              htmlFor="type"
              className="text-sm font-semibold text-gray-200 mb-2 block"
            >
              Domain Type
            </Label>
            <Select
              value={formData.domain_type}
              onValueChange={(value) => updateFormData("domain_type", value)}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem
                  value="STANDARD"
                  className="text-white hover:bg-gray-700"
                >
                  Standard
                </SelectItem>
                <SelectItem
                  value="PREMIUM"
                  className="text-white hover:bg-gray-700"
                >
                  Premium
                </SelectItem>
                <SelectItem
                  value="ENTERPRISE"
                  className="text-white hover:bg-gray-700"
                >
                  Enterprise
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label
              htmlFor="admin_email"
              className="text-sm font-semibold text-gray-200 mb-2 block"
            >
              Administrator Email
            </Label>
            <Input
              id="admin_email"
              type="email"
              value={formData.administrator_email}
              onChange={(e) =>
                updateFormData("administrator_email", e.target.value)
              }
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <Label
              htmlFor="verification"
              className="text-sm font-semibold text-gray-200 mb-2 block"
            >
              Verification
            </Label>
            <Select
              value={formData.verification}
              onValueChange={(value) => updateFormData("verification", value)}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem
                  value="default"
                  className="text-white hover:bg-gray-700"
                >
                  Default
                </SelectItem>
                <SelectItem
                  value="dns"
                  className="text-white hover:bg-gray-700"
                >
                  DNS Verification
                </SelectItem>
                <SelectItem
                  value="file"
                  className="text-white hover:bg-gray-700"
                >
                  File Verification
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600/50 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Domain Aliases
            </h3>
            <p className="text-sm text-gray-400">
              Enter aliases for this domain. Messages sent to all these
              addresses will be delivered to this domain's mailboxes.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-200 rounded-lg px-4 py-2 font-medium"
            onClick={() => {
              const newAlias = prompt("Enter domain alias:");
              if (newAlias && newAlias.trim()) {
                // Add alias logic here
                console.log("Adding alias:", newAlias);
              }
            }}
          >
            Add Alias
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-600/50 pt-8">
        <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl p-6 border border-gray-600/30">
          <h3 className="text-xl font-bold text-white mb-3">Quotas</h3>
          <p className="text-sm text-gray-300">
            Click Domain Limits to limit domain size, number of messages sent,
            or maximum size of messages on the domain level.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPermissionsSection = () => (
    <div className="space-y-8">
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Access Control
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-200 font-medium">
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-gray-400">
                  Require 2FA for all users
                </p>
              </div>
              <Switch
                checked={formData.two_factor_auth}
                onCheckedChange={(checked) =>
                  updateFormData("two_factor_auth", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-200 font-medium">
                  Instant Messaging
                </Label>
                <p className="text-sm text-gray-400">Enable chat features</p>
              </div>
              <Switch
                checked={formData.instant_messaging}
                onCheckedChange={(checked) =>
                  updateFormData("instant_messaging", checked)
                }
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderLimitsSection = () => (
    <div className="space-y-8">
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Domain Limits
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-200 font-medium">Disk Quota</Label>
                <p className="text-sm text-gray-400">Enable storage limits</p>
              </div>
              <Switch
                checked={formData.disk_quota_enabled}
                onCheckedChange={(checked) =>
                  updateFormData("disk_quota_enabled", checked)
                }
              />
            </div>

            {formData.disk_quota_enabled && (
              <div className="flex items-center space-x-2">
                <Input
                  value={formData.disk_quota}
                  onChange={(e) => updateFormData("disk_quota", e.target.value)}
                  placeholder="0"
                  className="bg-gray-700/50 border-gray-600/50 text-white w-20"
                />
                <Select
                  value={formData.disk_quota_unit}
                  onValueChange={(value) =>
                    updateFormData("disk_quota_unit", value)
                  }
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem
                      value="kB"
                      className="text-white hover:bg-gray-700"
                    >
                      kB
                    </SelectItem>
                    <SelectItem
                      value="MB"
                      className="text-white hover:bg-gray-700"
                    >
                      MB
                    </SelectItem>
                    <SelectItem
                      value="GB"
                      className="text-white hover:bg-gray-700"
                    >
                      GB
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFeaturesSection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-600/30 backdrop-blur-sm shadow-xl p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Security Features</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <span className="text-gray-200 font-medium">SSL Certificate</span>
              <div className="flex items-center gap-2">
                {domain.has_certificate ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    domain.has_certificate
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {domain.has_certificate ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <span className="text-gray-200 font-medium">DKIM Setup</span>
              <div className="flex items-center gap-2">
                {domain.dkim_setup ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    domain.dkim_setup
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {domain.dkim_setup ? "Configured" : "Not Configured"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                onClick={() => {
                  // Generate SSL certificate logic
                  console.log("Generate SSL certificate");
                }}
              >
                Generate SSL
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white border-green-500"
                onClick={() => {
                  // Generate DKIM keys logic
                  console.log("Generate DKIM keys");
                }}
              >
                Generate DKIM
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-600/30 backdrop-blur-sm shadow-xl p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">User Management</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <span className="text-gray-200 font-medium">Total Accounts</span>
              <span className="text-white font-bold text-lg bg-blue-500/20 px-3 py-1 rounded-full">
                {domain.account_count}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <span className="text-gray-200 font-medium">
                Groups with Public Folder
              </span>
              <span className="text-white font-bold bg-purple-500/20 px-3 py-1 rounded-full">
                {domain.groups_with_public_folder}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <span className="text-gray-200 font-medium">
                Groups with Team Chat
              </span>
              <span className="text-white font-bold bg-green-500/20 px-3 py-1 rounded-full">
                {domain.groups_with_teamchat}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Webmail", enabled: true },
              { name: "Calendar", enabled: true },
              { name: "Contacts", enabled: true },
              { name: "Tasks", enabled: true },
              { name: "Notes", enabled: true },
              { name: "Mobile Sync", enabled: true },
            ].map((feature) => (
              <div
                key={feature.name}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <span className="text-gray-200">{feature.name}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDevicesSection = () => (
    <div className="space-y-8">
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Mobile Devices
          </h3>
          <p className="text-gray-400">
            Manage connected mobile devices and their permissions.
          </p>
        </div>
      </Card>
    </div>
  );

  const renderStatisticsSection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30 backdrop-blur-sm shadow-xl p-6 rounded-2xl hover:shadow-blue-500/25 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Accounts</h3>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {domain.account_count}
          </p>
          <p className="text-sm text-blue-300 font-medium">Total users</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/20 border-green-500/30 backdrop-blur-sm shadow-xl p-6 rounded-2xl hover:shadow-green-500/25 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Domain Type</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {domain.domain_type}
          </p>
          <p className="text-sm text-green-300 font-medium">Current plan</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/30 backdrop-blur-sm shadow-xl p-6 rounded-2xl hover:shadow-purple-500/25 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Security</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {domain.has_certificate && domain.dkim_setup ? "Secure" : "Basic"}
          </p>
          <p className="text-sm text-purple-300 font-medium">Security level</p>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case "general":
        return renderGeneralSection();
      case "permissions":
        return renderPermissionsSection();
      case "limits":
        return renderLimitsSection();
      case "features":
        return renderFeaturesSection();
      case "devices":
        return renderDevicesSection();
      case "statistics":
        return renderStatisticsSection();
      default:
        return renderGeneralSection();
    }
  };

  return (
    <MultiTabLayout
      title={domain.name}
      subtitle="Domain Configuration"
      icon={<Globe className="h-6 w-6 text-white" />}
      tabs={tabs}
      defaultTab="general"
      onClose={onClose}
      onSave={handleSave}
      saveButtonText="Save Configuration"
      saveButtonDisabled={updateDomainConfiguration.isPending}
    >
      {renderTabContent}
    </MultiTabLayout>
  );
}
