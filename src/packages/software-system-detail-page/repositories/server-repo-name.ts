import type { ServerRuntime } from '@/store/builders/repositories-builder';

const SUFFIX: Record<ServerRuntime, string> = {
  express: 'express-server',
  storage: 'storage-express-server',
  python: 'python-server',
};

/**
 * Keeps a generated `{slug}-express-server` / `{slug}-storage-express-server` / `{slug}-python-server`
 * name in sync with the runtime. A name the user edited stays as they typed it.
 */
export const repoNameForServerRuntime = (currentName: string, slug: string, runtime: ServerRuntime): string => {
  const defaults = (Object.keys(SUFFIX) as ServerRuntime[]).map((key) => (slug ? `${slug}-${SUFFIX[key]}` : ''));
  const trimmed = currentName.trim();
  const nextDefault = slug ? `${slug}-${SUFFIX[runtime]}` : '';
  if (!trimmed || defaults.includes(trimmed)) {
    return nextDefault;
  }
  return currentName;
};
