'use client';

import { useEffect } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { SOFTWARE_SYSTEM_DETAIL_PAGE_PATH, SOFTWARE_SYSTEMS_PATH } from '@/config/routes';
import { TICKET_BUILD_POLL_MS } from '@/config/ticket-builds';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { getTicketBuildReposByBuildIdThunk, refreshCurrentTicketBuildThunk } from '@/store/thunks/ticket-builds';
import { TicketBuildAudit } from './audit';
import { TicketBuildPlan } from './plan';
import { isTicketBuildActive } from './status-badges';
import { TicketBuildSummaryCard } from './summary-card';

/**
 * Ticket build detail: summary + actions, the plan (review and edit), per-repo PR status, AI calls.
 * Polls the build (and its repos) while it is planning or building.
 */
export const TicketBuildDetailPage = () => {
  const dispatch = useAppDispatch();
  const build = useAppSelector((state) => state.currentTicketBuild);
  const softwareSystems = useAppSelector((state) => state.softwareSystems);

  useBreadcrumbs([
    { label: 'Projects', href: SOFTWARE_SYSTEMS_PATH },
    { label: softwareSystems[build.software_system_id]?.name ?? 'Software system', href: SOFTWARE_SYSTEM_DETAIL_PAGE_PATH },
    { label: build.ops_ticket_title || 'Ticket build' },
  ]);

  useEffect(() => {
    if (!build.id) return;
    void dispatch(refreshCurrentTicketBuildThunk());
    void dispatch(getTicketBuildReposByBuildIdThunk(build.id));
  }, [build.id, dispatch]);

  const active = build.id !== '' && isTicketBuildActive(build.status);
  useEffect(() => {
    if (!active) return undefined;
    const id = window.setInterval(() => {
      void dispatch(refreshCurrentTicketBuildThunk()).then(() => dispatch(getTicketBuildReposByBuildIdThunk(build.id)));
    }, TICKET_BUILD_POLL_MS);
    return () => window.clearInterval(id);
  }, [active, build.id, dispatch]);

  if (!build.id) {
    return (
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>No ticket build selected</p>
          <a href={SOFTWARE_SYSTEMS_PATH} className={detailPageStyles.emptyLink}>
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={detailPageStyles.page}>
      <TicketBuildSummaryCard />
      <TicketBuildPlan />
      <TicketBuildAudit />
    </div>
  );
};
