'use client';

import { useAppSelector } from '@/store';

export const ProjectsHeader = () => {
  const projects = useAppSelector((state) => state.projects);
  const countLabel = `${projects.length} project${projects.length !== 1 ? 's' : ''}`;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <div className={styles.sectionSummary}>
          <span className={styles.sectionTitle}>{countLabel}</span>
          <span className={styles.sectionDivider}>•</span>
          <span className={styles.sectionMeta}>
            Customer build projects
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: `
    mb-3
  `,
  sectionHeaderRow: `
    flex justify-between items-center mb-3
  `,
  sectionSummary: `
    flex items-center gap-1.5
  `,
  sectionTitle: `
    text-base font-semibold text-gray-900
  `,
  sectionDivider: `
    text-gray-300 text-sm
  `,
  sectionMeta: `
    text-xs text-gray-500
  `,
};
