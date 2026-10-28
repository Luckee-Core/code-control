'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { STUDIO_READY_LEAD } from '@/config/studio-setup-content';
import { detailPageStyles } from '@/components/detail-page-styles';
import { DashboardQuickLinks } from './quick-links';

/**
 * Home dashboard when the local stack health check has passed.
 */
export const DashboardReadyView = () => {
  const customers = useAppSelector((state) => state.customers);
  const projects = useAppSelector((state) => state.projects);

  const { customerCount, projectCount } = useMemo(() => {
    return {
      customerCount: Object.keys(customers).length,
      projectCount: Object.keys(projects).length,
    };
  }, [customers, projects]);

  return (
    <div className={styles.page}>
      <header className={styles.headerBlock}>
        <p className={styles.connectedBadge}>Local stack connected</p>
        <h1 className={styles.title}>Home</h1>
        <p className={styles.lead}>{STUDIO_READY_LEAD}</p>
      </header>

      <div className={styles.metricsRow}>
        <div className={detailPageStyles.panel}>
          <div className={detailPageStyles.panelBody}>
            <p className={styles.metricLabel}>Customers</p>
            <p className={styles.metricValue}>{customerCount}</p>
          </div>
        </div>
        <div className={detailPageStyles.panel}>
          <div className={detailPageStyles.panelBody}>
            <p className={styles.metricLabel}>Projects</p>
            <p className={styles.metricValue}>{projectCount}</p>
          </div>
        </div>
      </div>

      <DashboardQuickLinks />
    </div>
  );
};

const styles = {
  page: `mx-auto max-w-3xl w-full flex flex-col gap-5 pb-8`,
  headerBlock: ``,
  connectedBadge: `
    inline-flex rounded-full border border-green-600/30 bg-green-50 px-2.5 py-0.5
    text-[11px] font-medium text-green-800
  `,
  title: `mt-3 text-xl font-semibold text-gray-900`,
  lead: `mt-2 text-sm text-gray-600 leading-relaxed`,
  metricsRow: `grid grid-cols-2 gap-3`,
  metricLabel: `text-xs font-medium text-gray-500 uppercase tracking-wide m-0`,
  metricValue: `mt-1 text-2xl font-semibold text-gray-900 tabular-nums m-0`,
};
