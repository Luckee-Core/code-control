import { useAppSelector, useAppDispatch } from '@/store';
import { DataModelBuilderActions } from '@/store/builders/dataModelBuilder';

type DataModelQueueStatus = 'queued' | 'processing' | 'completed' | 'failed';

const STATUS_OPTIONS: { value: 'all' | DataModelQueueStatus; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'queued', label: 'Queued' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

export const DataModelQueueHeader = () => {
  const dispatch = useAppDispatch();
  const filterStatus = useAppSelector((state) => state.dataModelBuilder.filterStatus);
  const filteredItems = useAppSelector((state) => state.dataModelBuilder.filteredItems);

  const handleFilterChange = (status: 'all' | DataModelQueueStatus) => {
    dispatch(DataModelBuilderActions.setFilterStatus(status));
  };

  return (
    <div className={styles.controls}>
      <div className={styles.filters}>
        <select
          value={filterStatus}
          onChange={(e) => handleFilterChange(e.target.value as typeof filterStatus)}
          className={styles.filterSelect}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.rightControls}>
        <span className={styles.count}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>
    </div>
  );
};

const styles = {
  controls: `
    flex items-center justify-between gap-4
  `,
  filters: `
    flex gap-2 items-center
  `,
  rightControls: `
    flex items-center gap-3
  `,
  count: `
    text-xs text-gray-500
  `,
  filterSelect: `
    h-7 px-2 py-1 text-xs
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
    bg-white
  `,
};
