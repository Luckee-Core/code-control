import { CUSTOMERS_PATH, DASHBOARD_PATH, SOFTWARE_SYSTEMS_PATH } from '@/config/routes';
import type { NavigationLink } from './navigation-link';

/**
 * Code Control sidebar navigation.
 */
export const getNavigationLinks = (): NavigationLink[] => {
  return [
    { name: 'Home', href: DASHBOARD_PATH },
    { name: 'Customers', href: CUSTOMERS_PATH },
    { name: 'Software systems', href: SOFTWARE_SYSTEMS_PATH },
  ];
};
