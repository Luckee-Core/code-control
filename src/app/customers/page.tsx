'use client';

import { CustomersList, CustomersHeader, CreateCustomerModal } from '@/packages/customers';
import { useBreadcrumbs } from '@/hooks';

export default function CustomersPage() {
  useBreadcrumbs([{ label: 'Customers' }]);
  return (
    <div className={styles.page}>
      <CustomersHeader />
      <CustomersList />
      <CreateCustomerModal />
    </div>
  );
}

const styles = {
  page: `p-6 flex flex-col gap-4 overflow-auto flex-1 min-h-0`,
};
