import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/constants';
import type { ApiErrorResponse } from '@/types/release.types';

/**
 * Pre-configured Axios instance for API communication.
 * Centralizes request/response interceptors and error handling.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ─── Request Interceptor ─── */
apiClient.interceptors.request.use(
  (config) => {
    /* Future: Add auth tokens here if needed */
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/* ─── Response Interceptor ─── */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.error || error.message || 'An unexpected error occurred';

    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}: ${message}`);

    return Promise.reject(error);
  },
);

export { apiClient };

/**
 * Extracts a user-friendly error message from an Axios error.
 * @param error - The caught error
 * @returns Human-readable error message
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.error || axiosError.message || 'Network error';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
