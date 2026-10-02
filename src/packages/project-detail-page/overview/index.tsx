'use client';

import { useAppSelector } from '@/store';

export const Overview = () => {
  const currentProject = useAppSelector((state) => state.currentProject);

  if (!currentProject.id) {
    return null;
  }

  const createdDate = currentProject.created_at ? new Date(currentProject.created_at) : null;

  return (
    <div className={styles.infoCard}>
      <div className={styles.infoHeader}>
        <div>
          <h2 className={styles.projectName}>{currentProject.name}</h2>
          {currentProject.description && (
            <p className={styles.projectDescription}>{currentProject.description}</p>
          )}
        </div>
      </div>
      <div className={styles.infoMeta}>
        {createdDate && (
          <span className={styles.metaItem}>
            Created{' '}
            {createdDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </span>
        )}
        <span className={styles.metaItem}>{currentProject.id}</span>
      </div>
    </div>
  );
};

const styles = {
  infoCard: `
    rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden
  `,
  infoHeader: `
    p-6 flex items-start justify-between gap-4
  `,
  projectName: `
    text-2xl font-bold text-gray-900
  `,
  projectDescription: `
    text-sm text-gray-500 mt-1
  `,
  infoMeta: `
    px-6 pb-6 flex gap-4 text-xs text-gray-500
  `,
  metaItem: `
    inline-flex items-center gap-1.5
  `,
};
