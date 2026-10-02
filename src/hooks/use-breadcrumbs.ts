import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { LayoutBuilderActions } from '@/store/builders';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

/**
 * Sets breadcrumbs in Redux and clears them on unmount.
 */
export const useBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(LayoutBuilderActions.setBreadcrumbs(breadcrumbs));

    return () => {
      dispatch(LayoutBuilderActions.setBreadcrumbs([]));
    };
  }, [dispatch, breadcrumbs]);
};
