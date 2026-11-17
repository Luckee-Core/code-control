import type { AppThunk } from '../../types';
import { refreshDataModelProposalThunk } from './refresh-data-model-proposal-thunk';

/**
 * Refreshes every proposal still `running` (one poll tick).
 */
export const refreshRunningDataModelProposalsThunk = (): AppThunk<Promise<void>> => {
  return async (dispatch, getState) => {
    const running = Object.values(getState().dataModelProposals).filter((proposal) => proposal.status === 'running');
    await Promise.all(running.map((proposal) => dispatch(refreshDataModelProposalThunk(proposal.id))));
  };
};
