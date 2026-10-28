'use client';

import { useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { CustomerBuilderActions } from '@/store/builders';
import { CurrentCustomerActions } from '@/store/current';

type CustomerFiltersProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export const CustomerFilters = ({ searchTerm, onSearchChange }: CustomerFiltersProps) => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);

  const totalCount = useMemo(() => Object.keys(customers).length, [customers]);

  const filteredCount = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return totalCount;
    return Object.values(customers).filter((customer) =>
      customer.name.toLowerCase().includes(query)
    ).length;
  }, [customers, searchTerm, totalCount]);

  const countLabel = useMemo(() => {
    if (searchTerm.trim() && filteredCount !== totalCount) {
      return `${filteredCount} of ${totalCount} customer${totalCount === 1 ? '' : 's'}`;
    }
    return `${totalCount} customer${totalCount === 1 ? '' : 's'}`;
  }, [filteredCount, totalCount, searchTerm]);

  const handleAddCustomer = () => {
    dispatch(CurrentCustomerActions.reset());
    dispatch(CustomerBuilderActions.openCustomerModal());
  };

  return (
    <div className={listFilterBarStyles.section}>
      <div className={listFilterBarStyles.searchInputWrapper}>
        <input
          type="search"
          placeholder="Search customers…"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className={listFilterBarStyles.searchInput}
          aria-label="Search customers"
        />
        {searchTerm ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className={listFilterBarStyles.clearButton}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>
      <span className={styles.count}>{countLabel}</span>
      <div className={styles.right}>
        <button type="button" onClick={handleAddCustomer} className={detailPageStyles.primaryButton}>
          Add customer
        </button>
      </div>
    </div>
  );
};

const styles = {
  count: `shrink-0 text-xs text-gray-600 tabular-nums`,
  right: `ml-auto flex items-center`,
} as const;
