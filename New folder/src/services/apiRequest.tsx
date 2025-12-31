import apiClient from "../lib/api";
import { AxiosResponse, AxiosError } from "axios";
import { debugAuthState } from "../lib/utils";

// Utility function to debug token and headers
const debugTokenAndHeaders = (url: string, method: string) => {
  debugAuthState();
};

// Generic API response type
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Generic error response type
export interface ApiError {
  code?: string;
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Custom GET request function
 * @param url - The endpoint URL
 * @param params - Query parameters (optional)
 * @param options - Additional axios options (optional)
 * @returns Promise with API response
 */
export const apiGet = async <T = any,>(
  url: string,
  params?: Record<string, any>,
  options?: any
): Promise<ApiResponse<T>> => {
  try {
    debugTokenAndHeaders(url, "GET");

    const response: AxiosResponse<T> = await apiClient.get(url, { 
      params,
      ...options 
    });
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as any;
    throw {
      code: errorData?.code,
      message: errorData?.message || axiosError.message || "GET request failed",
      status: axiosError.response?.status || 500,
      errors: errorData?.errors,
    } as ApiError;
  }
};

/**
 * Custom POST request function
 * @param url - The endpoint URL
 * @param data - Request body data
 * @param options - Additional axios options (optional)
 * @returns Promise with API response
 */
export const apiPost = async <T = any,>(
  url: string,
  data?: any,
  options?: any
): Promise<ApiResponse<T>> => {
  try {
    debugTokenAndHeaders(url, "POST");

    const response: AxiosResponse<T> = await apiClient.post(url, data, options);
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as any;
    throw {
      code: errorData?.code,
      message:
        errorData?.message || axiosError.message || "POST request failed",
      status: axiosError.response?.status || 500,
      errors: errorData?.errors,
    } as ApiError;
  }
};

/**
 * Custom PUT request function
 * @param url - The endpoint URL
 * @param data - Request body data
 * @returns Promise with API response
 */
export const apiPut = async <T = any,>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    debugTokenAndHeaders(url, "PUT");

    const response: AxiosResponse<T> = await apiClient.put(url, data);
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as any;
    throw {
      code: errorData?.code,
      message: errorData?.message || axiosError.message || "PUT request failed",
      status: axiosError.response?.status || 500,
      errors: errorData?.errors,
    } as ApiError;
  }
};

/**
 * Custom PATCH request function
 * @param url - The endpoint URL
 * @param data - Request body data
 * @returns Promise with API response
 */
export const apiPatch = async <T = any,>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    debugTokenAndHeaders(url, "PATCH");

    const response: AxiosResponse<T> = await apiClient.patch(url, data);
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as any;
    throw {
      code: errorData?.code,
      message: errorData?.message || axiosError.message || "PATCH request failed",
      status: axiosError.response?.status || 500,
      errors: errorData?.errors,
    } as ApiError;
  }
};

/**
 * Custom DELETE request function
 * @param url - The endpoint URL
 * @param params - Query parameters (optional)
 * @returns Promise with API response
 */
export const apiDelete = async <T = any,>(
  url: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    debugTokenAndHeaders(url, "DELETE");

    const response: AxiosResponse<T> = await apiClient.delete(url, { params });
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as any;
    throw {
      code: errorData?.code,
      message:
        errorData?.message || axiosError.message || "DELETE request failed",
      status: axiosError.response?.status || 500,
      errors: errorData?.errors,
    } as ApiError;
  }
};

// Export all functions as default object for convenience
export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
};
