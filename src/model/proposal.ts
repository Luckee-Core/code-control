export type Proposal = {
  id: string;
  title: string;
  description: string;
  status: string;
  workspace_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};
