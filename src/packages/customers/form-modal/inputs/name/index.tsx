'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentCustomerActions } from '@/store/current';
import { createCustomerThunk } from '@/store/thunks/customers';

export const NameInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentCustomer);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="customer-name">
        Name *
      </label>
      <input
        id="customer-name"
        type="text"
        value={current.name}
        onChange={(event) =>
          dispatch(CurrentCustomerActions.updateCustomerFields({ name: event.target.value }))
        }
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (current.name.trim()) {
              void dispatch(createCustomerThunk());
            }
          }
        }}
        placeholder="Customer name"
        className={styles.input}
        autoFocus
      />
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
