import { ApiResponse } from '../types';
import { BuildStep } from '@/model';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const getBuildStepById = async (id: string): Promise<ApiResponse<BuildStep>> => {
  const response = await fetch(`${BASE_URL}/api/data/build-steps/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch build step' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
