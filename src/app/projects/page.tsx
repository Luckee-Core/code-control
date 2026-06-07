'use client';

import { ProjectsList, ProjectsHeader } from '@/packages/projects';
import { useBreadcrumbs } from '@/hooks';

export default function ProjectsPage() {
  useBreadcrumbs([{ label: 'Projects' }]);
  return (
    <div className={styles.page}>
      <ProjectsHeader />
      <ProjectsList />
    </div>
  );
}

const styles = {
  page: `p-6 flex flex-col gap-4 overflow-auto flex-1 min-h-0`,
};
