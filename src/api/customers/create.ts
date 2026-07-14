import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { Customer, CustomerStage } from '@/model/customer';

export type CreateCustomerInput = {
  name: string;
  description?: string | null;
  stage?: CustomerStage;
};

/**
 * Creates a customer via Express POST /api/data/customers.
 */
export const createCustomer = async (
  input: CreateCustomerInput,
  apiBaseUrl?: string
): Promise<ApiResponse<Customer>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const url = `${baseUrl}/api/data/customers`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
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
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
