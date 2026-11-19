'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formFieldStyles } from '@/components/form-field-styles';
import { TICKET_BUILD_DETAIL_PAGE_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { createTicketBuildThunk, openTicketBuildByIdThunk } from '@/store/thunks/ticket-builds';
import { getAllSoftwareSystemsThunk } from '@/store/thunks/software-systems';

const StartTicketBuild = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const opsTicketId = params.get('opsTicketId')?.trim() ?? '';
  const buildId = params.get('buildId')?.trim() ?? '';
  const softwareSystems = useAppSelector((state) => state.softwareSystems);
  const [error, setError] = useState<string | null>(null);
  const [systemId, setSystemId] = useState('');
  const started = useRef(false);

  const systems = useMemo(() => Object.values(softwareSystems).sort((a, b) => a.name.localeCompare(b.name)), [softwareSystems]);

  const start = (softwareSystemId: string | null) => {
    setError(null);
    void dispatch(createTicketBuildThunk(opsTicketId, softwareSystemId)).then((result) => {
      if (result.ok) {
        router.replace(TICKET_BUILD_DETAIL_PAGE_PATH);
        return;
      }
      setError(result.error);
      void dispatch(getAllSoftwareSystemsThunk());
    });
  };

  useEffect(() => {
    if (started.current) return;
    if (buildId) {
      started.current = true;
      void dispatch(openTicketBuildByIdThunk(buildId)).then((result) => {
        if (result.ok) router.replace(TICKET_BUILD_DETAIL_PAGE_PATH);
        else setError(result.error);
      });
      return;
    }
    if (!opsTicketId) return;
    started.current = true;
    start(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildId, opsTicketId]);

  if (!opsTicketId && !buildId) {
    return <p className={detailPageStyles.fieldValue}>Open this page from a My Ops Tracker ticket (missing opsTicketId).</p>;
  }
  if (buildId && error) return <p className={styles.error}>{error}</p>;
  if (!error) return <p className={styles.muted}>Starting the ticket build…</p>;

  return (
    <div className={styles.form}>
      <p className={styles.error}>{error}</p>
      <div className={formFieldStyles.field}>
        <label className={formFieldStyles.label} htmlFor="ticket-build-system">
          Build in software system
        </label>
        <select id="ticket-build-system" className={formFieldStyles.select} value={systemId} onChange={(event) => setSystemId(event.target.value)}>
          <option value="">Choose…</option>
          {systems.map((system) => (
            <option key={system.id} value={system.id}>
              {system.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button type="button" className={detailPageStyles.primaryButton} disabled={!systemId} onClick={() => start(systemId)}>
          Start build
        </button>
      </div>
    </div>
  );
};

/**
 * Entry from My Ops Tracker: ?opsTicketId= creates or opens the ticket's active build; ?buildId= opens
 * that build. Then shows the build detail page.
 * If no software system matches the ticket's repos, asks which one to use.
 */
export const TicketBuildStartPage = () => (
  <div className={detailPageStyles.page}>
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h1 className={detailPageStyles.panelTitle}>New ticket build</h1>
      </div>
      <div className={detailPageStyles.panelBody}>
        <Suspense fallback={<p className={styles.muted}>Loading…</p>}>
          <StartTicketBuild />
        </Suspense>
      </div>
    </section>
  </div>
);

const styles = {
  muted: `text-xs text-gray-500`,
  form: `flex flex-col gap-3 max-w-md`,
  error: `text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
};
