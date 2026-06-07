export type RepoType = 'express' | 'nextjs' | 'react-native';

export type ProjectRepo = {
  id: string;
  customer_id: string;
  project_id: string;
  repo_type: RepoType;
  name: string;
  repo_url: string;
  clone_url: string | null;
  current_phase: string | null;
  phase_status: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateRepoResponse = {
  success: boolean;
  already_done?: boolean;
  repo_url?: string;
  clone_url?: string;
  error?: string;
};
