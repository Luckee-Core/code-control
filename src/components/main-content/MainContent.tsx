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
        {children}
      </div>
    </main>
  );
};

const styles = {
  main: `
    flex-1 flex flex-col overflow-hidden
  `,
  breadcrumbsWrapper: `
    py-2 border-b border-border bg-card shrink-0
  `,
  content: `
    flex-1 min-h-0 flex flex-col overflow-hidden
  `,
};
