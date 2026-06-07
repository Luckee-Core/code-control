export type CursorGenerationRequestStatus = 'pending' | 'completed' | 'failed';

export type CursorGenerationRequest = {
  id: string;
  user_id: string | null;
  project_id: string;
  repo_id: string;
  entity_id: string;
  task_id: string;
  selected_task_id: string;
  prompt_text: string;
  status: CursorGenerationRequestStatus;
  created_at: string;
  updated_at: string;
};
