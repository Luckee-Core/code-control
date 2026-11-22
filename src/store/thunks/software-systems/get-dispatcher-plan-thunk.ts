import { getSoftwareSystemDispatcherPlan } from '@/api/software-systems';
import { DataModelDeliveryBuilderActions } from '../../builders';
import { DispatcherPlansActions } from '../../dumps';
import type { AppThunk } from '../../types';

/** Loads the current software system's dispatcher plan (Dispatcher tab). */
export const getDispatcherPlanThunk = (): AppThunk<Promise<200 | 400 | 500>> => {
  return async (dispatch, getState) => {
    const softwareSystemId = getState().currentSoftwareSystem.id;
    if (!softwareSystemId) return 400;
    dispatch(DataModelDeliveryBuilderActions.setPlanStatus({ status: 'loading' }));
    const response = await getSoftwareSystemDispatcherPlan(softwareSystemId);
    if (!response.success || !response.data) {
      dispatch(DataModelDeliveryBuilderActions.setPlanStatus({ status: 'error', error: response.error ?? 'Could not load the dispatcher plan' }));
      return 500;
    }
    dispatch(DispatcherPlansActions.setForSoftwareSystem({ softwareSystemId, plan: response.data }));
    dispatch(DataModelDeliveryBuilderActions.setPlanStatus({ status: 'idle' }));
    return 200;
  };
};
