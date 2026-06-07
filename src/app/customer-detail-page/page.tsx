'use client';

import { CustomerDetailPage } from '@/packages/customer-detail-page';
import { useBreadcrumbs } from '@/hooks';
import { useAppSelector } from '@/store';
import { CUSTOMERS_PATH } from '@/config/routes';

export default function CustomerDetailRoute() {
  const customer = useAppSelector((state) => state.currentCustomer);

  useBreadcrumbs([
    { label: 'Customers', href: CUSTOMERS_PATH },
    { label: customer.name || 'Customer' },
  ]);

  return (
    <div className={styles.page}>
      <CustomerDetailPage />
    </div>
  );
}

const styles = {
  page: `p-6 overflow-auto flex-1 min-h-0`,
};
