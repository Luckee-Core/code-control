/**
 * Get All CRUD API Tasks
 * Fetches all CRUD API task templates from the backend
 */

export type CrudApiTask = {
  id: string;
  name: string;
  task_type: string;
  description: string | null;
  prompt_template: string;
  output_path_template: string;
  operation_key: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';

export const getAllCrudApiTasks = async (
  apiBaseUrl?: string
): Promise<{ success: boolean; data?: CrudApiTask[]; error?: string }> => {
  const baseUrl = apiBaseUrl || BASE_URL;
  
  console.log('🌐 API: Fetching all CRUD API tasks from:', `${baseUrl}/api/data/crud-api-tasks`);
  
  try {
    const response = await fetch(`${baseUrl}/api/data/crud-api-tasks`);

    console.log('🌐 API: Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('🌐 API: Error response:', error);
      return {
        success: false,
        error: error.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const result = await response.json();
    console.log('🌐 API: Result:', result);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Failed to fetch CRUD API tasks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tasks',
    };
  }
};
