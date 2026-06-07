import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { LayoutBuilderActions } from '@/store/builders';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

/**
 * Hook to set breadcrumbs in Redux
 * Cleans up on unmount
 * @param breadcrumbs - Array of breadcrumb items
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
