'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { SEVERITY_BADGE, STATUS_BADGE, badgeBase } from '@/packages/conventions/badges';
import { useAppSelector } from '@/store';
import { formatDate } from '@/utils/date-time';
import { DeleteButton } from './header/buttons/delete';
import { EditButton } from './header/buttons/edit';
import { StatusButton } from './header/buttons/status';

export const Overview = () => {
  const current = useAppSelector((state) => state.currentConvention);
  const catalog = useAppSelector((state) => state.conventionsCatalog);

  const topicName = useMemo(
    () => catalog.topics.find((topic) => topic.key === current.topic_key)?.name ?? current.topic_key,
    [catalog.topics, current.topic_key],
  );
  const roleNames = useMemo(
    () =>
      current.role_keys
        .map((key) => catalog.repo_roles.find((role) => role.key === key)?.name ?? key)
        .join(', '),
    [catalog.repo_roles, current.role_keys],
  );

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <div className={styles.badges}>
            <span className={`${badgeBase} ${SEVERITY_BADGE[current.severity]}`}>{current.severity}</span>
            <span className={`${badgeBase} ${STATUS_BADGE[current.status]}`}>{current.status}</span>
          </div>
          <h2 className={detailPageStyles.panelTitle}>{current.title}</h2>
          <p className={styles.key}>{current.key}</p>
        </div>
        <div className={styles.actions}>
          <StatusButton />
          <EditButton />
          <DeleteButton />
        </div>
      </div>
      <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
        <div>
          <p className={detailPageStyles.fieldLabel}>Statement</p>
          <p className={styles.text}>{current.statement}</p>
        </div>
        {current.rationale ? (
          <div>
            <p className={detailPageStyles.fieldLabel}>Why</p>
            <p className={styles.text}>{current.rationale}</p>
          </div>
        ) : null}
        <div className={styles.metaGrid}>
          <div>
            <p className={detailPageStyles.fieldLabel}>Topic</p>
            <p className={styles.meta}>{topicName}</p>
          </div>
          <div>
            <p className={detailPageStyles.fieldLabel}>Repo roles</p>
            <p className={styles.meta}>{roleNames || '—'}</p>
          </div>
          <div>
            <p className={detailPageStyles.fieldLabel}>Automatic check</p>
            <p className={styles.meta}>{current.check_kind === 'none' ? 'None' : current.check_kind}</p>
          </div>
          <div>
            <p className={detailPageStyles.fieldLabel}>Updated</p>
            <p className={styles.meta}>{current.updated_at ? formatDate(current.updated_at) : '—'}</p>
          </div>
        </div>
        {current.check_config ? (
          <div>
            <p className={detailPageStyles.fieldLabel}>Check config</p>
            <pre className={styles.code}>{JSON.stringify(current.check_config, null, 2)}</pre>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  badges: `flex items-center gap-1.5 mb-1.5`,
  key: `mt-0.5 font-mono text-[11px] text-gray-500`,
  actions: `flex items-center gap-2 flex-wrap`,
  body: `flex flex-col gap-4`,
  text: `mt-1 text-sm text-gray-900 whitespace-pre-wrap`,
  metaGrid: `grid grid-cols-2 md:grid-cols-4 gap-4`,
  meta: `mt-1 text-xs text-gray-800`,
  code: `
    mt-1 text-[11px] font-mono bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto text-gray-800
  `,
};
