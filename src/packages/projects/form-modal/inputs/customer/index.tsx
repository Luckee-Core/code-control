'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentProjectActions } from '@/store/current';

export const CustomerInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentProject);
  const customers = useAppSelector((state) => state.customers);

  const customerOptions = useMemo(
    () =>
      Object.values(customers)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((customer) => ({ id: customer.id, name: customer.name })),
    [customers]
  );

  if (current.id) {
    return null;
  }

  return (
    <div className={styles.field}>
      <label className={styles.label}>Customer *</label>
      <select
        value={current.customer_id}
        onChange={(event) =>
          dispatch(
            CurrentProjectActions.updateProjectFields({
              customer_id: event.target.value,
            })
          )
        }
        className={styles.input}
      >
        <option value="">Select a customer</option>
        {customerOptions.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  field: `
    mb-4
  `,
  label: `
    block text-sm font-medium text-gray-700 mb-1
  `,
  input: `
    w-full px-3 py-2 border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
};
