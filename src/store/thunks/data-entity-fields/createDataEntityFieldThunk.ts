import { AppThunk } from '../../types';
import { DataEntitiesActions } from '../../dumps';
import { createDataEntityField } from '@/api/data-entity-fields';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 400 | 500>;

export const createDataEntityFieldThunk = (input: {
  entity_id: string;
  name: string;
  type: string;
  nullable?: boolean;
  default_value?: string | null;
  sort_order?: number;
  references_entity_id?: string | null;
}): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await createDataEntityField(input, apiBaseUrl);
      if (!response.success || !response.data) {
        console.error('Failed to create data entity field:', response.error);
        return response.success ? 200 : 400;
      }
      dispatch(
        DataEntitiesActions.addFieldToEntity({
          entityId: input.entity_id,
          field: response.data,
        })
      );
      return 200;
    } catch (error) {
      console.error('Error creating data entity field:', error);
      return 500;
    }
  };
};
