import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';


export const deleteBuildStep = async (id: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`${getApiBaseUrl()}/api/data/build-steps/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message || 'Failed to delete build step' };
  }
  
  return { success: true, data: undefined };
};
