export type RepoType = 'express' | 'python' | 'nextjs' | 'react-native' | 'storage-express';

export type ProjectRepo = {
  id: string;
  customer_id: string;
  software_system_id: string;
  repo_type: RepoType;
  /** repo_roles.key; null until assigned. */
  role: string | null;
  name: string;
  repo_url: string;
  clone_url: string | null;
  created_at: string;
  updated_at: string;
};
