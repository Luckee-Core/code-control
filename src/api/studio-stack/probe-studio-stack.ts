import { getHealth, type HealthResponse } from '@/api/health';
import { buildStudioStackProbePresentation } from './build-studio-stack-probe-result';
import { isStudioStackReady } from './is-studio-stack-ready';

export type ProbeStudioStackResult =
  | { success: true; data: HealthResponse }
  | { success: false; error: string; hint: string; data: HealthResponse | null };

/**
 * Probes Code Control Express /api/health and validates the full local stack.
 */
export const probeStudioStack = async (): Promise<ProbeStudioStackResult> => {
  console.log('🔍 [studio-stack] Probing Express /api/health…');

  const result = await getHealth();
  if (!result.success) {
    const presentation = buildStudioStackProbePresentation(null, result.error);
    console.warn('❌ [studio-stack] Health fetch failed:', result.error);
    return {
      success: false,
      error: presentation.title,
      hint: presentation.nextStep,
      data: null,
    };
  }

  const { data } = result;
  console.log('📊 [studio-stack] Health payload:', {
    status: data.status,
    canonicalData: data.canonicalData,
    database: data.database,
    directUrl: data.directUrl,
    gatewayUrl: data.gatewayUrl,
    detail: data.canonicalDataDetail,
  });

  if (isStudioStackReady(data)) {
    console.log('✅ [studio-stack] Stack ready');
    return { success: true, data };
  }

  const presentation = buildStudioStackProbePresentation(data, null);
  console.warn('⚠️ [studio-stack] Stack not ready:', presentation.title);
  return {
    success: false,
    error: presentation.title,
    hint: presentation.nextStep,
    data,
  };
};
