'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { getReposByProjectId, type ProjectRepo } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { RepoTable } from '../repo-table';
import { CreateWebRepoModal } from './create-modal';

const TITLE = 'Web apps';

export const WebAppReposSection = () => {
  const currentProject = useAppSelector((state) => state.currentProject);
  const [repos, setRepos] = useState<ProjectRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchRepos = async (projectId: string) => {
    setIsLoading(true);
    const response = await getReposByProjectId(projectId, getApiBaseUrl());
    setIsLoading(false);
    if (response.success && response.data) {
      setRepos(response.data.filter((repo) => repo.repo_type === 'nextjs'));
    }
  };

  useEffect(() => {
    if (!currentProject?.id) {
      return;
    }

    const timeoutId = setTimeout(() => void fetchRepos(currentProject.id), 0);
    return () => clearTimeout(timeoutId);
  }, [currentProject?.id]);

  if (!currentProject?.id) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.titleRow}>
        <h4 className={styles.sectionTitle}>{TITLE}</h4>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className={styles.createButton}
        >
          Create
        </button>
      </div>
      {isLoading ? (
        <p className={styles.loading}>Loading repos…</p>
      ) : (
        <RepoTable repos={repos} />
      )}
      <CreateWebRepoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => void fetchRepos(currentProject.id)}
      />
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
