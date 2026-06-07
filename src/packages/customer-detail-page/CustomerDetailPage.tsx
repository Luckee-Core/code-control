'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store';
import { CUSTOMERS_PATH } from '@/config/routes';
import { formatDate } from '@/utils/date-time';
import type { Customer } from '@/model/customer';
import { CustomerProjectsTab } from './CustomerProjectsTab';
import { CreateProjectModal } from './CreateProjectModal';

type CustomerTab = 'Overview' | 'Projects';

const CUSTOMER_TABS: CustomerTab[] = ['Overview', 'Projects'];

const formatStage = (stage: Customer['stage']): string => {
  switch (stage) {
    case 'discovery_call':
      return 'Discovery';
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    default:
      return stage;
  }
};

const getStageColor = (stage: Customer['stage']): string => {
  switch (stage) {
    case 'discovery_call':
      return 'bg-yellow-100 text-yellow-800';
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const CustomerDetailPage = () => {
  const customer = useAppSelector((state) => state.currentCustomer);
  const [activeTab, setActiveTab] = useState<CustomerTab>('Overview');

  if (!customer.id) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundTitle}>Customer not found</p>
        <p className={styles.notFoundDescription}>
          Open a customer from the list to view their detail page.
        </p>
        <Link href={CUSTOMERS_PATH} className={styles.backLink}>
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerCard}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{customer.name}</h1>
          <span className={`${styles.stageBadge} ${getStageColor(customer.stage)}`}>
            {formatStage(customer.stage)}
          </span>
        </div>
        {customer.description && (
          <p className={styles.description}>{customer.description}</p>
        )}
      </div>

      <div className={styles.tabBar}>
        {CUSTOMER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? styles.tabActive : styles.tabInactive}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'Overview' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metadataGrid}>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Created</span>
                <span className={styles.metadataValue}>{formatDate(customer.created_at)}</span>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Last updated</span>
                <span className={styles.metadataValue}>{formatDate(customer.updated_at)}</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Projects' && <CustomerProjectsTab />}
      </div>
      <CreateProjectModal />
    </div>
  );
};

const styles = {
  page: `flex flex-col gap-4`,
  headerCard: `border border-gray-200 rounded-lg bg-white p-6`,
  titleRow: `flex items-center gap-3 flex-wrap`,
  title: `text-2xl font-semibold text-gray-900`,
  stageBadge: `text-xs font-medium px-2.5 py-1 rounded-full`,
  description: `mt-3 text-sm text-gray-600`,
  tabBar: `flex gap-1 border-b border-gray-200`,
  tabActive: `px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-px bg-transparent cursor-pointer`,
  tabInactive: `px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer`,
  tabContent: `min-h-0`,
  section: `border border-gray-200 rounded-lg bg-white p-6`,
  sectionTitle: `text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4`,
  metadataGrid: `grid grid-cols-1 sm:grid-cols-2 gap-4`,
  metadataItem: `flex flex-col gap-1`,
  metadataLabel: `text-xs text-gray-500 uppercase tracking-wide`,
  metadataValue: `text-sm text-gray-900`,
  notFound: `border border-gray-200 rounded-lg bg-white p-8 text-center`,
  notFoundTitle: `text-sm font-medium text-gray-900 mb-1`,
  notFoundDescription: `text-sm text-gray-500 mb-4`,
  backLink: `text-sm text-blue-600 hover:underline`,
};
