import { ApiResponse } from '../types';
import { StepTaskCategory } from '@/model';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const getAllStepTaskCategories = async (): Promise<ApiResponse<StepTaskCategory[]>> => {
  const response = await fetch(`${BASE_URL}/api/data/step-task-categories`);
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch step task categories' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
