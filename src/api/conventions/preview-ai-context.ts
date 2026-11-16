import { getApiBaseUrl } from '../config';
import { ApiResponse } from '../types';
import type { AiContext, AiContextRequest } from '@/model/convention-responses';

/**
 * Builds AI context without saving it.
 */
export const previewAiContext = async (request: AiContextRequest, apiBaseUrl?: string): Promise<ApiResponse<AiContext>> => {
  const baseUrl = apiBaseUrl || getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/data/conventions/ai-context/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
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
    console.error('Error in previewAiContext:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
