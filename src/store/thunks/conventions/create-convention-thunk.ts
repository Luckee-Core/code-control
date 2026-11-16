import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { ConventionsActions } from '../../dumps';
import { CurrentConventionActions } from '../../current';
import { ConventionBuilderActions } from '../../builders';
import { createConvention } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Creates a convention from conventionBuilder.createForm and makes it current.
 */
export const createConventionThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const form = getState().conventionBuilder.createForm;
    if (!form.key.trim() || !form.domain_key || !form.topic_key || !form.title.trim() || !form.statement.trim()) {
      return 400;
    }
    dispatch(ConventionBuilderActions.setSaving(true));
    try {
      const response = await createConvention(
        {
          key: form.key.trim(),
          domain_key: form.domain_key,
          topic_key: form.topic_key,
          title: form.title.trim(),
          statement: form.statement.trim(),
          rationale: form.rationale.trim(),
          severity: form.severity,
          status: form.status,
        },
        getApiBaseUrl()
      );
      if (!response.success || !response.data) {
        dispatch(ConventionBuilderActions.setError(response.error ?? 'Failed to create convention'));
        return 400;
      }
      dispatch(ConventionsActions.upsertConvention(response.data));
      dispatch(CurrentConventionActions.setConvention(response.data));
      dispatch(ConventionBuilderActions.closeCreateModal());
      return 200;
    } catch (error) {
      console.error('Error creating convention:', error);
      return 500;
    } finally {
      dispatch(ConventionBuilderActions.setSaving(false));
    }
  };
};
