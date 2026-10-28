'use client';

import { STUDIO_GATE_SUB, STUDIO_GATE_TITLE } from '@/config/studio-setup-content';
import { getDefaultExpressBaseUrl } from '@/config/studio-stack';
import { StudioSetupStepper } from '../setup-stepper';

/**
 * Home gate when storage, Express, or Postgres is not ready.
 */
export const DashboardOnboardingView = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{STUDIO_GATE_TITLE}</h1>
        <p className={styles.sub}>
          {STUDIO_GATE_SUB}{' '}
          <code className={styles.code}>{getDefaultExpressBaseUrl()}</code>.
        </p>
      </header>
      <StudioSetupStepper />
    </div>
  );
};

const styles = {
  page: `mx-auto max-w-3xl w-full pb-8`,
  header: `shrink-0 pb-2`,
  title: `text-xl font-semibold text-gray-900`,
  sub: `mt-2 text-sm text-gray-600 leading-relaxed`,
  code: `rounded bg-gray-100 px-1 text-xs font-mono`,
};
