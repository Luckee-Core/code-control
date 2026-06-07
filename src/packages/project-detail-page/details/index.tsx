'use client';

import { useAppSelector } from '@/store';
import { ProjectDetailsOverview } from './overview';
import { ProjectDetailsRepositories } from './repositories';

type ProjectDetailsProps = {
  isActive?: boolean;
};

export const ProjectDetails = ({ isActive = true }: ProjectDetailsProps) => {
  const currentProject = useAppSelector((state) => state.currentProject);

  if (!isActive) {
    return null;
  }

  if (!currentProject?.id) {
    return (
      <div className={styles.tabContent}>
        <div className={styles.wrapper}>
          <p className={styles.empty}>No project selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.wrapper}>
        <ProjectDetailsOverview />
        <ProjectDetailsRepositories />
      </div>
    </div>
  );
};

const styles = {
  tabContent: `
    flex-1 overflow-auto p-6
  `,
  wrapper: `
    flex flex-col gap-8 max-w-3xl
  `,
  empty: `
    text-sm text-gray-500 italic p-4
  `,
};
