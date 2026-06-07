import { ApiResponse } from '../types';
import { TaskCategory } from '@/model';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

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
  const response = await fetch(`${BASE_URL}/api/data/task-categories`, {
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
