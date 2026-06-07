import { ApiResponse } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const deleteTaskCategory = async (id: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`${BASE_URL}/api/data/task-categories/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to delete task category' };
  }
  
  return { success: true, data: undefined };
};
