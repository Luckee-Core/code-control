import { ApiResponse } from '../types';
import type { Customer } from '@/model/customer';

/**
 * Fetch a single customer by ID.
 */
export const getCustomerById = async (
  id: string,
  apiBaseUrl?: string
): Promise<ApiResponse<Customer>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

  try {
    const url = `${baseUrl}/api/data/customers/${id}`;
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
    console.error('Error fetching customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
