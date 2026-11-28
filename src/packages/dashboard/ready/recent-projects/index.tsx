'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { detailPageStyles } from '@/components/detail-page-styles';
import { SOFTWARE_SYSTEM_DETAIL_PAGE_PATH } from '@/config/routes';
import type { SoftwareSystem } from '@/model/software-system';
import { useAppDispatch, useAppSelector } from '@/store';
import { getRecentSoftwareSystemOpensThunk, setCurrentSoftwareSystemThunk } from '@/store/thunks/software-systems';
import { formatTimeAgo } from '@/utils/date-time';

/** How many to show. */
const SHOWN = 5;
/** Fetch a few extra so deleted systems can be dropped and still leave five. */
const FETCHED = 10;

/**
 * The last five software systems someone opened, newest first.
 */
export const RecentProjects = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const opens = useAppSelector((state) => state.recentSoftwareSystemOpens);
  const systems = useAppSelector((state) => state.softwareSystems);
  const customers = useAppSelector((state) => state.customers);

  useEffect(() => {
    void dispatch(getRecentSoftwareSystemOpensThunk(FETCHED));
  }, [dispatch]);

  const recent = useMemo(
    () =>
      Object.values(opens)
        .filter((open) => systems[open.software_system_id])
        .sort((a, b) => b.last_opened_at.localeCompare(a.last_opened_at))
        .slice(0, SHOWN)
        .map((open) => ({ system: systems[open.software_system_id] as SoftwareSystem, openedAt: open.last_opened_at })),
    [opens, systems],
  );

  const handleOpen = async (system: SoftwareSystem) => {
    const status = await dispatch(setCurrentSoftwareSystemThunk(system));
    if (status === 200) router.push(SOFTWARE_SYSTEM_DETAIL_PAGE_PATH);
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>Recent projects</h2>
      </div>
      <div className={detailPageStyles.panelBody}>
        {recent.length === 0 ? (
          <p className={styles.empty}>Projects you open will show up here.</p>
        ) : (
          <ul className={styles.list}>
            {recent.map(({ system, openedAt }) => (
              <li key={system.id}>
                <button type="button" onClick={() => void handleOpen(system)} className={styles.row}>
                  <span className={styles.name}>{system.name}</span>
                  <span className={styles.customer}>{customers[system.customer_id]?.name ?? ''}</span>
                  <span className={styles.when}>{formatTimeAgo(openedAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

const styles = {
  empty: `text-sm text-gray-500 m-0`,
  list: `flex flex-col divide-y divide-gray-200`,
  row: `
    w-full flex items-center gap-3 px-1 py-2.5 text-left rounded
    hover:bg-gray-50 cursor-pointer
  `,
  name: `text-sm font-medium text-blue-700 truncate`,
  customer: `text-xs text-gray-500 truncate`,
  when: `ml-auto shrink-0 text-xs text-gray-500 tabular-nums`,
};
