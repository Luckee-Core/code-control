'use client';

import type { SystemBuildRunStep } from '@/model/system-build-run-step';
import { useAppDispatch } from '@/store';
import { SoftwareSystemTabsBuilderActions } from '@/store/builders';
import { STEP_ICON, STEP_LABEL, STEP_TAB } from '../../config';

type RowProps = {
  step: SystemBuildRunStep;
  prUrls: string[];
};

/** One tab of the build: status, why it stopped or was skipped, its PRs. Clicking opens the tab. */
export const Row = ({ step, prUrls }: RowProps) => {
  const dispatch = useAppDispatch();
  const tab = STEP_TAB[step.kind];
  const message = step.error ?? step.note;

  return (
    <li className={styles.row}>
      <span className={ICON_STYLE[step.status]} aria-hidden>
        {STEP_ICON[step.status]}
      </span>
      <div className={styles.body}>
        <div className={styles.line}>
          <button type="button" onClick={() => dispatch(SoftwareSystemTabsBuilderActions.setActiveTab(tab))} className={styles.tab}>
            {tab}
          </button>
          <span className={styles.status}>{STEP_LABEL[step.status]}</span>
          {prUrls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className={styles.pr}>
              {prLabel(url)}
            </a>
          ))}
        </div>
        {message ? <p className={step.error ? styles.error : styles.note}>{message}</p> : null}
      </div>
    </li>
  );
};

/** `acme-web #3` from a PR URL (…/{owner}/{repo}/pull/{number}). */
const prLabel = (url: string): string => {
  const parts = url.split('/');
  return `${parts[parts.length - 3] ?? 'PR'} #${parts[parts.length - 1]}`;
};

const ICON = 'w-4 shrink-0 text-center text-xs font-semibold leading-5';

const ICON_STYLE: Record<SystemBuildRunStep['status'], string> = {
  pending: `${ICON} text-gray-300`,
  running: `${ICON} text-blue-600 animate-pulse`,
  waiting_merge: `${ICON} text-amber-600`,
  merged: `${ICON} text-green-600`,
  skipped: `${ICON} text-gray-400`,
  failed: `${ICON} text-red-600`,
};

const styles = {
  row: `flex items-start gap-2 py-1.5`,
  body: `flex flex-col gap-0.5 min-w-0`,
  line: `flex flex-wrap items-center gap-x-2 gap-y-0.5`,
  tab: `text-xs font-medium text-gray-900 hover:underline underline-offset-2 cursor-pointer`,
  status: `text-[11px] text-gray-500`,
  pr: `text-[11px] text-blue-700 hover:underline`,
  note: `text-[11px] text-gray-600 leading-relaxed`,
  error: `text-[11px] text-red-700 leading-relaxed break-words`,
};
