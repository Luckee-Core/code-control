'use client';

import { ARDTable } from './table';

export const ARDManager = () => {
  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <ARDTable />
      </div>
    </div>
  );
};

const styles = {
  container: `
    flex flex-col h-full
  `,
  tableWrapper: `
    flex-1 overflow-y-auto scrollbar-thin p-2
  `,
};
