import { getApiBaseUrl } from '@/api/config';
import type { CustomerOpsSyncComparePayload } from './types';

type ApiEnvelope<T> = { success: boolean; data?: T; error?: string };

/**
 * Loads compare payload for customer Ops sync.
 */
export const fetchCustomerOpsSyncCompare = async (): Promise<
  { success: true; data: CustomerOpsSyncComparePayload } | { success: false; error: string; httpStatus: number }
> => {
  const url = `${getApiBaseUrl()}/api/integrations/customer-ops-sync/compare`;
  const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
  const json = (await response.json()) as ApiEnvelope<CustomerOpsSyncComparePayload>;
  if (!response.ok || !json.success || !json.data) {
    return {
      success: false,
      error: json.error ?? `HTTP ${response.status}`,
      httpStatus: response.status,
    };
  }
  return { success: true, data: json.data };
};
