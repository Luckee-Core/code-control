'use client';

import { useAppSelector } from '@/store';
import { ProjectWorkspaceTabBar } from '../tab-bar';
import { ProjectDetails } from '../details';
import { BackendOnboarding } from '../data';
import { GuidedPathwayContent } from '../build';

/**
 * Code control: the project workspace where you define conventions and drive what gets built —
 * Details (project meta), Data (schema / onboarding), Build (guided pathway). Lives in THT backend
 * panel; this is the shell extracted for clarity and reuse.
 */
export const CodeControl = () => {
  const activeWorkspaceView = useAppSelector(
    (state) => state.workspaceBuilder.activeWorkspaceView
  );

  return (
    <div className={styles.wrapper}>
      <ProjectWorkspaceTabBar />
      <div className={styles.content}>
        {activeWorkspaceView === 'details' && <ProjectDetails />}
        {activeWorkspaceView === 'data' && <BackendOnboarding />}
        {activeWorkspaceView === 'build' && <GuidedPathwayContent />}
      </div>
    </div>
  );
};

const styles = {
  wrapper: `
    flex flex-col flex-1 min-h-0 overflow-hidden bg-card
  `,
  content: `
    flex-1 flex flex-col min-h-0 overflow-hidden
  `,
};
