'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { probeStudioStackThunk } from '@/store/thunks/studio-stack';

/**
 * Keeps studio stack health state fresh while the app shell is mounted.
 */
export const StudioStackProbe = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(probeStudioStackThunk());
  }, [dispatch]);

  return null;
};
