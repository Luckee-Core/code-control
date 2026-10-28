'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  STUDIO_EXPRESS_ENV_EXAMPLE,
  STUDIO_SETUP_CHECKLIST_STEPS,
  STUDIO_SETUP_STORAGE_KEY,
  STUDIO_STORAGE_ENV_EXAMPLE,
  STUDIO_WEB_ENV_EXAMPLE,
} from '@/config/studio-setup-content';
import {
  DEFAULT_EXPRESS_PORT,
  DEFAULT_STORAGE_PORT,
  DEFAULT_WEB_PORT,
  EXPRESS_REPO_NAME,
  getDefaultExpressBaseUrl,
  getExpressHealthCurlExample,
  STORAGE_REPO_NAME,
  WEB_REPO_NAME,
} from '@/config/studio-stack';
import { useAppDispatch, useAppSelector } from '@/store';
import { probeStudioStackThunk } from '@/store/thunks/studio-stack';
import { useToast } from '@/components/shared';
import { CopyBlock } from './copy-block';
import { StackHealthStatusPanel } from './stack-health-status-panel';

const readStoredStep = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }
  try {
    const raw = localStorage.getItem(STUDIO_SETUP_STORAGE_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 && parsed < STUDIO_SETUP_CHECKLIST_STEPS.length
      ? parsed
      : 0;
  } catch {
    return 0;
  }
};

/**
 * Local stack onboarding checklist with health probe (companion-style).
 */
