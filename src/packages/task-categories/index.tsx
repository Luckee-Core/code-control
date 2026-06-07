'use client';

import { useAppSelector, useAppDispatch } from '@/store';
import { TaskCategoryBuilderActions } from '@/store/builders/taskCategoryBuilder';
import { CurrentTaskCategoryActions } from '@/store/current/currentTaskCategory';
import { TaskCategoriesTable } from './TaskCategoriesTable';
import { TaskCategoryModal } from './TaskCategoryModal';

export const TaskCategoriesManager = () => {
  const dispatch = useAppDispatch();
  const selectedRepoType = useAppSelector((state) => state.taskCategoryBuilder.selectedRepoType);

  const handleCreateClick = () => {
    const now = new Date().toISOString();
    const repoType =
      selectedRepoType === 'shared' || selectedRepoType === null
        ? null
        : selectedRepoType;
    dispatch(CurrentTaskCategoryActions.setCurrentTaskCategory({
      id: '',
      name: '',
      description: '',
      repo_type: repoType,
      sort_order: 0,
      is_active: true,
      created_at: now,
      updated_at: now,
    }));
    dispatch(TaskCategoryBuilderActions.openTaskCategoryModal(null));
  };

  const handleRepoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(
      TaskCategoryBuilderActions.setSelectedRepoType(
        value === 'all' ? null : (value as 'express' | 'nextjs' | 'react-native' | 'shared')
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Task Categories</h1>
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
            <option value="shared">Shared</option>
          </select>
          <button onClick={handleCreateClick} className={styles.createButton}>
            + Create Task Category
          </button>
        </div>
      </div>

      <TaskCategoriesTable />
      <TaskCategoryModal />
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
