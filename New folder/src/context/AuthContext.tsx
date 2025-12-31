"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiClient, { API_ENDPOINTS } from "@/lib/api";

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
  method: "plain";
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    email: string;
    isAuthenticated: boolean;
  };
  sessionDetails?: {
    sid: string;
    userCreated: boolean;
    lastActive?: string;
  };
  message?: string;
}

export interface User {
  isAuthenticated: boolean;
  email: string;
  id?: string;
  displayName?: string;
  isAdmin?: boolean;
  token?: string;
}

export interface SessionDetails {
  sid: string;
  userCreated: boolean;
  lastActive?: string;
}

// Auth Context Types
interface AuthContextType {
  user: User | null;
  sessionDetails: SessionDetails | null;
  loading: boolean;
  logoutLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
  isInitialized: boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication API functions
const authAPI = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Extract token from response data (not headers)
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const identity = response.data.identity;

      if (accessToken && typeof window !== "undefined") {
        // Store token in sessionStorage
        sessionStorage.setItem("iw_token", accessToken);
        sessionStorage.setItem("isAuthenticated", "true");

        const userData = {
          email: identity.email,
          isAuthenticated: true,
          id: identity.id,
          displayName: identity.display_name,
          isAdmin: identity.is_admin,
          token: accessToken,
        };

        sessionStorage.setItem("user", JSON.stringify(userData));

        return {
          success: true,
          token: accessToken,
          user: userData,
          sessionDetails: {
            sid: `session-${Date.now()}`,
            userCreated: true,
            lastActive: new Date().toISOString(),
          },
        };
      }

      return {
        success: false,
        message: "Login failed - no token received",
      };
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different types of errors
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        return {
          success: false,
          message:
            "Request timeout. Please check your internet connection and try again.",
        };
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message?.includes("Network Error")
      ) {
        return {
          success: false,
          message: "Network error. Please check your internet connection.",
        };
      } else if (error.response?.status === 401) {
        return {
          success: false,
          message: "Invalid credentials. Please check your email and password.",
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          message: "API endpoint not found. Please contact support.",
        };
      } else if (error.response?.status >= 500) {
        return {
          success: false,
          message: "Server error. Please try again later.",
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          message: "Access denied. Please contact your administrator.",
        };
      } else if (error.response?.status === 429) {
        return {
          success: false,
          message: "Too many login attempts. Please try again later.",
        };
      } else {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Login failed. Please try again.",
        };
      }
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      // Clear session storage only if in browser
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("iw_token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("sessionDetails");
      }

      // Optionally call logout endpoint if available
      // await apiClient.post('/logout');
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = sessionStorage.getItem("iw_token");
    const isAuth = sessionStorage.getItem("isAuthenticated");
    return !!(token && isAuth === "true");
  },

  /**
   * Get current user data
   */
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = sessionStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Get session details
   */
  getSessionDetails: (): SessionDetails | null => {
    if (typeof window === "undefined") return null;
    try {
      const sessionStr = sessionStorage.getItem("sessionDetails");
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      console.error("Error getting session details:", error);
      return null;
    }
  },
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      // Only check auth status in browser
      if (typeof window !== "undefined" && authAPI.isAuthenticated()) {
        const currentUser = authAPI.getCurrentUser();
        const currentSession = authAPI.getSessionDetails();

        if (currentUser) {
          setUser(currentUser);
          setSessionDetails(currentSession);
        }
      }
      
      setIsInitialized(true);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);

      if (response.success && response.user) {
        setUser(response.user);
        setSessionDetails(response.sessionDetails || null);

        // Store session details in sessionStorage only if in browser
        if (response.sessionDetails && typeof window !== "undefined") {
          sessionStorage.setItem(
            "sessionDetails",
            JSON.stringify(response.sessionDetails)
          );
        }

        return true;
      } else {
        setError(response.message || "Login failed");
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "An unexpected error occurred during login";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setLogoutLoading(true);

    try {
      await authAPI.logout();
      setUser(null);
      setSessionDetails(null);
      setError(null);

      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to login page
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Clear error function
  const clearError = (): void => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = authAPI.isAuthenticated() && user !== null;

  // Context value
  const contextValue: AuthContextType = {
    user,
    sessionDetails,
    loading,
    logoutLoading,
    error,
    login,
    logout,
    isAuthenticated,
    clearError,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
