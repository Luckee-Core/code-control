'use client';

import { useEffect, useMemo, useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { formFieldStyles } from '@/components/form-field-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateTicketBuildContractThunk } from '@/store/thunks/ticket-builds';
import { RepoPlanCard } from './repo-plan';

/**
 * The reviewed plan: summary, missing-roles note, shared contract and one card per repo.
 * Editable only while the plan is waiting for review.
 */
export const TicketBuildPlan = () => {
  const dispatch = useAppDispatch();
  const build = useAppSelector((state) => state.currentTicketBuild);
  const ticketBuildRepos = useAppSelector((state) => state.ticketBuildRepos);
  const editable = build.status === 'plan_ready';
  const [contractDraft, setContractDraft] = useState(build.contract_text);

  useEffect(() => setContractDraft(build.contract_text), [build.contract_text]);

  const repos = useMemo(
    () => Object.values(ticketBuildRepos).filter((repo) => repo.ticket_build_id === build.id).sort((a, b) => a.position - b.position),
    [build.id, ticketBuildRepos],
  );

  if (build.status === 'planning' && !build.contract_text) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelBody}>
          <p className={styles.muted}>Reading each repo and planning the change… this usually takes a few minutes.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>Plan</h2>
        {editable ? <span className={styles.hint}>Edit anything before you approve.</span> : null}
      </div>
      <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
        {build.summary ? <p className={styles.summary}>{build.summary}</p> : null}
        {build.missing_roles_note ? <p className={styles.note}>{build.missing_roles_note}</p> : null}
        <div className={formFieldStyles.field}>
          <label className={formFieldStyles.label} htmlFor="ticket-build-contract">
            Shared contract (every repo follows it exactly)
          </label>
          <textarea
            id="ticket-build-contract"
            className={`${formFieldStyles.codeTextarea} ${styles.tall}`}
            value={contractDraft}
            readOnly={!editable}
            onChange={(event) => setContractDraft(event.target.value)}
            onBlur={() => {
              if (editable && contractDraft !== build.contract_text) void dispatch(updateTicketBuildContractThunk(contractDraft));
            }}
          />
        </div>
        <div className={styles.repos}>
          {repos.map((repo) => (
            <RepoPlanCard key={repo.id} repo={repo} editable={editable} />
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  body: `flex flex-col gap-4`,
  summary: `text-sm text-gray-900`,
  note: `text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded px-3 py-2`,
  hint: `text-xs text-gray-500`,
  muted: `text-xs text-gray-500`,
  tall: `min-h-64`,
  repos: `flex flex-col gap-3`,
};
