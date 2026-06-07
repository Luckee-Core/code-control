import { AppThunk } from '../../types';
import { getCursorGenerationExchangeById } from '@/api/cursor-generation';
import { CursorGenerationExchangesActions } from '../../dumps/cursorGenerationExchanges';

type ResponseType = Promise<200 | 400 | 404 | 500>;

/**
 * Fetch a single cursor generation exchange by ID
 *
 * @param exchangeId - Exchange ID
 * @returns Status code (200 = success, 404 = not found, 500 = server error)
 */
export const fetchCursorGenerationExchangeByIdThunk = (
  exchangeId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const exchange = await getCursorGenerationExchangeById(exchangeId);
      if (!exchange) {
        return 404;
      }
      dispatch(CursorGenerationExchangesActions.addOrUpdateCursorGenerationExchange(exchange));
      return 200;
    } catch (error) {
      console.error('❌ Error fetching cursor generation exchange:', error);
      return 500;
    }
  };
};
