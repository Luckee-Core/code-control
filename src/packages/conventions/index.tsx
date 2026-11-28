'use client';

import { useEffect, useState } from 'react';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch } from '@/store';
import { getConventionsThunk } from '@/store/thunks/conventions';
import { Filters } from './filters';
import { FormModal } from './form-modal';
import { Table } from './table';

export { FormModal } from './form-modal';

export const Conventions = () => {
  const dispatch = useAppDispatch();
  const [loadFailed, setLoadFailed] = useState(false);

  useBreadcrumbs([{ label: 'Conventions' }]);

  useEffect(() => {
    void dispatch(getConventionsThunk()).then((status) => setLoadFailed(status !== 200));
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <Filters />
      {loadFailed ? <p className={styles.error}>Could not load conventions. Is the storage server reachable?</p> : null}
      <Table />
      <FormModal />
    </div>
  );
};

const styles = {
  page: `
    space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden
  `,
  error: `
    text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2
  `,
};
