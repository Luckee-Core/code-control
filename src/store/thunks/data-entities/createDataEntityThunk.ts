import { AppThunk } from '../../types';
import { DataEntitiesActions } from '../../dumps';
import { createDataEntity } from '@/api/data-entities';
import { getApiBaseUrl } from '@/api/config';
import type { DataEntityWithFields } from '@/model/data-entity';

type ResponseType = Promise<200 | 400 | 500>;

export const createDataEntityThunk = (input: {
  project_id: string;
  name: string;
  table_name?: string | null;
  sort_order?: number;
}): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await createDataEntity(input, apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('Failed to create data entity:', response.error);
        return response.success ? 200 : 400;
      }
      dispatch(
        DataEntitiesActions.addDataEntity({
          ...response.data,
          fields: [],
        } as DataEntityWithFields)
      );
      return 200;
    } catch (error) {
      console.error('Error creating data entity:', error);
      return 500;
    }
  };
};
