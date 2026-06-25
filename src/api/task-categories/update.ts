import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { TaskCategory } from '@/model';


export type UpdateTaskCategoryInput = {
  name?: string;
  description?: string;
  repo_type?: 'express' | 'nextjs' | 'react-native' | null;
  sort_order?: number;
  is_active?: boolean;
};

export const updateTaskCategory = async (
  id: string,
  input: UpdateTaskCategoryInput
): Promise<ApiResponse<TaskCategory>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/task-categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to update task category' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
