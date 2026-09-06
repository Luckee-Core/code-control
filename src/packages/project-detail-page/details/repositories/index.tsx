'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { getGithubOrgs, linkExistingRepo } from '@/api/project-setup';
import { getApiBaseUrl } from '@/api/config';
import {
  getGithubOrgConfig,
  mergeGithubOrgOptions,
  LAST_GITHUB_ORG_KEY,
} from '@/config/github-orgs';
import { ServerReposSection } from './servers';
import { WebAppReposSection } from './web-apps';
import { AddExistingRepoModal } from './AddExistingRepoModal';

const GITHUB_SETUP_QUICKSTART_URL =
  'https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss-quickstart.md#connect-github';

export const ProjectDetailsRepositories = () => {
  const orgConfig = getGithubOrgConfig();
  const currentProject = useAppSelector((state) => state.currentProject);
  const [githubOrgOptions, setGithubOrgOptions] = useState<string[]>(orgConfig.options);
  const [selectedGithubOrg, setSelectedGithubOrg] = useState(orgConfig.defaultOrg);
  const [githubSetupError, setGithubSetupError] = useState<string | null>(null);
  const [isAddExistingModalOpen, setIsAddExistingModalOpen] = useState(false);
  const [isLinkingExisting, setIsLinkingExisting] = useState(false);
  const [linkExistingError, setLinkExistingError] = useState<string | null>(null);
  const [listGeneration, setListGeneration] = useState(0);

  useEffect(() => {
    if (!currentProject?.id) {
      return;
    }

    const loadGithubOrgs = async () => {
      const config = getGithubOrgConfig();
      const response = await getGithubOrgs(currentProject.id, getApiBaseUrl());

      if (!response.success) {
        setGithubSetupError(response.error ?? 'GitHub is not configured on the Express server.');
        return;
      }

      setGithubSetupError(null);

      const options = mergeGithubOrgOptions(
        config.options,
        response.data ? response.data.options : undefined
      );

      const defaultOrg =
        response.data?.defaultOwner || config.defaultOrg;

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

  const handleLinkExistingRepo = async (
    repoType: 'express' | 'nextjs',
    repoUrl: string
  ) => {
    if (!currentProject?.id) return;

    setIsLinkingExisting(true);
    setLinkExistingError(null);

    const response = await linkExistingRepo(
      currentProject.id,
      { repo_type: repoType, repo_url: repoUrl },
      getApiBaseUrl()
    );

    setIsLinkingExisting(false);

    if (response.success) {
      setIsAddExistingModalOpen(false);
      setLinkExistingError(null);
      setListGeneration((generation) => generation + 1);
      return;
    }

    setLinkExistingError(response.error ?? 'Failed to add repository');
  };

  if (!currentProject?.id) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>Repositories</h3>
          <p className={styles.sectionDescription}>
            Create GitHub repositories for your project
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLinkExistingError(null);
            setIsAddExistingModalOpen(true);
          }}
          className={styles.addExistingButton}
        >
          Add existing repo
        </button>
      </div>

      {githubSetupError && (
        <div className={styles.setupBanner} role="status">
          <p className={styles.setupBannerTitle}>GitHub is not configured</p>
          <p className={styles.setupBannerText}>
            Set <code className={styles.setupBannerCode}>GITHUB_PERSONAL_ACCESS_TOKEN</code> and{' '}
            <code className={styles.setupBannerCode}>GITHUB_TEMPLATE_*</code> in the Express server{' '}
            <code className={styles.setupBannerCode}>.env</code>, then restart the API.
            {githubSetupError !== 'GitHub is not configured on the Express server.' && (
              <> Server message: {githubSetupError}</>
            )}
          </p>
          <a
            href={GITHUB_SETUP_QUICKSTART_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.setupBannerLink}
          >
            Connect your GitHub org — setup guide
          </a>
        </div>
      )}

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

      <div className={styles.tables}>
        <ServerReposSection key={`express-${listGeneration}`} />
        <WebAppReposSection key={`web-${listGeneration}`} />
      </div>

      <AddExistingRepoModal
        isOpen={isAddExistingModalOpen}
        isSubmitting={isLinkingExisting}
        errorMessage={linkExistingError}
        onClose={() => {
          setIsAddExistingModalOpen(false);
          setLinkExistingError(null);
        }}
        onSubmit={handleLinkExistingRepo}
      />
    </div>
  );
};

const styles = {
  wrapper: `
    flex flex-col gap-4
  `,
  sectionHeader: `
    flex items-start justify-between gap-4
  `,
  sectionTitle: `
    text-lg font-semibold text-gray-900
  `,
  sectionDescription: `
    text-sm text-gray-500
  `,
  addExistingButton: `
    shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700
    hover:bg-gray-50 transition-colors cursor-pointer
  `,
  setupBanner: `
    rounded-md border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col gap-2
  `,
  setupBannerTitle: `
    text-sm font-semibold text-amber-900
  `,
  setupBannerText: `
    text-sm text-amber-800
  `,
  setupBannerCode: `
    font-mono text-xs bg-amber-100 px-1 py-0.5 rounded
  `,
  setupBannerLink: `
    text-sm font-medium text-amber-900 underline hover:text-amber-700
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
  tables: `
    grid grid-cols-2 gap-4 w-full
  `,
};
