export type BuildConvention = {
  id: string;
  name: string;
  stack: string;
  content: string;
  repo_type: 'express' | 'nextjs' | 'react-native';
  created_at: string;
  updated_at: string;
};
