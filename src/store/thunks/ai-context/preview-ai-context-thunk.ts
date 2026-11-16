import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { AiContextBuilderActions } from '../../builders';
import { previewAiContext } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Builds AI context for the selected domain + role without saving it.
 */
export const previewAiContextThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { domainKey, roleKey } = getState().aiContextBuilder;
    if (!domainKey || !roleKey) return 400;
    dispatch(AiContextBuilderActions.setStatus('loading'));
    try {
      const response = await previewAiContext({ domain_key: domainKey, role_key: roleKey }, getApiBaseUrl());
      if (!response.success || !response.data) {
        dispatch(AiContextBuilderActions.setError(response.error ?? 'Failed to build context'));
        return 400;
      }
      dispatch(AiContextBuilderActions.setPreview(response.data));
      return 200;
    } catch (error) {
      dispatch(AiContextBuilderActions.setError(error instanceof Error ? error.message : 'Failed to build context'));
      return 500;
    }
  };
};
