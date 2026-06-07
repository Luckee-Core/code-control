'use client';

import { ProjectsList } from '@/packages/projects';
import { useBreadcrumbs } from '@/hooks';

export default function ProjectsPage() {
  useBreadcrumbs([{ label: 'Projects' }]);
  return <ProjectsList />;
}
