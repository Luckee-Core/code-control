import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { StepTaskCategory } from '@/model';


export type AssignCategoryInput = {
  build_step_id: string;
  task_category_id: string;
};

export const assignCategory = async (
  input: AssignCategoryInput
): Promise<ApiResponse<StepTaskCategory>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/step-task-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to assign category' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
