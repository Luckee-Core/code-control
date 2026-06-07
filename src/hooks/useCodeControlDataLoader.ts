import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store';
import {
  getAllCustomersThunk,
  getAllProjectsThunk,
  getAllProjectReposThunk,
  getAllBuildConventionsThunk,
  getAllBuildExamplesThunk,
  getAllDataEntitiesThunk,
  getAllARDGenerationQueueThunk,
  getAllARDTasksThunk,
  getAllDataModelGenerationQueueThunk,
  getAllCrudApiTasksThunk,
  getAllBuildStepsThunk,
  getAllTaskCategoriesThunk,
  getAllStepTaskCategoriesThunk,
  getAllConventionTaskCategoriesThunk,
} from '@/store/thunks';

/**
 * Loads Code Control workspace data on app init.
 */
export const useCodeControlDataLoader = () => {
  const dispatch = useAppDispatch();
  const hasLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    Promise.all([
      dispatch(getAllCustomersThunk()),
      dispatch(getAllProjectsThunk()),
      dispatch(getAllProjectReposThunk()),
      dispatch(getAllBuildConventionsThunk()),
      dispatch(getAllBuildExamplesThunk()),
      dispatch(getAllDataEntitiesThunk()),
      dispatch(getAllARDGenerationQueueThunk()),
      dispatch(getAllARDTasksThunk()),
      dispatch(getAllCrudApiTasksThunk()),
      dispatch(getAllDataModelGenerationQueueThunk()),
      dispatch(getAllBuildStepsThunk()),
      dispatch(getAllTaskCategoriesThunk()),
      dispatch(getAllStepTaskCategoriesThunk()),
      dispatch(getAllConventionTaskCategoriesThunk()),
    ])
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error('❌ Code Control data load error:', error);
        setIsLoading(false);
      });
  }, [dispatch]);

  return { isLoading };
};
