'use client';

import { useBreadcrumbs } from '@/hooks';
import { Header } from './header';
import { Table } from './table';
import { FormModal } from './form-modal';

export const Customers = () => {
  useBreadcrumbs([{ label: 'Customers' }]);

  return (
    <div className={styles.page}>
      <Header />
      <Table />
      <FormModal />
    </div>
  );
};

const styles = {
  page: `
    p-6 h-full flex-1 min-h-0 flex flex-col gap-4 overflow-hidden
  `,
};
