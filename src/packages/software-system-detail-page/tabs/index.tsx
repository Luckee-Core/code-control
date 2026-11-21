'use client';

import { useState } from 'react';
import { AiCosts } from '../ai-costs';
import { Api } from '../api';
import { DataModel } from '../data-model';
import { Layout } from '../layout';
import { Repositories } from '../repositories';
import { TicketBuilds } from '../ticket-builds';

type SoftwareSystemTab = 'Repositories' | 'Data model' | 'API' | 'Layout' | 'Ticket builds' | 'AI costs';

const SOFTWARE_SYSTEM_TABS: SoftwareSystemTab[] = ['Repositories', 'Data model', 'API', 'Layout', 'Ticket builds', 'AI costs'];

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState<SoftwareSystemTab>('Repositories');

  return (
    <>
      <div className={styles.tabsPanel}>
        <div className={styles.tabsRow}>
          <div className={styles.tabsContainer}>
            {SOFTWARE_SYSTEM_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? styles.tabActive : styles.tab}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'Repositories' && <Repositories />}
        {activeTab === 'Data model' && <DataModel />}
        {activeTab === 'API' && <Api />}
        {activeTab === 'Layout' && <Layout />}
        {activeTab === 'Ticket builds' && <TicketBuilds />}
        {activeTab === 'AI costs' && <AiCosts />}
      </div>
    </>
  );
};

const styles = {
  tabsPanel: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  tabsRow: `
    flex flex-wrap items-center justify-between gap-3
    px-3 py-2 border-b border-gray-300 bg-gray-50 min-w-0
  `,
  tabsContainer: `
    flex flex-wrap gap-1 min-w-0
  `,
  tab: `
    px-2.5 py-1 text-xs font-medium text-gray-600 rounded border border-transparent
    hover:text-gray-900 hover:bg-white hover:border-gray-300
    transition-colors cursor-pointer whitespace-nowrap
  `,
  tabActive: `
    px-2.5 py-1 text-xs font-semibold text-gray-900 rounded
    border border-gray-300 bg-white ring-1 ring-inset ring-gray-300
    cursor-pointer whitespace-nowrap
  `,
  tabContent: `
    min-h-0
  `,
};
