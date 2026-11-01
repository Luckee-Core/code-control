import { getCrmProxyUrl } from '@/api/config';
import type { Customer } from '@/model/customer';

type ApiEnvelope<T> = { success: boolean; data?: T; error?: string };

/**
 * Lists customers via CRM proxy (My Ops storage).
 */
export const listCustomers = async (): Promise<
  { success: true; data: Customer[] } | { success: false; error: string; httpStatus: number }
> => {
  const response = await fetch(getCrmProxyUrl('/customers'), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const json = (await response.json()) as ApiEnvelope<Customer[]>;
  if (!response.ok || !json.success) {
    return {
      success: false,
      error: json.error ?? `HTTP ${response.status}`,
      httpStatus: response.status,
    };
  }
  return { success: true, data: json.data ?? [] };
};
