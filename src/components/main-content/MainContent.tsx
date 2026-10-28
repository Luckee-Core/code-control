'use client';

import { Breadcrumbs } from '../breadcrumbs';

type MainContentProps = {
  children: React.ReactNode;
};

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <main className={styles.main}>
      <div className={styles.breadcrumbsWrapper}>
        <Breadcrumbs />
      </div>
      <div className={styles.content}>
        <div className={styles.pageSlot}>{children}</div>
      </div>
    </main>
  );
};

const styles = {
  main: `
    flex-1 flex flex-col overflow-hidden min-w-0 bg-gray-50
  `,
  breadcrumbsWrapper: `
    py-2 border-b border-gray-300 bg-white shrink-0
  `,
  content: `
    flex-1 min-h-0 overflow-y-auto p-3
  `,
  pageSlot: `
    w-full min-h-min
  `,
};
