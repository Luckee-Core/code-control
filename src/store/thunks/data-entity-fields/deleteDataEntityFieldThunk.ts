import { AppThunk } from '../../types';
import { DataEntitiesActions } from '../../dumps';
import { deleteDataEntityField } from '@/api/data-entity-fields';
import { getApiBaseUrl } from '@/api/config';

type ResponseType = Promise<200 | 500>;

export const deleteDataEntityFieldThunk = (
  entityId: string,
  fieldId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await deleteDataEntityField(fieldId, apiBaseUrl);
      if (!response.success) {
        console.error('Failed to delete data entity field:', response.error);
        return 500;
      }
      dispatch(
        DataEntitiesActions.removeFieldFromEntity({ entityId, fieldId })
      );
      return 200;
    } catch (error) {
      console.error('Error deleting data entity field:', error);
      return 500;
    }
  };
};
