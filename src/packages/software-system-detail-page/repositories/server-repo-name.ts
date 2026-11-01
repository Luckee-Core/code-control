import type { ServerRuntime } from '@/store/builders/repositories-builder';

/**
 * Keeps a generated `{slug}-express-server` or `{slug}-python-server` name in sync with the runtime.
 * A name the user edited stays as they typed it.
 */
export const repoNameForServerRuntime = (
  currentName: string,
  slug: string,
  runtime: ServerRuntime
): string => {
  const expressDefault = slug ? `${slug}-express-server` : '';
  const pythonDefault = slug ? `${slug}-python-server` : '';
  const trimmed = currentName.trim();
  const nextDefault = runtime === 'python' ? pythonDefault : expressDefault;
  if (!trimmed || trimmed === expressDefault || trimmed === pythonDefault) {
    return nextDefault;
  }
  return currentName;
};
