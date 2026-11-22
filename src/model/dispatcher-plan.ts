/** Loopback ports for one project's dispatcher stack. */
export type DispatcherPorts = { dispatcher: number; storage: number; api: number; web: number };

/** One gate-exposed path seeded in the storage catalog. */
export type DispatcherEndpoint = {
  id: string;
  service_id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  requires_body: boolean;
  sort_order: number;
};

/** GET /api/data/software-systems/:id/dispatcher-plan: what the Dispatcher tab delivers. */
export type DispatcherPlan = {
  project_id: string;
  name: string;
  description: string;
  env_prefix: string;
  session_slug: string;
  ports: DispatcherPorts;
  /** False until the first dispatcher delivery stores the ports on the software system. */
  ports_saved: boolean;
  service_ids: { storage: string; api: string; gateway: string };
  repos: { storage: string; express: string; dispatcher: string; dispatcher_web: string };
  spawn_root: string;
  cwd: { storage: string; express: string; dispatcher: string; dispatcher_web: string };
  gateway_path_prefix: string;
  api_path_prefix: string;
  secrets: { main_gate: string; main_admin: string; storage: string };
  endpoints: DispatcherEndpoint[];
  /** What blocks delivery; empty when ready. */
  problems: string[];
};
