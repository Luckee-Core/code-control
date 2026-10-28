import type { HealthResponse } from '@/api/health';
import { getApiBaseUrl } from '@/api/config';
import { getDefaultExpressBaseUrl } from '@/config/studio-stack';
import { isStudioStackReady } from './is-studio-stack-ready';

export type StackHealthLine = {
  label: string;
  status: string;
  tone: 'ok' | 'warn' | 'bad' | 'muted';
};

export type StudioStackProbePresentation = {
  title: string;
  nextStep: string;
  lines: StackHealthLine[];
};

const toneForComponent = (value: string): StackHealthLine['tone'] => {
  if (value === 'ok') return 'ok';
  if (value === 'unconfigured') return 'warn';
  if (value === 'degraded') return 'warn';
  return 'bad';
};

const labelForCanonical = (value: string): string => {
  if (value === 'ok') return 'connected';
  if (value === 'unconfigured') return 'not configured';
  if (value === 'error') return 'unreachable';
  return value;
};

const labelForDatabase = (value: string): string => {
  if (value === 'ok') return 'connected';
  if (value === 'unconfigured') return 'not checked (gateway mode)';
  if (value === 'error') return 'unreachable';
  return value;
};

const resolveDataTargetUrl = (data: HealthResponse): string => {
  if (data.directUrl?.trim()) {
    return data.directUrl.trim();
  }
  if (data.gatewayUrl?.trim()) {
    return data.gatewayUrl.trim();
  }
  if (data.storageUrl?.trim()) {
    return data.storageUrl.trim();
  }
  return '';
};

/**
 * User-facing title + next step + status lines from a health payload or fetch failure.
 */
export const buildStudioStackProbePresentation = (
  data: HealthResponse | null,
  fetchError: string | null,
): StudioStackProbePresentation => {
  const apiBase = getApiBaseUrl() || getDefaultExpressBaseUrl();

  if (!data) {
    return {
      title: 'Code Control API is not reachable',
      nextStep: fetchError
        ? `${fetchError} Start code-control-express-server (npm run dev) and set CODE_CONTROL_API_URL in code-control/.env.local to ${apiBase}.`
        : `Start code-control-express-server at ${apiBase}, then run the health check again.`,
      lines: [
        { label: 'Express API', status: 'unreachable', tone: 'bad' },
        { label: 'Storage / gateway', status: 'unknown', tone: 'muted' },
        { label: 'Postgres', status: 'unknown', tone: 'muted' },
      ],
    };
  }

  const canonical = data.canonicalData ?? data.storage ?? 'unconfigured';
  const db = data.database ?? 'unconfigured';
  const targetUrl = resolveDataTargetUrl(data);
  const detail = data.canonicalDataDetail?.trim() ?? '';

  const lines: StackHealthLine[] = [
    {
      label: 'Express API',
      status: data.status === 'ok' ? 'running' : data.status,
      tone: data.status === 'ok' ? 'ok' : 'warn',
    },
    {
      label: data.gatewayUrl ? 'Main gateway' : 'Storage Express',
      status: labelForCanonical(canonical),
      tone: toneForComponent(canonical),
    },
  ];

  if (targetUrl) {
    lines.push({
      label: 'Target URL',
      status: targetUrl,
      tone: 'muted',
    });
  }

  lines.push({
    label: 'Postgres',
    status: labelForDatabase(db),
    tone: toneForComponent(db === 'unconfigured' && data.gatewayUrl ? 'ok' : db),
  });

  if (isStudioStackReady(data)) {
    return {
      title: 'Stack is ready',
      nextStep: 'Home unlocks with your workspace snapshot.',
      lines,
    };
  }

  if (canonical === 'unconfigured') {
    return {
      title: 'Storage is not configured on Express',
      nextStep:
        'Set CODE_CONTROL_STORAGE_URL and CODE_CONTROL_STORAGE_SECRET (direct mode) or MAIN_GATEWAY_URL, MAIN_GATEWAY_PROJECT_ID, and DISPATCHER_GATE_SECRET (gateway mode) in code-control-express-server/.env, then restart the API.',
      lines,
    };
  }

  if (canonical === 'error') {
    const urlHint = targetUrl
      ? `Express tried to reach ${targetUrl}.`
      : 'Express could not reach storage or the main gateway.';
    const detailSuffix = detail ? ` Server reported: ${detail}` : '';
    return {
      title: 'Storage or gateway is unreachable',
      nextStep: `${urlHint} Start code-generator-storage-server (npm run dev on port 3080) or fix the gateway URL, then retry.${detailSuffix}`,
      lines,
    };
  }

  if (db === 'error') {
    return {
      title: 'Postgres is not reachable',
      nextStep:
        'Check DATABASE_URL in code-generator-storage-server/.env, run npm run db:apply-migrations, restart storage, then retry.',
      lines,
    };
  }

  if (data.status !== 'ok') {
    return {
      title: 'Express is up but dependencies are degraded',
      nextStep: 'Fix storage and Postgres using the status lines above, then run the health check again.',
      lines,
    };
  }

  return {
    title: 'Stack is not ready yet',
    nextStep: 'Review the status lines above, fix the failing dependency, then run the health check again.',
    lines,
  };
};
