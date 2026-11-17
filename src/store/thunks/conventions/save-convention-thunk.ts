import { createConvention, updateConvention } from '@/api/conventions';
import type { SaveConventionPayload } from '@/api/conventions/types';
import { ConventionsBuilderActions } from '../../builders';
import type { AppThunk } from '../../types';
import { applyConventionDetail } from './apply-convention-detail';

const parseCheckConfig = (text: string): Record<string, unknown> | null | Error => {
  if (!text.trim()) return null;
  try {
    const value = JSON.parse(text) as unknown;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return new Error('Check config must be a JSON object');
    }
    return value as Record<string, unknown>;
  } catch {
    return new Error('Check config is not valid JSON');
  }
};

/**
 * Creates or updates the current convention from the form (reads currentConvention + builder).
 */
export const saveConventionThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const current = getState().currentConvention;
    const builder = getState().conventionsBuilder;
    const topic = getState().conventionsCatalog.topics.find((item) => item.key === current.topic_key);

    const checkConfig = parseCheckConfig(builder.checkConfigText);
    if (checkConfig instanceof Error) {
      dispatch(ConventionsBuilderActions.setSaveStatus({ status: 'error', error: checkConfig.message }));
      return 400;
    }
    if (!current.title.trim() || !current.statement.trim() || !topic) {
      dispatch(
        ConventionsBuilderActions.setSaveStatus({ status: 'error', error: 'Title, statement and topic are required' }),
      );
      return 400;
    }

    const payload: SaveConventionPayload = {
      topic_key: current.topic_key,
      title: current.title.trim(),
      statement: current.statement.trim(),
      rationale: current.rationale.trim(),
      severity: current.severity,
      status: current.status,
      check_kind: current.check_kind,
      check_config: checkConfig,
      sort_order: current.sort_order,
      role_keys: current.role_keys,
    };

    dispatch(ConventionsBuilderActions.setSaveStatus({ status: 'saving' }));
    const response = current.id
      ? await updateConvention(current.id, payload)
      : await createConvention({ ...payload, key: current.key.trim(), domain_key: topic.domain_key });

    if (!response.success || !response.data) {
      dispatch(
        ConventionsBuilderActions.setSaveStatus({ status: 'error', error: response.error ?? 'Save failed' }),
      );
      return 500;
    }
    applyConventionDetail(dispatch, response.data);
    dispatch(ConventionsBuilderActions.closeFormModal());
    return 200;
  };
};
