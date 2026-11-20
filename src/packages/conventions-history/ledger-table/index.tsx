import type { ConventionChange } from '@/model/convention-change';
import { Row } from './row';

type LedgerTableProps = { changes: ConventionChange[]; showKey: boolean; emptyText: string };

/** Convention change ledger rows, newest first. */
export const LedgerTable = ({ changes, showKey, emptyText }: LedgerTableProps) => {
  if (changes.length === 0) return <p className={styles.empty}>{emptyText}</p>;
  const columns = ['When', ...(showKey ? ['Convention'] : []), 'Change', 'Fields', 'Source', 'Reason', 'Status', 'Roles'];
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className={styles.th}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {changes.map((change) => (
            <Row key={change.id} change={change} showKey={showKey} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  empty: `text-xs text-gray-500 px-4 py-6 text-center`,
  scroll: `overflow-x-auto overflow-y-auto flex-1 min-h-0`,
  table: `w-full border-collapse text-xs`,
  th: `px-3 py-2 text-left bg-gray-100 border-b border-gray-300 text-[10px] font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap`,
};
