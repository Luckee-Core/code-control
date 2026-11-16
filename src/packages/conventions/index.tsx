'use client';

import { useEffect, useState } from 'react';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch } from '@/store';
import { getAllConventionsThunk, getConventionOptionsThunk } from '@/store/thunks/conventions';
import { Filters, type ConventionFilters } from './filters';
import { Table } from './table';
import { FormModal } from './form-modal';

const EMPTY_FILTERS: ConventionFilters = { search: '', topicKey: '', severity: '', status: '' };

export const Conventions = () => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<ConventionFilters>(EMPTY_FILTERS);

  useBreadcrumbs([{ label: 'Conventions' }]);

  useEffect(() => {
    void dispatch(getConventionOptionsThunk());
    void dispatch(getAllConventionsThunk());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <Filters filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
      <Table filters={filters} />
      <FormModal />
    </div>
  );
};

const styles = {
  page: `
    space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden
  `,
};
