import { useAppSelector, useAppDispatch } from '@/store';
import { DataModelBuilderActions } from '@/store/builders/dataModelBuilder';
import { DataModelQueueRow } from './row';

type SortColumn =
  | 'status'
  | 'project'
  | 'repo'
  | 'entity'
  | 'file_path'
  | 'scheduled_at'
  | 'started_at'
  | 'completed_at'
  | 'error';

export const DataModelQueueTable = () => {
  const dispatch = useAppDispatch();
  const filteredItems = useAppSelector((state) => state.dataModelBuilder.filteredItems);
  const sortColumn = useAppSelector((state) => state.dataModelBuilder.sortColumn);
  const sortDirection = useAppSelector((state) => state.dataModelBuilder.sortDirection);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      dispatch(
        DataModelBuilderActions.setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      );
    } else {
      dispatch(DataModelBuilderActions.setSortColumn(column));
      dispatch(DataModelBuilderActions.setSortDirection('asc'));
    }
  };

  const renderSortHeader = (column: SortColumn, label: string) => (
    <th
      className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
      onClick={() => handleSort(column)}
    >
      <div className={styles.headerContent}>
        {label}
        {sortColumn === column && (
          <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {renderSortHeader('status', 'Status')}
            {renderSortHeader('project', 'Project')}
            {renderSortHeader('repo', 'Repo')}
            {renderSortHeader('entity', 'Entity')}
            {renderSortHeader('file_path', 'File Path')}
            {renderSortHeader('scheduled_at', 'Scheduled')}
            {renderSortHeader('started_at', 'Started')}
            {renderSortHeader('completed_at', 'Completed')}
            {renderSortHeader('error', 'Error')}
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <DataModelQueueRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  table: `
    w-full border-collapse text-xs
  `,
  tableHeaderCell: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
  sortableHeader: `
    cursor-pointer hover:bg-gray-200 transition-colors
    user-select-none
  `,
  headerContent: `
    flex items-center gap-1
  `,
  sortIndicator: `
    text-gray-500 text-xs
  `,
};
