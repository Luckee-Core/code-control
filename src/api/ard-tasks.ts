import { ApiResponse } from './types';
import { ARDTask } from '../model';

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const getAllARDTasks = async (
  apiBaseUrl?: string
): Promise<ApiResponse<ARDTask[]>> => {
  const baseUrl = apiBaseUrl || BASE_URL;
  
  console.log('🌐 API: Fetching all ARD tasks from:', `${baseUrl}/api/data/ard-tasks`);
  
  const response = await fetch(`${baseUrl}/api/data/ard-tasks`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  console.log('🌐 API: Response status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error('🌐 API: Error response:', error);
    return { success: false, error: error.message || 'Failed to fetch ARD tasks' };
  }

  const result = await response.json();
  console.log('🌐 API: Result:', result);
  console.log('🌐 API: Result.data:', result.data);
  return { success: true, data: result.data };
};

export const getARDTasksByStackType = async (
  stackType: 'express' | 'nextjs' | 'react-native'
): Promise<ApiResponse<ARDTask[]>> => {
  const response = await fetch(`${BASE_URL}/api/data/ard-tasks/stack/${stackType}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to fetch ARD tasks' };
  }

  const data = await response.json();
  return { success: true, data };
};
