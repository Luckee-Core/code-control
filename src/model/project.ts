export type Project = {
  id: string;
  customer_id: string;
  name: string;
  description: string | null;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
};
