'use client';

import { useBreadcrumbs } from '@/hooks';
import { StudioStackGate } from '@/packages/studio-stack-gate';

/**
 * Home / dashboard — env setup gate, then workspace snapshot.
 */
export const Dashboard = () => {
  useBreadcrumbs([{ label: 'Home' }]);

  return <StudioStackGate />;
};
