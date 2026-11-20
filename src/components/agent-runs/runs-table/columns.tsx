import type { ReactNode } from 'react';
import type { AgentRunListItem } from '@/api/agent-runs';
import type { AgentKind } from '@/model/agent-run';
import { formatDateTimeWithTime } from '@/utils/date-time';
import { PILL } from '../agent-run-labels';

export type RunColumn = { label: string; render: (run: AgentRunListItem) => ReactNode };

const when = (value: string | null) => (value ? formatDateTimeWithTime(value) : '—');
const errors = (run: AgentRunListItem) => run.findings.filter((finding) => finding.severity === 'error').length;
const errorLabel = (run: AgentRunListItem) => `${errors(run)} error${errors(run) === 1 ? '' : 's'}`;
const link = (href: string | null | undefined, label: string) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(event) => event.stopPropagation()}>
      {label}
    </a>
  ) : (
    label
  );

/** Columns per agent (status and title are always first). */
export const RUN_COLUMNS: Record<AgentKind, RunColumn[]> = {
  pr: [
    { label: 'Project', render: (run) => run.software_system_name ?? '—' },
    { label: 'Repo / role', render: (run) => (run.delivery ? `${run.delivery.repo_full_name.split('/')[1]} · ${run.delivery.role}` : run.role_key ?? '—') },
    { label: 'PR', render: (run) => (run.delivery?.pr_number ? link(run.delivery.pr_url, `#${run.delivery.pr_number}`) : '—') },
    { label: 'Version', render: (run) => `v${run.version}` },
    { label: 'Files', render: (run) => (typeof run.output.edit_count === 'number' ? String(run.output.edit_count) : '—') },
    { label: 'Checks', render: (run) => (errors(run) > 0 ? <span className={`${PILL} bg-red-50 text-red-700 border-red-200`}>{errorLabel(run)}</span> : '—') },
    { label: 'Created', render: (run) => when(run.created_at) },
    { label: 'Finished', render: (run) => when(run.finished_at) },
  ],
  convention: [
    { label: 'Source', render: (run) => run.software_system_name ?? 'Manual' },
    { label: 'Role', render: (run) => run.role_key ?? '—' },
    { label: 'Proposed', render: (run) => (typeof run.output.proposed_count === 'number' ? String(run.output.proposed_count) : '—') },
    {
      label: 'Applied / rejected',
      render: (run) => (typeof run.output.applied_count === 'number' ? `${run.output.applied_count} / ${run.output.rejected_count ?? 0}` : '—'),
    },
    { label: 'Checks', render: (run) => (errors(run) > 0 ? <span className={`${PILL} bg-red-50 text-red-700 border-red-200`}>{errorLabel(run)}</span> : '—') },
    { label: 'Created', render: (run) => when(run.created_at) },
    { label: 'Decided', render: (run) => when(run.decided_at) },
  ],
  template: [
    {
      label: 'Template PRs',
      render: (run) =>
        run.template_changes.length > 0 ? (
          <span className="flex flex-col gap-0.5">
            {run.template_changes.map((change) => (
              <span key={change.id}>
                {change.repo_full_name.split('/')[1]} {change.pr_number ? link(change.pr_url, `#${change.pr_number}`) : ''} <span className="text-gray-500">({change.status})</span>
              </span>
            ))}
          </span>
        ) : (
          '—'
        ),
    },
    { label: 'Changes', render: (run) => String(((run.input.change_ids as string[] | undefined) ?? []).length) },
    { label: 'Origin', render: (run) => (run.parent_run_id ? run.software_system_name ?? 'Convention agent' : 'Manual edits') },
    { label: 'Checks', render: (run) => (errors(run) > 0 ? <span className={`${PILL} bg-red-50 text-red-700 border-red-200`}>{errorLabel(run)}</span> : '—') },
    { label: 'Created', render: (run) => when(run.created_at) },
    { label: 'Decided', render: (run) => when(run.decided_at) },
  ],
};
