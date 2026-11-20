import {
  AI_CONTEXT_PATH,
  CONVENTION_AGENT_RUN_DETAIL_PAGE_PATH,
  CONVENTION_AGENT_RUNS_PATH,
  CONVENTION_DETAIL_PAGE_PATH,
  CONVENTIONS_CONTEXT_PATH,
  CONVENTIONS_HISTORY_PATH,
  CONVENTIONS_PATH,
  CONVENTIONS_VOCABULARY_PATH,
  CUSTOMERS_PATH,
  DASHBOARD_PATH,
  PR_AGENT_RUN_DETAIL_PAGE_PATH,
  PR_AGENT_RUNS_PATH,
  SOFTWARE_SYSTEMS_PATH,
  TEMPLATE_AGENT_RUN_DETAIL_PAGE_PATH,
  TEMPLATE_AGENT_RUNS_PATH,
} from '@/config/routes';
import type { NavigationLink } from './navigation-link';

/**
 * Code Control sidebar navigation.
 */
export const getNavigationLinks = (): NavigationLink[] => {
  return [
    { name: 'Home', href: DASHBOARD_PATH },
    { name: 'Customers', href: CUSTOMERS_PATH },
    { name: 'Software systems', href: SOFTWARE_SYSTEMS_PATH },
    { name: 'PR feedback', href: PR_AGENT_RUNS_PATH, badge: 'pr', activePrefixes: [PR_AGENT_RUN_DETAIL_PAGE_PATH] },
    {
      name: 'Conventions',
      href: CONVENTIONS_PATH,
      children: [
        { name: 'Catalog', href: CONVENTIONS_PATH, activePrefixes: [CONVENTION_DETAIL_PAGE_PATH, CONVENTIONS_VOCABULARY_PATH, CONVENTIONS_CONTEXT_PATH] },
        { name: 'Agent runs', href: CONVENTION_AGENT_RUNS_PATH, badge: 'convention', activePrefixes: [CONVENTION_AGENT_RUN_DETAIL_PAGE_PATH] },
        { name: 'History', href: CONVENTIONS_HISTORY_PATH },
      ],
    },
    { name: 'Template agents', href: TEMPLATE_AGENT_RUNS_PATH, badge: 'template', activePrefixes: [TEMPLATE_AGENT_RUN_DETAIL_PAGE_PATH] },
    { name: 'AI context', href: AI_CONTEXT_PATH },
  ];
};
