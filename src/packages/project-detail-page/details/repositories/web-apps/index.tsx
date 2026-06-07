'use client';

import type { ProjectRepo } from '@/api/project-setup';
import { WebAppRepoRow } from './row';

type WebAppReposSectionProps = {
  webRepos: ProjectRepo[];
  webSlug: string;
  onWebSlugChange: (value: string) => void;
  onCreateWebRepo: () => void;
  isCreating: boolean;
  errorMessage: string | null;
};

const SpinnerIcon = () => (
  <svg className={styles.spinnerSvg} fill="none" viewBox="0 0 24 24">
    <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const WebAppReposSection = ({
  webRepos,
  webSlug,
  onWebSlugChange,
  onCreateWebRepo,
  isCreating,
  errorMessage,
}: WebAppReposSectionProps) => {
  return (
    <>
      {webRepos.map((repo) => (
        <WebAppRepoRow key={repo.id} repo={repo} />
      ))}

      <div className={styles.addRepoCard}>
        <div className={styles.repoCardInner}>
          <div className={styles.repoIconMuted}>
            <svg className={styles.repoIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div className={styles.repoInfo}>
            <input
              type="text"
              value={webSlug}
              onChange={(event) => onWebSlugChange(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && onCreateWebRepo()}
              placeholder="Web app name (e.g. roads-admin-panel)"
              className={styles.slugInput}
              aria-label="Web repo name"
            />
          </div>
          <button
            type="button"
            onClick={onCreateWebRepo}
            disabled={!webSlug.trim() || isCreating}
            className={styles.createWebButton}
          >
            {isCreating ? (
              <>
                <SpinnerIcon /> Creating…
              </>
            ) : (
              'Create Web Repo'
            )}
          </button>
        </div>
        {errorMessage && (
          <p className={styles.errorText}>{errorMessage}</p>
        )}
      </div>
    </>
  );
};

const styles = {
  addRepoCard: `
    rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-4
  `,
  repoCardInner: `
    flex items-center gap-3
  `,
  repoIconMuted: `
    p-2 rounded-md bg-gray-200 text-gray-500
  `,
  repoIconSvg: `
    h-5 w-5
  `,
  repoInfo: `
    flex-1 min-w-0
  `,
  slugInput: `
    max-w-xs px-2 py-1.5 text-sm border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  createWebButton: `
    rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white
    hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
    inline-flex items-center gap-1.5 border-none cursor-pointer
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
  errorText: `
    text-xs text-red-600 mt-2
  `,
};
