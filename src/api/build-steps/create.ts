import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import { BuildStep } from '@/model';


export type CreateBuildStepInput = {
  name: string;
  description?: string;
  repo_type: 'express' | 'nextjs' | 'react-native';
  sort_order?: number;
  is_active?: boolean;
};

export const createBuildStep = async (
  input: CreateBuildStepInput
): Promise<ApiResponse<BuildStep>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/build-steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to create build step' };
  }
  
  const data = await response.json();
  return { success: true, data: data.data };
};
