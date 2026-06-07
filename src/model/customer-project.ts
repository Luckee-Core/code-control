export type CustomerProject = {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  app_type?: string;
  app_type_config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
