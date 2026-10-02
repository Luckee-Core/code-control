'use client';

import { useState } from 'react';
import { useBreadcrumbs } from '@/hooks';
import { Header } from './header';
import { Filters } from './filters';
import { Table } from './table';
import { FormModal } from './form-modal';

export { FormModal } from './form-modal';

export const Projects = () => {
  const [search, setSearch] = useState('');
  const [customerId, setCustomerId] = useState('');

  useBreadcrumbs([{ label: 'Projects' }]);

  return (
    <div className={styles.page}>
      <Header />
      <Filters
        search={search}
        customerId={customerId}
        onSearchChange={setSearch}
        onCustomerChange={setCustomerId}
      />
      <Table search={search} customerId={customerId} />
      <FormModal />
    </div>
  );
};

const styles = {
  page: `
    p-6 h-full flex-1 min-h-0 flex flex-col gap-4 overflow-hidden
  `,
};
