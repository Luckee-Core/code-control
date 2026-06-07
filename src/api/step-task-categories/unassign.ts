import { ApiResponse } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const unassignCategory = async (
  buildStepId: string,
  taskCategoryId: string
): Promise<ApiResponse<void>> => {
  const response = await fetch(
    `${BASE_URL}/api/data/step-task-categories/${buildStepId}/${taskCategoryId}`,
    { method: 'DELETE' }
  );
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to unassign category' };
  }
  
  return { success: true, data: undefined };
};
