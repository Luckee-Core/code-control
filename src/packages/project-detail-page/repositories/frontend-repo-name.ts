import type { FrontendRuntime } from '@/store/builders/repositories-builder';

/**
 * Keeps a generated `{slug}-web` or `{slug}-react-native` name in sync with the frontend type.
 * A name the user edited stays as they typed it.
 */
export const repoNameForFrontendRuntime = (
  currentName: string,
  slug: string,
  runtime: FrontendRuntime
): string => {
  const nextjsDefault = slug ? `${slug}-web` : '';
  const reactNativeDefault = slug ? `${slug}-react-native` : '';
  const trimmed = currentName.trim();
  const nextDefault = runtime === 'react-native' ? reactNativeDefault : nextjsDefault;
  if (!trimmed || trimmed === nextjsDefault || trimmed === reactNativeDefault) {
    return nextDefault;
  }
  return currentName;
};
