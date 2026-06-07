'use client';

import { useBreadcrumbs } from '@/hooks';
import { ARDQueuePage } from '@/packages/ard-queue';

export default function ARDQueueRoute() {
  useBreadcrumbs([
    { label: 'Projects', href: '/projects' },
    { label: 'ARD Queue' },
  ]);

  return <ARDQueuePage />;
}
