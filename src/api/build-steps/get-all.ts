import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { BuildStep } from '@/model';


export const getAllBuildSteps = async (): Promise<ApiResponse<BuildStep[]>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/build-steps`);
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch build steps' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
