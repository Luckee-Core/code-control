'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { linkExistingRepoThunk } from '@/store/thunks/project-repos';

export const RepoUrlInput = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);

  return (
    <div className={styles.field}>
      <label htmlFor="existing-repo-url" className={styles.label}>
        Repository URL
      </label>
      <input
        id="existing-repo-url"
        type="url"
        value={repositoriesBuilder.existingRepoUrl}
        onChange={(event) =>
          dispatch(RepositoriesBuilderActions.setExistingRepoUrl(event.target.value))
        }
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            void dispatch(linkExistingRepoThunk());
          }
        }}
        placeholder="https://github.com/owner/repo"
        className={styles.input}
        autoFocus
      />
      <p className={styles.hint}>Paste a GitHub HTTPS or SSH clone URL.</p>
    </div>
  );
};

const styles = {
  field: `
    flex flex-col gap-2
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  input: `
    w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  hint: `
    text-xs text-gray-500
  `,
};
