'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { slugifyRepoName } from '../../slugify-repo-name';
import { repoNameForServerRuntime } from '../server-repo-name';
import { Table } from '../table';

const TITLE = 'Servers';

export const Servers = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const projectRepos = useAppSelector((state) => state.projectRepos);
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);

  const repos = useMemo(
    () =>
      Object.values(projectRepos).filter(
        (repo) =>
          repo.project_id === currentProject.id &&
          (repo.repo_type === 'express' || repo.repo_type === 'python')
      ),
    [projectRepos, currentProject.id]
  );

  if (!currentProject.id) {
    return null;
  }

  const handleOpenCreate = () => {
    const slug = currentProject.name ? slugifyRepoName(currentProject.name) : '';
    const defaultName = repoNameForServerRuntime('', slug, 'express');
    dispatch(RepositoriesBuilderActions.setExpressRepoName(defaultName));
    dispatch(RepositoriesBuilderActions.openExpressCreate());
  };

  return (
    <div className={styles.section}>
      <div className={styles.titleRow}>
        <h4 className={styles.sectionTitle}>{TITLE}</h4>
        <button type="button" onClick={handleOpenCreate} className={styles.createButton}>
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
  sectionTitle: `
    text-sm font-semibold text-gray-900
  `,
  createButton: `
    rounded border border-gray-300 bg-white px-2 py-0.5 text-xs font-medium text-gray-700
    hover:bg-gray-50 transition-colors cursor-pointer
  `,
  loading: `
    text-sm text-gray-500
  `,
};
