import { CUSTOMERS_PATH, PROJECTS_PATH, STUDIO_SETUP_PATH } from '@/config/routes';
import type { NavigationLink } from './navigation-link';

/**
 * Code Control sidebar navigation.
 */
export const getNavigationLinks = (): NavigationLink[] => {
  return [
    { name: 'Customers', href: CUSTOMERS_PATH },
    { name: 'Projects', href: PROJECTS_PATH },
    { name: 'Studio setup', href: STUDIO_SETUP_PATH },
  ];
};
