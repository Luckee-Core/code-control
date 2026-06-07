export type GenerateCodeInput = {
  projectId: string;
  repoId: string;
  entityId: string;
  taskId: string;
  selectedTaskId: string;
};

export type GenerateCodeResponse = {
  success: boolean;
  agentId?: string;
  prUrl?: string;
  summary?: string;
  cursorExchangeId?: string;
  error?: string;
};

/**
 * Generate code for an entity using Cursor Cloud Agents API
 * 
 * @param input - Project, repo, entity, and task IDs
 * @returns Generation result with PR URL
 */
export const generateCode = async (input: GenerateCodeInput): Promise<GenerateCodeResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_CODE_CONTROL_API_URL || 'http://localhost:3010';
  
  const response = await fetch(
    `${baseUrl}/api/data/projects/${input.projectId}/project-setup/generate-code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to generate code');
  }
  
  return response.json();
};
