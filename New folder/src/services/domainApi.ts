import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./apiRequest";
import { API_ENDPOINTS } from "@/config/apiEndpoints";
import {
  Domain,
  DomainsResponse,
  DomainResponse,
  CreateDomainRequest,
  UpdateDomainRequest,
  DomainConfigurationRequest,
  DomainQueryParams,
  DomainStatistics,
  DomainValidation,
  SSLCertificate,
  DKIMConfig,
  DKIMCreationResponse,
  DKIMSetupCheck,
  DKIMGetResponse,
  DNSValidationResponse,
  DomainAccountsStatsResponse,
  DomainLimits,
  UserLimits,
} from "@/types/domain";

/**
 * Domain Management API Service
 * Based on IceWarp API Documentation: https://api.stage1.k8s.icewarp.com/api-spec/#/domain
 */

// Domain CRUD Operations
export const domainApi = {
  // Get all domains with pagination and filtering
  getDomains: async (
    params: DomainQueryParams = {}
  ): Promise<DomainsResponse> => {
    const response = await apiGet<any>(
      API_ENDPOINTS.DOMAINS.LIST,
      params
    );
    
    // Transform the API response to map domain.type to domain_type
    const transformedItems = (response.data.items || []).map((item: any) => ({
      ...item,
      domain_type: item.domain?.type || item.domain_type || 'STANDARD',
    }));
    
    return {
      ...response.data,
      items: transformedItems,
    };
  },

  // Get a single domain by ID
  getDomain: async (id: string): Promise<Domain> => {
    const response = await apiGet<Domain | DomainResponse | any>(
      API_ENDPOINTS.DOMAINS.GET_BY_ID(id)
    );
    
    let domainData: any;
    
    // Handle both direct Domain response and wrapped DomainResponse
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'status' in response.data) {
      // Wrapped format: { data: Domain, status: number, success: boolean }
      domainData = (response.data as DomainResponse).data;
    } else {
      // Direct format: Domain object or raw API response
      domainData = response.data;
    }
    
    // Map API response fields to Domain interface
    const domain: Domain = {
      id: domainData.id || id,
      name: domainData.name || '',
      description: domainData.description || '',
      domain_type: domainData.domain?.type || domainData.domain_type || 'STANDARD',
      status: domainData.status || 'ACTIVE', // Default to ACTIVE if not provided
      created_at: domainData.created_at || new Date().toISOString(),
      updated_at: domainData.updated_at || new Date().toISOString(),
      account_count: domainData.account_count || 0,
      groups_with_public_folder: domainData.groups_with_public_folder || 0,
      groups_with_teamchat: domainData.groups_with_teamchat || 0,
      groups_with_gal: domainData.groups_with_gal || 0,
      has_certificate: domainData.certificate !== null && domainData.certificate !== undefined,
      dkim_setup: domainData.dkim_setup || false,
      saas_plan_restricted: domainData.saas_plan_restricted || false,
      administrator_email: domainData.admin_email || domainData.administrator_email,
      verification_status: domainData.verification_status || 'PENDING',
      verify_type: domainData.verify_type || 'DEFAULT',
      ssl_certificate: domainData.ssl_certificate,
      dkim_config: domainData.dkim_config,
      domain_limits: domainData.domain_limits,
      user_limits: domainData.user_limits,
      features: domainData.features,
      aliases: domainData.alias_list || domainData.aliases || [],
      // Include any additional fields from API response
      ...domainData,
    };
    
    return domain;
  },

  // Create a new domain
  createDomain: async (data: CreateDomainRequest): Promise<Domain> => {
    const response = await apiPost<Domain | DomainResponse>(
      API_ENDPOINTS.DOMAINS.CREATE,
      data
    );
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'status' in response.data) {
      // Wrapped format: { data: Domain, status: number, success: boolean }
      return (response.data as DomainResponse).data;
    }
    // Direct format: Domain object
    return response.data as Domain;
  },

  // Update a domain
  updateDomain: async (
    id: string,
    data: UpdateDomainRequest
  ): Promise<Domain> => {
    // Transform domain_type to nested domain structure if present
    const payload: any = { ...data };
    if (payload.domain_type !== undefined) {
      // API expects nested structure: { domain: { type: "STANDARD", value: "string" } }
      payload.domain = {
        type: payload.domain_type,
        value: payload.domain_type, // Use the domain type as the value, or any string as per API requirement
      };
      // Remove domain_type from payload as API doesn't accept it
      delete payload.domain_type;
    }
    
    const response = await apiPut<DomainResponse>(
      API_ENDPOINTS.DOMAINS.UPDATE(id),
      payload
    );
    return response.data.data;
  },

  // Update a domain with PATCH (only send changed fields)
  patchDomain: async (
    id: string,
    data: Partial<UpdateDomainRequest>
  ): Promise<Domain> => {
    // Transform domain_type to nested domain structure if present
    const payload: any = { ...data };
    if (payload.domain_type !== undefined) {
      // API expects nested structure: { domain: { type: "STANDARD", value: "string" } }
      payload.domain = {
        type: payload.domain_type,
        value: payload.domain_type, // Use the domain type as the value, or any string as per API requirement
      };
      // Remove domain_type from payload as API doesn't accept it
      delete payload.domain_type;
    }
    
    const response = await apiPatch<Domain | DomainResponse>(
      API_ENDPOINTS.DOMAINS.UPDATE(id),
      payload
    );
    // Handle both direct Domain response and wrapped DomainResponse
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'status' in response.data) {
      return (response.data as DomainResponse).data;
    }
    return response.data as Domain;
  },

  // Delete a domain
  deleteDomain: async (id: string): Promise<void> => {
    await apiDelete(API_ENDPOINTS.DOMAINS.DELETE(id));
  },

  // Domain Configuration Operations
  updateDomainConfiguration: async (
    id: string,
    config: DomainConfigurationRequest
  ): Promise<Domain> => {
    const response = await apiPut<DomainResponse>(
      API_ENDPOINTS.DOMAINS.CONFIGURATION(id),
      config
    );
    return response.data.data;
  },

  // Domain Limits Operations
  getDomainLimits: async (id: string): Promise<any> => {
    const response = await apiGet<any>(
      API_ENDPOINTS.DOMAINS.GET_LIMITS(id)
    );
    // Handle both direct response and wrapped response
    // API returns flat structure with string values
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  updateDomainLimits: async (id: string, limits: any): Promise<any> => {
    // API expects POST request with flat structure matching GET response format
    const response = await apiPost<any>(
      API_ENDPOINTS.DOMAINS.UPDATE_LIMITS(id),
      limits
    );
    // Handle both direct response and wrapped response
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Domain Features Operations
  getDomainFeatures: async (id: string): Promise<any> => {
    const response = await apiGet<any>(
      API_ENDPOINTS.DOMAINS.GET_FEATURES(id)
    );
    // Handle both direct response and wrapped response
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  updateDomainFeatures: async (id: string, features: any): Promise<any> => {
    // API expects POST request
    const response = await apiPost<any>(
      API_ENDPOINTS.DOMAINS.UPDATE_FEATURES(id),
      features
    );
    // Handle both direct response and wrapped response
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },

  // Domain Aliases Operations
  addDomainAlias: async (id: string, alias: string): Promise<Domain> => {
    const response = await apiPost<DomainResponse>(
      API_ENDPOINTS.DOMAINS.ALIASES(id),
      {
        alias,
      }
    );
    return response.data.data;
  },

  removeDomainAlias: async (id: string, alias: string): Promise<Domain> => {
    const response = await apiDelete(
      API_ENDPOINTS.DOMAINS.ALIAS_DELETE(id, alias)
    );
    return response.data.data;
  },

  // SSL Certificate Operations
  getSSLCertificate: async (id: string): Promise<SSLCertificate> => {
    const response = await apiGet<SSLCertificate>(
      API_ENDPOINTS.DOMAINS.SSL(id)
    );
    return response.data;
  },

  generateSSLCertificate: async (
    id: string,
    type: "SELF_SIGNED" | "LETS_ENCRYPT" = "LETS_ENCRYPT"
  ): Promise<SSLCertificate> => {
    const response = await apiPost<SSLCertificate>(
      API_ENDPOINTS.DOMAINS.SSL(id),
      {
        type,
      }
    );
    return response.data;
  },

  uploadSSLCertificate: async (
    id: string,
    certificate: string,
    privateKey: string
  ): Promise<SSLCertificate> => {
    const response = await apiPost<SSLCertificate>(
      API_ENDPOINTS.DOMAINS.SSL_UPLOAD(id),
      {
        certificate,
        private_key: privateKey,
      }
    );
    return response.data;
  },

  // DKIM Operations
  checkDKIMSetup: async (id: string): Promise<DKIMSetupCheck> => {
    const response = await apiGet<DKIMSetupCheck>(API_ENDPOINTS.DOMAINS.CHECK_DKIM(id));
    return response.data;
  },

  getDKIM: async (id: string): Promise<DKIMGetResponse> => {
    const response = await apiGet<DKIMGetResponse>(API_ENDPOINTS.DOMAINS.GET_DKIM(id));
    return response.data;
  },

  getDKIMConfig: async (id: string): Promise<DKIMConfig> => {
    const response = await apiGet<DKIMConfig>(API_ENDPOINTS.DOMAINS.GET_DKIM(id));
    return response.data;
  },

  generateDKIMKeys: async (
    id: string,
    selector: string = "default"
  ): Promise<DKIMCreationResponse> => {
    const response = await apiPost<DKIMCreationResponse>(
      API_ENDPOINTS.DOMAINS.CREATE_DKIM(id),
      {
        selector,
        key_size: 2048,
      }
    );
    return response.data;
  },

  updateDKIMConfig: async (
    id: string,
    config: Partial<DKIMConfig>
  ): Promise<DKIMConfig> => {
    const response = await apiPut<DKIMConfig>(
      API_ENDPOINTS.DOMAINS.GET_DKIM(id),
      config
    );
    return response.data;
  },

  updateDKIMActive: async (
    id: string,
    active: boolean
  ): Promise<DKIMGetResponse> => {
    const response = await apiPatch<DKIMGetResponse>(
      API_ENDPOINTS.DOMAINS.UPDATE_DKIM(id),
      { active }
    );
    return response.data;
  },

  resetDKIM: async (id: string): Promise<void> => {
    await apiPost<void>(
      API_ENDPOINTS.DOMAINS.RESET_DKIM(id),
      {}
    );
  },

  // Domain Validation
  validateDomain: async (domainName: string): Promise<DomainValidation> => {
    const response = await apiPost<DomainValidation>(
      API_ENDPOINTS.DOMAINS.VALIDATE,
      {
        domain: domainName,
      }
    );
    return response.data;
  },

  // DNS Validation
  getDNSValidation: async (id: string): Promise<DNSValidationResponse> => {
    const response = await apiGet<DNSValidationResponse>(
      API_ENDPOINTS.DOMAINS.DNS_VALIDATION(id)
    );
    return response.data;
  },

  // Domain name validation helper
  isValidDomainName: (domainName: string): boolean => {
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domainName) && domainName.length <= 253;
  },

  // Domain Statistics
  getDomainStatistics: async (): Promise<DomainStatistics> => {
    const response = await apiGet<DomainStatistics>(
      API_ENDPOINTS.DOMAINS.STATISTICS
    );
    return response.data;
  },

  // Domain dashboard accounts statistics
  getDomainAccountsStats: async (
    id: string
  ): Promise<DomainAccountsStatsResponse> => {
    const response = await apiGet<DomainAccountsStatsResponse>(
      API_ENDPOINTS.DOMAINS.STATS_ACCOUNTS(id)
    );
    return response.data as DomainAccountsStatsResponse;
  },

  // Domain Status Operations
  activateDomain: async (id: string): Promise<Domain> => {
    const response = await apiPost<DomainResponse>(
      API_ENDPOINTS.DOMAINS.ACTIVATE(id)
    );
    return response.data.data;
  },

  deactivateDomain: async (id: string): Promise<Domain> => {
    const response = await apiPost<DomainResponse>(
      API_ENDPOINTS.DOMAINS.DEACTIVATE(id)
    );
    return response.data.data;
  },

  suspendDomain: async (id: string, reason?: string): Promise<Domain> => {
    const response = await apiPost<DomainResponse>(
      API_ENDPOINTS.DOMAINS.SUSPEND(id),
      {
        reason,
      }
    );
    return response.data.data;
  },

  // Bulk domain operations
  bulkActivateDomains: async (ids: string[]): Promise<Domain[]> => {
    const promises = ids.map((id) => domainApi.activateDomain(id));
    return Promise.all(promises);
  },

  bulkDeactivateDomains: async (ids: string[]): Promise<Domain[]> => {
    const promises = ids.map((id) => domainApi.deactivateDomain(id));
    return Promise.all(promises);
  },

  bulkDeleteDomains: async (ids: string[]): Promise<void> => {
    const promises = ids.map((id) => domainApi.deleteDomain(id));
    await Promise.all(promises);
  },

  // Domain Backup/Restore
  backupDomain: async (
    id: string
  ): Promise<{ backup_id: string; download_url: string }> => {
    const response = await apiPost<{ backup_id: string; download_url: string }>(
      API_ENDPOINTS.DOMAINS.BACKUP(id)
    );
    return response.data;
  },

  restoreDomain: async (id: string, backupId: string): Promise<Domain> => {
    const response = await apiPost<DomainResponse>(
      API_ENDPOINTS.DOMAINS.RESTORE(id),
      {
        backup_id: backupId,
      }
    );
    return response.data.data;
  },

  // Domain Migration
  migrateDomain: async (
    id: string,
    targetServer: string
  ): Promise<{ migration_id: string; status: string }> => {
    const response = await apiPost<{ migration_id: string; status: string }>(
      API_ENDPOINTS.DOMAINS.MIGRATE(id),
      {
        target_server: targetServer,
      }
    );
    return response.data;
  },

  // Export domains
  exportDomains: async (format: "csv" | "excel" = "csv"): Promise<Blob> => {
    const response = await apiGet<Blob>(
      `${API_ENDPOINTS.DOMAINS.LIST}/export?format=${format}`,
      {},
      { responseType: "blob" }
    );
    return response.data;
  },

  // Import domains
  importDomains: async (
    file: File
  ): Promise<{ imported: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiPost<{
      imported: number;
      failed: number;
      errors: string[];
    }>(`${API_ENDPOINTS.DOMAINS.LIST}/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Domain Monitoring
  getDomainHealth: async (
    id: string
  ): Promise<{
    status: "HEALTHY" | "WARNING" | "CRITICAL";
    checks: Array<{
      name: string;
      status: "PASS" | "FAIL" | "WARNING";
      message: string;
      last_checked: string;
    }>;
  }> => {
    const response = await apiGet<{
      status: "HEALTHY" | "WARNING" | "CRITICAL";
      checks: Array<{
        name: string;
        status: "PASS" | "FAIL" | "WARNING";
        message: string;
        last_checked: string;
      }>;
    }>(API_ENDPOINTS.DOMAINS.HEALTH(id));
    return response.data;
  },
};

export default domainApi;
