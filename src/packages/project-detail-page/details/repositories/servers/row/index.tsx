'use client';

import type { ProjectRepo } from '@/api/project-setup';

type ServerRepoRowProps = {
  expressRepo: ProjectRepo | null;
  expressSlug: string;
  onExpressSlugChange: (value: string) => void;
  onCreateExpressRepo: () => void;
  isCreating: boolean;
};

const CheckIcon = () => (
  <svg className={styles.checkIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className={styles.externalLinkSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className={styles.spinnerSvg} fill="none" viewBox="0 0 24 24">
    <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const ServerRepoRow = ({
  expressRepo,
  expressSlug,
  onExpressSlugChange,
  onCreateExpressRepo,
  isCreating,
}: ServerRepoRowProps) => {
  return (
    <div className={styles.repoCard}>
      <div className={styles.repoCardInner}>
        <div className={styles.repoIcon}>
          <svg className={styles.repoIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
        <div className={styles.repoInfo}>
          <h4 className={styles.repoTitle}>Express Server</h4>
          <p className={styles.repoSubtitle}>Backend API server</p>
        </div>

        {expressRepo ? (
          <div className={styles.repoStatus}>
            <span className={styles.checkIcon}>
              <CheckIcon />
            </span>
            {expressRepo.repo_url ? (
              <a
                href={expressRepo.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoLink}
              >
                {expressRepo.name}
                <ExternalLinkIcon />
              </a>
            ) : (
              <span className={styles.creatingText}>
                <SpinnerIcon /> Creating…
              </span>
            )}
          </div>
        ) : (
          <div className={styles.repoActions}>
            <input
              type="text"
              value={expressSlug}
              onChange={(event) => onExpressSlugChange(event.target.value)}
              placeholder="e.g. roads → roads-express-server"
              className={styles.slugInput}
              aria-label="Express repo slug"
            />
            <button
              type="button"
              onClick={onCreateExpressRepo}
              disabled={isCreating}
              className={styles.createButton}
            >
              {isCreating ? (
                <>
                  <SpinnerIcon /> Creating…
                </>
              ) : (
                'Create Express Repo'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  repoCard: `
    rounded-lg border border-gray-200 bg-white shadow-sm p-4
  `,
  repoCardInner: `
    flex items-center gap-3
  `,
  repoIcon: `
    p-2 rounded-md bg-blue-100 text-blue-600
  `,
  repoIconSvg: `
    h-5 w-5
  `,
  repoInfo: `
    flex-1 min-w-0
  `,
  repoTitle: `
    text-sm font-semibold text-gray-900
  `,
  repoSubtitle: `
    text-xs text-gray-500
  `,
  repoStatus: `
    flex items-center gap-2 shrink-0
  `,
  checkIcon: `
    text-green-600
  `,
  checkIconSvg: `
    h-4 w-4
  `,
  repoLink: `
    text-xs text-blue-600 hover:underline inline-flex items-center gap-1
  `,
  externalLinkSvg: `
    h-3 w-3
  `,
  creatingText: `
    text-xs text-gray-500 inline-flex items-center gap-1
  `,
  spinnerSvg: `
    h-3 w-3 animate-spin
  `,
  spinnerCircle: `
    opacity-25
  `,
  spinnerPath: `
    opacity-75
  `,
  repoActions: `
    flex items-center gap-2 shrink-0
  `,
  slugInput: `
    max-w-xs px-2 py-1.5 text-sm border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  createButton: `
    rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
    inline-flex items-center gap-1.5 border-none cursor-pointer
  `,
};
