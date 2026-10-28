'use client';

import { useState } from 'react';
import { useBreadcrumbs } from '@/hooks';
import { CustomerFilters } from './filters';
import { Table } from './table';
import { FormModal } from './form-modal';

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useBreadcrumbs([{ label: 'Customers' }]);

  return (
    <div className={styles.page}>
      <CustomerFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Table searchTerm={searchTerm} />
      <FormModal />
    </div>
  );
};

const styles = {
  page: `
    space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden
  `,
};
