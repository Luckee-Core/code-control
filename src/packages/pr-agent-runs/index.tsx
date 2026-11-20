'use client';

import { RunsTable } from '@/components/agent-runs';
import { useBreadcrumbs } from '@/hooks';

export const PrAgentRuns = () => {
  useBreadcrumbs([{ label: 'PR feedback' }]);
  return (
    <div className={styles.page}>
      <p className={styles.intro}>Feedback you gave on generated PRs (Update PR on a project's Data access rows). Each run proposes edits to that PR only; approving commits them and creates a convention agent draft.</p>
      <RunsTable agent="pr" emptyText="No PR feedback yet. Press Update PR on a Data access row of a software system to start." />
    </div>
  );
};

const styles = {
  page: `space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden`,
  intro: `text-xs text-gray-600 max-w-3xl leading-relaxed`,
};
