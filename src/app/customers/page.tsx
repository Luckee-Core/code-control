'use client';

import { CustomersList } from '@/packages/customers';
import { useBreadcrumbs } from '@/hooks';

export default function CustomersPage() {
  useBreadcrumbs([{ label: 'Customers' }]);
  return (
    <div className={styles.page}>
      <CustomersList />
    </div>
  );
}

const styles = {
  page: `p-6 overflow-auto flex-1`,
};
