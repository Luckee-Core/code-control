'use client';

import { useBreadcrumbs } from '@/hooks';
import { DataModelQueuePage } from '@/packages/data-model-queue';

export default function DataModelQueueRoute() {
  useBreadcrumbs([
    { label: 'Projects', href: '/projects' },
    { label: 'Data Model Queue' },
  ]);

  return <DataModelQueuePage />;
}
