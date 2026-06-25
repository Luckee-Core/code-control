import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { TaskCategory } from '@/model';


export type CreateTaskCategoryInput = {
  name: string;
  description?: string;
  repo_type?: 'express' | 'nextjs' | 'react-native' | null;
  sort_order?: number;
  is_active?: boolean;
};

export const createTaskCategory = async (
  input: CreateTaskCategoryInput
): Promise<ApiResponse<TaskCategory>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/task-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to create task category' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
