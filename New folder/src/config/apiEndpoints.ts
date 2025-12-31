/**
 * Centralized API Endpoints Configuration
 * All API endpoints are defined here in a single file for easy maintenance
 * Based on IceWarp API Documentation: https://api.stage1.k8s.icewarp.com/api-spec/
 */

export const API_ENDPOINTS = {
  // Authentication Endpoints
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    VERIFY: "/verify",
    PROFILE: "/profile",
  },

  // Domain Management Endpoints
  DOMAINS: {
    // CRUD Operations
    LIST: "/admin/domain",
    GET_BY_ID: (id: string) => `/admin/domain/${id}`,
    CREATE: "/admin/domain",
    UPDATE: (id: string) => `/admin/domain/${id}`,
    DELETE: (id: string) => `/admin/domain/${id}`,

    // Domain Migration
    MIGRATE: (id: string) => `/admin/domain/${id}/migrate`,

    // Domain Statistics
    STATS_ACCOUNTS: (id: string) => `/admin/domain/${id}/stats/accounts`,

    //DKIM
    CHECK_DKIM: (id: string) => `/admin/domain/${id}/dkim/is_setup`,
    GET_DKIM: (id: string) => `/admin/domain/${id}/dkim`,
    CREATE_DKIM: (id: string) => `/admin/domain/${id}/dkim`,
    UPDATE_DKIM: (id: string) => `/admin/domain/${id}/dkim`,
    RESET_DKIM: (id: string) => `/admin/domain/${id}/dkim/reset`,
    
    //DNS Validation
    DNS_VALIDATION: (id: string) => `/admin/domain/${id}/dns`,

    //Limits
    GET_LIMITS: (id: string) => `/admin/domain/${id}/settings/limits`,
    UPDATE_LIMITS: (id: string) => `/admin/domain/${id}/settings/limits`,

    //Features
    GET_FEATURES: (id: string) => `/admin/domain/${id}/settings/features`,
    UPDATE_FEATURES: (id: string) => `/admin/domain/${id}/settings/features`
  },

  // User Management Endpoints (for future implementation)
  USERS: {
    LIST: "/users",
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
    PREFERENCES: (id: string) => `/users/${id}/preferences`,
    CREATE:(id: string) => `/admin/domain/${id}/accounts`,
    GET_BY_DOMAIN_ID: (id: string) => `/admin/domain/${id}/accounts`,
    GET_ACCOUNT_DETAILS: (domainId: string, accountId: string) => `/admin/domain/${domainId}/accounts/${accountId}`,
    UPDATE_ACCOUNT: (domainId: string, accountId: string) => `/admin/domain/${domainId}/accounts/${accountId}`,
    DELETE: (domainId: string, accountId: string) => `/admin/domain/${domainId}/accounts/${accountId}`,
    RESET_PASSWORD: (domainId: string, accountId: string) => `/admin/domain/${domainId}/accounts/${accountId}/reset-password`,
  },

  // Group Management Endpoints (for future implementation)
  GROUPS: {
    LIST: "/groups",
    GET_BY_ID: (id: string) => `/groups/${id}`,
    CREATE: "/groups",
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
    MEMBERS: (id: string) => `/groups/${id}/members`,
    PERMISSIONS: (id: string) => `/groups/${id}/permissions`,
    GET_BY_DOMAIN_ID: (id: string) => `/admin/domain/${id}/group`,
  },

  // System Administration Endpoints (for future implementation)
  SYSTEM: {
    STATUS: "/system/status",
    HEALTH: "/system/health",
    METRICS: "/system/metrics",
    LOGS: "/system/logs",
    CONFIG: "/system/config",
  },

  // File Management Endpoints (for future implementation)
  FILES: {
    UPLOAD: "/files/upload",
    DOWNLOAD: (id: string) => `/files/${id}/download`,
    DELETE: (id: string) => `/files/${id}`,
    LIST: "/files",
  },

  // Notification Endpoints (for future implementation)
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    PREFERENCES: "/notifications/preferences",
  },

  // Settings Endpoints (for future implementation)
  SETTINGS: {
    GENERAL: "/settings/general",
    SECURITY: "/settings/security",
    EMAIL: "/settings/email",
    BACKUP: "/settings/backup",
  },
} as const;

// Type definitions for better TypeScript support
export type ApiEndpoints = typeof API_ENDPOINTS;

// Helper function to get endpoint with parameters
export const getEndpoint = (path: string, ...params: string[]): string => {
  return params.reduce((acc, param) => acc.replace(/:\w+/, param), path);
};

// Helper function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

// Helper function to get full URL with query parameters
export const getFullUrl = (
  endpoint: string,
  queryParams?: Record<string, any>
): string => {
  const queryString = queryParams ? buildQueryString(queryParams) : "";
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

export default API_ENDPOINTS;
