'use client';

import { Settings, Database, Hammer } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';

type WorkspaceTab = 'details' | 'data' | 'build';

const WORKSPACE_TABS: { id: WorkspaceTab; label: string; icon: typeof Settings }[] = [
  { id: 'details', label: 'Details', icon: Settings },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'build', label: 'Build', icon: Hammer },
];

export const ProjectWorkspaceTabBar = () => {
  const dispatch = useAppDispatch();
  const activeWorkspaceView = useAppSelector(
    (state) => state.workspaceBuilder.activeWorkspaceView
  );

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {WORKSPACE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeWorkspaceView === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                dispatch(
                  WorkspaceBuilderActions.setActiveWorkspaceView(tab.id)
                )
              }
              className={`${styles.tab} ${
                isActive ? styles.tabActive : styles.tabInactive
              }`}
            >
              <Icon className={styles.tabIcon} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

const styles = {
  header: `
    shrink-0 border-b border-border bg-card px-4
  `,
  nav: `
    flex gap-1
  `,
  tab: `
    inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors
    border-transparent bg-transparent cursor-pointer
  `,
  tabIcon: `
    h-4 w-4
  `,
  tabActive: `
    border-primary text-primary
  `,
  tabInactive: `
    text-muted-foreground hover:text-foreground hover:border-border
  `,
};
