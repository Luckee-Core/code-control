import { AppThunk } from '../../types';
import { DataEntitiesActions } from '../../dumps';
import { getAllDataEntities } from '@/api/data-entities';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllDataEntitiesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllDataEntities(getApiBaseUrl());
      
      if (response.success && response.data) {
        dispatch(DataEntitiesActions.setDataEntities(response.data));
        return 200;
      }
      
      return 400;
    } catch (error) {
      console.error('Error fetching all data entities:', error);
      return 500;
    }
  };
};
