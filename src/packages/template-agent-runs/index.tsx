'use client';

import { RunsTable } from '@/components/agent-runs';
import { useBreadcrumbs } from '@/hooks';

export const TemplateAgentRuns = () => {
  useBreadcrumbs([{ label: 'Template agents' }]);
  return (
    <div className={styles.page}>
      <p className={styles.intro}>Applied convention changes (from the convention agent or manual edits) collect in one draft. Confirming it updates codegen templates, scaffold and ADRs in every template repo that needs the change, with one PR per repo, reviewed and merged together.</p>
      <RunsTable agent="template" emptyText="No template agent runs yet. They are created when convention changes are applied." />
    </div>
  );
};

const styles = {
  page: `space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden`,
  intro: `text-xs text-gray-600 max-w-3xl leading-relaxed`,
};
