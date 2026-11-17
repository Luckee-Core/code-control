'use client';

import { useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { setConventionStatusThunk } from '@/store/thunks/conventions';

/** Activate drafts/deprecated rules; deprecate active ones. */
export const StatusButton = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.currentConvention.status);
  const [isBusy, setIsBusy] = useState(false);

  const next = status === 'active' ? 'deprecated' : 'active';
  const label = status === 'active' ? 'Deprecate' : 'Activate';

  const handleClick = async () => {
    setIsBusy(true);
    await dispatch(setConventionStatusThunk(next));
    setIsBusy(false);
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isBusy}
      className={next === 'active' ? detailPageStyles.primaryButton : detailPageStyles.secondaryButton}
    >
      {isBusy ? 'Saving…' : label}
    </button>
  );
};
