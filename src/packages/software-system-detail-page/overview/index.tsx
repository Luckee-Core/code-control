'use client';

import { useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formatDate } from '@/utils/date-time';

export const Overview = () => {
  const currentSoftwareSystem = useAppSelector((state) => state.currentSoftwareSystem);

  if (!currentSoftwareSystem.id) {
    return null;
  }

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>{currentSoftwareSystem.name}</h2>
          {currentSoftwareSystem.description ? (
            <p className={detailPageStyles.panelSubtitle}>{currentSoftwareSystem.description}</p>
          ) : null}
        </div>
      </div>
      <div className={detailPageStyles.panelBody}>
        <div className={styles.metaRow}>
          {currentSoftwareSystem.created_at ? (
            <span className={styles.metaItem}>
              Created {formatDate(currentSoftwareSystem.created_at)}
            </span>
          ) : null}
          <span className={styles.metaItem}>{currentSoftwareSystem.id}</span>
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
