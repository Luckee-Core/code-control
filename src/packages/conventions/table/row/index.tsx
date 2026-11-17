'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CONVENTION_DETAIL_PAGE_PATH } from '@/config/routes';
import type { Convention } from '@/model/convention';
import { useAppDispatch, useAppSelector } from '@/store';
import { openConventionThunk } from '@/store/thunks/conventions';
import { SEVERITY_BADGE, STATUS_BADGE, badgeBase } from '../../badges';

type RowProps = {
  convention: Convention;
};

export const Row = ({ convention }: RowProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((state) => state.conventionsCatalog);

  const topicName = useMemo(
    () => catalog.topics.find((topic) => topic.key === convention.topic_key)?.name ?? convention.topic_key,
    [catalog.topics, convention.topic_key],
  );
  const roles = useMemo(
    () =>
      catalog.convention_roles
        .filter((link) => link.convention_id === convention.id)
        .map((link) => link.role_key)
        .sort()
        .join(', '),
    [catalog.convention_roles, convention.id],
  );

  const handleOpen = () => {
    void dispatch(openConventionThunk(convention));
    router.push(CONVENTION_DETAIL_PAGE_PATH);
  };

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <button type="button" onClick={handleOpen} className={styles.titleButton}>
          {convention.title}
        </button>
        <div className={styles.key}>{convention.key}</div>
      </td>
      <td className={styles.cell}>{topicName}</td>
      <td className={styles.cell}>
        <span className={`${badgeBase} ${SEVERITY_BADGE[convention.severity]}`}>{convention.severity}</span>
      </td>
      <td className={styles.cell}>
        <span className={`${badgeBase} ${STATUS_BADGE[convention.status]}`}>{convention.status}</span>
      </td>
      <td className={styles.cellMuted}>{roles || '—'}</td>
      <td className={styles.cellMuted}>{convention.check_kind === 'none' ? '—' : convention.check_kind}</td>
    </tr>
  );
};

const styles = {
  row: `hover:bg-gray-50 transition-colors align-top`,
  cell: `px-3 py-2 text-xs text-gray-900 border-b border-gray-200`,
  cellMuted: `px-3 py-2 text-xs text-gray-600 border-b border-gray-200`,
  titleButton: `
    font-medium text-left text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0
  `,
  key: `mt-0.5 font-mono text-[10px] text-gray-500`,
};
