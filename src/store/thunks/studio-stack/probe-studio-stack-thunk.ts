import { probeStudioStack } from '@/api/studio-stack/probe-studio-stack';
import { buildStudioStackProbePresentation } from '@/api/studio-stack/build-studio-stack-probe-result';
import type { AppThunk } from '@/store/types';
import { StudioStackBuilderActions } from '@/store/builders/studioStackBuilder';
import { runProbeSingleFlight } from './probe-in-flight';

export type ProbeStudioStackOutcome = {
  code: 200 | 500;
  title: string;
  detail: string;
};

/**
 * Probes Express GET /api/health only; sets `ready` when `status === "ok"` in the health body.
 */
export const probeStudioStackThunk = (): AppThunk<Promise<ProbeStudioStackOutcome>> => {
  return (dispatch, getState): Promise<ProbeStudioStackOutcome> => {
    return runProbeSingleFlight(async (): Promise<200 | 500> => {
      dispatch(StudioStackBuilderActions.setStudioStackProbing(true));
      console.log('🚀 [probeStudioStackThunk] Starting stack probe');

      try {
        const result = await probeStudioStack();
        dispatch(StudioStackBuilderActions.setStudioStackLastCheckedAt(new Date().toISOString()));

        const presentation = buildStudioStackProbePresentation(result.data, null);

        if (!result.success) {
          dispatch(StudioStackBuilderActions.setStudioStackStatus('unavailable'));
          dispatch(StudioStackBuilderActions.setStudioStackError(result.error));
          dispatch(StudioStackBuilderActions.setStudioStackErrorHint(result.hint));
          dispatch(StudioStackBuilderActions.setStudioStackHealthLines(presentation.lines));
          console.warn('❌ [probeStudioStackThunk] Probe failed:', result.error);
          return 500;
        }

        dispatch(StudioStackBuilderActions.setStudioStackStatus('ready'));
        dispatch(StudioStackBuilderActions.setStudioStackHealthLines(presentation.lines));
        dispatch(StudioStackBuilderActions.setStudioStackError(''));
        dispatch(StudioStackBuilderActions.setStudioStackErrorHint(''));
        console.log('✅ [probeStudioStackThunk] Stack ready');
        return 200;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Health check failed';
        dispatch(StudioStackBuilderActions.setStudioStackStatus('unavailable'));
        dispatch(StudioStackBuilderActions.setStudioStackError('Health check failed'));
        dispatch(StudioStackBuilderActions.setStudioStackErrorHint(message));
        console.error('❌ [probeStudioStackThunk] Unexpected error:', error);
        return 500;
      } finally {
        dispatch(StudioStackBuilderActions.setStudioStackProbing(false));
      }
    }).then((code) => {
      const stack = getState().studioStackBuilder;
      return {
        code,
        title:
          code === 200 ? 'Stack is ready' : stack.errorMessage || 'Health check failed',
        detail:
          code === 200
            ? 'Home now shows your workspace snapshot.'
            : stack.errorHint || 'Fix the issues in the status panel above and try again.',
      };
    });
  };
};
