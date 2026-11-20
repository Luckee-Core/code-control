'use client';

import { useEffect, useState } from 'react';
import { DiffView, Findings } from '@/components/agent-runs';
import { templateViewKey, useAppDispatch, useAppSelector } from '@/store';
import { getTemplateRenderPreviewThunk } from '@/store/thunks/agent-runs';

type RenderPreviewProps = { runId: string; repo: string };

/** Generated code for a sample data model, before vs after one repo's template PR (what future projects get). */
export const RenderPreview = ({ runId, repo }: RenderPreviewProps) => {
  const dispatch = useAppDispatch();
  const preview = useAppSelector((state) => state.templateRunViews[templateViewKey(runId, repo)]?.preview ?? null);
  const builder = useAppSelector((state) => state.agentRunsBuilder);
  const [open, setOpen] = useState('');

  useEffect(() => {
    if (!preview) void dispatch(getTemplateRenderPreviewThunk());
  }, [dispatch, preview, repo]);

  if (!preview) return <p className={styles.muted}>{builder.viewError ?? 'Rendering the sample data model with both template versions…'}</p>;
  return (
    <div className={styles.wrap}>
      <p className={styles.muted}>
        Sample: {preview.sample}. {preview.files.length} generated file{preview.files.length === 1 ? '' : 's'} change; {preview.unchanged_count} stay the same.
      </p>
      <Findings findings={preview.findings} />
      <ul className={styles.list}>
        {preview.files.map((file) => {
          const key = `${file.kind}:${file.path}`;
          return (
            <li key={key}>
              <button type="button" onClick={() => setOpen(open === key ? '' : key)} className={styles.file}>
                {open === key ? '▾' : '▸'} <span className={styles.kind}>{file.kind}</span> {file.path}
                {file.before === null ? ' (new)' : file.after === null ? ' (removed)' : ''}
              </button>
              {open === key ? <DiffView before={file.before ?? ''} after={file.after ?? ''} /> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles = {
  wrap: `flex flex-col gap-3`,
  muted: `text-xs text-gray-600`,
  list: `flex flex-col gap-1`,
  file: `text-left text-[11px] font-mono text-blue-700 hover:underline bg-transparent border-none p-0 cursor-pointer`,
  kind: `text-[9px] uppercase font-semibold text-gray-500`,
};
