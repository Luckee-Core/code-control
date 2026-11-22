'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
import { loadSetupPresetsThunk } from '@/store/thunks/software-systems';
import { formatDate } from '@/utils/date-time';
import { ActionsMenu } from './actions-menu';

/** Top card: name, description, type and customer, with the Edit / Delete menu. */
export const Overview = () => {
  const dispatch = useAppDispatch();
  const currentSoftwareSystem = useAppSelector((state) => state.currentSoftwareSystem);
  const presetsByKey = useAppSelector((state) => state.setupPresets);
  const customers = useAppSelector((state) => state.customers);

  useEffect(() => {
    if (Object.keys(presetsByKey).length === 0) void dispatch(loadSetupPresetsThunk());
  }, [dispatch, presetsByKey]);

  if (!currentSoftwareSystem.id) {
    return null;
  }

  const presetKey = currentSoftwareSystem.setup_preset_key;
  const typeName = presetKey ? (presetsByKey[presetKey]?.name ?? presetKey) : 'Not set';
  const customerName = customers[currentSoftwareSystem.customer_id]?.name;

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <h2 className={detailPageStyles.panelTitle}>{currentSoftwareSystem.name}</h2>
          {currentSoftwareSystem.description ? (
            <p className={detailPageStyles.panelSubtitle}>{currentSoftwareSystem.description}</p>
          ) : null}
        </div>
        <ActionsMenu />
      </div>
      <div className={detailPageStyles.panelBody}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <span className={detailPageStyles.fieldLabel}>Type</span>
            <span className={detailPageStyles.fieldValue}>{typeName}</span>
          </div>
          {customerName ? (
            <div className={styles.field}>
              <span className={detailPageStyles.fieldLabel}>Customer</span>
              <span className={detailPageStyles.fieldValue}>{customerName}</span>
            </div>
          ) : null}
          {currentSoftwareSystem.created_at ? (
            <div className={styles.field}>
              <span className={detailPageStyles.fieldLabel}>Created</span>
              <span className={detailPageStyles.fieldValue}>{formatDate(currentSoftwareSystem.created_at)}</span>
            </div>
          ) : null}
          <div className={styles.field}>
            <span className={detailPageStyles.fieldLabel}>ID</span>
            <span className={styles.id}>{currentSoftwareSystem.id}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  titleBlock: `flex flex-col gap-1 min-w-0 flex-1`,
  fields: `grid grid-cols-2 md:grid-cols-4 gap-3`,
  field: `flex flex-col gap-0.5 min-w-0`,
  id: `text-xs font-mono text-gray-500 truncate`,
};
