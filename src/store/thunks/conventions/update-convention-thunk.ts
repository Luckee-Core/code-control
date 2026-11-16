import { AppThunk } from '../../types';
import { getApiBaseUrl } from '@/api/config';
import { ConventionsActions } from '../../dumps';
import { CurrentConventionActions } from '../../current';
import { ConventionBuilderActions } from '../../builders';
import { replaceConventionRoles, updateConvention } from '@/api/conventions';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Saves the current convention's fields and roles.
 */
export const updateConventionThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const { convention, roleKeys } = getState().currentConvention;
    if (!convention.id || !convention.title.trim() || !convention.statement.trim()) return 400;
    dispatch(ConventionBuilderActions.setSaving(true));
    dispatch(ConventionBuilderActions.setError(null));
    try {
      const apiBaseUrl = getApiBaseUrl();
      const [updated, roles] = await Promise.all([
        updateConvention(
          convention.id,
          {
            topic_key: convention.topic_key,
            title: convention.title.trim(),
            statement: convention.statement.trim(),
            rationale: convention.rationale.trim(),
            severity: convention.severity,
            status: convention.status,
            sort_order: convention.sort_order,
          },
          apiBaseUrl
        ),
        replaceConventionRoles(convention.id, roleKeys, apiBaseUrl),
      ]);
      if (!updated.success || !updated.data || !roles.success) {
        dispatch(ConventionBuilderActions.setError(updated.error ?? roles.error ?? 'Failed to save convention'));
        return 400;
      }
      dispatch(ConventionsActions.upsertConvention(updated.data));
      dispatch(CurrentConventionActions.setConvention(updated.data));
      dispatch(CurrentConventionActions.setRoleKeys((roles.data ?? []).map((role) => role.role_key)));
      return 200;
    } catch (error) {
      console.error('Error updating convention:', error);
      return 500;
    } finally {
      dispatch(ConventionBuilderActions.setSaving(false));
    }
  };
};
