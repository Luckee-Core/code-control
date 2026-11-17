'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch } from '@/store';
import { startConventionFormThunk } from '@/store/thunks/conventions';

export const EditButton = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      type="button"
      onClick={() => void dispatch(startConventionFormThunk('edit'))}
      className={detailPageStyles.secondaryButton}
    >
      Edit
    </button>
  );
};
