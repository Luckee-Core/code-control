/**
 * CRUD API Phase
 *
 * Entity assignment at top (select entities + operations, Generate).
 * Queue table below: one row per queued operation.
 */

'use client';

import { CrudApiEntityAssignment } from './CrudApiEntityAssignment';
import { CrudApiQueueTable } from './CrudApiQueueTable';

type CrudApiPhaseProps = {
  repoId: string;
  repoName: string;
};

export const CrudApiPhase = ({ repoId, repoName }: CrudApiPhaseProps) => {
  return (
    <div className={styles.container}>
      {/* Entity Assignment: select entities + operations, then Generate */}
      <CrudApiEntityAssignment
        repoId={repoId}
        repoName={repoName}
      />

      {/* Queue Table: one row per queued operation */}
      <CrudApiQueueTable repoId={repoId} repoName={repoName} />
    </div>
  );
};

const styles = {
  container: `
    w-full h-full
    flex flex-col gap-4 p-6
  `,
};
