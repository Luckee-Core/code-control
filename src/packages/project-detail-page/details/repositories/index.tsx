'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import {
  getReposByProjectId,
  getGithubOrgs,
  createExpressRepo,
  createWebRepo,
} from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import { getGithubOrgConfig, mergeGithubOrgOptions } from '@/config/github-orgs';
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

const LAST_GITHUB_ORG_KEY = 'code-control:last-github-org';

const slugify = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export const ProjectDetailsRepositories = () => {
  const orgConfig = getGithubOrgConfig();
  const currentProject = useAppSelector((state) => state.currentProject);
  const [repos, setRepos] = useState<ProjectRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expressStep, setExpressStep] = useState<StepState>(INITIAL_STEP);
  const [webStep, setWebStep] = useState<StepState>(INITIAL_STEP);
  const [githubOrgOptions, setGithubOrgOptions] = useState<string[]>(orgConfig.options);
  const [selectedGithubOrg, setSelectedGithubOrg] = useState(orgConfig.defaultOrg);
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

  useEffect(() => {
    if (!currentProject?.id) {
      return;
    }

    const loadGithubOrgs = async () => {
      const config = getGithubOrgConfig();
      const response = await getGithubOrgs(currentProject.id, getApiBaseUrl());

      const options = mergeGithubOrgOptions(
        config.options,
        response.success && response.data ? response.data.options : undefined
      );

      const defaultOrg =
        (response.success && response.data?.defaultOwner) || config.defaultOrg;

      setGithubOrgOptions(options);

      const storedOrg =
        typeof window !== 'undefined' ? window.localStorage.getItem(LAST_GITHUB_ORG_KEY) : null;
      const initialOrg =
        storedOrg && options.includes(storedOrg) ? storedOrg : defaultOrg;
      setSelectedGithubOrg(initialOrg);
    };

    void loadGithubOrgs();
  }, [currentProject?.id]);

  const handleGithubOrgChange = (value: string) => {
    setSelectedGithubOrg(value);
    if (githubOrgOptions.length > 0 && typeof window !== 'undefined') {
      window.localStorage.setItem(LAST_GITHUB_ORG_KEY, value);
    }
  };

  const buildCreateOptions = (fields: { slug?: string; name?: string }) => {
    const owner = selectedGithubOrg || githubOrgOptions[0];
    return {
      ...fields,
      ...(owner ? { owner } : {}),
    };
  };

  const handleCreateExpressRepo = async () => {
    if (!currentProject?.id) return;

    setExpressStep({ status: 'running', message: null, repoUrl: null });
    const options = expressSlug.trim()
      ? buildCreateOptions({ slug: expressSlug.trim() })
      : buildCreateOptions({});
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
    const options = buildCreateOptions({ name: webSlug.trim() });
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
  const webRepos = repos.filter((repo) => repo.repo_type === 'nextjs');
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

      {githubOrgOptions.length > 0 && (
        <fieldset className={styles.orgField}>
          <legend className={styles.orgLabel}>GitHub organization</legend>
          <div className={styles.orgOptions}>
            {githubOrgOptions.map((org) => (
              <label key={org} className={styles.orgOption}>
                <input
                  type="radio"
                  name="github-org"
                  value={org}
                  checked={selectedGithubOrg === org}
                  onChange={() => handleGithubOrgChange(org)}
                  className={styles.orgRadio}
                />
                <span className={styles.orgOptionText}>{org}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

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
    text-sm text-gray-500
  `,
  orgField: `
    flex flex-col gap-2 mb-4 border-0 p-0 m-0
  `,
  orgLabel: `
    text-sm font-medium text-gray-700 mb-1
  `,
  orgOptions: `
    flex flex-wrap gap-3
  `,
  orgOption: `
    inline-flex items-center gap-2 cursor-pointer
  `,
  orgRadio: `
    h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500
  `,
  orgOptionText: `
    text-sm text-gray-900
  `,
  loading: `
    text-sm text-gray-500
  `,
  cards: `
    space-y-3
  `,
};
