export type StepStatus = 'not-started' | 'in-progress' | 'done';

export type CustomerProjectStep = {
  id: string;
  stage_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  tags: string[];
  status: StepStatus;
  selected_example_ids: string[];
  selected_convention_ids: string[];
  created_at: string;
  updated_at: string;
};
