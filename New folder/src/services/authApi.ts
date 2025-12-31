import { apiGet, apiPost } from "./apiRequest";
import { API_ENDPOINTS } from "@/config/apiEndpoints";

/**
 * Authentication API Service
 * Centralized authentication endpoints using the API_ENDPOINTS configuration
 */

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions: string[];
  created_at: string;
  last_login: string;
  is_active: boolean;
}

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiPost<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiPost(API_ENDPOINTS.AUTH.LOGOUT);
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiPost<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    );
    return response.data;
  },

  // Verify token validity
  verifyToken: async (
    token: string
  ): Promise<{ valid: boolean; user?: UserProfile }> => {
    const response = await apiPost<{ valid: boolean; user?: UserProfile }>(
      API_ENDPOINTS.AUTH.VERIFY,
      { token }
    );
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiGet<UserProfile>(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
};

export default authApi;
