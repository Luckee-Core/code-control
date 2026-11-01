'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { CustomerOpsSyncBuilderActions } from '@/store/builders/customerOpsSyncBuilder';
import { applyCustomerOpsSyncThunk } from '@/store/thunks/customer-ops-sync';

const modalStyles = {
  overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4`,
  modal: `max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl flex flex-col`,
  header: `border-b border-gray-200 px-4 py-3`,
  title: `text-base font-semibold text-gray-900 m-0`,
  body: `overflow-y-auto px-4 py-3 flex flex-col gap-4`,
  footer: `border-t border-gray-200 px-4 py-3 flex justify-end gap-2`,
  table: `w-full text-sm border-collapse`,
  th: `text-left text-xs font-medium text-gray-500 border-b border-gray-200 py-2`,
  td: `py-2 border-b border-gray-100 align-top`,
  error: `text-sm text-red-600 m-0`,
  muted: `text-xs text-gray-500 m-0`,
  btnSecondary: `rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50`,
  btnPrimary: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800 disabled:opacity-50`,
};

/**
 * Modal to compare legacy local customers with Ops CRM and apply sync.
 */
export const CustomerOpsSyncModal = () => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.customerOpsSyncBuilder);
  const projects = useAppSelector((state) => state.softwareSystems);

  const projectCountByCustomer = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const project of Object.values(projects)) {
      counts[project.customer_id] = (counts[project.customer_id] ?? 0) + 1;
    }
    return counts;
  }, [projects]);

  if (!builder.isModalOpen) {
    return null;
  }

  const handleClose = () => {
    dispatch(CustomerOpsSyncBuilderActions.closeModal());
  };

  const handleApply = () => {
    void dispatch(applyCustomerOpsSyncThunk());
  };

  const payload = builder.comparePayload;
  const canApply =
    payload &&
    payload.localCustomers.length > 0 &&
    payload.localCustomers.every((local) => {
      const d = builder.draftDecisions[local.id];
      if (!d) return false;
      if (d.action === 'link') return Boolean(d.opsCustomerId);
      return true;
    });

  return (
    <div className={modalStyles.overlay} onClick={handleClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>Sync customers with Ops</h2>
          <p className={modalStyles.muted}>
            Match legacy Code Control customers to My Ops CRM, then remap software workspaces.
          </p>
        </div>
        <div className={modalStyles.body}>
          {builder.compareLoading && <p className={modalStyles.muted}>Loading compare…</p>}
          {builder.compareError && <p className={modalStyles.error}>{builder.compareError}</p>}
          {builder.applyError && <p className={modalStyles.error}>{builder.applyError}</p>}
          {payload && (
            <>
              <p className={modalStyles.muted}>
                Local {payload.summary.localCount} · Ops {payload.summary.opsCount} · Unmatched local{' '}
                {payload.summary.unmatchedLocalCount}
              </p>
              {payload.localCustomers.length === 0 ? (
                <p className={modalStyles.muted}>No legacy local customers — already synced.</p>
              ) : (
                <table className={modalStyles.table}>
                  <thead>
                    <tr>
                      <th className={modalStyles.th}>Local customer</th>
                      <th className={modalStyles.th}>Workspaces</th>
                      <th className={modalStyles.th}>Action</th>
                      <th className={modalStyles.th}>Ops customer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payload.localCustomers.map((local) => {
                      const draft = builder.draftDecisions[local.id] ?? { action: 'create' as const };
                      return (
                        <tr key={local.id}>
                          <td className={modalStyles.td}>
                            <strong>{local.name}</strong>
                            <div className={modalStyles.muted}>{local.stage}</div>
                          </td>
                          <td className={modalStyles.td}>{projectCountByCustomer[local.id] ?? 0}</td>
                          <td className={modalStyles.td}>
                            <label className="flex flex-col gap-1 text-xs">
                              <span>
                                <input
                                  type="radio"
                                  checked={draft.action === 'link'}
                                  onChange={() =>
                                    dispatch(
                                      CustomerOpsSyncBuilderActions.setDraftDecision({
                                        localCustomerId: local.id,
                                        decision: {
                                          action: 'link',
                                          opsCustomerId: draft.opsCustomerId ?? payload.opsCustomers[0]?.id,
                                        },
                                      }),
                                    )
                                  }
                                />{' '}
                                Link
                              </span>
                              <span>
                                <input
                                  type="radio"
                                  checked={draft.action === 'create'}
                                  onChange={() =>
                                    dispatch(
                                      CustomerOpsSyncBuilderActions.setDraftDecision({
                                        localCustomerId: local.id,
                                        decision: { action: 'create' },
                                      }),
                                    )
                                  }
                                />{' '}
                                Create in Ops
                              </span>
                            </label>
                          </td>
                          <td className={modalStyles.td}>
                            {draft.action === 'link' ? (
                              <select
                                className="w-full rounded border border-gray-300 text-sm"
                                value={draft.opsCustomerId ?? ''}
                                onChange={(e) =>
                                  dispatch(
                                    CustomerOpsSyncBuilderActions.setDraftDecision({
                                      localCustomerId: local.id,
                                      decision: { action: 'link', opsCustomerId: e.target.value },
                                    }),
                                  )
                                }
                              >
                                <option value="">Select…</option>
                                {payload.opsCustomers.map((ops) => (
                                  <option key={ops.id} value={ops.id}>
                                    {ops.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={modalStyles.muted}>New Ops row</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
        <div className={modalStyles.footer}>
          <button type="button" className={modalStyles.btnSecondary} onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className={modalStyles.btnPrimary}
            disabled={!canApply || builder.applyLoading}
            onClick={handleApply}
          >
            {builder.applyLoading ? 'Applying…' : 'Apply sync'}
          </button>
        </div>
      </div>
    </div>
  );
};
