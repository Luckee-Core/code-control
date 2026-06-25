import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';


export const unassignCategory = async (
  buildStepId: string,
  taskCategoryId: string
): Promise<ApiResponse<void>> => {
  const response = await fetch(
    `${getApiBaseUrl()}/api/data/step-task-categories/${buildStepId}/${taskCategoryId}`,
    { method: 'DELETE' }
  );
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to unassign category' };
  }
  
  return { success: true, data: undefined };
};
