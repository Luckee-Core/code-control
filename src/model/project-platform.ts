export type ProjectPlatform = {
  id: string;
  project_id: string;
  platform_id: string;
  platform_name: string;
  repo_id: string | null;
  status: string;
  current_phase: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