export const StudioSetupStepper = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const stack = useAppSelector((state) => state.studioStackBuilder);
  const [activeStep, setActiveStep] = useState(0);
  const panelAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveStep(readStoredStep());
  }, []);

  const persistStep = useCallback((step: number) => {
    setActiveStep(step);
    try {
      localStorage.setItem(STUDIO_SETUP_STORAGE_KEY, String(step));
    } catch {
      // ignore quota errors
    }
  }, []);

  const onCheckStack = () => {
    panelAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void dispatch(probeStudioStackThunk()).then((outcome) => {
      const toastMessage = `${outcome.title}. ${outcome.detail}`;
      if (outcome.code === 200) {
        showToast(toastMessage, 'success');
        persistStep(STUDIO_SETUP_CHECKLIST_STEPS.length - 1);
        return;
      }
      showToast(toastMessage, 'error');
    });
  };

  const onAdvanceStep = (index: number) => {
    if (index < STUDIO_SETUP_CHECKLIST_STEPS.length - 1) {
      persistStep(Math.max(activeStep, index + 1));
    }
  };

  const checking = stack.isProbing;

  return (
    <section className={styles.wrap} id="setup" aria-label="Studio stack setup">
      <div ref={panelAnchorRef}>
        <StackHealthStatusPanel />
      </div>
      <div className={styles.repoCard}>
        <h2 className={styles.heading}>Repositories</h2>
        <p className={styles.repoLead}>
          Hub <strong>Run</strong> starts Express and web only — start{' '}
          <code className={styles.codeInline}>{STORAGE_REPO_NAME}</code> separately when you need
          data. Default Hub ports: storage <strong>{DEFAULT_STORAGE_PORT}</strong>, Express{' '}
          <strong>{DEFAULT_EXPRESS_PORT}</strong>, web <strong>{DEFAULT_WEB_PORT}</strong>.
        </p>
        <ul className={styles.repoList}>
          <li>
            <code className={styles.codeInline}>{STORAGE_REPO_NAME}</code>
          </li>
          <li>
            <code className={styles.codeInline}>{EXPRESS_REPO_NAME}</code>
          </li>
          <li>
            <code className={styles.codeInline}>{WEB_REPO_NAME}</code>
          </li>
        </ul>
      </div>

      <h2 className={styles.checklistHeading}>Setup checklist</h2>
      <ol className={styles.list}>
        {STUDIO_SETUP_CHECKLIST_STEPS.map((step, index) => (
          <li key={step.title} className={index <= activeStep ? styles.itemDone : styles.item}>
            <span className={styles.badge}>{index + 1}</span>
            <div className={styles.stepBody}>
              <p className={styles.stepTitle}>{step.title}</p>
              <p className={styles.stepText}>{step.body}</p>
              {index === 1 ? (
                <CopyBlock label="Storage .env" command={STUDIO_STORAGE_ENV_EXAMPLE} />
              ) : null}
              {index === 3 ? (
                <CopyBlock label="Express .env" command={STUDIO_EXPRESS_ENV_EXAMPLE} />
              ) : null}
              {index === 4 ? (
                <>
                  <CopyBlock
                    label="Start storage"
                    command={`cd ${STORAGE_REPO_NAME}\nnpm run dev`}
                  />
                  <CopyBlock
                    label="Start Express"
                    command={`cd ${EXPRESS_REPO_NAME}\nnpm run dev`}
                  />
                  <CopyBlock
                    label="Start web"
                    command={`cd ${WEB_REPO_NAME}\n# .env.local:\n${STUDIO_WEB_ENV_EXAMPLE}\nnpm run dev`}
                  />
                </>
              ) : null}
              {index < STUDIO_SETUP_CHECKLIST_STEPS.length - 1 ? (
                <button type="button" className={styles.doneButton} onClick={() => onAdvanceStep(index)}>
                  {index < activeStep ? 'Done' : 'Mark done'}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <p className={styles.apiLine}>
        API URL: <code className={styles.code}>{getDefaultExpressBaseUrl()}</code>
      </p>
      <CopyBlock label="Health check" command={getExpressHealthCurlExample()} />

      <button type="button" className={styles.testButton} disabled={checking} onClick={onCheckStack}>
        {checking ? 'Checking…' : 'Run health check'}
      </button>

      {!checking && stack.lastCheckedAt && stack.status === 'unavailable' ? (
        <div className={styles.resultFail} role="alert">
          <p className={styles.resultFailTitle}>{stack.errorMessage}</p>
          <p className={styles.resultBody}>{stack.errorHint}</p>
        </div>
      ) : null}

      {!checking && stack.status === 'ready' ? (
        <div className={styles.resultOk} role="status">
          <p className={styles.resultTitle}>Stack is ready</p>
          <p className={styles.resultBody}>Home unlocked — use the sidebar or quick links on Home.</p>
        </div>
      ) : null}

      <p className={styles.docsNote}>
        Full guide:{' '}
        <code className={styles.codeInline}>code-control-express-server/DEPLOYMENT.md</code> and{' '}
        <code className={styles.codeInline}>
          code-control-express-server/docs/studio-local-postgres-setup.md
        </code>
        .
      </p>
    </section>
  );
};

const styles = {
  wrap: `mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left pb-8`,
  repoCard: `rounded-lg border border-gray-200 bg-white p-4`,
  heading: `text-sm font-semibold text-gray-900`,
  repoLead: `mt-2 text-sm text-gray-600 leading-relaxed`,
  repoList: `mt-3 text-sm text-gray-800 space-y-1 list-disc pl-5 m-0`,
  checklistHeading: `mt-6 text-sm font-semibold text-gray-900`,
  list: `mt-3 flex flex-col gap-3`,
  item: `flex gap-2 text-sm text-gray-600`,
  itemDone: `flex gap-2 text-sm text-gray-900`,
  badge: `
    flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold
  `,
  stepBody: `min-w-0 flex-1 flex flex-col gap-2`,
  stepTitle: `font-medium leading-snug`,
  stepText: `mt-0.5 text-xs text-gray-600 leading-relaxed`,
  doneButton: `text-xs font-medium text-blue-700 hover:underline cursor-pointer self-start`,
  apiLine: `mt-6 text-xs text-gray-600`,
  code: `rounded bg-white px-1 font-mono text-xs`,
  codeInline: `rounded bg-gray-100 px-1 text-[11px] font-mono`,
  testButton: `
    mt-3 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white
    hover:bg-gray-800 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
  `,
  resultOk: `
    mt-4 rounded-lg border border-green-400 bg-green-50 p-4
  `,
  resultFail: `
    mt-4 rounded-lg border border-red-400 bg-red-50 p-4
  `,
  resultTitle: `text-sm font-semibold m-0 text-gray-900`,
  resultFailTitle: `text-sm font-semibold m-0 text-red-900`,
  resultBody: `text-sm mt-2 leading-relaxed text-gray-800 m-0`,
  docsNote: `mt-4 text-xs text-gray-600 leading-relaxed`,
};
