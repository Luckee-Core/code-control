import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { ConventionTaskCategory } from '@/model';


export const getAllConventionTaskCategories = async (): Promise<ApiResponse<ConventionTaskCategory[]>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/convention-task-categories`);
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch convention task categories' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
