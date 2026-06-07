'use client';

import { useAppSelector } from '@/store';
import {
  NoProjectSelected,
  NoReposYet,
  GuidedPathwaySidebar,
  PhaseContentArea,
} from './components';

type GuidedPathwayContentProps = {
  isActive?: boolean;
};

/** Build tab: guided pathway (sidebar + phase content). */
export const GuidedPathwayContent = ({ isActive = true }: GuidedPathwayContentProps) => {
  const currentProject = useAppSelector((state) => state.currentProject);
  const repos = useAppSelector((state) => state.projectRepos);

  if (!isActive) {
    return null;
  }

  if (!currentProject?.id) {
    return <NoProjectSelected />;
  }

  if (repos.length === 0) {
    return <NoReposYet />;
  }

  return (
    <div className={styles.buildContent}>
      <div className={styles.layout}>
        <GuidedPathwaySidebar />
        <PhaseContentArea />
      </div>
    </div>
  );
};

const styles = {
  buildContent: `
    flex-1 flex flex-col w-full min-w-0 min-h-0 overflow-hidden
  `,
  layout: `
    flex flex-1 min-h-0 w-full min-w-0
  `,
};
