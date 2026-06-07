export type Project = {
  id: string;
  customer_id: string;
  name: string;
  description: string | null;
  app_type?: string;
  app_type_config?: Record<string, unknown>;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
};
