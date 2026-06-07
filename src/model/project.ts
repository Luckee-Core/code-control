export type Project = {
  id: string;
  workspace_id: string;
  external_customer_id?: string | null;
  name: string;
  description: string | null;
  app_type?: string;
  app_type_config?: Record<string, unknown>;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
};
