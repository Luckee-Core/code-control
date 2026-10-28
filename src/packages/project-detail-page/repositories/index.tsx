'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
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
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Repositories</h2>
          <p className={detailPageStyles.panelSubtitle}>
            Create GitHub repositories for your project
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(RepositoriesBuilderActions.openAddExisting())}
          className={detailPageStyles.secondaryButton}
        >
          Add existing repo
        </button>
      </div>

      <div className={detailPageStyles.panelBody}>
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
      </div>

      <ExpressModal />
      <WebModal />
      <AddExistingModal />
    </section>
  );
};

const styles = {
  setupBanner: `
    rounded-md border border-amber-300 bg-amber-50 px-4 py-3 flex flex-col gap-2 mb-4
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
    text-sm font-medium text-amber-900 underline hover:text-amber-700 cursor-pointer
  `,
  orgField: `
    flex flex-col gap-2 mb-4 border-0 p-0 m-0
  `,
  orgLabel: `
    text-sm font-medium text-gray-700
  `,
  orgOptions: `
    flex flex-wrap gap-3
  `,
  orgOption: `
    inline-flex items-center gap-2 cursor-pointer
  `,
  orgRadio: `
    h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer
  `,
  orgOptionText: `
    text-sm text-gray-900
  `,
  tables: `
    grid grid-cols-1 lg:grid-cols-2 gap-4 w-full
  `,
};
