'use client';

import type { ProjectRepo } from '@/api/project-setup';
import { CopyGitCloneButton } from '@/components/copy-git-clone-button';
import { RepoGithubLink } from '@/components/repo-github-link';

type WebAppRepoRowProps = {
  repo: ProjectRepo;
};

const CheckIcon = () => (
  <svg className={styles.checkIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className={styles.spinnerSvg} fill="none" viewBox="0 0 24 24">
    <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const WebAppRepoRow = ({ repo }: WebAppRepoRowProps) => {
  return (
    <div className={styles.repoCard}>
      <div className={styles.repoCardInner}>
        <div className={styles.repoIcon}>
          <svg className={styles.repoIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <div className={styles.repoInfo}>
          <h4 className={styles.repoTitle}>{repo.name}</h4>
          <p className={styles.repoSubtitle}>Web application</p>
        </div>
        <div className={styles.repoStatus}>
          <span className={styles.checkIcon}>
            <CheckIcon />
          </span>
          {repo.repo_url ? (
            <div className={styles.repoActions}>
              <CopyGitCloneButton cloneUrl={repo.clone_url} repoUrl={repo.repo_url} />
              <RepoGithubLink repoUrl={repo.repo_url} />
            </div>
          ) : (
            <span className={styles.creatingText}>
              <SpinnerIcon /> Creating…
            </span>
          )}
        </div>
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
  repoActions: `
    flex items-center gap-2 shrink-0
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
};
