'use client';

import { useAppSelector } from '@/store';
import { AddEntityForm } from './AddEntityForm';
import { EntityCard } from './EntityCard';
import { EntityTaskStatusOverview } from './EntityTaskStatusOverview';

const styles = {
  section: `
    flex flex-col gap-4
  `,
  title: `
    text-lg font-semibold text-gray-900 mb-4
  `,
  empty: `
    flex flex-col items-center justify-center py-16 text-gray-500
  `,
  emptyIcon: `
    h-10 w-10 mb-3 opacity-50
  `,
  emptyText: `
    text-sm
  `,
  entityContainer: `
    space-y-3
  `,
};

export const EntitiesSection = () => {
  const currentProject = useAppSelector((state) => state.currentProject);
  const entities = useAppSelector((state) => state.dataEntities);

  if (!currentProject?.id) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Entities</h2>
      <EntityTaskStatusOverview />
      <AddEntityForm projectId={currentProject.id} />
      {entities.length === 0 ? (
        <div className={styles.empty}>
          <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className={styles.emptyText}>No entities yet. Add your first entity above.</p>
        </div>
      ) : (
        <div className={styles.entityContainer}>
          {entities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} />
          ))}
        </div>
      )}
    </section>
  );
};
