'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { slugifyRepoName } from '../../slugify-repo-name';
import { Table } from '../table';

const TITLE = 'Frontend apps';

export const WebApps = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const projectRepos = useAppSelector((state) => state.projectRepos);
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);

  const repos = useMemo(
    () =>
      Object.values(projectRepos).filter(
        (repo) =>
          repo.project_id === currentProject.id &&
          (repo.repo_type === 'nextjs' || repo.repo_type === 'react-native')
      ),
    [projectRepos, currentProject.id]
  );

  if (!currentProject.id) {
    return null;
  }

  const handleOpenCreate = () => {
    const slug = currentProject.name ? slugifyRepoName(currentProject.name) : '';
    const defaultName = slug ? `${slug}-web` : '';
    dispatch(RepositoriesBuilderActions.setWebRepoName(defaultName));
    dispatch(RepositoriesBuilderActions.openWebCreate());
  };

  return (
    <div className={styles.section}>
      <div className={styles.titleRow}>
        <h3 className={detailPageStyles.sectionTitle}>{TITLE}</h3>
        <button type="button" onClick={handleOpenCreate} className={detailPageStyles.secondaryButton}>
          Create
        </button>
      </div>
      {repositoriesBuilder.listLoadStatus === 'loading' ? (
        <p className={styles.loading}>Loading repos…</p>
      ) : (
        <Table repos={repos} />
      )}
    </div>
  );
};

const styles = {
  section: `
    flex flex-col gap-2 min-w-0 w-full
  `,
  titleRow: `
    flex items-center justify-between gap-2
  `,
  loading: `
    text-sm text-gray-500
  `,
};
