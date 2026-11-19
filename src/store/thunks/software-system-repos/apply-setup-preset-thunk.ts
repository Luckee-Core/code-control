import { applySetupPreset } from '@/api/software-system-setup';
import type { AppThunk } from '@/store';
import { RepositoriesBuilderActions } from '@/store/builders';
import { SetupPresetResultsActions } from '@/store/dumps';
import { getReposBySoftwareSystemIdThunk } from './get-repos-by-project-id-thunk';

/**
 * Creates the current software system's missing repos for its project type
 * (currentSoftwareSystem.setup_preset_key), using the selected GitHub org. Safe to re-run:
 * roles that already have a repo are skipped.
 */
export const applySetupPresetThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const { currentSoftwareSystem, repositoriesBuilder } = getState();
  const presetKey = currentSoftwareSystem.setup_preset_key;
  if (!currentSoftwareSystem.id || !presetKey || presetKey === 'none') return 400;

  dispatch(RepositoriesBuilderActions.setPresetStatus({ status: 'applying' }));
  const response = await applySetupPreset(
    currentSoftwareSystem.id,
    presetKey,
    repositoriesBuilder.selectedGithubOrg || undefined,
  );
  if (!response.success || !response.data) {
    dispatch(RepositoriesBuilderActions.setPresetStatus({ status: 'error', error: response.error ?? 'Could not create the repos' }));
    return 500;
  }
  dispatch(
    SetupPresetResultsActions.setResults({ softwareSystemId: currentSoftwareSystem.id, results: response.data.results }),
  );
  dispatch(RepositoriesBuilderActions.setPresetStatus({ status: 'done' }));
  await dispatch(getReposBySoftwareSystemIdThunk());
  return 200;
};
