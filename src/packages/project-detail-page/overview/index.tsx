'use client';

import { useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formatDate } from '@/utils/date-time';

export const Overview = () => {
  const currentProject = useAppSelector((state) => state.currentProject);

  if (!currentProject.id) {
    return null;
  }

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>{currentProject.name}</h2>
          {currentProject.description ? (
            <p className={detailPageStyles.panelSubtitle}>{currentProject.description}</p>
          ) : null}
        </div>
      </div>
      <div className={detailPageStyles.panelBody}>
        <div className={styles.metaRow}>
          {currentProject.created_at ? (
            <span className={styles.metaItem}>
              Created {formatDate(currentProject.created_at)}
            </span>
          ) : null}
          <span className={styles.metaItem}>{currentProject.id}</span>
        </div>
      </div>
    </section>
  );
};

const styles = {
  metaRow: `
    flex flex-wrap gap-4 text-xs text-gray-500
  `,
  metaItem: `
    inline-flex items-center gap-1.5
  `,
};
