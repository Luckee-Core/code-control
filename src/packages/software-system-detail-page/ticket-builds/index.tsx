'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { detailPageStyles } from '@/components/detail-page-styles';
import { TICKET_BUILD_DETAIL_PAGE_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { getTicketBuildsBySoftwareSystemIdThunk, setCurrentTicketBuildThunk } from '@/store/thunks/ticket-builds';
import type { TicketBuild } from '@/model/ticket-build';
import { BUILD_STATUS } from '../../ticket-build-detail-page/status-badges';

/** Ticket builds of the current software system (newest first). Row → build detail. */
export const TicketBuilds = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentSoftwareSystem = useAppSelector((state) => state.currentSoftwareSystem);
  const ticketBuilds = useAppSelector((state) => state.ticketBuilds);
  const ticketBuildBuilder = useAppSelector((state) => state.ticketBuildBuilder);

  useEffect(() => {
    if (currentSoftwareSystem.id) void dispatch(getTicketBuildsBySoftwareSystemIdThunk());
  }, [currentSoftwareSystem.id, dispatch]);

  const builds = useMemo(
    () =>
      Object.values(ticketBuilds)
        .filter((build) => build.software_system_id === currentSoftwareSystem.id)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [currentSoftwareSystem.id, ticketBuilds],
  );

  const open = (build: TicketBuild) => {
    void dispatch(setCurrentTicketBuildThunk(build)).then(() => router.push(TICKET_BUILD_DETAIL_PAGE_PATH));
  };

  if (builds.length === 0) {
    return (
      <div className={detailPageStyles.panelBody}>
        <p className={styles.muted}>
          {ticketBuildBuilder.isLoadingList
            ? 'Loading…'
            : 'No ticket builds yet. Start one from a ticket in My Ops Tracker (AI pull requests → Build in Code Control).'}
        </p>
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Ticket</th>
          <th className={styles.th}>Status</th>
          <th className={styles.th}>Created</th>
        </tr>
      </thead>
      <tbody>
        {builds.map((build) => {
          const badge = BUILD_STATUS[build.status];
          return (
            <tr key={build.id} className={styles.row} onClick={() => open(build)}>
              <td className={styles.td}>{build.ops_ticket_title}</td>
              <td className={styles.td}>
                <span className={badge.className}>{badge.label}</span>
              </td>
              <td className={styles.td}>{new Date(build.created_at).toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const styles = {
  muted: `text-xs text-gray-500`,
  table: `w-full text-xs`,
  th: `text-left px-3 py-2 font-semibold uppercase tracking-wide text-[10px] text-gray-500 border-b border-gray-200`,
  row: `cursor-pointer hover:bg-gray-50`,
  td: `px-3 py-2 border-b border-gray-100 text-gray-900`,
};
