'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';

export const RepoTypeInput = () => {
  const dispatch = useAppDispatch();
  const repositoriesBuilder = useAppSelector((state) => state.repositoriesBuilder);

  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>Repository type</legend>
      <div className={styles.typeOptions}>
        <label className={styles.typeOption}>
          <input
            type="radio"
            name="existing-repo-type"
            value="express"
            checked={repositoriesBuilder.existingRepoType === 'express'}
            onChange={() => dispatch(RepositoriesBuilderActions.setExistingRepoType('express'))}
            className={styles.typeRadio}
          />
          <span className={styles.typeOptionText}>Express server</span>
        </label>
        <label className={styles.typeOption}>
          <input
            type="radio"
            name="existing-repo-type"
            value="python"
            checked={repositoriesBuilder.existingRepoType === 'python'}
            onChange={() => dispatch(RepositoriesBuilderActions.setExistingRepoType('python'))}
            className={styles.typeRadio}
          />
          <span className={styles.typeOptionText}>Python server</span>
        </label>
        <label className={styles.typeOption}>
          <input
            type="radio"
            name="existing-repo-type"
            value="nextjs"
            checked={repositoriesBuilder.existingRepoType === 'nextjs'}
            onChange={() => dispatch(RepositoriesBuilderActions.setExistingRepoType('nextjs'))}
            className={styles.typeRadio}
          />
          <span className={styles.typeOptionText}>Next.js web app</span>
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
  typeOptions: `
    flex flex-col gap-2
  `,
  typeOption: `
    inline-flex items-center gap-2 cursor-pointer
  `,
  typeRadio: `
    h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500
  `,
  typeOptionText: `
    text-sm text-gray-900
  `,
};
