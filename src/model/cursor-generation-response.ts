export type CursorGenerationResponse = {
  id: string;
  pr_url: string | null;
  pr_number: number | null;
  branch_name: string | null;
  files_changed: unknown | null;
  lines_added: number | null;
  lines_removed: number | null;
  agent_summary: string | null;
  created_at: string;
  updated_at: string;
};
