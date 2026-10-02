export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  page?: number;
  pageSize?: number;
  total?: number;
};
