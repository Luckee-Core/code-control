import { ApiResponse } from '../types';
import type { BuildExample } from '@/model/build-example';

export type CreateBuildExampleInput = {
  name: string;
  tags: string[];
  language: string;
  code: string;
};

export const createBuildExample = async (
  input: CreateBuildExampleInput,
  apiBaseUrl?: string
): Promise<ApiResponse<BuildExample>> => {
  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  try {
    const response = await fetch(`${baseUrl}/api/data/build-examples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      };
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating build example:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
