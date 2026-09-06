import { CUSTOMERS_PATH } from '@/config/routes';

export type NavigationLink = {
  name: string;
  href: string;
  children?: NavigationLink[];
};

/**
 * Code Control sidebar navigation.
 */
export const getNavigationLinks = (): NavigationLink[] => {
  return [
    { name: 'Customers', href: CUSTOMERS_PATH },
    { name: 'Projects', href: '/projects' },
  ];
};
