export type CursorGenerationExchangeStatus = 'pending' | 'running' | 'completed' | 'failed';

export type CursorGenerationExchange = {
  id: string;
  user_id: string | null;
  request_id: string;
  response_id: string | null;
  agent_id: string;
  model_used: string | null;
  api_calls_count: number;
  duration_seconds: number | null;
  cost_estimate: number | null;
  repository: string;
  branch_ref: string;
  status: CursorGenerationExchangeStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};
