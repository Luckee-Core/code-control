import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';


export const deleteTaskCategory = async (id: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/task-categories/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to delete task category' };
  }
  
  return { success: true, data: undefined };
};
