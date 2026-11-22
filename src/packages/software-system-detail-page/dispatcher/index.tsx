'use client';

import { useEffect, useMemo, useRef } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { getDataModelProposalsThunk } from '@/store/thunks/data-model-proposals';
import { getDispatcherPlanThunk } from '@/store/thunks/software-systems';
import { Deliver } from '../data-model/proposal/deliver';
import { DeliveryAiCalls } from '../delivery-ai-calls';
import { DeliveryScreenshot } from '../delivery-screenshot';

/**
 * Dispatcher tab: puts the project behind the studio's main gateway. Shows the plan (ids, ports,
 * services, spawn folders, secret names, exposed paths), then delivers it as four PRs: storage
 * catalog seed, project dispatcher, dispatcher web and the main gateway registration.
 */
export const Dispatcher = () => {
  const dispatch = useAppDispatch();
  const softwareSystemId = useAppSelector((state) => state.currentSoftwareSystem.id);
  const loadedFor = useAppSelector((state) => state.dataModelBuilder.softwareSystemId);
  const isLoading = useAppSelector((state) => state.dataModelBuilder.isLoading);
  const proposalsById = useAppSelector((state) => state.dataModelProposals);
  const plan = useAppSelector((state) => (softwareSystemId ? state.dispatcherPlans[softwareSystemId] : undefined));
  const planStatus = useAppSelector((state) => state.dataModelDeliveryBuilder.planStatus);
  const planError = useAppSelector((state) => state.dataModelDeliveryBuilder.planError);
  const deliveringRole = useAppSelector((state) => state.dataModelDeliveryBuilder.deliveringRole);

  useEffect(() => {
    if (softwareSystemId && loadedFor !== softwareSystemId) void dispatch(getDataModelProposalsThunk());
  }, [dispatch, softwareSystemId, loadedFor]);

  useEffect(() => {
    if (softwareSystemId) void dispatch(getDispatcherPlanThunk());
  }, [dispatch, softwareSystemId]);

  // A delivery stores the ports and may link the main gateway repo: reload the plan when it finishes.
  const wasDelivering = useRef(false);
  useEffect(() => {
    if (deliveringRole) {
      wasDelivering.current = true;
      return;
    }
    if (wasDelivering.current) {
      wasDelivering.current = false;
      void dispatch(getDispatcherPlanThunk());
    }
  }, [dispatch, deliveringRole]);

  const approved = useMemo(
    () =>
      Object.values(proposalsById).find(
        (proposal) => proposal.software_system_id === softwareSystemId && proposal.status === 'approved' && proposal.proposal,
      ),
    [proposalsById, softwareSystemId],
  );

  if (!softwareSystemId) return null;

  if (!approved?.proposal) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{isLoading ? 'Loading…' : 'No approved data model yet'}</p>
          <p className={styles.emptyText}>
            Approve a version in the <strong>Data model</strong> tab. This tab then puts the project behind the studio&apos;s
            main gateway: a loopback project dispatcher that starts storage and the API, its operator page, the storage
            catalog of exposed paths, and the main gateway registration.
          </p>
        </div>
      </section>
    );
  }

  const services = plan
    ? [
        { id: plan.service_ids.storage, role: 'Storage', repo: plan.repos.storage, port: plan.ports.storage, prefix: '/api/storage', cwd: plan.cwd.storage },
        { id: plan.service_ids.api, role: 'API', repo: plan.repos.express, port: plan.ports.api, prefix: plan.api_path_prefix, cwd: plan.cwd.express },
        { id: plan.service_ids.gateway, role: 'Dispatcher', repo: plan.repos.dispatcher, port: plan.ports.dispatcher, prefix: plan.gateway_path_prefix, cwd: plan.cwd.dispatcher },
        { id: `${plan.project_id}-dispatcher-web`, role: 'Dispatcher web', repo: plan.repos.dispatcher_web, port: plan.ports.web, prefix: '—', cwd: plan.cwd.dispatcher_web },
      ]
    : [];

  return (
    <div className={styles.stack}>
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <div>
            <h2 className={detailPageStyles.panelTitle}>Project dispatcher</h2>
            <p className={detailPageStyles.panelSubtitle}>
              Follows the Project dispatcher conventions. Other devices call the main gateway at{' '}
              <code className={styles.code}>http://&lt;studio&gt;:3010/{plan?.project_id ?? '{project}'}/api/…</code>; it starts this
              project&apos;s dispatcher, which starts storage and the API on loopback and forwards only the exposed paths below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void dispatch(getDispatcherPlanThunk())}
            disabled={planStatus === 'loading'}
            className={`${detailPageStyles.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {planStatus === 'loading' ? 'Loading…' : 'Refresh'}
          </button>
        </div>
        {planError ? <p className={styles.error}>{planError}</p> : null}
        {plan && plan.problems.length > 0 ? (
          <div className={styles.warn} role="status">
            <p className={styles.warnTitle}>Before delivering</p>
            <ul className={styles.warnList}>
              {plan.problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {plan ? (
          <>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className={detailPageStyles.fieldLabel}>Project id</dt>
                <dd className={styles.mono}>{plan.project_id}</dd>
              </div>
              <div className={styles.fact}>
                <dt className={detailPageStyles.fieldLabel}>Ports</dt>
                <dd className={styles.mono}>
                  {plan.ports.dispatcher}–{plan.ports.web}{' '}
                  <span className={styles.muted}>{plan.ports_saved ? '(assigned)' : '(proposed; kept on first delivery)'}</span>
                </dd>
              </div>
              <div className={styles.fact}>
                <dt className={detailPageStyles.fieldLabel}>Spawn root</dt>
                <dd className={styles.mono}>{plan.spawn_root}</dd>
              </div>
              <div className={styles.fact}>
                <dt className={detailPageStyles.fieldLabel}>Main gateway secrets</dt>
                <dd className={styles.mono}>
                  {plan.secrets.main_gate}, {plan.secrets.main_admin}{' '}
                  <span className={styles.muted}>(generated at runtime)</span>
                </dd>
              </div>
              <div className={styles.fact}>
                <dt className={detailPageStyles.fieldLabel}>Storage secret (dispatcher)</dt>
                <dd className={styles.mono}>
                  {plan.secrets.storage} <span className={styles.muted}>(generated at runtime)</span>
                </dd>
              </div>
              <div className={styles.fact}>
                <dt className={detailPageStyles.fieldLabel}>Session tables</dt>
                <dd className={styles.mono}>{plan.session_slug}_dispatcher / _storage / _api_sessions</dd>
              </div>
            </dl>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Service</th>
                    <th className={styles.th}>Registry id</th>
                    <th className={styles.th}>Repo</th>
                    <th className={styles.th}>Port</th>
                    <th className={styles.th}>Path prefix</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.role} className={styles.row} title={service.cwd}>
                      <td className={styles.tdName}>{service.role}</td>
                      <td className={styles.tdMono}>{service.id}</td>
                      <td className={styles.tdMono}>{service.repo}</td>
                      <td className={styles.tdMono}>127.0.0.1:{service.port}</td>
                      <td className={styles.tdMono}>{service.prefix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.subhead}>Exposed paths (storage catalog seed)</div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Method</th>
                    <th className={styles.th}>Path</th>
                    <th className={styles.th}>Service</th>
                    <th className={styles.th}>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.endpoints.map((endpoint) => (
                    <tr key={endpoint.id} className={styles.row}>
                      <td className={styles.tdMethod}>{endpoint.method}</td>
                      <td className={styles.tdMono}>{endpoint.path}</td>
                      <td className={styles.tdMono}>{endpoint.service_id}</td>
                      <td className={styles.tdText}>{endpoint.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : planStatus === 'loading' ? (
          <p className={styles.loading}>Loading the plan…</p>
        ) : null}
      </section>
      <DeliveryScreenshot
        proposalId={approved.id}
        kind="dispatcher"
        role="dispatcher-web"
        subtitle="The dispatcher web this delivery generates: start/stop storage and the API, the gate paths with toggles and Try. The same screenshot goes in the dispatcher web PR."
        alt="Generated dispatcher web: storage and API sections with their gate paths"
      />
      <Deliver proposalId={approved.id} kind="dispatcher" />
      <DeliveryAiCalls kind="dispatcher" area="Dispatcher" />
    </div>
  );
};

const styles = {
  stack: `flex flex-col gap-5`,
  empty: `px-6 py-10 flex flex-col gap-2 max-w-xl`,
  emptyTitle: `text-sm font-semibold text-gray-900`,
  emptyText: `text-xs text-gray-600 leading-relaxed`,
  code: `font-mono text-[11px] bg-gray-100 px-1 py-0.5 rounded`,
  error: `px-4 py-2 text-xs text-red-700`,
  loading: `px-4 py-3 text-xs text-gray-500`,
  warn: `mx-4 mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900`,
  warnTitle: `font-semibold mb-1`,
  warnList: `list-disc pl-4 flex flex-col gap-0.5`,
  facts: `px-4 py-3 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 border-b border-gray-200`,
  fact: `flex flex-col gap-0.5 min-w-0`,
  mono: `font-mono text-[11px] text-gray-900 break-all`,
  muted: `font-sans text-gray-500`,
  subhead: `px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-t border-gray-200`,
  tableWrap: `overflow-x-auto`,
  table: `w-full text-xs`,
  th: `px-4 py-2 text-left font-medium text-gray-500 bg-gray-50 border-b border-gray-200`,
  row: `border-b border-gray-100 last:border-b-0`,
  tdName: `px-4 py-1.5 font-medium text-gray-900`,
  tdMono: `px-4 py-1.5 font-mono text-[11px] text-gray-600`,
  tdMethod: `px-4 py-1.5 font-mono text-[11px] font-semibold text-gray-900`,
  tdText: `px-4 py-1.5 text-gray-600`,
};
