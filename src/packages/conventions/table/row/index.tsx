'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { setCurrentConventionThunk } from '@/store/thunks/conventions';
import { CONVENTION_DETAIL_PAGE_PATH } from '@/config/routes';
import type { Convention } from '@/model/convention';
import { severityBadgeClass } from '../../severity-badge-class';

type RowProps = {
  convention: Convention;
  topicName: string;
};

export const Row = ({ convention, topicName }: RowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleOpen = async () => {
    const status = await dispatch(setCurrentConventionThunk(convention));
    if (status === 200) router.push(CONVENTION_DETAIL_PAGE_PATH);
  };

  return (
    <tr className={styles.row}>
      <td className={styles.keyCell}>{convention.key}</td>
      <td className={styles.cell}>
        <button type="button" onClick={() => void handleOpen()} className={styles.titleButton}>
          {convention.title}
        </button>
      </td>
      <td className={styles.cellMuted}>{topicName}</td>
      <td className={styles.cell}>
        <span className={severityBadgeClass(convention.severity)}>{convention.severity}</span>
      </td>
      <td className={styles.cell}>
        <span className={severityBadgeClass(convention.status)}>{convention.status}</span>
      </td>
    </tr>
  );
};

const styles = {
  row: `hover:bg-gray-50 transition-colors`,
  cell: `px-3 py-2 text-xs text-gray-900 border-b border-gray-200`,
  cellMuted: `px-3 py-2 text-xs text-gray-600 border-b border-gray-200`,
  keyCell: `px-3 py-2 text-[11px] font-mono text-gray-600 border-b border-gray-200 whitespace-nowrap`,
  titleButton: `font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0`,
};
