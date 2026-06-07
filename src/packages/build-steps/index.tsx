'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { BuildStepBuilderActions } from '@/store/builders/buildStepBuilder';
import { CurrentBuildStepActions } from '@/store/current/currentBuildStep';
import { BuildStepsTable } from './BuildStepsTable';
import { BuildStepModal } from './BuildStepModal';

export const BuildStepsManager = () => {
  const dispatch = useAppDispatch();
  const selectedRepoType = useAppSelector((state) => state.buildStepBuilder.selectedRepoType);

  const handleCreateClick = () => {
    const now = new Date().toISOString();
    dispatch(CurrentBuildStepActions.setCurrentBuildStep({
      id: '',
      name: '',
      description: '',
      repo_type: selectedRepoType || 'express',
      sort_order: 0,
      is_active: true,
      created_at: now,
      updated_at: now,
    }));
    dispatch(BuildStepBuilderActions.openBuildStepModal(null));
  };

  const handleRepoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(
      BuildStepBuilderActions.setSelectedRepoType(
        value === 'all' ? null : (value as 'express' | 'nextjs' | 'react-native')
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Build Steps</h1>
        <div className={styles.actions}>
          <select
            value={selectedRepoType || 'all'}
            onChange={handleRepoTypeChange}
            className={styles.select}
          >
            <option value="all">All Repo Types</option>
            <option value="express">Express</option>
            <option value="nextjs">Next.js</option>
            <option value="react-native">React Native</option>
          </select>
          <button onClick={handleCreateClick} className={styles.createButton}>
            + Create Build Step
          </button>
        </div>
      </div>

      <BuildStepsTable />
      <BuildStepModal />
    </div>
  );
};

const styles = {
  container: `
    bg-white border border-gray-300 rounded p-4 mb-4
  `,
  header: `
    flex items-center justify-between mb-4
  `,
  title: `
    text-base font-semibold text-gray-900
  `,
  actions: `
    flex items-center gap-3
  `,
  select: `
    h-7 px-3 text-xs font-medium
    text-gray-700 bg-white border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  createButton: `
    h-7 px-3 text-xs font-medium
    text-white bg-blue-600 border border-blue-600 rounded
    hover:bg-blue-700
    transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500
    cursor-pointer
  `,
};
