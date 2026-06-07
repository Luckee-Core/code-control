export type BuildStep = {
  id: string;
  name: string;
  description: string | null;
  repo_type: 'express' | 'nextjs' | 'react-native';
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
