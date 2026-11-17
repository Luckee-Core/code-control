import { ConventionsBuilderActions } from '../../builders';
import { CurrentConventionActions, EMPTY_CURRENT_CONVENTION } from '../../current';
import type { AppThunk } from '../../types';

/**
 * Opens the form modal: `new` resets the current convention; `edit` keeps the one on the detail page.
 */
export const startConventionFormThunk = (mode: 'new' | 'edit'): AppThunk<Promise<200>> => {
  return async (dispatch, getState) => {
    if (mode === 'new') {
      const firstTopic = getState().conventionsCatalog.topics[0];
      dispatch(
        CurrentConventionActions.setConvention({
          ...EMPTY_CURRENT_CONVENTION,
          domain_key: firstTopic?.domain_key ?? EMPTY_CURRENT_CONVENTION.domain_key,
          topic_key: firstTopic?.key ?? '',
        }),
      );
    }
    const config = getState().currentConvention.check_config;
    dispatch(
      ConventionsBuilderActions.openFormModal({
        checkConfigText: config ? JSON.stringify(config, null, 2) : '',
      }),
    );
    return 200;
  };
};
