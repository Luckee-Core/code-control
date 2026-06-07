'use client';

import { useAppSelector } from '@/store';

const APP_TYPE_LABELS: Record<string, string> = {
  marketplace: 'Marketplace',
  field_service: 'Field Service',
  social: 'Social Network',
  saas: 'SaaS Platform',
  custom: 'Custom',
};

export const ProjectDetailsOverview = () => {
  const currentProject = useAppSelector((state) => state.currentProject);

  if (!currentProject?.id) {
    return null;
  }

  const appTypeLabel =
    currentProject.app_type && APP_TYPE_LABELS[currentProject.app_type]
      ? APP_TYPE_LABELS[currentProject.app_type]
      : currentProject.app_type ?? 'Custom';

  const createdDate = currentProject.created_at
    ? new Date(currentProject.created_at)
    : null;

  return (
    <div className={styles.infoCard}>
      <div className={styles.infoHeader}>
        <div>
          <h2 className={styles.projectName}>{currentProject.name}</h2>
          {currentProject.description && (
            <p className={styles.projectDescription}>{currentProject.description}</p>
          )}
        </div>
        <span className={styles.appTypeBadge}>{appTypeLabel}</span>
      </div>
      <div className={styles.infoMeta}>
        {createdDate && (
          <span className={styles.metaItem}>
            <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Created {createdDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </span>
        )}
        <span className={styles.metaItem}>
          <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          {currentProject.id}
        </span>
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
  appTypeBadge: `
    shrink-0 text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700
  `,
  infoMeta: `
    px-6 pb-6 flex gap-4 text-xs text-gray-500
  `,
  metaItem: `
    inline-flex items-center gap-1.5
  `,
  metaIcon: `
    h-3 w-3
  `,
};
