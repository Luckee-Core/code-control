import { AppThunk } from '../../types';
import {
  getCursorGenerationRequestsByEntity,
  getCursorGenerationExchangesByRequest,
} from '@/api/cursor-generation';
import { CursorGenerationRequestsActions } from '../../dumps/cursorGenerationRequests';
import { CursorGenerationExchangesActions } from '../../dumps/cursorGenerationExchanges';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Fetch cursor generation requests and exchanges for an entity
 *
 * @param entityId - Entity ID
 * @returns Status code (200 = success, 400 = client error, 500 = server error)
 */
export const fetchCursorGenerationExchangesByEntityThunk = (
  entityId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const requests = await getCursorGenerationRequestsByEntity(entityId);
      dispatch(CursorGenerationRequestsActions.setCursorGenerationRequests(requests));

      for (const req of requests) {
        const exchanges = await getCursorGenerationExchangesByRequest(req.id);
        for (const ex of exchanges) {
          dispatch(CursorGenerationExchangesActions.addOrUpdateCursorGenerationExchange(ex));
        }
      }

      return 200;
    } catch (error) {
      console.error('❌ Error fetching cursor generation exchanges:', error);
      return 500;
    }
  };
};
