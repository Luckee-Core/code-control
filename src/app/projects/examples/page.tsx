'use client';

import { WorkspaceExamplesTab } from '@/packages/workspace-examples';
import { useBreadcrumbs } from '@/hooks';

export default function ExamplesPage() {
  useBreadcrumbs([{ label: 'Projects', href: '/projects' }, { label: 'Examples' }]);

  return (
    <div className="w-full">
      <WorkspaceExamplesTab />
    </div>
  );
}
