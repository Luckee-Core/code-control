import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { StepTaskCategory } from '@/model';


export const getAllStepTaskCategories = async (): Promise<ApiResponse<StepTaskCategory[]>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/step-task-categories`);
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch step task categories' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
