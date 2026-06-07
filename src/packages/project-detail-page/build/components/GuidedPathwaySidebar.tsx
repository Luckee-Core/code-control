'use client';

import { useAppSelector } from '@/store';
import { RepoRow } from './sidebar';

export const GuidedPathwaySidebar = () => {
  const currentProject = useAppSelector((state) => state.currentProject);
  const repos = useAppSelector((state) => state.projectRepos);
  const entities = useAppSelector((state) =>
    state.dataEntities.filter((e) => e.project_id === currentProject?.id)
  );
  const openReposInWorkspace = useAppSelector(
    (state) => state.workspaceBuilder.openReposInWorkspace
  );

  const projectRepos = repos.filter(
    (repo) => repo.project_id === currentProject?.id
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        <p className={styles.sidebarLabel}>Repositories</p>
        {projectRepos.map((repo) => {
          const isOpen = openReposInWorkspace.includes(repo.id);
          const assignedCount = entities.filter((e) =>
            (e.assigned_repo_ids ?? []).includes(repo.id)
          ).length;

          return (
            <RepoRow
              key={repo.id}
              repo={repo}
              isOpen={isOpen}
              assignedCount={assignedCount}
            />
          );
        })}
      </div>
    </aside>
  );
};

const styles = {
  sidebar: `
    w-64 shrink-0 border-r border-gray-200 bg-white
    flex flex-col h-full min-h-0 overflow-y-auto
  `,
  sidebarInner: `
    flex-1 min-h-0 overflow-y-auto p-3
  `,
  sidebarLabel: `
    text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2
  `,
};
