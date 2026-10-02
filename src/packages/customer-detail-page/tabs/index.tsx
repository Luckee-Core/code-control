'use client';

import { useState } from 'react';
import { Overview } from '../overview';
import { Projects } from '../projects';

type CustomerTab = 'Overview' | 'Projects';

const CUSTOMER_TABS: CustomerTab[] = ['Overview', 'Projects'];

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState<CustomerTab>('Overview');

  return (
    <>
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
        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Projects' && <Projects />}
      </div>
    </>
  );
};

const styles = {
  tabBar: `
    flex gap-1 border-b border-gray-200
  `,
  tabActive: `
    px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-px bg-transparent cursor-pointer
  `,
  tabInactive: `
    px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer
  `,
  tabContent: `
    min-h-0
  `,
};
