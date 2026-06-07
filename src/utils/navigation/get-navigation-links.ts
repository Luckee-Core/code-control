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
    { name: 'Customers', href: '/customers' },
    { name: 'Projects', href: '/projects' },
    {
      name: 'Queues',
      href: '/projects/ard-queue',
      children: [
        { name: 'ARD Queue', href: '/projects/ard-queue' },
        { name: 'Data Model Queue', href: '/projects/data-model-queue' },
      ],
    },
    { name: 'Conventions', href: '/projects/conventions' },
    { name: 'Build Steps', href: '/build-steps' },
    { name: 'Task Categories', href: '/task-categories' },
    { name: 'Examples', href: '/projects/examples' },
  ];
};
