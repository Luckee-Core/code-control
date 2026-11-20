import { listConventionChanges, type ConventionChangesQuery } from '@/api/convention-changes';
import { AgentRunsBuilderActions } from '../../builders';
import { ConventionChangesActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads the convention change ledger for the history page (replaces the dump).
 */
export const listConventionChangesThunk =
  (query: ConventionChangesQuery): AppThunk<Promise<200 | 500>> =>
  async (dispatch) => {
    dispatch(AgentRunsBuilderActions.setHistory({ status: 'loading' }));
    const response = await listConventionChanges({ limit: 1000, ...query });
    if (!response.success || !response.data) {
      dispatch(AgentRunsBuilderActions.setHistory({ status: 'error', error: response.error ?? 'Could not load history' }));
      return 500;
    }
    dispatch(ConventionChangesActions.setChanges(response.data));
    dispatch(AgentRunsBuilderActions.setHistory({ status: 'idle' }));
    return 200;
  };
