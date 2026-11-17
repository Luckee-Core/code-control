'use client';

import { useRouter } from 'next/navigation';
import { CONVENTIONS_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteConventionThunk } from '@/store/thunks/conventions';

export const DeleteButton = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const key = useAppSelector((state) => state.currentConvention.key);

  const handleClick = async () => {
    if (!window.confirm(`Delete ${key}? Its examples and sources are deleted too. Deprecating keeps history.`)) {
      return;
    }
    const status = await dispatch(deleteConventionThunk());
    if (status === 200) {
      router.push(CONVENTIONS_PATH);
    }
  };

  return (
    <button type="button" onClick={() => void handleClick()} className={styles.button}>
      Delete
    </button>
  );
};

const styles = {
  button: `
    text-xs font-medium text-red-700 px-3 py-1.5 rounded border border-red-200 bg-white
    hover:bg-red-50 transition-colors cursor-pointer
  `,
};
