export type CustomerStage = 'discovery_call' | 'active' | 'inactive';

export type Customer = {
  id: string;
  name: string;
  description: string | null;
  stage: CustomerStage;
  created_at: string;
  updated_at: string;
};
