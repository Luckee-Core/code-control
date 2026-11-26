'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { SoftwareSystemTabsBuilderActions, type SoftwareSystemTab } from '@/store/builders';
import { AiCosts } from '../ai-costs';
import { Api } from '../api';
import { Dashboard } from '../dashboard';
import { DataModel } from '../data-model';
import { DetailPages } from '../detail-pages';
import { Dispatcher } from '../dispatcher';
import { Layout } from '../layout';
import { Repositories } from '../repositories';
import { Tables } from '../tables';
import { TicketBuilds } from '../ticket-builds';

const SOFTWARE_SYSTEM_TABS: SoftwareSystemTab[] = [
  'Repositories',
  'Data model',
  'API',
  'Layout',
  'Tables',
  'Detail pages',
  'Dashboard',
  'Dispatcher',
  'Ticket builds',
  'AI costs',
];

export const Tabs = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.softwareSystemTabsBuilder.activeTab);
  const presetKey = useAppSelector((state) => state.currentSoftwareSystem.setup_preset_key);
  const preset = useAppSelector((state) => (presetKey ? state.setupPresets[presetKey] : undefined));
  // A project type that creates repos but no dispatcher (e.g. Supabase Customer) has no Dispatcher tab.
  const hidesDispatcher = Boolean(preset && preset.role_keys.length > 0 && !preset.role_keys.includes('dispatcher'));
  const tabs = hidesDispatcher ? SOFTWARE_SYSTEM_TABS.filter((tab) => tab !== 'Dispatcher') : SOFTWARE_SYSTEM_TABS;

  return (
    <>
      <div className={styles.tabsPanel}>
        <div className={styles.tabsRow}>
          <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => dispatch(SoftwareSystemTabsBuilderActions.setActiveTab(tab))}
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
        {activeTab === 'Tables' && <Tables />}
        {activeTab === 'Detail pages' && <DetailPages />}
        {activeTab === 'Dashboard' && <Dashboard />}
        {activeTab === 'Dispatcher' && !hidesDispatcher && <Dispatcher />}
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
