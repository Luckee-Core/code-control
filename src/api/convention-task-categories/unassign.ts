import { ApiResponse } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const unassignConvention = async (
  conventionId: string,
  taskCategoryId: string
): Promise<ApiResponse<void>> => {
  const response = await fetch(
    `${BASE_URL}/api/data/convention-task-categories/${conventionId}/${taskCategoryId}`,
    { method: 'DELETE' }
  );
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to unassign convention' };
  }
  
  return { success: true, data: undefined };
};
