export const DASHBOARD_PATH = '/dashboard';
export const CUSTOMERS_PATH = '/customers';
export const CUSTOMER_DETAIL_PAGE_PATH = '/customer-detail-page';
export const SOFTWARE_SYSTEMS_PATH = '/software-systems';
export const SOFTWARE_SYSTEM_DETAIL_PAGE_PATH = '/software-system-detail-page';
export const CONVENTIONS_PATH = '/conventions';
export const CONVENTION_DETAIL_PAGE_PATH = '/convention-detail-page';
export const CONVENTIONS_VOCABULARY_PATH = '/conventions-vocabulary';
export const CONVENTIONS_CONTEXT_PATH = '/conventions-context';
export const AI_CONTEXT_PATH = '/ai-context';
export const TICKET_BUILD_START_PAGE_PATH = '/ticket-build-start-page';
export const TICKET_BUILD_DETAIL_PAGE_PATH = '/ticket-build-detail-page';
export const PR_AGENT_RUNS_PATH = '/pr-agent-runs';
export const PR_AGENT_RUN_DETAIL_PAGE_PATH = '/pr-agent-run-detail-page';
export const CONVENTION_AGENT_RUNS_PATH = '/convention-agent-runs';
export const CONVENTION_AGENT_RUN_DETAIL_PAGE_PATH = '/convention-agent-run-detail-page';
export const CONVENTIONS_HISTORY_PATH = '/conventions-history';
export const TEMPLATE_AGENT_RUNS_PATH = '/template-agent-runs';
export const TEMPLATE_AGENT_RUN_DETAIL_PAGE_PATH = '/template-agent-run-detail-page';

/** Detail page for each agent's runs. */
export const AGENT_RUN_DETAIL_PATHS: Record<'pr' | 'convention' | 'template', string> = {
  pr: PR_AGENT_RUN_DETAIL_PAGE_PATH,
  convention: CONVENTION_AGENT_RUN_DETAIL_PAGE_PATH,
  template: TEMPLATE_AGENT_RUN_DETAIL_PAGE_PATH,
};

/** List page for each agent's runs. */
export const AGENT_RUN_LIST_PATHS: Record<'pr' | 'convention' | 'template', string> = {
  pr: PR_AGENT_RUNS_PATH,
  convention: CONVENTION_AGENT_RUNS_PATH,
  template: TEMPLATE_AGENT_RUNS_PATH,
};
