import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { ConventionTaskCategory } from '@/model';


export type AssignConventionInput = {
  convention_id: string;
  task_category_id: string;
  relevance_score?: number;
  is_required?: boolean;
};

export const assignConvention = async (
  input: AssignConventionInput
): Promise<ApiResponse<ConventionTaskCategory>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/convention-task-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to assign convention' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
