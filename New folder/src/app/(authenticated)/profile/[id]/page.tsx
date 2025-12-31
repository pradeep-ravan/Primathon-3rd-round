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
import { useAccountDetails, useUpdateAccount } from '@/hooks/useUsers';
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
  
  // Update account mutation
  const updateAccountMutation = useUpdateAccount();
  
  // Track if data has been loaded and mapped
  const [isDataMapped, setIsDataMapped] = useState(false);
  
  // Store original data to compare changes
  const [originalProfileData, setOriginalProfileData] = useState<any>(null);

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
    firstName: '',
    lastName: '',
    birthday: '',
    gender: 'Unknown',
    anniversary: '',
    company: '',
    department: '',
    job: '',
    manager: '',
    assistant: '',
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

      const newProfileData = {
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
        firstName: accountDetails.card?.first_name || accountDetails.name || '',
        lastName: accountDetails.card?.last_name || accountDetails.surname || '',
        birthday: accountDetails.card?.birthday || '',
        gender: accountDetails.card?.gender === 1 ? 'Male' : accountDetails.card?.gender === 2 ? 'Female' : 'Unknown',
        anniversary: accountDetails.card?.anniversary || '',
        company: accountDetails.card?.company_name || '',
        department: accountDetails.card?.department || '',
        job: accountDetails.card?.job_title || '',
        manager: accountDetails.card?.manager_name || '',
        assistant: accountDetails.card?.assistant_name || '',
        phone: accountDetails.card?.mobile_telephone_number || accountDetails.card?.business_telephone_number || '',
        website: accountDetails.card?.webpage || accountDetails.card?.homepage || '',
        street: accountDetails.card?.business_address_street || accountDetails.card?.home_address_street || '',
        city: accountDetails.card?.business_address_city || accountDetails.card?.home_address_city || '',
        zip: accountDetails.card?.business_address_postal_code || accountDetails.card?.home_address_postal_code || '',
        state: accountDetails.card?.business_address_state || accountDetails.card?.home_address_state || '',
        country: accountDetails.card?.business_address_country || accountDetails.card?.home_address_country || '',
        notes: accountDetails.comment || '',
        
        // Rules section (defaults)
        autoReplyEnabled: false,
        vacationMessage: '',
        forwardToManager: false,
        blockExternalEmails: false,
        requireApproval: false,
        customRules: [] as string[],
      };

      setProfileData((prev) => ({
        ...prev,
        ...newProfileData,
      }));
      
      // Store original data for comparison (only if not already set)
      if (!originalProfileData) {
        setOriginalProfileData({ ...newProfileData });
      }
      
      // Mark data as mapped
      setIsDataMapped(true);
    } else {
      // Reset mapping state when accountDetails is cleared
      // But don't clear originalProfileData as it's needed for comparison
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

  // Helper function to check if two values are different
  const hasChanged = (current: any, original: any): boolean => {
    if (Array.isArray(current) && Array.isArray(original)) {
      return JSON.stringify(current) !== JSON.stringify(original);
    }
    return current !== original;
  };

  const handleSave = async () => {
    if (!domainId || !accountId) {
      toast.error('Domain ID and Account ID are required');
      return;
    }

    // If originalProfileData is not set, we can't detect changes properly
    // In this case, we'll send all non-empty fields (fallback behavior)
    const useChangeDetection = !!originalProfileData;
    const baseline = originalProfileData || {};
    
    if (!profileData) {
      toast.error('Profile data not loaded. Please wait and try again.');
      return;
    }

    try {
      // Map profile data to API format - only include changed fields
      const updateData: any = {};

      // Info section - only include if changed
      if (useChangeDetection) {
        if (hasChanged(profileData.firstName, baseline.firstName) ||
            hasChanged(profileData.lastName, baseline.lastName)) {
          updateData.name = profileData.firstName || '';
          updateData.surname = profileData.lastName || '';
        }
      }
      
      // Description/Comment - only send if changed and not empty
      // API only accepts 'comment', not 'description'
      if (useChangeDetection && hasChanged(profileData.description, baseline.description)) {
        // Only send if it's not empty (or if it was changed from non-empty to empty)
        if (profileData.description !== undefined && profileData.description !== '') {
          updateData.comment = profileData.description;
        } else if (baseline.description && baseline.description !== '') {
          // User cleared the description, send empty string
          updateData.comment = '';
        }
      } else if (!useChangeDetection && profileData.description && profileData.description !== '') {
        // Fallback: if change detection not available, send if not empty
        updateData.comment = profileData.description;
      }
      
      // Aliases - only include if changed
      if (useChangeDetection && hasChanged(profileData.aliases, baseline.aliases)) {
        updateData.alias_list = profileData.aliases;
      }
      
      // Account state - only include if changed
      if (useChangeDetection && hasChanged(profileData.accountState, baseline.accountState)) {
        // Map account state to API format
        let accountState = 'NONE';
        if (profileData.accountState === 'Enabled') {
          accountState = 'NONE';
        } else if (profileData.accountState === 'Disabled (login)') {
          accountState = 'DISABLED';
        } else if (profileData.accountState === 'Disable (login, receive)') {
          accountState = 'DISABLED_RECEIVE';
        } else if (profileData.accountState === 'Spam trap') {
          accountState = 'SPAM_TRAP';
        }
        updateData.account_state = accountState;
      }
      
      // Account type - only include if changed
      if (useChangeDetection && hasChanged(profileData.accountType, baseline.accountType)) {
        // Map account type to admin_type
        let adminType = 'USER';
        if (profileData.accountType === 'System Administrator') {
          adminType = 'SYSTEM_ADMIN';
        } else if (profileData.accountType === 'Domain Administrator') {
          adminType = 'DOMAIN_ADMIN';
        } else if (profileData.accountType === 'Web Administrator') {
          adminType = 'WEB_ADMIN';
        } else {
          adminType = 'USER';
        }
        updateData.admin_type = adminType;
      }

      // Card section - only include changed fields
      if (useChangeDetection) {
        const cardChanges: any = {};
        if (hasChanged(profileData.firstName, baseline.firstName)) {
          cardChanges.first_name = profileData.firstName;
        }
        if (hasChanged(profileData.lastName, baseline.lastName)) {
          cardChanges.last_name = profileData.lastName;
        }
        if (hasChanged(profileData.birthday, baseline.birthday)) {
          cardChanges.birthday = profileData.birthday;
        }
        if (hasChanged(profileData.gender, baseline.gender)) {
          // Map gender to API format: 0=Unknown, 1=Male, 2=Female
          let genderValue = 0;
          if (profileData.gender === 'Male') genderValue = 1;
          else if (profileData.gender === 'Female') genderValue = 2;
          cardChanges.gender = genderValue;
        }
        if (hasChanged(profileData.anniversary, baseline.anniversary)) {
          cardChanges.anniversary = profileData.anniversary;
        }
        if (hasChanged(profileData.company, baseline.company)) {
          cardChanges.company_name = profileData.company;
        }
        if (hasChanged(profileData.department, baseline.department)) {
          cardChanges.department = profileData.department;
        }
        if (hasChanged(profileData.job, baseline.job)) {
          cardChanges.job_title = profileData.job;
        }
        if (hasChanged(profileData.manager, baseline.manager)) {
          cardChanges.manager_name = profileData.manager;
        }
        if (hasChanged(profileData.assistant, baseline.assistant)) {
          cardChanges.assistant_name = profileData.assistant;
        }
        if (hasChanged(profileData.phone, baseline.phone)) {
          cardChanges.mobile_telephone_number = profileData.phone;
        }
        if (hasChanged(profileData.website, baseline.website)) {
          cardChanges.webpage = profileData.website;
          cardChanges.homepage = profileData.website;
        }
        if (hasChanged(profileData.street, baseline.street)) {
          cardChanges.business_address_street = profileData.street;
        }
        if (hasChanged(profileData.city, baseline.city)) {
          cardChanges.business_address_city = profileData.city;
        }
        if (hasChanged(profileData.zip, baseline.zip)) {
          cardChanges.business_address_postal_code = profileData.zip;
        }
        if (hasChanged(profileData.state, baseline.state)) {
          cardChanges.business_address_state = profileData.state;
        }
        if (hasChanged(profileData.country, baseline.country)) {
          cardChanges.business_address_country = profileData.country;
        }
        if (hasChanged(profileData.notes, baseline.notes)) {
          // Notes are stored in comment field
          if (!updateData.comment) {
            updateData.comment = profileData.notes;
          }
        }
        if (Object.keys(cardChanges).length > 0) {
          updateData.card = cardChanges;
        }
      }

      // Email section - only include changed fields
      if (useChangeDetection) {
        const emailSettingsChanges: any = {};
        let hasEmailChanges = false;
        
        if (hasChanged(profileData.forwardTo, baseline.forwardTo)) {
          emailSettingsChanges.forward_to = profileData.forwardTo;
          hasEmailChanges = true;
        }
        if (hasChanged(profileData.alternateEmail, baseline.alternateEmail)) {
          emailSettingsChanges.alternate_email = profileData.alternateEmail;
          hasEmailChanges = true;
        }
        if (hasChanged(profileData.doNotForwardSpam, baseline.doNotForwardSpam)) {
          emailSettingsChanges.do_not_forward_spam = profileData.doNotForwardSpam;
          hasEmailChanges = true;
        }
        if (hasChanged(profileData.copyIncomingMail, baseline.copyIncomingMail)) {
          emailSettingsChanges.mail_in = profileData.copyIncomingMail;
          hasEmailChanges = true;
        }
        if (hasChanged(profileData.copyOutgoingMail, baseline.copyOutgoingMail)) {
          emailSettingsChanges.mail_out = profileData.copyOutgoingMail;
          hasEmailChanges = true;
        }
        
        // Check if responder settings changed
        const responderChanged = 
          hasChanged(profileData.autoRespondEnabled, baseline.autoRespondEnabled) ||
          hasChanged(profileData.respondStartDate, baseline.respondStartDate) ||
          hasChanged(profileData.respondEndDate, baseline.respondEndDate) ||
          hasChanged(profileData.respondAfterDays, baseline.respondAfterDays);
        
        if (responderChanged) {
          emailSettingsChanges.responder = {
            responder_type: profileData.autoRespondEnabled ? 'ENABLED' : 'DISABLED',
            respond_period: profileData.respondAfterDays ? parseInt(profileData.respondAfterDays) || 0 : 0,
            respond_between_from: profileData.respondStartDate || '',
            respond_between_to: profileData.respondEndDate || '',
            respond_only_if_to_me: false,
          };
          hasEmailChanges = true;
        }
        
        if (hasChanged(profileData.spamReportsMode, baseline.spamReportsMode) && 
            profileData.spamReportsMode !== 'default') {
          emailSettingsChanges.spam_reports_mode = profileData.spamReportsMode.toUpperCase();
          hasEmailChanges = true;
        }
        if (hasChanged(profileData.spamFolderMode, baseline.spamFolderMode) && 
            profileData.spamFolderMode !== 'default') {
          emailSettingsChanges.spam_folder = profileData.spamFolderMode.toUpperCase();
          hasEmailChanges = true;
        }
        
        if (hasEmailChanges) {
          updateData.email_settings = emailSettingsChanges;
        }
      }

      // Limits section - only include changed fields
      if (useChangeDetection) {
        const quotaChanges: any = {};
        const limitsChanges: any = {};
        let hasQuotaChanges = false;
        let hasLimitsChanges = false;
        
        if (hasChanged(profileData.accountDiskQuota, baseline.accountDiskQuota) ||
            hasChanged(profileData.diskQuotaValue, baseline.diskQuotaValue)) {
          if (profileData.accountDiskQuota && profileData.diskQuotaValue) {
            quotaChanges.mailbox_quota = parseInt(profileData.diskQuotaValue) || 0;
          } else {
            quotaChanges.mailbox_quota = 0;
          }
          hasQuotaChanges = true;
        }
        
        if (hasChanged(profileData.deleteMailOlderThan, baseline.deleteMailOlderThan)) {
          limitsChanges.delete_older = profileData.deleteMailOlderThan;
          hasLimitsChanges = true;
        }
        if (hasChanged(profileData.deleteSpamOlderThan, baseline.deleteSpamOlderThan)) {
          limitsChanges.spam_delete_older = profileData.deleteSpamOlderThan;
          hasLimitsChanges = true;
        }
        if (hasChanged(profileData.userCanSendToLocalDomainsOnly, baseline.userCanSendToLocalDomainsOnly)) {
          limitsChanges.local_domain = profileData.userCanSendToLocalDomainsOnly;
          hasLimitsChanges = true;
        }
        if (hasChanged(profileData.expirationStatus, baseline.expirationStatus)) {
          limitsChanges.account_valid = profileData.expirationStatus === 'enabled';
          hasLimitsChanges = true;
        }
        if (hasChanged(profileData.expiresIfInactiveFor, baseline.expiresIfInactiveFor)) {
          limitsChanges.inactive_for = parseInt(profileData.expiresIfInactiveFor) || 0;
          hasLimitsChanges = true;
        }
        if (hasChanged(profileData.notifyBeforeExpiration, baseline.notifyBeforeExpiration)) {
          limitsChanges.validity_report = profileData.notifyBeforeExpiration;
          hasLimitsChanges = true;
        }
        if (hasChanged(profileData.deleteAccountWhenExpired, baseline.deleteAccountWhenExpired)) {
          limitsChanges.delete_expire = profileData.deleteAccountWhenExpired;
          hasLimitsChanges = true;
        }
        
        if (hasQuotaChanges) {
          updateData.quota = quotaChanges;
        }
        if (hasLimitsChanges) {
          updateData.limits = limitsChanges;
        }
      }

      // Clean up empty nested objects
      if (updateData.card && Object.keys(updateData.card).length === 0) {
        delete updateData.card;
      }
      if (updateData.email_settings && Object.keys(updateData.email_settings).length === 0) {
        delete updateData.email_settings;
      }
      if (updateData.quota && Object.keys(updateData.quota).length === 0) {
        delete updateData.quota;
      }
      if (updateData.limits && Object.keys(updateData.limits).length === 0) {
        delete updateData.limits;
      }

    
      // Only send update if there's data to update
      if (Object.keys(updateData).length === 0) {
        toast('No changes to save', {
          duration: 3000,
          icon: 'ℹ️',
        });
        return;
      }
      
      const result = await updateAccountMutation.mutateAsync({
        domainId,
        accountId,
        data: updateData,
      });
      // Update original data to reflect the saved state
      setOriginalProfileData({ ...profileData });
      
      toast.success('Profile saved successfully', {
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      const errorMessage =
        error?.message || 'Failed to save profile. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
      });
    }
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
            domainId={domainId}
            accountId={accountId}
          />
        );

      case 'card':
        return (
          <ProfileCardSection
            profileData={{
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              birthday: profileData.birthday,
              gender: profileData.gender,
              anniversary: profileData.anniversary,
              company: profileData.company,
              department: profileData.department,
              job: profileData.job,
              manager: profileData.manager,
              assistant: profileData.assistant,
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
        onClose={() => router.back()}
        onSave={handleSave}
        saveButtonText="Save Changes"
        saveButtonDisabled={updateAccountMutation.isPending}
      >
        {renderTabContent}
      </MultiTabLayout>
    </>
  );
}


