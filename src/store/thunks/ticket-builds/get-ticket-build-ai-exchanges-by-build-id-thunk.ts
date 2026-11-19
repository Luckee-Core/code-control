import { listTicketBuildAiExchanges } from '@/api/ticket-builds';
import { TicketBuildAiExchangesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Loads one build's AI call summaries. */
export const getTicketBuildAiExchangesByBuildIdThunk = (ticketBuildId: string): AppThunk<Promise<200 | 500>> => {
  return async (dispatch) => {
    const response = await listTicketBuildAiExchanges(ticketBuildId);
    if (!response.success || !response.data) return 500;
    dispatch(TicketBuildAiExchangesActions.setForBuild({ ticketBuildId, exchanges: response.data }));
    return 200;
  };
};
