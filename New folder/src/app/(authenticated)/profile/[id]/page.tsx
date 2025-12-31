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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { useAccountDetails } from '@/hooks/useUsers';
import { useDomains } from '@/hooks/useDomains';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Unwrap params Promise for Next.js 15+
  const { id } = use(params);
  const decodedUserId = decodeURIComponent(id);
  
  // Get domain and accountId from query params
  const domainName = searchParams.get('domain') || '';
  const accountId = searchParams.get('accountId') || '';
  
  // Fetch all domains to find domain ID
  const { data: domainsData, isLoading: isLoadingDomains } = useDomains({
    page: 0,
    limit: 250,
    search_query: '',
    sort: 'name:asc',
  });
  
  // Find domain ID from domain name
  const domainId = domainsData?.items?.find(d => d.name === domainName)?.id;
  
  // Fetch account details
  const { data: accountDetails, isLoading: isLoadingDetails, error } = useAccountDetails(domainId, accountId);
  
  // Track if data has been loaded and mapped
  const [isDataMapped, setIsDataMapped] = useState(false);

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
    alternateEmail: '',
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

  // Map API response to profile data
  useEffect(() => {
    if (accountDetails) {
      // Extract domain from email (use email field which contains full email)
      const emailDomain = accountDetails.email?.split('@')[1] || '';
      
      // Map account type based on admin_type and account_type
      let accountType = 'User';
      if (accountDetails.admin_type === 'SYSTEM_ADMIN') {
        accountType = 'System Administrator';
      } else if (accountDetails.admin_type === 'ADMIN' || accountDetails.admin_type === 'DOMAIN_ADMIN') {
        accountType = 'Domain Administrator';
      } else if (accountDetails.admin_type === 'WEB_ADMIN') {
        accountType = 'Web Administrator';
      } else if (accountDetails.account_type === 'ACCOUNT' || accountDetails.account_type === 'MAILING_LIST') {
        accountType = 'User';
      }
      
      // Map account state - API returns values like "NONE", "DISABLED", etc.
      let accountState = 'Enabled';
      const state = accountDetails.account_state?.toUpperCase() || '';
      if (state === 'NONE' || state === 'ENABLED' || state === '') {
        accountState = 'Enabled';
      } else if (state === 'DISABLED') {
        accountState = 'Disabled (login)';
      } else if (state === 'DISABLED_RECEIVE' || state === 'DISABLED_RECEIVE') {
        accountState = 'Disable (login, receive)';
      } else if (state === 'SPAM_TRAP' || state === 'SPAMTRAP') {
        accountState = 'Spam trap';
      } else {
        // Fallback: try to match partial strings
        if (state.includes('DISABLED') && state.includes('RECEIVE')) {
          accountState = 'Disable (login, receive)';
        } else if (state.includes('DISABLED')) {
          accountState = 'Disabled (login)';
        } else if (state.includes('SPAM')) {
          accountState = 'Spam trap';
        } else {
          accountState = 'Enabled';
        }
      }

      setProfileData((prev) => ({
        ...prev,
        // Info section
        firstName: accountDetails.name || accountDetails.card?.first_name || '',
        lastName: accountDetails.surname || accountDetails.card?.last_name || '',
        username: accountDetails.mailbox || accountDetails.display_email || '',
        description: accountDetails.description || accountDetails.comment || '',
        aliases: accountDetails.alias_list || [],
        domain: emailDomain,
        accountType: accountType,
        accountState: accountState,
        
        // Email section
        forwardTo: accountDetails.email_settings?.forward_to || '',
        alternateEmail: accountDetails.email_settings?.alternate_email || '',
        doNotForwardSpam: accountDetails.email_settings?.do_not_forward_spam || false,
        copyIncomingMail: accountDetails.email_settings?.mail_in || '',
        copyOutgoingMail: accountDetails.email_settings?.mail_out || '',
        autoRespondEnabled: accountDetails.email_settings?.responder?.responder_type !== 'DISABLED' && 
          accountDetails.email_settings?.responder?.responder_type !== 0 && 
          accountDetails.email_settings?.responder?.responder_type !== '0',
        respondStartDate: accountDetails.email_settings?.responder?.respond_between_from || '',
        respondEndDate: accountDetails.email_settings?.responder?.respond_between_to || '',
        respondAfterDays: accountDetails.email_settings?.responder?.respond_period?.toString() || '',
        spamReportsMode: accountDetails.email_settings?.spam_reports_mode?.toLowerCase() || 'default',
        spamFolderMode: accountDetails.email_settings?.spam_folder?.toLowerCase() || 'default',
        
        // Limits section
        accountDiskQuota: accountDetails.quota?.mailbox_quota ? accountDetails.quota.mailbox_quota > 0 : false,
        diskQuotaValue: accountDetails.quota?.mailbox_quota?.toString() || '0',
        diskQuotaUnit: 'kB',
        dailySendOutLimits: accountDetails.limits?.number_send_limit ? accountDetails.limits.number_send_limit > 0 : false,
        deleteMailOlderThan: accountDetails.limits?.delete_older || false,
        deleteSpamOlderThan: accountDetails.limits?.spam_delete_older || false,
        userCanSendToLocalDomainsOnly: accountDetails.limits?.local_domain || false,
        disableAccessToPop3: false, // Not in API response
        expirationStatus: accountDetails.limits?.account_valid ? 'enabled' : 'disabled',
        expiresIfInactiveFor: accountDetails.limits?.inactive_for?.toString() || '0',
        expiresOn: accountDetails.limits?.account_valid_till_date ? true : false,
        notifyBeforeExpiration: accountDetails.limits?.validity_report || false,
        deleteAccountWhenExpired: accountDetails.limits?.delete_expire || false,
        
        // Card section
        phone: accountDetails.card?.mobile_telephone_number || accountDetails.card?.business_telephone_number || '',
        website: accountDetails.card?.webpage || accountDetails.card?.homepage || '',
        street: accountDetails.card?.business_address_street || accountDetails.card?.home_address_street || '',
        city: accountDetails.card?.business_address_city || accountDetails.card?.home_address_city || '',
        zip: accountDetails.card?.business_address_postal_code || accountDetails.card?.home_address_postal_code || '',
        state: accountDetails.card?.business_address_state || accountDetails.card?.home_address_state || '',
        country: accountDetails.card?.business_address_country || accountDetails.card?.home_address_country || '',
        notes: accountDetails.comment || '',
      }));
      
      // Mark data as mapped
      setIsDataMapped(true);
    } else {
      // Reset mapping state when accountDetails is cleared
      setIsDataMapped(false);
    }
  }, [accountDetails]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    // TODO: Implement API call to update account details
    toast.success('Profile saved successfully');
  };

  const handleManageDevice = (deviceId: string) => {
    console.log('Managing device:', deviceId);
  };

  const handleBlockDevice = (deviceId: string) => {
    // TODO: Implement device blocking
  };

  const handleUnblockDevice = (deviceId: string) => {
    // TODO: Implement device unblocking
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

  // Show loading state while:
  // 1. Auth is loading
  // 2. Domains are loading (needed to find domainId)
  // 3. Account details are loading
  // 4. Data hasn't been mapped yet
  const isLoading = loading || 
    isLoadingDomains || 
    isLoadingDetails || 
    !isDataMapped || 
    !accountDetails ||
    (domainName && !domainId); // Wait for domainId if domainName is provided

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground text-lg">Loading profile...</p>
          <p className="text-muted-foreground text-sm mt-2">Please wait while we fetch your account details</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">Failed to load profile</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayName = accountDetails?.name 
    ? `${accountDetails.name}${accountDetails.surname ? ' ' + accountDetails.surname : ''}`.trim()
    : decodedUserId;

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
            devices={[]}
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
        title={displayName}
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


