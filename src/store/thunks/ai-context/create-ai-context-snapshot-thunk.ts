import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { AiContextBuilderActions } from '../../builders';
import { createAiContextSnapshot } from '@/api/conventions';
import { getConventionSnapshotsThunk } from './get-convention-snapshots-thunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Saves the selected domain + role as a snapshot (reuses an identical one) and refreshes the list.
 */
export const createAiContextSnapshotThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { domainKey, roleKey } = getState().aiContextBuilder;
    if (!domainKey || !roleKey) return 400;
    dispatch(AiContextBuilderActions.setStatus('loading'));
    try {
      const response = await createAiContextSnapshot({ domain_key: domainKey, role_key: roleKey }, getApiBaseUrl());
      if (!response.success || !response.data) {
        dispatch(AiContextBuilderActions.setError(response.error ?? 'Failed to save snapshot'));
        return 400;
      }
      dispatch(AiContextBuilderActions.setLastSnapshot(response.data));
      await dispatch(getConventionSnapshotsThunk());
      return 200;
    } catch (error) {
      dispatch(AiContextBuilderActions.setError(error instanceof Error ? error.message : 'Failed to save snapshot'));
      return 500;
    }
  };
};
