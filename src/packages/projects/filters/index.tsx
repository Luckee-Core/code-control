'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';

type FiltersProps = {
  search: string;
  customerId: string;
  onSearchChange: (value: string) => void;
  onCustomerChange: (customerId: string) => void;
};

export const Filters = ({
  search,
  customerId,
  onSearchChange,
  onCustomerChange,
}: FiltersProps) => {
  const customers = useAppSelector((state) => state.customers);
  const customerOptions = useMemo(
    () =>
      Object.values(customers)
        .map((customer) => ({ id: customer.id, name: customer.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [customers]
  );

  return (
    <div className={styles.bar}>
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search name, description, or customer"
        aria-label="Search projects"
        className={styles.search}
      />
      <select
        value={customerId}
        onChange={(event) => onCustomerChange(event.target.value)}
        aria-label="Filter by customer"
        className={styles.select}
      >
        <option value="">All customers</option>
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
  bar: `
    flex flex-wrap items-center gap-2 shrink-0
  `,
  search: `
    flex-1 min-w-[16rem] px-3 py-1.5 text-sm text-gray-900 bg-white
    border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  select: `
    px-3 py-1.5 text-sm text-gray-900 bg-white
    border border-gray-300 rounded
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
};
