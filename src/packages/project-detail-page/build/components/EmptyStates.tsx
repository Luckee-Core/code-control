'use client';

import { useAppDispatch } from '@/store';
import { WorkspaceBuilderActions } from '@/store/builders';

export const NoProjectSelected = () => (
  <div className={styles.container}>
    <div className={styles.placeholder}>
      <p className={styles.text}>No project selected.</p>
    </div>
  </div>
);

export const NoReposYet = () => {
  const dispatch = useAppDispatch();
  
  return (
    <div className={styles.container}>
      <div className={styles.emptyState}>
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p className={styles.title}>No repositories yet</p>
        <p className={styles.hint}>Create repositories in the Details tab first</p>
        <button
          type="button"
          onClick={() => dispatch(WorkspaceBuilderActions.setActiveWorkspaceView('details'))}
          className={styles.button}
        >
          Go to Details
          <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const NoRepoOrPhaseSelected = () => (
  <div className={styles.placeholder}>
    <svg className={styles.placeholderIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
    <p className={styles.text}>Select a repository and phase</p>
    <p className={styles.hint}>Choose from the sidebar to begin</p>
  </div>
);

export const NoPhaseSelected = () => (
  <div className={styles.placeholder}>
    <p className={styles.text}>Select a phase</p>
  </div>
);

const styles = {
  container: `
    flex-1 flex min-h-0 overflow-hidden
  `,
  placeholder: `
    flex flex-col items-center justify-center py-20 text-gray-500 text-center
  `,
  placeholderIcon: `
    h-12 w-12 mb-4 opacity-30
  `,
  text: `
    text-sm font-medium
  `,
  hint: `
    text-xs mt-1
  `,
  emptyState: `
    flex flex-col items-center justify-center py-20 text-gray-500 text-center
  `,
  icon: `
    h-12 w-12 mb-4 opacity-30
  `,
  title: `
    text-sm font-medium
  `,
  button: `
    inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
    hover:bg-blue-700 transition-colors border-none cursor-pointer mt-4
  `,
  arrowIcon: `
    h-4 w-4
  `,
};
