/**
 * API Types
 * Shared types for API responses
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page?: number;
  pageSize?: number;
  total?: number;
}
