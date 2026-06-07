export type CustomerStage = 'discovery_call' | 'active' | 'inactive';

export type Customer = {
  id: string;
  name: string;
  description: string;
  stage: CustomerStage;
  created_at: string;
  updated_at: string;
};
