'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { setCurrentSoftwareSystemThunk } from '@/store/thunks/software-systems';
import { SOFTWARE_SYSTEM_DETAIL_PAGE_PATH } from '@/config/routes';
import type { SoftwareSystem } from '@/model/software-system';
import { formatDate } from '@/utils/date-time';
import { truncateText } from '@/packages/software-systems/truncate-text';
import { ActionsMenu } from './actions-menu';

type RowProps = {
  project: SoftwareSystem;
};

export const Row = ({ project }: RowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleOpen = async () => {
    const status = await dispatch(setCurrentSoftwareSystemThunk(project));
    if (status === 200) {
      router.push(SOFTWARE_SYSTEM_DETAIL_PAGE_PATH);
    }
  };

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <button type="button" onClick={() => void handleOpen()} className={styles.projectNameButton}>
          {project.name}
        </button>
      </td>
      <td className={styles.cellDescription}>{truncateText(project.description, 60)}</td>
      <td className={styles.cell}>{formatDate(project.updated_at)}</td>
      <td className={styles.cellActions}>
        <ActionsMenu project={project} />
      </td>
    </tr>
  );
};

const styles = {
  row: `
    border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors
  `,
  cell: `
    px-3 py-2 text-xs text-gray-900
  `,
  cellActions: `
    px-2 py-2 w-12
  `,
  cellDescription: `
    px-3 py-2 text-xs text-gray-600 max-w-xs
  `,
  projectNameButton: `
    font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0
  `,
};
