import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import type { ConventionDetail } from '@/api/conventions/types';
import {
  ConventionExamplesActions,
  ConventionSourcesActions,
  ConventionsActions,
  ConventionsCatalogActions,
} from '../../dumps';
import { CurrentConventionActions } from '../../current';

/**
 * Writes a convention detail response into current, dumps and the role links.
 */
export const applyConventionDetail = (dispatch: Dispatch<UnknownAction>, detail: ConventionDetail): void => {
  dispatch(CurrentConventionActions.setConvention({ ...detail.convention, role_keys: detail.role_keys }));
  dispatch(ConventionsActions.upsertConvention(detail.convention));
  dispatch(ConventionExamplesActions.setExamples(detail.examples));
  dispatch(ConventionSourcesActions.setSources(detail.sources));
  dispatch(
    ConventionsCatalogActions.setConventionRoleLinks({
      conventionId: detail.convention.id,
      links: detail.role_keys.map((role_key) => ({
        convention_id: detail.convention.id,
        role_key,
        created_at: detail.convention.updated_at,
      })),
    }),
  );
};
