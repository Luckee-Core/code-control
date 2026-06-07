'use client';

import { PHASES } from './phaseConfig';

type PhaseProgressProps = {
  currentPhase: string;
};

const styles = {
  container: `
    flex items-center gap-2 mb-4
  `,
  step: `
    flex items-center
  `,
  stepLabel: `
    text-xs font-medium
  `,
  stepActive: `
    text-blue-600
  `,
  stepDone: `
    text-gray-500
  `,
  stepPending: `
    text-gray-400
  `,
  separator: `
    mx-1 text-gray-300
  `,
};

export const PhaseProgress = ({ currentPhase }: PhaseProgressProps) => {
  const currentIdx = PHASES.findIndex((p) => p.id === currentPhase);

  return (
    <div className={styles.container}>
      {PHASES.map((phase, idx) => {
        const isActive = phase.id === currentPhase;
        const isDone = currentIdx > idx;
        const isPending = currentIdx < idx;
        const labelClass = isActive
          ? styles.stepActive
          : isDone
            ? styles.stepDone
            : styles.stepPending;

        return (
          <div key={phase.id} className={styles.step}>
            <span className={`${styles.stepLabel} ${labelClass}`}>{phase.name}</span>
            {idx < PHASES.length - 1 && (
              <span className={styles.separator}>→</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
