'use client';

import { useBreadcrumbs } from '@/hooks';
import { useAppSelector } from '@/store';
import { CUSTOMERS_PATH } from '@/config/routes';
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
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p className={styles.notFoundTitle}>Customer not found</p>
          <p className={styles.notFoundDescription}>
            Open a customer from the list to view their detail page.
          </p>
          <a href={CUSTOMERS_PATH} className={styles.backLink}>
            Back to Customers
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <Tabs />
      <FormModal />
    </div>
  );
};

const styles = {
  page: `
    p-6 overflow-auto flex-1 min-h-0 flex flex-col gap-4
  `,
  notFound: `
    border border-gray-200 rounded-lg bg-white p-8 text-center
  `,
  notFoundTitle: `
    text-sm font-medium text-gray-900 mb-1
  `,
  notFoundDescription: `
    text-sm text-gray-500 mb-4
  `,
  backLink: `
    text-sm text-blue-600 hover:underline
  `,
};
