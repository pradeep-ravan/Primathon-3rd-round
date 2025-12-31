'use client';

import {
  MobileDevice,
  ProfileCardSection,
  ProfileEmailSection,
  ProfileInfoSection,
  ProfileLimitsSection,
  ProfileMobileSection,
  ProfileRulesSection,
} from '@/components/profile/sections';
import { MultiTabLayout, Tab } from '@/components/ui/layout/MultiTabLayout';
import { useAuth } from '@/context/AuthContext';
import { Clock, Mail, Settings, Shield, Smartphone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePageRefactored() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    // Info section
    firstName: '',
    lastName: '',
    username: '',
    description: '',
    aliases: [] as string[],
    domain: '',
    accountType: 'System Administrator',
    accountState: 'Enabled',

    // Email section
    forwardTo: '',
    alternateEmail: 'jan.sanek2@icewarp.com',
    doNotForwardSpam: false,
    copyIncomingMail: '',
    copyOutgoingMail: '',
    autoRespondEnabled: false,
    respondStartDate: '',
    respondEndDate: '',
    respondAfterDays: '',
    spamReportsMode: 'default',
    spamFolderMode: 'default',

    // Limits section
    accountDiskQuota: false,
    diskQuotaValue: '0',
    diskQuotaUnit: 'kB',
    dailySendOutLimits: false,
    deleteMailOlderThan: false,
    deleteSpamOlderThan: false,
    userCanSendToLocalDomainsOnly: false,
    disableAccessToPop3: false,
    expirationStatus: 'enabled',
    expiresIfInactiveFor: '0',
    expiresOn: false,
    notifyBeforeExpiration: false,
    deleteAccountWhenExpired: false,

    // Card section
    phone: '',
    website: '',
    street: '',
    city: '',
    zip: '',
    state: '',
    country: '',
    notes: '',

    // Rules section
    autoReplyEnabled: false,
    vacationMessage: '',
    forwardToManager: false,
    blockExternalEmails: false,
    requireApproval: false,
    customRules: [] as string[],
  });

  const [mobileDevices, setMobileDevices] = useState<MobileDevice[]>([
    {
      id: '1',
      name: 'iPhone 14 Pro',
      type: 'phone',
      lastSeen: '2 hours ago',
      status: 'active',
      location: 'New York, NY',
    },
    {
      id: '2',
      name: 'iPad Pro',
      type: 'tablet',
      lastSeen: '1 day ago',
      status: 'inactive',
      location: 'San Francisco, CA',
    },
  ]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  // Initialize profile data when user is available
  useEffect(() => {
    if (user?.displayName) {
      const nameParts = user.displayName.split(' ');
      setProfileData((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
      }));
    }
    // Extract domain from user email if available
    if (user?.email) {
      const emailParts = user.email.split('@');
      if (emailParts.length > 1) {
        setProfileData((prev) => ({
          ...prev,
          username: emailParts[0] || '',
          domain: emailParts[1] || '',
        }));
      }
    }
  }, [user?.displayName, user?.email]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    // Here you would typically save to your API
  };

  // Logout functionality can be added here if needed

  const handleManageDevice = (deviceId: string) => {
    console.log('Managing device:', deviceId);
  };

  const handleBlockDevice = (deviceId: string) => {
    setMobileDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? { ...device, status: 'blocked' as const }
          : device
      )
    );
  };

  const handleUnblockDevice = (deviceId: string) => {
    setMobileDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? { ...device, status: 'active' as const }
          : device
      )
    );
  };

  const handleAddRule = () => {
    setProfileData((prev) => ({
      ...prev,
      customRules: [...prev.customRules, `Rule ${prev.customRules.length + 1}`],
    }));
  };

  const handleRemoveRule = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      customRules: prev.customRules.filter((_, i) => i !== index),
    }));
  };

  const tabs: Tab[] = [
    { id: 'info', label: 'Info', icon: User },
    { id: 'card', label: 'Card', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'limits', label: 'Limits', icon: Clock },
    { id: 'rules', label: 'Rules', icon: Shield },
    { id: 'mobile', label: 'Mobile Devices', icon: Smartphone },
  ];

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted-foreground border-t-foreground mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case 'info':
        return (
          <ProfileInfoSection
            profileData={{
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              username: profileData.username,
              description: profileData.description,
              aliases: profileData.aliases,
              domain: profileData.domain,
              accountType: profileData.accountType,
              accountState: profileData.accountState,
            }}
            onInputChange={handleInputChange}
          />
        );

      case 'card':
        return (
          <ProfileCardSection
            profileData={{
              phone: profileData.phone,
              website: profileData.website,
              street: profileData.street,
              city: profileData.city,
              zip: profileData.zip,
              state: profileData.state,
              country: profileData.country,
              notes: profileData.notes,
            }}
            onInputChange={handleInputChange}
          />
        );

      case 'email':
        return (
          <ProfileEmailSection
            profileData={{
              forwardTo: profileData.forwardTo,
              alternateEmail: profileData.alternateEmail,
              doNotForwardSpam: profileData.doNotForwardSpam,
              copyIncomingMail: profileData.copyIncomingMail,
              copyOutgoingMail: profileData.copyOutgoingMail,
              autoRespondEnabled: profileData.autoRespondEnabled,
              respondStartDate: profileData.respondStartDate,
              respondEndDate: profileData.respondEndDate,
              respondAfterDays: profileData.respondAfterDays,
              spamReportsMode: profileData.spamReportsMode,
              spamFolderMode: profileData.spamFolderMode,
            }}
            onInputChange={handleInputChange}
          />
        );

      case 'limits':
        return (
          <ProfileLimitsSection
            profileData={{
              accountDiskQuota: profileData.accountDiskQuota,
              diskQuotaValue: profileData.diskQuotaValue,
              diskQuotaUnit: profileData.diskQuotaUnit,
              dailySendOutLimits: profileData.dailySendOutLimits,
              deleteMailOlderThan: profileData.deleteMailOlderThan,
              deleteSpamOlderThan: profileData.deleteSpamOlderThan,
              userCanSendToLocalDomainsOnly:
                profileData.userCanSendToLocalDomainsOnly,
              disableAccessToPop3: profileData.disableAccessToPop3,
              expirationStatus: profileData.expirationStatus,
              expiresIfInactiveFor: profileData.expiresIfInactiveFor,
              expiresOn: profileData.expiresOn,
              notifyBeforeExpiration: profileData.notifyBeforeExpiration,
              deleteAccountWhenExpired: profileData.deleteAccountWhenExpired,
            }}
            onInputChange={handleInputChange}
          />
        );

      case 'rules':
        return (
          <ProfileRulesSection
            profileData={{
              autoReplyEnabled: profileData.autoReplyEnabled,
              vacationMessage: profileData.vacationMessage,
              forwardToManager: profileData.forwardToManager,
              blockExternalEmails: profileData.blockExternalEmails,
              requireApproval: profileData.requireApproval,
              customRules: profileData.customRules,
            }}
            onInputChange={handleInputChange}
            onAddRule={handleAddRule}
            onRemoveRule={handleRemoveRule}
          />
        );

      case 'mobile':
        return (
          <ProfileMobileSection
            devices={mobileDevices}
            onManageDevice={handleManageDevice}
            onBlockDevice={handleBlockDevice}
            onUnblockDevice={handleUnblockDevice}
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Content for {activeTab} section coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <MultiTabLayout
        title={user?.displayName || 'User Profile'}
        subtitle="Manage your account settings and preferences"
        icon={<User className="h-6 w-6" />}
        tabs={tabs}
        defaultTab="info"
        onSave={handleSave}
        saveButtonText="Save Changes"
      >
        {renderTabContent}
      </MultiTabLayout>
    </>
  );
}
