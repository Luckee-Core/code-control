export type CrudApiGenerationQueue = {
  id: string;
  project_id: string;
  repo_id: string;
  entity_id: string | null;
  task_id: string | null;
  operation_key: string | null;
  file_path: string | null;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  pr_link: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};

/** Input for creating a queue item (omit server-set fields). */
export type CreateCrudApiQueueItemInput = Pick<
  CrudApiGenerationQueue,
  'project_id' | 'repo_id' | 'entity_id' | 'task_id' | 'operation_key' | 'file_path'
>;
