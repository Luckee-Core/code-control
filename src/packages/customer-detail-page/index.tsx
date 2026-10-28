'use client';

import { useBreadcrumbs } from '@/hooks';
import { useAppSelector } from '@/store';
import { CUSTOMERS_PATH } from '@/config/routes';
import { detailPageStyles } from '@/components/detail-page-styles';
import { Header } from './header';
import { Tabs } from './tabs';
import { FormModal } from '@/packages/projects';

export const CustomerDetailPage = () => {
  const customer = useAppSelector((state) => state.currentCustomer);

  useBreadcrumbs([
    { label: 'Customers', href: CUSTOMERS_PATH },
    { label: customer.name || 'Customer' },
  ]);

  if (!customer.id) {
    return (
      <div className={detailPageStyles.page}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>Customer not found</p>
          <a href={CUSTOMERS_PATH} className={detailPageStyles.emptyLink}>
            Back to Customers
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={detailPageStyles.page}>
      <Header />
      <Tabs />
      <FormModal />
    </div>
  );
};
