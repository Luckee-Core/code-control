import { getTemplateHeads } from '@/api/agent-runs';
import { TemplateHeadsActions } from '../../dumps';
import type { AppThunk } from '../../types';

/**
 * Loads each template repo's current commit (Data access rows offer Re-render when a delivery is behind).
 */
export const getTemplateHeadsThunk = (): AppThunk<Promise<200 | 500>> => async (dispatch) => {
  const response = await getTemplateHeads();
  if (!response.success || !response.data) return 500;
  dispatch(TemplateHeadsActions.setHeads(response.data));
  return 200;
};
