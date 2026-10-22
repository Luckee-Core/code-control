import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store';
import {
  getAllCustomersThunk,
  getAllProjectsThunk,
  getAllProjectReposThunk,
} from '@/store/thunks';

/**
 * Loads Code Control workspace data on app init.
 */
export const useCodeControlDataLoader = () => {
  const dispatch = useAppDispatch();
  const hasLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    Promise.all([
      dispatch(getAllCustomersThunk()),
      dispatch(getAllProjectsThunk()),
      dispatch(getAllProjectReposThunk()),
    ])
      .then((results) => {
        setLoadFailed(results.some((code) => code !== 200));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('❌ Code Control data load error:', error);
        setLoadFailed(true);
        setIsLoading(false);
      });
  }, [dispatch]);

  return { isLoading, loadFailed };
};
