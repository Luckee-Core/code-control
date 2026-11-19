'use client';

import { useEffect, useState } from 'react';
import { formFieldStyles } from '@/components/form-field-styles';
import { useAppDispatch } from '@/store';
import { updateTicketBuildRepoThunk } from '@/store/thunks/ticket-builds';
import type { TicketBuildRepo } from '@/model/ticket-build-repo';
import { REPO_STATUS } from '../../status-badges';

type RepoPlanCardProps = {
  repo: TicketBuildRepo;
  editable: boolean;
};

/** One repo's plan: role, include toggle, plan text (saved on blur), PR status once building. */
export const RepoPlanCard = (props: RepoPlanCardProps) => {
  const { repo, editable } = props;
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState(repo.plan_text);
  useEffect(() => setDraft(repo.plan_text), [repo.plan_text]);
  const badge = REPO_STATUS[repo.status];

  return (
    <div className={repo.included ? styles.card : styles.cardMuted}>
      <div className={styles.header}>
        <span className={styles.role}>{repo.role}</span>
        <span className={styles.name}>{repo.repo_full_name}</span>
        <span className={badge.className}>{badge.label}</span>
        {repo.pr_url ? (
          <a href={repo.pr_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Pull request{repo.pr_number ? ` #${repo.pr_number}` : ''}
          </a>
        ) : null}
        {editable ? (
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={repo.included}
              onChange={(event) => void dispatch(updateTicketBuildRepoThunk(repo.id, { included: event.target.checked }))}
            />
            Include
          </label>
        ) : null}
      </div>
      {repo.error ? <p className={styles.error}>{repo.error}</p> : null}
      <textarea
        aria-label={`Plan for ${repo.repo_full_name}`}
        className={`${formFieldStyles.codeTextarea} ${styles.text}`}
        value={draft}
        readOnly={!editable}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (editable && draft !== repo.plan_text) void dispatch(updateTicketBuildRepoThunk(repo.id, { planText: draft }));
        }}
      />
    </div>
  );
};

const styles = {
  card: `flex flex-col gap-2 border border-gray-200 rounded p-3`,
  cardMuted: `flex flex-col gap-2 border border-gray-200 rounded p-3 bg-gray-50 opacity-75`,
  header: `flex flex-wrap items-center gap-2`,
  role: `inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200`,
  name: `text-xs font-medium text-gray-900`,
  link: `text-xs font-medium text-blue-700 hover:underline`,
  toggle: `ml-auto flex items-center gap-1 text-xs text-gray-700 cursor-pointer`,
  error: `text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1 whitespace-pre-wrap`,
  text: `min-h-40`,
};
