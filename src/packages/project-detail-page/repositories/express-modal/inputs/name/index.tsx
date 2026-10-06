'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { createExpressRepoThunk } from '@/store/thunks/project-repos';

const NAME_LABEL = 'Repository name';

export const NameInput = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);

  return (
    <div className={styles.field}>
      <label htmlFor="create-server-repo-name" className={styles.label}>
        {NAME_LABEL}
      </label>
      <input
        id="create-server-repo-name"
        type="text"
        value={repositoriesBuilder.expressRepoName}
        onChange={(event) =>
          dispatch(RepositoriesBuilderActions.setExpressRepoName(event.target.value))
        }
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            void dispatch(createExpressRepoThunk());
          }
        }}
        placeholder={
          repositoriesBuilder.serverRuntime === 'python'
            ? 'e.g. roads-crm-python-server'
            : 'e.g. roads-crm-express-server'
        }
        className={styles.input}
        autoFocus
      />
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
};
