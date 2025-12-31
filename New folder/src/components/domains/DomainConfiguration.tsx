'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Import feature images
import filesModernImage from '@/assets/modern_features_files_documents.jpg';
import filesLegacyImage from '@/assets/features_files_documents_legacy.jpg';
import notesModernImage from '@/assets/features_notes_modern.jpg';
import notesLegacyImage from '@/assets/features_notes_legacy.jpg';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Globe,
  Shield,
  Settings,
  Users,
  Smartphone,
  FileText,
  List,
  BarChart3,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  LayoutDashboard,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Domain, DomainConfigurationRequest, UpdateDomainRequest, DomainFeatures } from '@/types/domain';
import { useUpdateDomainConfiguration, usePatchDomain, useDomainAccountsStats, useDomainLimits, useUpdateDomainLimits, useDomainFeatures, useUpdateDomainFeatures } from '@/hooks/useDomains';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { SideTabsLayout } from '@/components/ui/layout/SideTabsLayout';
import { TabContent } from '@/components/ui/layout/TabContent';
import { DKIMWizard } from './DKIMWizard';
import { DNSValidationModal } from './DNSValidationModal';
import { FeaturesModal } from './FeaturesModal';
import toast from 'react-hot-toast';

interface DomainConfigurationProps {
  domain: Domain;
  onClose: () => void;
  onSave?: (updatedDomain: Domain) => void;
}

type TabType =
  | 'dashboard'
  | 'general'
  | 'permissions'
  | 'limits'
  | 'features'
  | 'devices'
  | 'statistics';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'general', label: 'General', icon: Settings },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'limits', label: 'Limits', icon: BarChart3 },
  { id: 'features', label: 'Features', icon: List },
  { id: 'devices', label: 'Devices', icon: Smartphone },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
];

