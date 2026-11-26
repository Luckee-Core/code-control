'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { Row } from './row';

type StepsProps = {
  runId: string;
};

/** The run's steps in tab order, each with the PR links from its latest logged outcome. */
export const Steps = ({ runId }: StepsProps) => {
  const stepsById = useAppSelector((state) => state.systemBuildRunSteps);
  const eventsById = useAppSelector((state) => state.systemBuildRunEvents);

  const steps = useMemo(
    () => Object.values(stepsById).filter((step) => step.run_id === runId).sort((a, b) => a.position - b.position),
    [stepsById, runId],
  );
  const prUrlsByStep = useMemo(() => {
    const byStep: Record<string, string[]> = {};
    Object.values(eventsById)
      .filter((event) => event.run_id === runId && event.step_id)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach((event) => {
        const urls = event.detail?.pr_urls;
        if (Array.isArray(urls)) byStep[event.step_id as string] = urls.filter((url): url is string => typeof url === 'string');
      });
    return byStep;
  }, [eventsById, runId]);

  return (
    <ol className={styles.list}>
      {steps.map((step) => (
        <Row key={step.id} step={step} prUrls={prUrlsByStep[step.id] ?? []} />
      ))}
    </ol>
  );
};

const styles = {
  list: `flex flex-col divide-y divide-gray-100`,
};
