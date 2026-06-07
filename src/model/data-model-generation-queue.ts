export type DataModelQueueStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type DataModelGenerationQueue = {
  id: string;
  project_id: string;
  repo_id: string;
  entity_id: string;
  file_path: string;
  file_content: string | null;
  status: DataModelQueueStatus;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  cursor_exchange_id: string | null;
  pr_link: string | null;
  selected_operation_keys?: string[]; // CRUD operations to generate for this entity
  created_at: string;
  updated_at: string;
};
