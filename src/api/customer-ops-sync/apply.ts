import { getApiBaseUrl } from '@/api/config';
import type { CustomerOpsSyncApplyPayload, CustomerOpsSyncDecision } from './types';

type ApiEnvelope<T> = { success: boolean; data?: T; error?: string };

export type ApplyCustomerOpsSyncResult =
  | { success: true; data: CustomerOpsSyncApplyPayload }
  | { success: false; error: string; httpStatus: number; data?: CustomerOpsSyncApplyPayload };

/**
 * Applies customer Ops sync decisions.
 */
export const applyCustomerOpsSync = async (
  decisions: CustomerOpsSyncDecision[],
): Promise<ApplyCustomerOpsSyncResult> => {
  const url = `${getApiBaseUrl()}/api/integrations/customer-ops-sync/apply`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ decisions }),
  });
  const json = (await response.json()) as ApiEnvelope<CustomerOpsSyncApplyPayload>;

  if (!response.ok) {
    return {
      success: false,
      error: json.error ?? `HTTP ${response.status}`,
      httpStatus: response.status,
      data: json.data,
    };
  }

  if (!json.data) {
    return {
      success: false,
      error: json.error ?? 'Missing apply payload',
      httpStatus: response.status,
    };
  }

  if (!json.success) {
    return {
      success: false,
      error: json.error ?? 'One or more decisions failed',
      httpStatus: 200,
      data: json.data,
    };
  }

  return { success: true, data: json.data };
};
