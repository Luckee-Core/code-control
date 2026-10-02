'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { setSelectedGithubOrgThunk } from '@/store/thunks/project-repos';
import { Servers } from './servers';
import { WebApps } from './web-apps';
import { ExpressModal } from './express-modal';
import { WebModal } from './web-modal';
import { AddExistingModal } from './add-existing-modal';

const GITHUB_SETUP_QUICKSTART_URL =
  'https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss-quickstart.md#connect-github';

export const Repositories = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);

  if (!currentProject.id) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>Repositories</h3>
          <p className={styles.sectionDescription}>Create GitHub repositories for your project</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(RepositoriesBuilderActions.openAddExisting())}
          className={styles.addExistingButton}
        >
          Add existing repo
        </button>
      </div>

      {repositoriesBuilder.githubSetupError && (
        <div className={styles.setupBanner} role="status">
          <p className={styles.setupBannerTitle}>GitHub is not configured</p>
          <p className={styles.setupBannerText}>
            Set <code className={styles.setupBannerCode}>GITHUB_PERSONAL_ACCESS_TOKEN</code> and{' '}
            <code className={styles.setupBannerCode}>GITHUB_TEMPLATE_*</code> in the Express server{' '}
            <code className={styles.setupBannerCode}>.env</code>, then restart the API.
            {repositoriesBuilder.githubSetupError !==
              'GitHub is not configured on the Express server.' && (
              <> Server message: {repositoriesBuilder.githubSetupError}</>
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

      {repositoriesBuilder.githubOrgOptions.length > 0 && (
        <fieldset className={styles.orgField}>
          <legend className={styles.orgLabel}>GitHub organization</legend>
          <div className={styles.orgOptions}>
            {repositoriesBuilder.githubOrgOptions.map((org) => (
              <label key={org} className={styles.orgOption}>
                <input
                  type="radio"
                  name="github-org"
                  value={org}
                  checked={repositoriesBuilder.selectedGithubOrg === org}
                  onChange={() => void dispatch(setSelectedGithubOrgThunk(org))}
                  className={styles.orgRadio}
                />
                <span className={styles.orgOptionText}>{org}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className={styles.tables}>
        <Servers />
        <WebApps />
      </div>

      <ExpressModal />
      <WebModal />
      <AddExistingModal />
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
