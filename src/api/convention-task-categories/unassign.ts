import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';


export const unassignConvention = async (
  conventionId: string,
  taskCategoryId: string
): Promise<ApiResponse<void>> => {
  const response = await fetch(
    `${getApiBaseUrl()}/api/data/convention-task-categories/${conventionId}/${taskCategoryId}`,
    { method: 'DELETE' }
  );
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to unassign convention' };
  }
  
  return { success: true, data: undefined };
};
