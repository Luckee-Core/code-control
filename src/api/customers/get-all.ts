import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { Customer } from '@/model/customer';

export type GetAllCustomersParams = {
  stage?: string;
};

export const getAllCustomers = async (
  apiBaseUrl?: string,
  params?: GetAllCustomersParams
): Promise<ApiResponse<Customer[]>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();

  try {
    const searchParams = new URLSearchParams();
    if (params?.stage) searchParams.append('stage', params.stage);

    const queryString = searchParams.toString();
    const url = `${baseUrl}/api/data/customers${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
