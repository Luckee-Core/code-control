import { ApiResponse } from '../types';
import { TaskCategory } from '@/model';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const getTaskCategoryById = async (id: string): Promise<ApiResponse<TaskCategory>> => {
  const response = await fetch(`${BASE_URL}/api/data/task-categories/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch task category' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
