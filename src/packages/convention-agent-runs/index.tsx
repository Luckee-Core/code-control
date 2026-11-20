'use client';

import { RunsTable } from '@/components/agent-runs';
import { useBreadcrumbs } from '@/hooks';

export const ConventionAgentRuns = () => {
  useBreadcrumbs([{ label: 'Convention agent runs' }]);
  return (
    <div className={styles.page}>
      <p className={styles.intro}>After you approve a PR change, a convention agent draft appears here. Run it to compare the feedback with the catalog; accepted changes go into the conventions ledger and create template agent drafts.</p>
      <RunsTable agent="convention" emptyText="No convention agent runs yet. They are created when a PR agent run is approved." />
    </div>
  );
};

const styles = {
  page: `space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden`,
  intro: `text-xs text-gray-600 max-w-3xl leading-relaxed`,
};
