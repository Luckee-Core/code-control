'use client';

import { ProjectDetails } from '../details';

/**
 * Project workspace: overview and repositories for `/projects/[projectId]`.
 */
export const CodeControl = () => {
  return (
    <div className={styles.wrapper}>
      <ProjectDetails isActive />
    </div>
  );
};

const styles = {
  wrapper: `
    flex flex-col flex-1 min-h-0 overflow-hidden bg-card
  `,
};
