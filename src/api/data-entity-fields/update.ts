import { ApiResponse } from '../types';
import type { DataEntityField } from '@/model/data-entity';

export type UpdateDataEntityFieldInput = {
  name?: string;
  type?: string;
  nullable?: boolean;
  default_value?: string | null;
  sort_order?: number;
  references_entity_id?: string | null;
};

export const updateDataEntityField = async (
  id: string,
  input: UpdateDataEntityFieldInput,
  apiBaseUrl?: string
): Promise<ApiResponse<DataEntityField>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const response = await fetch(`${baseUrl}/api/data/data-entity-fields/${id}`, {
      method: 'PATCH',
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
    console.error('Error updating data entity field:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
