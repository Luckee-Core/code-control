'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions, type FrontendRuntime } from '@/store/builders';
import { slugifyRepoName } from '../../../../slugify-repo-name';
import { repoNameForFrontendRuntime } from '../../../frontend-repo-name';

export const RuntimeInput = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);
  const currentProject = useAppSelector((state) => state.currentProject);

  const handleChange = (runtime: FrontendRuntime) => {
    const slug = currentProject.name ? slugifyRepoName(currentProject.name) : '';
    const nextName = repoNameForFrontendRuntime(
      repositoriesBuilder.webRepoName,
      slug,
      runtime
    );
    dispatch(RepositoriesBuilderActions.setFrontendRuntime(runtime));
    dispatch(RepositoriesBuilderActions.setWebRepoName(nextName));
  };

  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>Frontend type</legend>
      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="radio"
            name="create-frontend-runtime"
            value="nextjs"
            checked={repositoriesBuilder.frontendRuntime === 'nextjs'}
            onChange={() => handleChange('nextjs')}
            className={styles.radio}
          />
          <span className={styles.optionText}>Next.js web app</span>
        </label>
        <label className={styles.option}>
          <input
            type="radio"
            name="create-frontend-runtime"
            value="react-native"
            checked={repositoriesBuilder.frontendRuntime === 'react-native'}
            onChange={() => handleChange('react-native')}
            className={styles.radio}
          />
          <span className={styles.optionText}>React Native</span>
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
    h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer
  `,
  optionText: `
    text-sm text-gray-900
  `,
};
