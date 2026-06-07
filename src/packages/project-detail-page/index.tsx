'use client';

import { CodeControl } from './code-control';

/**
 * Customer project workspace for `/projects/[projectId]` and customer-linked flows.
 * Renders {@link CodeControl} (Details / Data / Build).
 *
 * Learning blueprint project UI lives in `@/packages/learning-project-detail`.
 */
export const ProjectWorkspace = () => {
  return <CodeControl />;
};
