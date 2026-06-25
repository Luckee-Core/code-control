import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { ConventionTaskCategory } from '@/model';


export type UpdateRelevanceInput = {
  relevance_score?: number;
  is_required?: boolean;
};

export const updateRelevance = async (
  conventionId: string,
  taskCategoryId: string,
  input: UpdateRelevanceInput
): Promise<ApiResponse<ConventionTaskCategory>> => {
  const response = await fetch(
    `${getApiBaseUrl()}/api/data/convention-task-categories/${conventionId}/${taskCategoryId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to update relevance' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