export function DomainConfiguration({
  domain,
  onClose,
  onSave,
}: DomainConfigurationProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const updateDomainConfiguration = useUpdateDomainConfiguration();
  const patchDomain = usePatchDomain();
  const updateDomainLimits = useUpdateDomainLimits();
  const updateDomainFeatures = useUpdateDomainFeatures();
  const [isSaving, setIsSaving] = useState(false);
  const [isDKIMWizardOpen, setIsDKIMWizardOpen] = useState(false);
  const [isDNSValidationOpen, setIsDNSValidationOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const {
    data: accountStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: statsRefetch,
  } = useDomainAccountsStats(domain.id);
  
  // Fetch domain limits when Limits tab is active
  const {
    data: limitsData,
    isLoading: limitsLoading,
    error: limitsError,
    refetch: refetchLimits,
  } = useDomainLimits(domain.id, activeTab === 'limits');
  
  // Fetch domain features when Features tab is active
  const {
    data: featuresData,
    isLoading: featuresLoading,
    error: featuresError,
    refetch: refetchFeatures,
  } = useDomainFeatures(domain.id, activeTab === 'features');
  
  // Track original limits data to detect changes
  const [originalLimitsData, setOriginalLimitsData] = useState<any>(null);
  
  // Track original features data to detect changes
  const [originalFeaturesData, setOriginalFeaturesData] = useState<any>(null);
  
  // Track original values to detect changes
  const originalValues = {
    name: domain.name,
    description: domain.description || '',
    domain_type: domain.domain_type,
    administrator_email: domain.administrator_email || '',
    // Convert API value (uppercase with underscores) to lowercase for form comparison
    verify_type: (domain.verify_type || 'DEFAULT').toLowerCase(),
    aliases: (domain.aliases || []).filter(alias => alias.trim() !== ''),
    // Permissions
    // API returns "maximal_saas_plan" but we use "max_subscription_plan" in form
    max_subscription_plan: (domain as any).maximal_saas_plan || (domain as any).max_subscription_plan || 'any',
    unknown_accounts: (domain as any).unknown_accounts || 'reject',
    // API returns "unknown_forward_to" but we use "target_email" in form
    target_email: (domain as any).unknown_forward_to || (domain as any).target_email || '',
    // API returns "two_factor_enabled" but we use "two_factor_auth" in form
    two_factor_auth: (domain as any).two_factor_enabled ?? domain.features?.two_factor_auth ?? false,
    // API returns "im_roster_populated" but we use "instant_messaging" in form
    instant_messaging: (domain as any).im_roster_populated ?? domain.features?.instant_messaging ?? false,
    // Available Features
    contacts: domain.features?.contacts ?? true,
    calendars: domain.features?.calendar ?? true,
    files_documents: domain.features?.files_documents ?? true,
    notes: domain.features?.notes ?? true,
    tasks: domain.features?.tasks ?? true,
    quarantine: domain.features?.quarantine ?? true,
    marketplace: domain.features?.marketplace ?? true,
    // Feature Modes (MODERN/LEGACY)
    files_documents_mode: (domain.features as any)?.files_documents_mode || (domain.features as any)?.files_documents_interface || 'MODERN',
    notes_mode: (domain.features as any)?.notes_mode || (domain.features as any)?.notes_interface || 'MODERN',
  };

  const [formData, setFormData] = useState({
    // General
    name: domain.name,
    description: domain.description || '',
    domain_type: domain.domain_type,
    administrator_email: domain.administrator_email || '',
    // Use verify_type from API (returns "DEFAULT", "ISSUE_RCPT", "ISSUE_VRFY", "MINGER") - convert to lowercase for select
    verification: (domain.verify_type || 'DEFAULT').toLowerCase(),
    password: '',

    // Permissions
    // API returns "maximal_saas_plan" but we use "max_subscription_plan" in form
    max_subscription_plan: (domain as any).maximal_saas_plan || (domain as any).max_subscription_plan || 'any',
    unknown_accounts: (domain as any).unknown_accounts || 'reject',
    // API returns "unknown_forward_to" but we use "target_email" in form
    target_email: (domain as any).unknown_forward_to || (domain as any).target_email || '',
    // API returns "two_factor_enabled" but we use "two_factor_auth" in form
    two_factor_auth: (domain as any).two_factor_enabled ?? domain.features?.two_factor_auth ?? false,
    // API returns "im_roster_populated" but we use "instant_messaging" in form
    instant_messaging: (domain as any).im_roster_populated ?? domain.features?.instant_messaging ?? false,

    // Limits
    domain_admin_limit: '',
    disk_quota_enabled: domain.domain_limits?.disk_quota_enabled || false,
    disk_quota: '',
    disk_quota_unit: 'kB',
    daily_send_limit_enabled: domain.domain_limits?.daily_send_limit_enabled || false,
    daily_send_data_limit: (domain.domain_limits as any)?.daily_send_data_limit?.toString() || (domain.domain_limits as any)?.send_out_data_limit?.toString() || '',
    daily_send_data_limit_unit: (domain.domain_limits as any)?.daily_send_data_limit_unit || (domain.domain_limits as any)?.send_out_data_limit_unit || 'kB',
    daily_send_messages_limit: (domain.domain_limits as any)?.daily_send_messages_limit?.toString() || (domain.domain_limits as any)?.send_out_messages_limit?.toString() || '',
    disable_login: domain.domain_limits?.disable_login || false,
    account_size: '',
    account_size_unit: 'kB',
    max_message_size: '',
    max_message_size_unit: 'kB',
    default_daily_send_limit_enabled: domain.user_limits?.default_daily_send_limit || false,
    default_daily_send_data_limit: (domain.user_limits as any)?.default_daily_send_data_limit?.toString() || (domain.user_limits as any)?.send_out_data_limit?.toString() || '',
    default_daily_send_data_limit_unit: (domain.user_limits as any)?.default_daily_send_data_limit_unit || (domain.user_limits as any)?.send_out_data_limit_unit || 'kB',
    default_daily_send_messages_limit: (domain.user_limits as any)?.default_daily_send_messages_limit?.toString() || (domain.user_limits as any)?.send_out_messages_limit?.toString() || '',
    delete_spam_older_than_enabled: domain.user_limits?.delete_spam_older_than || false,
    delete_spam_older_than_days: (domain.user_limits as any)?.delete_spam_older_than_days?.toString() || (domain.user_limits as any)?.spam_older_than_days?.toString() || '',

    // Expiration
    expires_on: domain.domain_limits?.expires_on ? true : false,
    expires_on_date: domain.domain_limits?.expires_on ? new Date(domain.domain_limits.expires_on).toISOString().split('T')[0] : '',
    notify_before_expiration: domain.domain_limits?.notify_before_expiration || false,
    notify_before_expiration_days: (domain.domain_limits as any)?.notify_before_expiration_days?.toString() || (domain.domain_limits as any)?.notify_days_before_expiration?.toString() || '',
    delete_domain_when_expired: domain.domain_limits?.delete_domain_when_expired || false,

    // Available Features
    contacts: domain.features?.contacts ?? true,
    calendars: domain.features?.calendar ?? true,
    files_documents: domain.features?.files_documents ?? true,
    notes: domain.features?.notes ?? true,
    tasks: domain.features?.tasks ?? true,
    quarantine: domain.features?.quarantine ?? true,
    marketplace: domain.features?.marketplace ?? true,
    // Feature Modes (MODERN/LEGACY)
    files_documents_mode: (domain.features as any)?.files_documents_mode || (domain.features as any)?.files_documents_interface || 'MODERN',
    notes_mode: (domain.features as any)?.notes_mode || (domain.features as any)?.notes_interface || 'MODERN',
    // Statistics
    statistics_range: 'specified_by_date',
    statistics_from_date: new Date().toISOString().split('T')[0],
    statistics_to_date: new Date().toISOString().split('T')[0],
    statistics_filter: '',
    statistics_max_items: '100',
    statistics_group_by_domain: false,
  });

  // Aliases state - array of strings
  // Initialize with existing aliases or empty array (will show empty input if no aliases)
  const [aliases, setAliases] = useState<string[]>(
    domain.aliases && domain.aliases.length > 0 ? domain.aliases : ['']
  );

  // Update form data when domain prop changes (e.g., after refetch)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      // General
      name: domain.name,
      description: domain.description || '',
      domain_type: domain.domain_type,
      administrator_email: domain.administrator_email || '',
      verification: (domain.verify_type || 'DEFAULT').toLowerCase(),
      // Permissions
      max_subscription_plan: (domain as any).maximal_saas_plan || (domain as any).max_subscription_plan || 'any',
      unknown_accounts: (domain as any).unknown_accounts || 'reject',
      target_email: (domain as any).unknown_forward_to || (domain as any).target_email || '',
      two_factor_auth: (domain as any).two_factor_enabled ?? domain.features?.two_factor_auth ?? false,
      instant_messaging: (domain as any).im_roster_populated ?? domain.features?.instant_messaging ?? false,
      // Limits
      disk_quota_enabled: domain.domain_limits?.disk_quota_enabled || false,
      daily_send_limit_enabled: domain.domain_limits?.daily_send_limit_enabled || false,
      daily_send_data_limit: (domain.domain_limits as any)?.daily_send_data_limit?.toString() || (domain.domain_limits as any)?.send_out_data_limit?.toString() || '',
      daily_send_data_limit_unit: (domain.domain_limits as any)?.daily_send_data_limit_unit || (domain.domain_limits as any)?.send_out_data_limit_unit || 'kB',
      daily_send_messages_limit: (domain.domain_limits as any)?.daily_send_messages_limit?.toString() || (domain.domain_limits as any)?.send_out_messages_limit?.toString() || '',
      disable_login: domain.domain_limits?.disable_login || false,
      default_daily_send_limit_enabled: domain.user_limits?.default_daily_send_limit || false,
      default_daily_send_data_limit: (domain.user_limits as any)?.default_daily_send_data_limit?.toString() || (domain.user_limits as any)?.send_out_data_limit?.toString() || '',
      default_daily_send_data_limit_unit: (domain.user_limits as any)?.default_daily_send_data_limit_unit || (domain.user_limits as any)?.send_out_data_limit_unit || 'kB',
      default_daily_send_messages_limit: (domain.user_limits as any)?.default_daily_send_messages_limit?.toString() || (domain.user_limits as any)?.send_out_messages_limit?.toString() || '',
      delete_spam_older_than_enabled: domain.user_limits?.delete_spam_older_than || false,
      delete_spam_older_than_days: (domain.user_limits as any)?.delete_spam_older_than_days?.toString() || (domain.user_limits as any)?.spam_older_than_days?.toString() || '',
      // Expiration
      expires_on: domain.domain_limits?.expires_on ? true : false,
      expires_on_date: domain.domain_limits?.expires_on ? new Date(domain.domain_limits.expires_on).toISOString().split('T')[0] : '',
      notify_before_expiration: domain.domain_limits?.notify_before_expiration || false,
      notify_before_expiration_days: (domain.domain_limits as any)?.notify_before_expiration_days?.toString() || (domain.domain_limits as any)?.notify_days_before_expiration?.toString() || '',
      delete_domain_when_expired: domain.domain_limits?.delete_domain_when_expired || false,
      // Available Features
      contacts: domain.features?.contacts ?? true,
      calendars: domain.features?.calendar ?? true,
      files_documents: domain.features?.files_documents ?? true,
      notes: domain.features?.notes ?? true,
      tasks: domain.features?.tasks ?? true,
      quarantine: domain.features?.quarantine ?? true,
      marketplace: domain.features?.marketplace ?? true,
      files_documents_mode: (domain.features as any)?.files_documents_mode || (domain.features as any)?.files_documents_interface || 'MODERN',
      notes_mode: (domain.features as any)?.notes_mode || (domain.features as any)?.notes_interface || 'MODERN',
    }));
    
    // Update aliases
    setAliases(
      domain.aliases && domain.aliases.length > 0 ? domain.aliases : ['']
    );
  }, [domain]);

  // Update form data when limits are fetched from API
  useEffect(() => {
    if (limitsData && activeTab === 'limits') {
      // API returns flat structure with string values
      // Helper function to convert "1"/"0" strings to boolean
      const toBoolean = (value: string | undefined): boolean => {
        return value === "1" || value === "true";
      };
      
      // Helper function to parse date from "YYYY/MM/DD" format to YYYY-MM-DD
      // Convert API date format to HTML date input format
      // HTML date inputs require dates >= 1900-01-01, so dates before 1900 are treated as empty
      const parseDate = (dateStr: string | undefined): string => {
        if (!dateStr || dateStr === "0" || dateStr.trim() === '') return '';
        
        try {
          // Handle format like "1899/12/30" or "YYYY/MM/DD"
          if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              const year = parts[0].trim();
              const month = parts[1].trim().padStart(2, '0');
              const day = parts[2].trim().padStart(2, '0');
              
              // Validate the date components
              const yearNum = parseInt(year, 10);
              const monthNum = parseInt(month, 10);
              const dayNum = parseInt(day, 10);
              
              if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) {
                return '';
              }
              
              // Check valid ranges
              if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
                return '';
              }
              
              // HTML date inputs require dates >= 1900-01-01
              // Dates before 1900 (like "1899/12/30" sentinel value) cannot be displayed
              // So we return empty string for dates < 1900
              if (yearNum < 1900) {
                console.log('Date before 1900 (sentinel value):', dateStr, '- treating as empty');
                return '';
              }
              
              // Return in YYYY-MM-DD format for HTML date input
              const formattedDate = `${year}-${month}-${day}`;
              console.log('Parsed date:', dateStr, '->', formattedDate);
              return formattedDate;
            }
          }
          
          // If already in YYYY-MM-DD format, validate and return
          if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              const year = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10);
              const day = parseInt(parts[2], 10);
              
              if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                // HTML date inputs require dates >= 1900-01-01
                if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900) {
                  return dateStr;
                }
              }
            }
          }
        } catch (e) {
          console.error('Error parsing date:', e, 'Input:', dateStr);
        }
        
        return '';
      };
      
      // Convert disk_quota from string to number and determine if enabled
      const diskQuotaValue = limitsData.disk_quota ? parseInt(limitsData.disk_quota, 10) : 0;
      const diskQuotaEnabled = diskQuotaValue > 0;
      
      // Convert volume_limit (likely in MB) - might be daily send data limit
      const volumeLimitValue = limitsData.volume_limit ? parseInt(limitsData.volume_limit, 10) : 0;
      
      const parsedDate = parseDate(limitsData.expires_on_date);
      console.log('Setting expires_on_date:', limitsData.expires_on_date, '->', parsedDate);
      
      // Store original limits data for comparison (deep copy)
      const originalData = JSON.parse(JSON.stringify(limitsData));
      setOriginalLimitsData(originalData);
      console.log('Stored original limits data:', originalData);
      
      setFormData((prev) => ({
        ...prev,
        // Domain Limits
        domain_admin_limit: limitsData.account_number || '',
        disk_quota_enabled: diskQuotaEnabled,
        disk_quota: diskQuotaValue > 0 ? diskQuotaValue.toString() : '',
        disk_quota_unit: 'MB', // API returns in MB based on sample
        daily_send_limit_enabled: volumeLimitValue > 0 || (limitsData.user_msg && parseInt(limitsData.user_msg, 10) > 0),
        daily_send_data_limit: volumeLimitValue > 0 ? volumeLimitValue.toString() : '',
        daily_send_data_limit_unit: 'MB', // Assuming MB based on volume_limit
        daily_send_messages_limit: limitsData.user_msg || '',
        disable_login: toBoolean(limitsData.disable_login),
        expires_on: toBoolean(limitsData.expires),
        expires_on_date: parsedDate,
        notify_before_expiration: toBoolean(limitsData.notify_expire),
        notify_before_expiration_days: limitsData.notify_before_expires || '',
        delete_domain_when_expired: toBoolean(limitsData.delete_expired),
        // User Limits
        account_size: limitsData.user_mb || '',
        account_size_unit: 'MB', // API returns in MB
        max_message_size: limitsData.user_mailbox || '',
        max_message_size_unit: 'MB', // Assuming MB
        default_daily_send_limit_enabled: (limitsData.user_number && parseInt(limitsData.user_number, 10) > 0) || (limitsData.number_limit && parseInt(limitsData.number_limit, 10) > 0),
        default_daily_send_data_limit: limitsData.number_limit || '',
        default_daily_send_data_limit_unit: 'MB', // Assuming MB
        default_daily_send_messages_limit: limitsData.user_number || '',
        // Handle spam_delete_older: if > 0, enable toggle and set days value
        delete_spam_older_than_enabled: (() => {
          const spamDeleteOlderValue = parseInt(limitsData.spam_delete_older || "0", 10);
          return spamDeleteOlderValue > 0;
        })(),
        delete_spam_older_than_days: (() => {
          const spamDeleteOlderValue = parseInt(limitsData.spam_delete_older || "0", 10);
          return spamDeleteOlderValue > 0 ? spamDeleteOlderValue.toString() : '';
        })(),
      }));
    }
  }, [limitsData, activeTab]);

  // Update form data when features are fetched from API
  useEffect(() => {
    if (featuresData && activeTab === 'features') {
      // Store original features data for comparison (deep copy)
      const originalData = JSON.parse(JSON.stringify(featuresData));
      setOriginalFeaturesData(originalData);
      console.log('Stored original features data:', originalData);
      
      // Map API response to form fields
      // Note: API uses "disabled_*" fields (true = disabled), form uses enabled fields (true = enabled)
      // So we invert: disabled=false means enabled=true
      setFormData((prev) => ({
        ...prev,
        // Map disabled_* fields (inverted: disabled=false means enabled=true)
        contacts: !featuresData.disabled_contacts,
        calendars: !featuresData.disabled_calendar,
        files_documents: !featuresData.disabled_files,
        notes: !featuresData.disabled_notes,
        tasks: !featuresData.disabled_tasks,
        // Marketplace uses dashboard_marketplace field
        marketplace: featuresData.dashboard_marketplace ?? prev.marketplace,
        // Quarantine is not in API response, keep existing value
        quarantine: prev.quarantine ?? true,
        // Keep existing mode values if not provided in API
        files_documents_mode: prev.files_documents_mode || 'MODERN',
        notes_mode: prev.notes_mode || 'MODERN',
      }));
    }
  }, [featuresData, activeTab]);

  const formatNumber = (value: number) =>
    Intl.NumberFormat(undefined, { notation: 'compact' }).format(
      Number.isFinite(value) ? value : 0
    );

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString();
  };

  // Helper function to calculate date ranges based on selected range
  const calculateDateRange = (range: string): { from: string; to: string } => {
    const today = new Date();
    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999); // End of today
    
    let fromDate = new Date();

    switch (range) {
      case 'last_month': {
        // First day of last month to last day of last month
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        toDate.setFullYear(lastDayOfLastMonth.getFullYear());
        toDate.setMonth(lastDayOfLastMonth.getMonth());
        toDate.setDate(lastDayOfLastMonth.getDate());
        break;
      }
      case 'last_2_months': {
        // First day of 2 months ago to today
        fromDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        break;
      }
      case 'last_quarter': {
        // Calculate last quarter (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)
        const currentMonth = today.getMonth(); // 0-11
        const currentQuarter = Math.floor(currentMonth / 3); // 0-3
        const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
        const lastQuarterYear = currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
        
        const quarterStartMonth = lastQuarter * 3; // 0, 3, 6, or 9
        const quarterEndMonth = quarterStartMonth + 2;
        
        fromDate = new Date(lastQuarterYear, quarterStartMonth, 1);
        toDate = new Date(lastQuarterYear, quarterEndMonth + 1, 0); // Last day of quarter
        break;
      }
      case 'last_2_quarters': {
        // Calculate last 2 quarters
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        const startQuarter = currentQuarter === 0 ? 2 : (currentQuarter === 1 ? 3 : currentQuarter - 2);
        const startYear = currentQuarter <= 1 ? today.getFullYear() - 1 : today.getFullYear();
        
        const quarterStartMonth = startQuarter * 3;
        fromDate = new Date(startYear, quarterStartMonth, 1);
        break;
      }
      case 'last_3_quarters': {
        // Calculate last 3 quarters
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        const startQuarter = currentQuarter === 0 ? 1 : (currentQuarter === 1 ? 2 : (currentQuarter === 2 ? 3 : currentQuarter - 3));
        const startYear = currentQuarter <= 2 ? today.getFullYear() - 1 : today.getFullYear();
        
        const quarterStartMonth = startQuarter * 3;
        fromDate = new Date(startYear, quarterStartMonth, 1);
        break;
      }
      case 'last_year': {
        // First day of last year to last day of last year
        fromDate = new Date(today.getFullYear() - 1, 0, 1);
        toDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      }
      case 'specified_by_date':
      default:
        // Keep current dates
        return {
          from: formData.statistics_from_date,
          to: formData.statistics_to_date,
        };
    }

    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    return {
      from: fromDate.toISOString().split('T')[0],
      to: toDate.toISOString().split('T')[0],
    };
  };

  // Handle range change
  const handleRangeChange = (range: string) => {
    updateFormData('statistics_range', range);
    
    if (range !== 'specified_by_date') {
      const dates = calculateDateRange(range);
      updateFormData('statistics_from_date', dates.from);
      updateFormData('statistics_to_date', dates.to);
    }
  };

  // Handle download statistics
  const handleDownloadStatistics = () => {
    const statisticsData = {
      range: formData.statistics_range,
      from_date: formData.statistics_from_date,
      to_date: formData.statistics_to_date,
      filter: formData.statistics_filter,
      max_items: parseInt(formData.statistics_max_items) || 100,
      group_by_domain: formData.statistics_group_by_domain,
    };

    // TODO: Implement actual download API call
    console.log('Download statistics:', statisticsData);
    toast.success('Statistics download initiated', {
      duration: 3000,
    });
  };

  // Helper function to detect changes
  const getChangedFields = (): Partial<UpdateDomainRequest> & { admin_email?: string; verify_type?: string; alias_list?: string[]; maximal_saas_plan?: string; unknown_forward_to?: string; two_factor_enabled?: boolean; im_roster_populated?: boolean } => {
    const changedFields: Partial<UpdateDomainRequest> & { admin_email?: string; verify_type?: string; alias_list?: string[]; maximal_saas_plan?: string; unknown_forward_to?: string; two_factor_enabled?: boolean; im_roster_populated?: boolean } = {};

    // Check name
    if (formData.name !== originalValues.name) {
      changedFields.name = formData.name;
    }

    // Check description
    if (formData.description !== originalValues.description) {
      changedFields.description = formData.description;
    }

    // Check domain_type
    if (formData.domain_type !== originalValues.domain_type) {
      changedFields.domain_type = formData.domain_type;
    }

    // Check administrator_email - API expects "admin_email" not "administrator_email"
    if (formData.administrator_email !== originalValues.administrator_email) {
      changedFields.admin_email = formData.administrator_email;
    }

    // Check verify_type - API expects "verify_type" (uppercase: "DEFAULT", "ISSUE_RCPT", "ISSUE_VRFY", "MINGER")
    if (formData.verification !== originalValues.verify_type) {
      // Convert lowercase form value to uppercase for API
      // Handle special case for issue_rcpt and issue_vrfy (use underscore, not hyphen)
      const apiValue = formData.verification
        .toUpperCase()
        .replace(/-/g, '_') as 'DEFAULT' | 'ISSUE_RCPT' | 'ISSUE_VRFY' | 'MINGER';
      changedFields.verify_type = apiValue;
    }

    // Check aliases - compare arrays (filter out empty strings for comparison)
    const currentAliases = aliases.filter(alias => alias.trim() !== '');
    const aliasesChanged = 
      currentAliases.length !== originalValues.aliases.length ||
      currentAliases.some((alias, index) => alias !== originalValues.aliases[index]) ||
      originalValues.aliases.some((alias, index) => alias !== currentAliases[index]);
    
    if (aliasesChanged) {
      // Use alias_list for API request (API expects alias_list, not aliases)
      changedFields.alias_list = currentAliases;
    }

    // Check permissions fields
    // API expects "maximal_saas_plan" not "max_subscription_plan"
    if (formData.max_subscription_plan !== originalValues.max_subscription_plan) {
      changedFields.maximal_saas_plan = formData.max_subscription_plan;
    }

    if (formData.unknown_accounts !== originalValues.unknown_accounts) {
      if (originalValues.unknown_accounts === 'forward' && formData.unknown_accounts !== 'forward') {
        changedFields.unknown_forward_to = '';
      }
    }

    // Check target_email - API expects "unknown_forward_to" when "forward" is selected
    if (formData.target_email !== originalValues.target_email) {
      // Only send unknown_forward_to if "forward" is selected
      if (formData.unknown_accounts === 'forward') {
        changedFields.unknown_forward_to = formData.target_email;
      }
    }

    // Check two_factor_auth - API expects "two_factor_enabled" not "two_factor_auth"
    if (formData.two_factor_auth !== originalValues.two_factor_auth) {
      changedFields.two_factor_enabled = formData.two_factor_auth;
    }

    // Check instant_messaging - API expects "im_roster_populated" not "instant_messaging"
    if (formData.instant_messaging !== originalValues.instant_messaging) {
      changedFields.im_roster_populated = formData.instant_messaging;
    }

    // Check Available Features
    const featuresChanged: Partial<DomainFeatures> = {};
    if (formData.contacts !== originalValues.contacts) {
      featuresChanged.contacts = formData.contacts;
    }
    if (formData.calendars !== originalValues.calendars) {
      featuresChanged.calendar = formData.calendars; // API uses "calendar" not "calendars"
    }
    if (formData.files_documents !== originalValues.files_documents) {
      featuresChanged.files_documents = formData.files_documents;
    }
    if (formData.notes !== originalValues.notes) {
      featuresChanged.notes = formData.notes;
    }
    if (formData.tasks !== originalValues.tasks) {
      featuresChanged.tasks = formData.tasks;
    }
    if (formData.quarantine !== originalValues.quarantine) {
      featuresChanged.quarantine = formData.quarantine;
    }
    if (formData.marketplace !== originalValues.marketplace) {
      featuresChanged.marketplace = formData.marketplace;
    }

    // Check feature modes (MODERN/LEGACY)
    if (formData.files_documents_mode !== originalValues.files_documents_mode) {
      if (Object.keys(featuresChanged).length === 0) {
        featuresChanged = {};
      }
      (featuresChanged as any).files_documents_mode = formData.files_documents_mode;
    }
    if (formData.notes_mode !== originalValues.notes_mode) {
      if (Object.keys(featuresChanged).length === 0) {
        featuresChanged = {};
      }
      (featuresChanged as any).notes_mode = formData.notes_mode;
    }

    // If any features changed, add features object to changedFields
    if (Object.keys(featuresChanged).length > 0) {
      changedFields.features = featuresChanged;
    }

    return changedFields;
  };

  // Build limits payload with only changed fields
  const buildLimitsPayload = () => {
    if (!originalLimitsData) {
      console.warn('Original limits data not available, sending all fields');
      // If no original data, send all fields (fallback)
      return buildFullLimitsPayload();
    }

    // Helper to convert boolean to "1" or "0"
    const toBooleanString = (value: boolean | undefined): string => {
      return value ? "1" : "0";
    };

    // Helper to convert date from YYYY-MM-DD to YYYY/MM/DD format
    const formatDateForAPI = (dateStr: string | undefined): string => {
      if (!dateStr || dateStr.trim() === '') return "1899/12/30"; // Default sentinel value
      if (dateStr.includes('-')) {
        return dateStr.replace(/-/g, '/');
      }
      return dateStr;
    };

    // Helper to convert number to string, default to "0"
    const toString = (value: string | number | undefined): string => {
      if (value === undefined || value === null || value === '') return "0";
      return String(value);
    };

    // Helper to compare values (normalize for comparison)
    const valuesEqual = (val1: any, val2: any): boolean => {
      const str1 = String(val1 || "0").trim();
      const str2 = String(val2 || "0").trim();
      return str1 === str2;
    };

    const payload: any = {};

    // Compare and add only changed fields
    // Domain Limits
    const currentVolumeLimit = toString(formData.daily_send_limit_enabled ? formData.daily_send_data_limit : "0");
    if (!valuesEqual(currentVolumeLimit, originalLimitsData.volume_limit)) {
      payload.volume_limit = currentVolumeLimit;
    }

    const currentAccountNumber = toString(formData.domain_admin_limit || "0");
    if (!valuesEqual(currentAccountNumber, originalLimitsData.account_number)) {
      payload.account_number = currentAccountNumber;
    }

    const currentDiskQuota = toString(formData.disk_quota_enabled ? formData.disk_quota : "0");
    if (!valuesEqual(currentDiskQuota, originalLimitsData.disk_quota)) {
      payload.disk_quota = currentDiskQuota;
    }

    const currentDisableLogin = toBooleanString(formData.disable_login);
    if (!valuesEqual(currentDisableLogin, originalLimitsData.disable_login)) {
      payload.disable_login = currentDisableLogin;
    }

    const currentExpires = toBooleanString(formData.expires_on);
    if (!valuesEqual(currentExpires, originalLimitsData.expires)) {
      payload.expires = currentExpires;
    }

    const currentExpiresOnDate = formatDateForAPI(formData.expires_on_date);
    if (!valuesEqual(currentExpiresOnDate, originalLimitsData.expires_on_date)) {
      payload.expires_on_date = currentExpiresOnDate;
    }

    const currentNotifyExpire = toBooleanString(formData.notify_before_expiration);
    if (!valuesEqual(currentNotifyExpire, originalLimitsData.notify_expire)) {
      payload.notify_expire = currentNotifyExpire;
    }

    const currentNotifyBeforeExpires = toString(formData.notify_before_expiration_days || "0");
    if (!valuesEqual(currentNotifyBeforeExpires, originalLimitsData.notify_before_expires)) {
      payload.notify_before_expires = currentNotifyBeforeExpires;
    }

    const currentDeleteExpired = toBooleanString(formData.delete_domain_when_expired);
    if (!valuesEqual(currentDeleteExpired, originalLimitsData.delete_expired)) {
      payload.delete_expired = currentDeleteExpired;
    }

    const currentUserMsg = toString(formData.daily_send_limit_enabled ? formData.daily_send_messages_limit : "0");
    if (!valuesEqual(currentUserMsg, originalLimitsData.user_msg)) {
      payload.user_msg = currentUserMsg;
    }

    // User Limits
    const currentUserMb = toString(formData.account_size || "0");
    if (!valuesEqual(currentUserMb, originalLimitsData.user_mb)) {
      payload.user_mb = currentUserMb;
    }

    const currentUserMailbox = toString(formData.max_message_size || "0");
    if (!valuesEqual(currentUserMailbox, originalLimitsData.user_mailbox)) {
      payload.user_mailbox = currentUserMailbox;
    }

    const currentNumberLimit = toString(formData.default_daily_send_limit_enabled ? formData.default_daily_send_data_limit : "0");
    if (!valuesEqual(currentNumberLimit, originalLimitsData.number_limit)) {
      payload.number_limit = currentNumberLimit;
    }

    const currentUserNumber = toString(formData.default_daily_send_limit_enabled ? formData.default_daily_send_messages_limit : "0");
    if (!valuesEqual(currentUserNumber, originalLimitsData.user_number)) {
      payload.user_number = currentUserNumber;
    }

    const currentSpamDeleteOlder = toBooleanString(formData.delete_spam_older_than_enabled);
    if (!valuesEqual(currentSpamDeleteOlder, originalLimitsData.spam_delete_older)) {
      payload.spam_delete_older = currentSpamDeleteOlder;
    }

    console.log('Original limits data:', originalLimitsData);
    console.log('Changed fields only:', payload);
    
    return payload;
  };

  // Build full limits payload (fallback when original data is not available)
  const buildFullLimitsPayload = () => {
    // Helper to convert boolean to "1" or "0"
    const toBooleanString = (value: boolean | undefined): string => {
      return value ? "1" : "0";
    };

    // Helper to convert date from YYYY-MM-DD to YYYY/MM/DD format
    const formatDateForAPI = (dateStr: string | undefined): string => {
      if (!dateStr || dateStr.trim() === '') return "1899/12/30"; // Default sentinel value
      if (dateStr.includes('-')) {
        return dateStr.replace(/-/g, '/');
      }
      return dateStr;
    };

    // Helper to convert number to string, default to "0"
    const toString = (value: string | number | undefined): string => {
      if (value === undefined || value === null || value === '') return "0";
      return String(value);
    };

    return {
      // Domain Limits
      volume_limit: toString(formData.daily_send_limit_enabled ? formData.daily_send_data_limit : "0"),
      account_number: toString(formData.domain_admin_limit || "0"),
      disk_quota: toString(formData.disk_quota_enabled ? formData.disk_quota : "0"),
      disable_login: toBooleanString(formData.disable_login),
      expires: toBooleanString(formData.expires_on),
      expires_on_date: formatDateForAPI(formData.expires_on_date),
      notify_expire: toBooleanString(formData.notify_before_expiration),
      notify_before_expires: toString(formData.notify_before_expiration_days || "0"),
      delete_expired: toBooleanString(formData.delete_domain_when_expired),
      user_msg: toString(formData.daily_send_limit_enabled ? formData.daily_send_messages_limit : "0"),
      
      // User Limits
      user_mb: toString(formData.account_size || "0"),
      user_mailbox: toString(formData.max_message_size || "0"),
      number_limit: toString(formData.default_daily_send_limit_enabled ? formData.default_daily_send_data_limit : "0"),
      user_number: toString(formData.default_daily_send_limit_enabled ? formData.default_daily_send_messages_limit : "0"),
      spam_delete_older: formData.delete_spam_older_than_enabled 
        ? toString(formData.delete_spam_older_than_days || "0")
        : "0",
    };
  };

  // Build features payload with only changed fields
  const buildFeaturesPayload = () => {
    if (!originalFeaturesData) {
      console.warn('Original features data not available, sending all fields');
      // If no original data, send all fields (fallback)
      return buildFullFeaturesPayload();
    }

    // Helper to compare values
    const valuesEqual = (val1: any, val2: any): boolean => {
      return val1 === val2;
    };

    const payload: any = {};

    // Compare and add only changed fields
    // Map form enabled fields to API disabled fields (inverted)
    const currentDisabledContacts = !formData.contacts;
    if (!valuesEqual(currentDisabledContacts, originalFeaturesData.disabled_contacts)) {
      payload.disabled_contacts = currentDisabledContacts;
    }

    const currentDisabledCalendar = !formData.calendars;
    if (!valuesEqual(currentDisabledCalendar, originalFeaturesData.disabled_calendar)) {
      payload.disabled_calendar = currentDisabledCalendar;
    }

    const currentDisabledFiles = !formData.files_documents;
    if (!valuesEqual(currentDisabledFiles, originalFeaturesData.disabled_files)) {
      payload.disabled_files = currentDisabledFiles;
    }

    const currentDisabledNotes = !formData.notes;
    if (!valuesEqual(currentDisabledNotes, originalFeaturesData.disabled_notes)) {
      payload.disabled_notes = currentDisabledNotes;
    }

    const currentDisabledTasks = !formData.tasks;
    if (!valuesEqual(currentDisabledTasks, originalFeaturesData.disabled_tasks)) {
      payload.disabled_tasks = currentDisabledTasks;
    }

    const currentDashboardMarketplace = formData.marketplace;
    if (!valuesEqual(currentDashboardMarketplace, originalFeaturesData.dashboard_marketplace)) {
      payload.dashboard_marketplace = currentDashboardMarketplace;
    }

    // Dashboard files - map from files_documents enabled state
    if (originalFeaturesData.dashboard_files !== undefined) {
      const currentDashboardFiles = formData.files_documents;
      if (!valuesEqual(currentDashboardFiles, originalFeaturesData.dashboard_files)) {
        payload.dashboard_files = currentDashboardFiles;
      }
    }

    // Dashboard notes - map from notes enabled state
    if (originalFeaturesData.dashboard_notes !== undefined) {
      const currentDashboardNotes = formData.notes;
      if (!valuesEqual(currentDashboardNotes, originalFeaturesData.dashboard_notes)) {
        payload.dashboard_notes = currentDashboardNotes;
      }
    }

    console.log('Original features data:', originalFeaturesData);
    console.log('Changed fields only:', payload);
    
    return payload;
  };

  // Build full features payload (fallback when original data is not available)
  const buildFullFeaturesPayload = () => {
    return {
      disabled_contacts: !formData.contacts,
      disabled_calendar: !formData.calendars,
      disabled_files: !formData.files_documents,
      disabled_notes: !formData.notes,
      disabled_tasks: !formData.tasks,
      dashboard_marketplace: formData.marketplace,
      dashboard_files: formData.files_documents,
      dashboard_notes: formData.notes,
    };
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // If we're on the Limits tab, use UPDATE_LIMITS API
      if (activeTab === 'limits') {
        const limitsPayload = buildLimitsPayload();
        
        // Check if there are any changes
        if (Object.keys(limitsPayload).length === 0) {
          toast.info('No changes to save', {
            duration: 3000,
          });
          setIsSaving(false);
          return;
        }

        console.log('Sending only changed fields:', limitsPayload);
        
        await updateDomainLimits.mutateAsync({
          id: domain.id,
          limits: limitsPayload,
        });

        // Refetch limits to update the UI with latest data
        const updatedLimits = await refetchLimits();
        
        // Update original limits data after successful save
        if (updatedLimits.data) {
          setOriginalLimitsData(JSON.parse(JSON.stringify(updatedLimits.data)));
        }

        toast.success('Domain limits updated successfully', {
          duration: 4000,
        });

        onSave?.(domain);
        // Don't close the modal, just show success
        return;
      }

      // If we're on the Features tab, use UPDATE_FEATURES API
      if (activeTab === 'features') {
        const featuresPayload = buildFeaturesPayload();
        
        // Check if there are any changes
        if (Object.keys(featuresPayload).length === 0) {
          toast.info('No changes to save', {
            duration: 3000,
          });
          setIsSaving(false);
          return;
        }

        console.log('Sending only changed fields:', featuresPayload);
        
        await updateDomainFeatures.mutateAsync({
          id: domain.id,
          features: featuresPayload,
        });

        // Refetch features to update the UI with latest data
        const updatedFeatures = await refetchFeatures();
        
        // Update original features data after successful save
        if (updatedFeatures.data) {
          const newOriginalData = JSON.parse(JSON.stringify(updatedFeatures.data));
          setOriginalFeaturesData(newOriginalData);
          console.log('Updated original features data:', newOriginalData);
        }

        toast.success('Domain features updated successfully', {
          duration: 4000,
        });

        onSave?.(domain);
        // Don't close the modal, just show success
        return;
      }

      // For other tabs, use the existing PATCH logic
      // Get only changed fields
      const changedFields = getChangedFields();

      // If no changes, show message and return
      if (Object.keys(changedFields).length === 0) {
        toast.info('No changes to save', {
          duration: 3000,
        });
        setIsSaving(false);
        return;
      }

      // Use PATCH to send only changed fields
      const updatedDomain = await patchDomain.mutateAsync({
        id: domain.id,
        data: changedFields,
      });

      toast.success('Domain updated successfully', {
        duration: 4000,
      });

      onSave?.(updatedDomain);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save domain configuration', {
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add new alias input field
  const handleAddAlias = () => {
    setAliases([...aliases, '']);
  };

  // Remove alias at index
  const handleRemoveAlias = (index: number) => {
    setAliases(aliases.filter((_, i) => i !== index));
  };

  // Update alias at index
  const handleUpdateAlias = (index: number, value: string) => {
    const newAliases = [...aliases];
    newAliases[index] = value;
    setAliases(newAliases);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderDashboardSection = () => {
    // Show loader while dashboard stats are being fetched
    if (statsLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    // Show error message if dashboard stats failed to load
    if (statsError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">Failed to load dashboard data</p>
              <p className="text-xs text-muted-foreground mt-1">
                {statsError instanceof Error ? statsError.message : 'An error occurred'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => statsRefetch()}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    const summary = accountStats?.summary;
    const accounts = accountStats?.accounts || [];

    const messageData =
      summary?.total_received_messages !== undefined
        ? [
            {
              name: 'Received',
              value: summary.total_received_messages,
            },
            {
              name: 'Sent',
              value: summary.total_sent_messages,
            },
            {
              name: 'Sent Out',
              value: summary.total_sent_out_messages,
            },
          ]
        : [];

    const storageData =
      summary?.total_files_amount !== undefined
        ? [
            { name: 'Files (count)', value: summary.total_files_count },
            { name: 'Files Size', value: summary.total_files_amount },
            { name: 'Storage Used', value: summary.total_storage_used },
          ]
        : [];

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Domain Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Live summary for {domain.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => statsRefetch()}
              disabled={statsLoading}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-9">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Received',
              value: summary?.total_received_messages,
              hint: 'messages',
            },
            {
              label: 'Total Sent',
              value: summary?.total_sent_messages,
              hint: 'messages',
            },
            {
              label: 'Files',
              value: summary?.total_files_count,
              hint: 'items',
            },
            {
              label: 'Storage Used',
              value: summary?.total_storage_used,
              hint: 'kB',
            },
          ].map((card, idx) => (
            <Card
              key={idx}
              className="bg-card/80 border-border/60 shadow-sm hover:shadow-md transition-all duration-200 p-4 rounded-lg"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {card.label}
              </p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                {card.value !== undefined ? formatNumber(card.value) : '—'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{card.hint}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-card/80 border-border/60 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">
                Message Flow
              </h4>
              <span className="text-xs text-muted-foreground">by count</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={messageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--color-primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-card/80 border-border/60 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">
                Storage & Files
              </h4>
              <span className="text-xs text-muted-foreground">totals</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={storageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--color-chart-2))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="bg-card/80 border-border/60 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Accounts</h4>
              <p className="text-xs text-muted-foreground">
                Activity and storage overview
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Last login: {formatDate(summary?.last_activity?.last_login)}
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border/60">
                  <th className="py-2 pr-2">Alias</th>
                  <th className="py-2 pr-2">Sent</th>
                  <th className="py-2 pr-2">Received</th>
                  <th className="py-2 pr-2">Files</th>
                  <th className="py-2 pr-2">Storage</th>
                  <th className="py-2 pr-2">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {statsLoading && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      Loading dashboard...
                    </td>
                  </tr>
                )}
                {!statsLoading && accounts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      No account data available yet.
                    </td>
                  </tr>
                )}
                {accounts.map((account) => (
                    <tr
                      key={account.alias}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-3 pr-2 font-semibold text-foreground">
                        {account.alias}
                      </td>
                      <td className="py-3 pr-2 text-muted-foreground">
                        {formatNumber(account.sent_messages)} msgs
                      </td>
                      <td className="py-3 pr-2 text-muted-foreground">
                        {formatNumber(account.received_messages)} msgs
                      </td>
                      <td className="py-3 pr-2 text-muted-foreground">
                        {formatNumber(account.files_count)} files
                      </td>
                      <td className="py-3 pr-2 text-muted-foreground">
                        {formatNumber(account.files_amount)} kB
                      </td>
                      <td className="py-3 pr-2 text-muted-foreground">
                        {formatDate(account.last_login || account.last_received)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderGeneralSection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-foreground mb-2 block"
            >
              Domain Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200"
              placeholder="Enter domain name"
            />
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-foreground mb-2 block"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200 resize-none"
              placeholder="Enter domain description"
              rows={3}
            />
          </div>

          <div>
            <Label
              htmlFor="type"
              className="text-sm font-semibold text-foreground mb-2 block"
            >
              Domain Type
            </Label>
            <Select
              value={formData.domain_type}
              onValueChange={(value) => updateFormData('domain_type', value)}
            >
              <SelectTrigger className="bg-muted border-border text-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem
                  value="STANDARD"
                  className="text-foreground hover:bg-muted"
                >
                  Standard
                </SelectItem>
                <SelectItem
                  value="ETRN_ATRN"
                  className="text-foreground hover:bg-muted"
                >
                  ETRN/ATRN queue
                </SelectItem>
                <SelectItem
                  value="ALIAS"
                  className="text-foreground hover:bg-muted"
                >
                  Domain alias
                </SelectItem>
                <SelectItem
                  value="BACKUP"
                  className="text-foreground hover:bg-muted"
                >
                  Backup Domain
                </SelectItem>
                <SelectItem
                  value="DISTRIBUTED"
                  className="text-foreground hover:bg-muted"
                >
                  Distributed Domain
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label
              htmlFor="admin_email"
              className="text-sm font-semibold text-foreground mb-2 block"
            >
              Administrator Email
            </Label>
            <Input
              id="admin_email"
              type="email"
              value={formData.administrator_email}
              onChange={(e) =>
                updateFormData('administrator_email', e.target.value)
              }
              className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <Label
              htmlFor="verification"
              className="text-sm font-semibold text-foreground mb-2 block"
            >
              Verification
            </Label>
            <Select
              disabled
              value={formData.verification}
              onValueChange={(value) => updateFormData('verification', value)}
            >
              <SelectTrigger className="bg-muted border-border text-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem
                  value="default"
                  className="text-foreground hover:bg-muted"
                >
                  Default
                </SelectItem>
                <SelectItem
                  value="issue_rcpt"
                  className="text-foreground hover:bg-muted"
                >
                  Issue RCPT
                </SelectItem>
                <SelectItem
                  value="issue_vrfy"
                  className="text-foreground hover:bg-muted"
                >
                  Issue VRFY
                </SelectItem>
                <SelectItem
                  value="minger"
                  className="text-foreground hover:bg-muted"
                >
                  Minger
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-foreground mb-2 block"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              disabled
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200"
              placeholder="Enter password"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">
            ALIASES
            </h3>
          <p className="text-sm text-muted-foreground mb-4">
              Enter aliases for this domain. Messages sent to all these
            addresses will be delivered to this domain's mailboxes. For these aliases you cannot set different rules than for the original domain.
            </p>
          </div>
        
        <div className="space-y-3 mb-4">
          <AnimatePresence mode="popLayout">
            {aliases.map((alias, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Input
                  value={alias}
                  onChange={(e) => handleUpdateAlias(index, e.target.value)}
                  placeholder="Add alias"
                  className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200 flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAlias(index)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

          <Button
            variant="outline"
            size="sm"
          onClick={handleAddAlias}
          className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-200 rounded-lg px-4 py-2 font-medium uppercase"
          >
          <Plus className="h-4 w-4 mr-2" />
            Add Alias
          </Button>
      </div>

      <div className="border-t border-border pt-8">
        <div className="bg-muted rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-3">Quotas</h3>
          <p className="text-sm text-foreground">
            Click Domain Limits to limit domain size, number of messages sent,
            or maximum size of messages on the domain level.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPermissionsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="max_plan"
              className="text-sm font-medium text-foreground"
            >
              Max Allowed Subscription Plan
            </Label>
            <Select
              value={formData.max_subscription_plan}
              onValueChange={(value) =>
                updateFormData('max_subscription_plan', value)
              }
            >
              <SelectTrigger className="mt-1 bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Plan</SelectItem>
                <SelectItem value="icewarp">IceWarp</SelectItem>
                <SelectItem value="icewarp_desktop">IceWarp Desktop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="unknown_accounts"
              className="text-sm font-medium text-foreground"
            >
              Unknown Accounts
            </Label>
            <Select
              value={formData.unknown_accounts}
              onValueChange={(value) =>
                updateFormData('unknown_accounts', value)
              }
            >
              <SelectTrigger className="mt-1 bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="forward">Forward to address</SelectItem>
                <SelectItem value="accept">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="target_email"
              className="text-sm font-medium text-foreground"
            >
              Target Email
            </Label>
            <Input
              id="target_email"
              type="email"
              value={formData.target_email}
              onChange={(e) => updateFormData('target_email', e.target.value)}
              className="mt-1 bg-card border-border text-foreground"
              placeholder=""
              disabled={formData.unknown_accounts !== 'forward'}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <div>
              <Label
                htmlFor="two_factor"
                className="text-sm font-semibold text-foreground"
              >
                Two-Factor Authentication
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Enable 2FA for domain users
              </p>
            </div>
            <Switch
              id="two_factor"
              checked={formData.two_factor_auth}
              onCheckedChange={(checked) =>
                updateFormData('two_factor_auth', checked)
              }
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <div>
              <Label
                htmlFor="instant_messaging"
                className="text-sm font-semibold text-foreground"
              >
                Instant Messaging Shared Roster
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Enable shared roster for IM
              </p>
            </div>
            <Switch
              id="instant_messaging"
              checked={formData.instant_messaging}
              onCheckedChange={(checked) =>
                updateFormData('instant_messaging', checked)
              }
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Domain Features
        </h3>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setIsFeaturesModalOpen(true)}
          >
            Features
          </Button>
          <Button
            variant="outline"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setIsDNSValidationOpen(true)}
          >
            Validation
          </Button>
          <Button
            variant="outline"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setIsDKIMWizardOpen(true)}
          >
            DKIM
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLimitsSection = () => {
    // Show loader while limits are being fetched
    if (limitsLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading limits...</p>
          </div>
        </div>
      );
    }

    // Show error message if limits failed to load
    if (limitsError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">Failed to load limits</p>
              <p className="text-xs text-muted-foreground mt-1">
                {limitsError instanceof Error ? limitsError.message : 'An error occurred'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchLimits()}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Domain Limits
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          The following domain limits take precedence of any user-level limits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="admin_limit"
              className="text-sm font-medium text-foreground"
            >
              Domain Admin Account Limit
            </Label>
            <Input
              id="admin_limit"
              type="number"
              value={formData.domain_admin_limit}
              onChange={(e) =>
                updateFormData('domain_admin_limit', e.target.value)
              }
              className="mt-1 bg-card border-border text-foreground"
              placeholder="Enter limit"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label
                htmlFor="disk_quota"
                className="text-sm font-medium text-foreground"
              >
                Disk Quota
              </Label>
              <Switch
                checked={formData.disk_quota_enabled}
                onCheckedChange={(checked) =>
                  updateFormData('disk_quota_enabled', checked)
                }
              />
            </div>
            <div className="flex gap-2">
              <Input
                id="disk_quota"
                type="number"
                value={formData.disk_quota}
                onChange={(e) => updateFormData('disk_quota', e.target.value)}
                className="bg-card border-border text-foreground"
                placeholder="Enter quota"
                disabled={!formData.disk_quota_enabled}
              />
              <Select
                value={formData.disk_quota_unit}
                onValueChange={(value) =>
                  updateFormData('disk_quota_unit', value)
                }
              >
                <SelectTrigger className="w-20 bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kB">kB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                  <SelectItem value="GB">GB</SelectItem>
                  <SelectItem value="GB">TB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border mb-4">
              <div>
                <Label
                  htmlFor="daily_send_limit"
                  className="text-sm font-semibold text-foreground"
                >
                  Daily Send Out Limits for Domain
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable daily send limits for this domain
                </p>
              </div>
              <Switch
                id="daily_send_limit"
                checked={formData.daily_send_limit_enabled}
                onCheckedChange={(checked) =>
                  updateFormData('daily_send_limit_enabled', checked)
                }
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>

            {formData.daily_send_limit_enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label
                    htmlFor="send_out_data_limit"
                    className="text-sm font-medium text-foreground"
                  >
                    Send Out Data Limit
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="send_out_data_limit"
                      type="number"
                      value={formData.daily_send_data_limit}
                      onChange={(e) =>
                        updateFormData('daily_send_data_limit', e.target.value)
                      }
                      className="bg-card border-border text-foreground"
                      placeholder="Enter limit"
                    />
                    <Select
                      value={formData.daily_send_data_limit_unit}
                      onValueChange={(value) =>
                        updateFormData('daily_send_data_limit_unit', value)
                      }
                    >
                      <SelectTrigger className="w-20 bg-card border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kB">kB</SelectItem>
                        <SelectItem value="MB">MB</SelectItem>
                        <SelectItem value="GB">GB</SelectItem>
                        <SelectItem value="TB">TB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="send_out_messages_limit"
                    className="text-sm font-medium text-foreground"
                  >
                    Send Out Messages Limit
                  </Label>
                  <Input
                    id="send_out_messages_limit"
                    type="number"
                    value={formData.daily_send_messages_limit}
                    onChange={(e) =>
                      updateFormData('daily_send_messages_limit', e.target.value)
                    }
                    className="mt-1 bg-card border-border text-foreground"
                    placeholder="# per day"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <div>
              <Label
                htmlFor="disable_login"
                className="text-sm font-semibold text-foreground"
              >
                Disable Login to This Domain
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Prevent users from logging into this domain
              </p>
            </div>
            <Switch
              id="disable_login"
              checked={formData.disable_login}
              onCheckedChange={(checked) =>
                updateFormData('disable_login', checked)
              }
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          User Limits
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          The following limits have lower priority than any user-level limits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="account_size"
              className="text-sm font-medium text-foreground"
            >
              Account Size
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="account_size"
                type="number"
                value={formData.account_size}
                onChange={(e) => updateFormData('account_size', e.target.value)}
                className="bg-card border-border text-foreground"
                placeholder="Enter size"
              />
              <Select
                value={formData.account_size_unit}
                onValueChange={(value) =>
                  updateFormData('account_size_unit', value)
                }
              >
                <SelectTrigger className="w-20 bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kB">kB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                  <SelectItem value="GB">GB</SelectItem>
                  <SelectItem value="GB">TB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label
              htmlFor="max_message_size"
              className="text-sm font-medium text-foreground"
            >
              Max Message Size
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="max_message_size"
                type="number"
                value={formData.max_message_size}
                onChange={(e) =>
                  updateFormData('max_message_size', e.target.value)
                }
                className="bg-card border-border text-foreground"
                placeholder="Enter size"
              />
              <Select
                value={formData.max_message_size_unit}
                onValueChange={(value) =>
                  updateFormData('max_message_size_unit', value)
                }
              >
                <SelectTrigger className="w-20 bg-card border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kB">kB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                  <SelectItem value="GB">GB</SelectItem>
                  <SelectItem value="GB">TB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border mb-4">
              <div>
                <Label
                  htmlFor="default_daily_send_limit"
                  className="text-sm font-semibold text-foreground"
                >
                  Default Daily Send Out Limits for Users
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable default daily send limits for users
                </p>
              </div>
              <Switch
                id="default_daily_send_limit"
                checked={formData.default_daily_send_limit_enabled}
                onCheckedChange={(checked) =>
                  updateFormData('default_daily_send_limit_enabled', checked)
                }
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>

            {formData.default_daily_send_limit_enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label
                    htmlFor="default_send_out_data_limit"
                    className="text-sm font-medium text-foreground"
                  >
                    Send Out Data Limit
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="default_send_out_data_limit"
                      type="number"
                      value={formData.default_daily_send_data_limit}
                      onChange={(e) =>
                        updateFormData('default_daily_send_data_limit', e.target.value)
                      }
                      className="bg-card border-border text-foreground"
                      placeholder="Enter limit"
                    />
                    <Select
                      value={formData.default_daily_send_data_limit_unit}
                      onValueChange={(value) =>
                        updateFormData('default_daily_send_data_limit_unit', value)
                      }
                    >
                      <SelectTrigger className="w-20 bg-card border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kB">kB</SelectItem>
                        <SelectItem value="MB">MB</SelectItem>
                        <SelectItem value="GB">GB</SelectItem>
                        <SelectItem value="TB">TB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="default_send_out_messages_limit"
                    className="text-sm font-medium text-foreground"
                  >
                    Send Out Messages Limit
                  </Label>
                  <Input
                    id="default_send_out_messages_limit"
                    type="number"
                    value={formData.default_daily_send_messages_limit}
                    onChange={(e) =>
                      updateFormData('default_daily_send_messages_limit', e.target.value)
                    }
                    className="mt-1 bg-card border-border text-foreground"
                    placeholder="# per day"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border mb-4">
              <div>
                <Label
                  htmlFor="delete_spam_older_than"
                  className="text-sm font-semibold text-foreground"
                >
                  Delete Spam Older Than
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically delete spam messages older than specified days
                </p>
              </div>
              <Switch
                id="delete_spam_older_than"
                checked={formData.delete_spam_older_than_enabled}
                onCheckedChange={(checked) =>
                  updateFormData('delete_spam_older_than_enabled', checked)
                }
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>

            {formData.delete_spam_older_than_enabled && (
              <div className="mt-4">
                <Label
                  htmlFor="spam_older_than_days"
                  className="text-sm font-medium text-foreground"
                >
                  Days
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="spam_older_than_days"
                    type="number"
                    value={formData.delete_spam_older_than_days}
                    onChange={(e) =>
                      updateFormData('delete_spam_older_than_days', e.target.value)
                    }
                    className="bg-card border-border text-foreground"
                    placeholder="Days"
                  />
                  <div className="flex items-center px-3 bg-muted border border-border rounded-md text-sm text-muted-foreground">
                    days
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Domain Expiration
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define an expiration date for the domain. When a domain expires, only
          the login to the domain is disabled. If you choose to delete the domain, all accounts and their data will be deleted!
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border mb-4">
              <div>
                <Label
                  htmlFor="expires_on"
                  className="text-sm font-semibold text-foreground"
                >
                  Expires On
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Set domain expiration date
                </p>
              </div>
              <Switch
                id="expires_on"
                checked={formData.expires_on}
                onCheckedChange={(checked) =>
                  updateFormData('expires_on', checked)
                }
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>

            {formData.expires_on && (
              <div className="mt-4">
                <div className="relative mt-1">
                  <Input
                    id="expires_on_date"
                    type="date"
                    value={formData.expires_on_date}
                    onChange={(e) =>
                      updateFormData('expires_on_date', e.target.value)
                    }
                    className="bg-card border-border text-foreground pr-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border mb-4">
              <div>
                <Label
                  htmlFor="notify_expiration"
                  className="text-sm font-semibold text-foreground"
                >
                  Notify Before Expiration
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Send notification before domain expires
                </p>
              </div>
              <Switch
                id="notify_expiration"
                checked={formData.notify_before_expiration}
                onCheckedChange={(checked) =>
                  updateFormData('notify_before_expiration', checked)
                }
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
              />
            </div>

            {formData.notify_before_expiration && (
              <div className="mt-4">
                <Input
                  id="notify_before_expiration_days"
                  type="number"
                  value={formData.notify_before_expiration_days}
                  onChange={(e) =>
                    updateFormData('notify_before_expiration_days', e.target.value)
                  }
                  className="mt-1 bg-card border-border text-foreground"
                  placeholder="Enter days"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <div>
              <Label
                htmlFor="delete_expired"
                className="text-sm font-semibold text-foreground"
              >
                Delete Domain When Expired
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically delete expired domains
              </p>
            </div>
            <Switch
              id="delete_expired"
              checked={formData.delete_domain_when_expired}
              onCheckedChange={(checked) =>
                updateFormData('delete_domain_when_expired', checked)
              }
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
            />
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderFeaturesSection = () => {
    // Show loader while features are being fetched
    if (featuresLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading features...</p>
          </div>
        </div>
      );
    }

    // Show error message if features failed to load
    if (featuresError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm font-medium text-foreground">Failed to load features</p>
              <p className="text-xs text-muted-foreground mt-1">
                {featuresError instanceof Error ? featuresError.message : 'An error occurred'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchFeatures()}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    const availableFeatures = [
      { key: 'contacts', label: 'CONTACTS' },
      { key: 'calendars', label: 'CALENDARS' },
      { key: 'files_documents', label: 'FILES & DOCUMENTS' },
      { key: 'notes', label: 'NOTES' },
      { key: 'tasks', label: 'TASKS' },
      { key: 'quarantine', label: 'QUARANTINE' },
      { key: 'marketplace', label: 'MARKETPLACE' },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            AVAILABLE FEATURES
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Here is a list of features available to all your end users in the WebClient.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            You can choose which features to activate or deactivate based on your needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableFeatures.map((feature) => (
              <div
                key={feature.key}
                className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border"
              >
                <Label
                  htmlFor={feature.key}
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
                  {feature.label}
                </Label>
                <Switch
                  id={feature.key}
                  checked={formData[feature.key as keyof typeof formData] as boolean}
                  onCheckedChange={(checked) =>
                    updateFormData(feature.key, checked)
                  }
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <h3 className="text-xl font-bold text-foreground mb-2">
            FEATURES
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Choose between the redesigned Files & Documents or Notes with a modern interface and secure cloud-based processing, or the legacy version with a classic look and fully local data handling.
          </p>

          <div className="space-y-8">
            {/* Files & Documents */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Files & Documents
              </h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <Image
                  src={formData.files_documents_mode === 'MODERN' ? filesModernImage : filesLegacyImage}
                  alt={`Files & Documents - ${formData.files_documents_mode}`}
                  className="w-full h-auto"
                  priority
                />
                <div className="p-4 bg-muted border-t border-border">
                  <RadioGroup
                    value={formData.files_documents_mode}
                    onValueChange={(value) => updateFormData('files_documents_mode', value)}
                    className="flex items-center gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MODERN" id="files-modern" />
                      <Label
                        htmlFor="files-modern"
                        className="text-sm font-semibold text-foreground cursor-pointer"
                      >
                        MODERN
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LEGACY" id="files-legacy" />
                      <Label
                        htmlFor="files-legacy"
                        className="text-sm font-semibold text-foreground cursor-pointer"
                      >
                        LEGACY
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Notes
              </h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <Image
                  src={formData.notes_mode === 'MODERN' ? notesModernImage : notesLegacyImage}
                  alt={`Notes - ${formData.notes_mode}`}
                  className="w-full h-auto"
                  priority
                />
                <div className="p-4 bg-muted border-t border-border">
                  <RadioGroup
                    value={formData.notes_mode}
                    onValueChange={(value) => updateFormData('notes_mode', value)}
                    className="flex items-center gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MODERN" id="notes-modern" />
                      <Label
                        htmlFor="notes-modern"
                        className="text-sm font-semibold text-foreground cursor-pointer"
                      >
                        MODERN
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LEGACY" id="notes-legacy" />
                      <Label
                        htmlFor="notes-legacy"
                        className="text-sm font-semibold text-foreground cursor-pointer"
                      >
                        LEGACY
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDevicesSection = () => (
    <div className="space-y-6">
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Mobile Devices
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Manage settings of connected mobile devices for this domain.
        </p>
        <Button
          variant="outline"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Manage Mobile Devices
        </Button>
      </Card>
    </div>
  );

  const renderStatisticsSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-foreground mb-6">
        ACCOUNT STATISTICS
      </h3>

      <div className="space-y-6">
        {/* RANGE */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            RANGE
          </Label>
          <Select
            value={formData.statistics_range}
            onValueChange={handleRangeChange}
          >
            <SelectTrigger className="bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="specified_by_date">Specified by date</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_2_months">Last 2 Months</SelectItem>
              <SelectItem value="last_quarter">Last Quarter</SelectItem>
              <SelectItem value="last_2_quarters">Last 2 Quarters</SelectItem>
              <SelectItem value="last_3_quarters">Last 3 Quarters</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* FROM and TO Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              FROM
            </Label>
            <div className="relative">
              <Input
                type="date"
                value={formData.statistics_from_date}
                onChange={(e) => updateFormData('statistics_from_date', e.target.value)}
                className="bg-card border-border text-foreground pr-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-100"
                disabled={formData.statistics_range !== 'specified_by_date'}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              TO
            </Label>
            <div className="relative">
              <Input
                type="date"
                value={formData.statistics_to_date}
                onChange={(e) => updateFormData('statistics_to_date', e.target.value)}
                className="bg-card border-border text-foreground pr-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-100"
                disabled={formData.statistics_range !== 'specified_by_date'}
              />
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            FILTER
          </Label>
          <Input
            type="text"
            value={formData.statistics_filter}
            onChange={(e) => updateFormData('statistics_filter', e.target.value)}
            className="bg-card border-border text-foreground"
            placeholder="Enter filter"
          />
        </div>

        {/* MAX ITEMS */}
        <div>
          <Label className="text-sm font-semibold text-foreground mb-2 block">
            MAX ITEMS
          </Label>
          <Input
            type="number"
            value={formData.statistics_max_items}
            onChange={(e) => updateFormData('statistics_max_items', e.target.value)}
            className="bg-card border-border text-foreground"
            placeholder="100"
            min="1"
          />
        </div>

        {/* GROUP BY DOMAIN */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
          <Label
            htmlFor="group_by_domain"
            className="text-sm font-semibold text-foreground cursor-pointer"
          >
            GROUP BY DOMAIN
          </Label>
          <Switch
            id="group_by_domain"
            checked={formData.statistics_group_by_domain}
            onCheckedChange={(checked) =>
              updateFormData('statistics_group_by_domain', checked)
            }
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 dark:data-[state=unchecked]:bg-muted-foreground/50"
          />
        </div>

        {/* DOWNLOAD Button */}
        <Button
          onClick={handleDownloadStatistics}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-200 rounded-lg px-6 py-2 font-medium uppercase"
        >
          DOWNLOAD
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardSection();
      case 'general':
        return renderGeneralSection();
      case 'permissions':
        return renderPermissionsSection();
      case 'limits':
        return renderLimitsSection();
      case 'features':
        return renderFeaturesSection();
      case 'devices':
        return renderDevicesSection();
      case 'statistics':
        return renderStatisticsSection();
      default:
        return renderGeneralSection();
    }
  };

  return (
    <SideTabsLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as TabType)}
      header={
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg shadow-lg">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {domain.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Domain Configuration
              </p>
            </div>
          </div>
        </div>
      }
      actions={
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-200 rounded-lg px-6 py-2 font-medium"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      }
    >
      <TabContent activeTab={activeTab}>
        {() => renderTabContent()}
      </TabContent>

      {/* DKIM Wizard Modal */}
      <DKIMWizard
        domainId={domain.id}
        domainName={domain.name}
        isOpen={isDKIMWizardOpen}
        onClose={() => setIsDKIMWizardOpen(false)}
        onSuccess={() => {
          setIsDKIMWizardOpen(false);
          // Optionally refetch domain data or show success message
        }}
      />

      {/* DNS Validation Modal */}
      <DNSValidationModal
        domainId={domain.id}
        domainName={domain.name}
        isOpen={isDNSValidationOpen}
        onClose={() => setIsDNSValidationOpen(false)}
      />

      {/* Features Modal */}
      <FeaturesModal
        domainId={domain.id}
        domainName={domain.name}
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
        onSave={() => {
          setIsFeaturesModalOpen(false);
          // TODO: Optionally refetch domain data or show success message
        }}
      />
    </SideTabsLayout>
  );
}
