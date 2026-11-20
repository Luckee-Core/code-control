'use client';

import { useEffect, useMemo, useState } from 'react';
import { DiffView, PILL } from '@/components/agent-runs';
import { AgentRunsBuilderActions, templateViewKey, useAppDispatch, useAppSelector } from '@/store';
import { getTemplateRunDiffThunk, getTemplateRunFileThunk } from '@/store/thunks/agent-runs';

type PrFilesProps = { runId: string; repo: string; explanations: Record<string, string> };

const AREA_BADGE: Record<string, string> = {
  codegen: `${PILL} bg-indigo-50 text-indigo-700 border-indigo-200`,
  scaffold: `${PILL} bg-gray-50 text-gray-700 border-gray-300`,
  adr: `${PILL} bg-teal-50 text-teal-700 border-teal-200`,
};

/** One template repo's PR files grouped by area (codegen, scaffold, ADR) with the diff or the full file. */
export const PrFiles = ({ runId, repo, explanations }: PrFilesProps) => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const views = useAppSelector((state) => state.templateRunViews);
  const [full, setFull] = useState(false);
  const view = views[templateViewKey(runId, repo)];
  const files = useMemo(() => view?.diff[builder.diffScope] ?? null, [view, builder.diffScope]);
  const sorted = useMemo(() => (files ? [...files].sort((a, b) => a.area.localeCompare(b.area) || a.filename.localeCompare(b.filename)) : []), [files]);
  const selected = useMemo(() => sorted.find((file) => file.filename === builder.selectedPath) ?? sorted[0] ?? null, [sorted, builder.selectedPath]);
  const fullFile = selected ? view?.files[`head:${selected.filename}`] : undefined;

  useEffect(() => {
    if (!files) void dispatch(getTemplateRunDiffThunk());
  }, [dispatch, files, builder.diffScope, repo]);
  useEffect(() => {
    if (full && selected) void dispatch(getTemplateRunFileThunk(selected.filename, 'head'));
  }, [dispatch, full, selected]);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.toggle}>
          {(['pr', 'run'] as const).map((scope) => (
            <button key={scope} type="button" onClick={() => dispatch(AgentRunsBuilderActions.setDiffScope(scope))} className={builder.diffScope === scope ? styles.on : styles.off}>
              {scope === 'pr' ? 'Whole PR' : "This run's commit"}
            </button>
          ))}
        </div>
        <label className={styles.check}>
          <input type="checkbox" checked={full} onChange={(event) => setFull(event.target.checked)} /> Full file
        </label>
        {builder.viewStatus === 'loading' ? <span className={styles.muted}>Loading…</span> : null}
        {builder.viewError ? <span className={styles.error}>{builder.viewError}</span> : null}
      </div>
      <div className={styles.split}>
        <ul className={styles.files}>
          {sorted.map((file) => (
            <li key={file.filename}>
              <button
                type="button"
                onClick={() => dispatch(AgentRunsBuilderActions.selectPath(file.filename))}
                className={selected?.filename === file.filename ? styles.fileActive : styles.file}
              >
                <span className={AREA_BADGE[file.area] ?? AREA_BADGE.scaffold}>{file.area}</span>
                <span className={styles.path}>{file.filename}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.viewer}>
          {selected ? (
            <>
              {explanations[selected.filename] ? <p className={styles.explanation}>{explanations[selected.filename]}</p> : null}
              {full ? (
                fullFile ? <DiffView after={fullFile.content ?? ''} showFull /> : <p className={styles.muted}>Loading file…</p>
              ) : (
                <DiffView patch={selected.patch ?? ''} />
              )}
            </>
          ) : (
            <p className={styles.muted}>{files ? 'No files changed.' : 'Loading…'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrap: `flex flex-col gap-3`,
  toolbar: `flex flex-wrap items-center gap-3`,
  toggle: `inline-flex rounded border border-gray-300 overflow-hidden`,
  on: `text-[11px] px-2 py-1 bg-gray-900 text-white cursor-default`,
  off: `text-[11px] px-2 py-1 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer`,
  check: `flex items-center gap-1 text-xs text-gray-700 cursor-pointer`,
  muted: `text-xs text-gray-500`,
  error: `text-xs text-red-700`,
  split: `grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-3`,
  files: `flex flex-col gap-0.5 max-h-[36rem] overflow-auto`,
  file: `w-full text-left px-2 py-1 rounded hover:bg-gray-50 cursor-pointer flex items-start gap-2`,
  fileActive: `w-full text-left px-2 py-1 rounded bg-gray-100 ring-1 ring-inset ring-gray-300 flex items-start gap-2`,
  path: `text-[11px] font-mono break-all text-gray-800`,
  viewer: `flex flex-col gap-2 min-w-0`,
  explanation: `text-xs text-gray-700`,
};
