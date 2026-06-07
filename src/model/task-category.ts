export type TaskCategory = {
  id: string;
  name: string;
  description: string | null;
  repo_type: 'express' | 'nextjs' | 'react-native' | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
