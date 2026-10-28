'use client';

import Link from 'next/link';
import { DASHBOARD_PATH } from '@/config/routes';

type WorkspaceLoadBannerProps = {
  onDismiss: () => void;
};

export const WorkspaceLoadBanner = ({ onDismiss }: WorkspaceLoadBannerProps) => {
  return (
    <div className={styles.bar} role="status">
      <p className={styles.text}>
        Couldn&apos;t load workspace data. Storage Express may not be running.{' '}
        <Link href={DASHBOARD_PATH} className={styles.link}>
          Check setup on Home
        </Link>
      </p>
      <button type="button" onClick={onDismiss} className={styles.dismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};

const styles = {
  bar: `
    flex items-center justify-between gap-3 px-4 py-2
    bg-amber-50 border-b border-amber-300 text-amber-950
  `,
  text: `
    text-sm m-0
  `,
  link: `
    font-medium text-amber-900 underline hover:text-amber-950
  `,
  dismiss: `
    shrink-0 text-lg leading-none text-amber-800 hover:text-amber-950
    bg-transparent border-none cursor-pointer px-1
  `,
};
