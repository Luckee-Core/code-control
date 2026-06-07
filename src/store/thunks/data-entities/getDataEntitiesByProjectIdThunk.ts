import { AppThunk } from '../../types';
import { DataEntitiesActions } from '../../dumps';
import { getDataEntitiesByProjectId } from '@/api/data-entities';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

export const getDataEntitiesByProjectIdThunk = (
  projectId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await getDataEntitiesByProjectId(projectId, apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('Failed to fetch data entities:', response.error);
        return 500;
      }
      dispatch(DataEntitiesActions.setDataEntities(response.data));
      return 200;
    } catch (error) {
      console.error('Error fetching data entities:', error);
      return 500;
    }
  };
};
