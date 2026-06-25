import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { DataEntityField } from '@/model/data-entity';

export type CreateDataEntityFieldInput = {
  entity_id: string;
  name: string;
  type: string;
  nullable?: boolean;
  default_value?: string | null;
  sort_order?: number;
  references_entity_id?: string | null;
};

export const createDataEntityField = async (
  input: CreateDataEntityFieldInput,
  apiBaseUrl?: string
): Promise<ApiResponse<DataEntityField>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/data-entity-fields`, {
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
    console.error('Error creating data entity field:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
