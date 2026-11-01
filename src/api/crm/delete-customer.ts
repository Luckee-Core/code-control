import { getCrmProxyUrl } from '@/api/config';
import type { ApiResponse } from '@/api/types';

type ApiEnvelope = { success: boolean; error?: string; message?: string };

const readResponseEnvelope = async (
  response: Response,
): Promise<{ envelope?: ApiEnvelope; raw: string }> => {
  const raw = await response.text();
  if (!raw.trim()) {
    return { raw: '' };
  }
  try {
    return { envelope: JSON.parse(raw) as ApiEnvelope, raw };
  } catch {
    return { raw };
  }
};

/**
 * Deletes a customer in My Ops CRM via the Code Control CRM proxy.
 */
export const deleteCustomer = async (customerId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(getCrmProxyUrl(`/customers/${customerId}`), {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    const { envelope, raw } = await readResponseEnvelope(response);

    if (!response.ok || !envelope?.success) {
      const message =
        envelope?.error ??
        envelope?.message ??
        (raw.trim() ? raw.trim() : `HTTP ${response.status}`);
      return { success: false, error: message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
