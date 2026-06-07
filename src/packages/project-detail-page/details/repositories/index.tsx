'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import {
  getReposByProjectId,
  createExpressRepo,
  createWebRepo,
} from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import type { ProjectRepo } from '@/api/project-setup';
import { ServerReposSection } from './servers';
import { WebAppReposSection } from './web-apps';

type StepStatus = 'idle' | 'running' | 'done' | 'error';

type StepState = {
  status: StepStatus;
  message: string | null;
  repoUrl: string | null;
};

const INITIAL_STEP: StepState = {
  status: 'idle',
  message: null,
  repoUrl: null,
};

const slugify = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export const ProjectDetailsRepositories = () => {
  const currentProject = useAppSelector((state) => state.currentProject);
  const [repos, setRepos] = useState<ProjectRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expressStep, setExpressStep] = useState<StepState>(INITIAL_STEP);
  const [webStep, setWebStep] = useState<StepState>(INITIAL_STEP);
  const defaultSlug = currentProject?.name ? slugify(currentProject.name) : '';
  const [expressSlug, setExpressSlug] = useState(defaultSlug);
  const [webSlug, setWebSlug] = useState(defaultSlug);

  const fetchRepos = async (projectId: string) => {
    setLoading(true);
    const response = await getReposByProjectId(projectId, getApiBaseUrl());
    setLoading(false);
    if (response.success && response.data) {
      setRepos(response.data);
    }
  };

  useEffect(() => {
    if (!currentProject?.id) {
      return;
    }

    const timeoutId = setTimeout(() => void fetchRepos(currentProject.id), 0);
    return () => clearTimeout(timeoutId);
  }, [currentProject?.id]);

  const handleCreateExpressRepo = async () => {
    if (!currentProject?.id) return;

    setExpressStep({ status: 'running', message: null, repoUrl: null });
    const options = expressSlug.trim() ? { slug: expressSlug.trim() } : undefined;
    const response = await createExpressRepo(currentProject.id, getApiBaseUrl(), options);

    if (response.success) {
      setExpressStep({
        status: 'done',
        message: response.already_done ? 'Already done' : 'Created',
        repoUrl: response.repo_url ?? null,
      });
      void fetchRepos(currentProject.id);
      return;
    }

    setExpressStep({
      status: 'error',
      message: response.error ?? 'Failed',
      repoUrl: null,
    });
  };

  const handleCreateWebRepo = async () => {
    if (!currentProject?.id || !webSlug.trim()) return;

    setWebStep({ status: 'running', message: null, repoUrl: null });
    const options = { name: webSlug.trim() };
    const response = await createWebRepo(currentProject.id, getApiBaseUrl(), options);

    if (response.success) {
      setWebStep({
        status: 'done',
        message: response.already_done ? 'Already done' : 'Created',
        repoUrl: response.repo_url ?? null,
      });
      setWebSlug('');
      void fetchRepos(currentProject.id);
      return;
    }

    setWebStep({
      status: 'error',
      message: response.error ?? 'Failed',
      repoUrl: null,
    });
  };

  const expressRepos = repos.filter((repo) => repo.repo_type === 'express');
  const webRepos = repos.filter((repo) => repo.repo_type === 'web');
  const expressRepo = expressRepos[0] ?? null;

  if (!currentProject?.id) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.sectionTitle}>Repositories</h3>
      <p className={styles.sectionDescription}>
        Create GitHub repositories for your project
      </p>

      {loading ? (
        <p className={styles.loading}>Loading repos…</p>
      ) : (
        <div className={styles.cards}>
          <ServerReposSection
            expressRepo={expressRepo}
            expressSlug={expressSlug}
            onExpressSlugChange={setExpressSlug}
            onCreateExpressRepo={handleCreateExpressRepo}
            isCreating={expressStep.status === 'running'}
            errorMessage={expressStep.status === 'error' ? expressStep.message : null}
          />

          <WebAppReposSection
            webRepos={webRepos}
            webSlug={webSlug}
            onWebSlugChange={setWebSlug}
            onCreateWebRepo={handleCreateWebRepo}
            isCreating={webStep.status === 'running'}
            errorMessage={webStep.status === 'error' ? webStep.message : null}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: `
    flex flex-col gap-4
  `,
  sectionTitle: `
    text-lg font-semibold text-gray-900
  `,
  sectionDescription: `
    text-sm text-gray-500 mb-4
  `,
  loading: `
    text-sm text-gray-500
  `,
  cards: `
    space-y-3
  `,
};
