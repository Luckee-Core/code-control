import { AppThunk } from '../../types';
import { DataEntitiesActions } from '../../dumps';
import { deleteDataEntity } from '@/api/data-entities';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

export const deleteDataEntityThunk = (id: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await deleteDataEntity(id, apiBaseUrl);
      if (!response.success) {
        console.error('Failed to delete data entity:', response.error);
        return 500;
      }
      dispatch(DataEntitiesActions.deleteDataEntity(id));
      return 200;
    } catch (error) {
      console.error('Error deleting data entity:', error);
      return 500;
    }
  };
};
