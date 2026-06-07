'use client';

import { useAppDispatch } from '@/store';
import { toggleOpenRepoThunk } from '@/store/thunks/projects';
import { RepoIcon } from '../RepoIcon';
import { PhasesList } from './PhasesList';
import type { ProjectRepo } from '@/api/project-setup';
import type { RepoType } from '@/api/project-setup/types';

type RepoRowProps = {
  repo: ProjectRepo;
  isOpen: boolean;
  assignedCount: number;
};

export const RepoRow = ({ repo, isOpen, assignedCount }: RepoRowProps) => {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleOpenRepoThunk(repo.id));
  };

  return (
    <div className={styles.repoBlock}>
      <button
        type="button"
        onClick={handleToggle}
        className={`${styles.repoButton} ${
          isOpen ? styles.repoButtonActive : styles.repoButtonInactive
        }`}
      >
        <RepoIcon type={repo.repo_type as RepoType} />
        <span className={styles.repoName}>{repo.name}</span>
        {assignedCount > 0 && (
          <span className={styles.assignedBadge}>{assignedCount}</span>
        )}
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronExpanded : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {isOpen && <PhasesList repoId={repo.id} repoType={repo.repo_type as RepoType} />}
    </div>
  );
};

const styles = {
  repoBlock: `
    mb-2
  `,
  repoButton: `
    w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors
    border-none bg-transparent cursor-pointer text-left
  `,
  repoButtonActive: `
    bg-blue-50 text-blue-700 font-medium
  `,
  repoButtonInactive: `
    text-gray-900 hover:bg-gray-50
  `,
  repoName: `
    truncate flex-1
  `,
  assignedBadge: `
    text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700 font-medium
  `,
  chevron: `
    h-3 w-3 text-gray-400 transition-transform
  `,
  chevronExpanded: `
    rotate-90
  `,
};
