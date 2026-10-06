'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions, type ServerRuntime } from '@/store/builders';
import { slugifyRepoName } from '../../../../slugify-repo-name';
import { repoNameForServerRuntime } from '../../../server-repo-name';

export const RuntimeInput = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);
  const currentProject = useAppSelector((state) => state.currentProject);

  const handleChange = (runtime: ServerRuntime) => {
    const slug = currentProject.name ? slugifyRepoName(currentProject.name) : '';
    const nextName = repoNameForServerRuntime(
      repositoriesBuilder.expressRepoName,
      slug,
      runtime
    );
    dispatch(RepositoriesBuilderActions.setServerRuntime(runtime));
    dispatch(RepositoriesBuilderActions.setExpressRepoName(nextName));
  };

  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>Server type</legend>
      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="radio"
            name="create-server-runtime"
            value="express"
            checked={repositoriesBuilder.serverRuntime === 'express'}
            onChange={() => handleChange('express')}
            className={styles.radio}
          />
          <span className={styles.optionText}>Express</span>
        </label>
        <label className={styles.option}>
          <input
            type="radio"
            name="create-server-runtime"
            value="python"
            checked={repositoriesBuilder.serverRuntime === 'python'}
            onChange={() => handleChange('python')}
            className={styles.radio}
          />
          <span className={styles.optionText}>Python</span>
        </label>
      </div>
    </fieldset>
  );
};

const styles = {
  field: `
    flex flex-col gap-2 border-0 p-0 m-0
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  options: `
    flex flex-col gap-2
  `,
  option: `
    inline-flex items-center gap-2 cursor-pointer
  `,
  radio: `
    h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500
  `,
  optionText: `
    text-sm text-gray-900
  `,
};
