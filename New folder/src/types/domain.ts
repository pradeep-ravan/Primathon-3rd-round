// Domain-related TypeScript interfaces based on IceWarp API

export interface Domain {
  id: string;
  name: string;
  description?: string;
  domain_type: "STANDARD" | "ETRN_ATRN" | "ALIAS" | "BACKUP" | "DISTRIBUTED";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  created_at: string;
  updated_at: string;
  account_count: number;
  groups_with_public_folder: number;
  groups_with_teamchat: number;
  groups_with_gal: number;
  has_certificate: boolean;
  dkim_setup: boolean;
  saas_plan_restricted: boolean;
  administrator_email?: string;
  verification_status: "PENDING" | "VERIFIED" | "FAILED";
  verify_type?: "DEFAULT" | "ISSUE_RCPT" | "ISSUE_VRFY" | "MINGER";
  ssl_certificate?: SSLCertificate;
  dkim_config?: DKIMConfig;
  domain_limits?: DomainLimits;
  user_limits?: UserLimits;
  features?: DomainFeatures;
  aliases?: string[];
}

export interface SSLCertificate {
  id: string;
  domain_id: string;
  certificate_type: "SELF_SIGNED" | "LETS_ENCRYPT" | "CUSTOM";
  status: "ACTIVE" | "EXPIRED" | "PENDING" | "FAILED";
  expires_at?: string;
  issuer?: string;
  fingerprint?: string;
  created_at: string;
}

export interface DKIMConfig {
  id: string;
  domain_id: string;
  selector: string;
  public_key: string;
  private_key: string;
  status: "ACTIVE" | "PENDING" | "FAILED";
  created_at: string;
  updated_at: string;
}

export interface DKIMCreationResponse {
  active: boolean;
  hostname: string;
  selector_record: string;
}

export interface DKIMSetupCheck {
  setup: boolean;
}

export interface DKIMGetResponse {
  active: boolean;
  selector: string;
  hostname: string;
  selector_record: string;
}

export interface DomainLimits {
  domain_admin_limit?: number;
  disk_quota_enabled: boolean;
  disk_quota?: number;
  disk_quota_unit: "kB" | "MB" | "GB";
  daily_send_limit_enabled: boolean;
  daily_send_limit?: number;
  disable_login: boolean;
  expires_on?: string;
  notify_before_expiration: boolean;
  delete_domain_when_expired: boolean;
}

export interface UserLimits {
  account_size?: number;
  account_size_unit: "kB" | "MB" | "GB";
  max_message_size?: number;
  max_message_size_unit: "kB" | "MB" | "GB";
  default_daily_send_limit: boolean;
  delete_spam_older_than: boolean;
  spam_retention_days?: number;
}

export interface DomainFeatures {
  two_factor_auth: boolean;
  instant_messaging: boolean;
  shared_roster: boolean;
  public_folders: boolean;
  team_chat: boolean;
  global_address_list: boolean;
  mobile_sync: boolean;
  outlook_sync: boolean;
  webmail: boolean;
  calendar: boolean;
  contacts: boolean;
  tasks: boolean;
  notes: boolean;
  files_documents?: boolean;
  quarantine?: boolean;
  marketplace?: boolean;
}

export type DomainType = "STANDARD" | "ETRN_ATRN" | "ALIAS" | "BACKUP" | "DISTRIBUTED";
export type DomainStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type VerificationStatus = "PENDING" | "VERIFIED" | "FAILED";

// API Response types
export interface DomainsResponse {
  page: number;
  limit: number;
  total_count: number;
  items: Domain[];
}

export interface DomainResponse {
  data: Domain;
  message?: string;
  status: number;
  success: boolean;
}

// Domain creation/update types
export interface CreateDomainRequest {
  name: string;
  description?: string;
  domain_type?: DomainType;
  administrator_email?: string;
  aliases?: string[];
  domain_limits?: Partial<DomainLimits>;
  user_limits?: Partial<UserLimits>;
  features?: Partial<DomainFeatures>;
}

export interface UpdateDomainRequest {
  name?: string;
  description?: string;
  domain_type?: DomainType;
  administrator_email?: string;
  aliases?: string[];
  domain_limits?: Partial<DomainLimits>;
  user_limits?: Partial<UserLimits>;
  features?: Partial<DomainFeatures>;
}

export interface DomainConfigurationRequest {
  domain_limits?: Partial<DomainLimits>;
  user_limits?: Partial<UserLimits>;
  features?: Partial<DomainFeatures>;
  aliases?: string[];
}

// Query parameters for domain listing
export interface DomainQueryParams {
  page?: number;
  limit?: number;
  search_query?: string;
  sort?: string; // Format: "field:direction" e.g., "name:asc", "name:desc"
  domain_type?: DomainType;
  status?: DomainStatus;
  has_certificate?: boolean;
  dkim_setup?: boolean;
}

// Domain statistics
export interface DomainStatistics {
  total_domains: number;
  active_domains: number;
  inactive_domains: number;
  suspended_domains: number;
  domains_with_ssl: number;
  domains_with_dkim: number;
  total_accounts: number;
  total_groups: number;
}

// Domain accounts stats (dashboard)
export interface DomainAccountStatsSummary {
  total_received_messages: number;
  total_received_amount: number;
  total_sent_messages: number;
  total_sent_amount: number;
  total_sent_out_messages: number;
  total_sent_out_amount: number;
  total_files_count: number;
  total_files_amount: number;
  total_storage_used: number;
  storage_quota_used_percent: number;
  last_activity?: {
    last_sent?: string;
    last_received?: string;
    last_login?: string;
  };
}

export interface DomainAccountStat {
  alias: string;
  received_messages: number;
  received_amount: number;
  sent_messages: number;
  sent_amount: number;
  sent_out_messages: number;
  sent_out_amount: number;
  last_sent?: string;
  last_received?: string;
  last_login?: string;
  files_count: number;
  files_amount: number;
  created?: string;
  last_ip?: string;
  mailbox_quota_percent?: number;
}

export interface DomainAccountsStatsResponse {
  domain: string;
  summary: DomainAccountStatsSummary;
  accounts: DomainAccountStat[];
}

// Domain validation
export interface DomainValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// DNS Record for validation
export interface DNSRecord {
  type: string;
  name: string;
  value?: string;
  status: 'valid' | 'missing' | 'invalid';
  message?: string;
}

// DNS Validation Response
export interface DNSValidationResponse {
  records: DNSRecord[];
}
