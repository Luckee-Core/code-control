import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { TaskCategory } from '@/model';


export const getTaskCategoryById = async (id: string): Promise<ApiResponse<TaskCategory>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/task-categories/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch task category' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
