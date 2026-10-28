'use client';

import type { ReactNode } from 'react';
import { useAppSelector } from '@/store';
import { DashboardOnboardingView } from '@/packages/dashboard/onboarding';
import { DashboardReadyView } from '@/packages/dashboard/ready';

type Props = {
  children?: ReactNode;
};

/**
 * Renders the home dashboard when Express GET /api/health reports ready; otherwise setup guidance.
 * Workspace list data loading does not unlock Home — only `probeStudioStackThunk` after health ok.
 */
export const StudioStackGate = ({ children }: Props) => {
  const stack = useAppSelector((state) => state.studioStackBuilder);

  if (stack.status === 'ready') {
    return children ?? <DashboardReadyView />;
  }

  return <DashboardOnboardingView />;
};
