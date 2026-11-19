'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { DataModelDeliveryBuilderActions } from '@/store/builders';
import { deliveryPreviewKey } from '@/store/dumps';

/** Rendered files for one role: file list on the left, read-only code on the right. */
export const Preview = () => {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const previewRole = useAppSelector((state) => state.dataModelDeliveryBuilder.previewRole);
  const previewStatus = useAppSelector((state) => state.dataModelDeliveryBuilder.previewStatus);
  const previewError = useAppSelector((state) => state.dataModelDeliveryBuilder.previewError);
  const selectedPath = useAppSelector((state) => state.dataModelDeliveryBuilder.selectedPath);
  const preview = useAppSelector((state) =>
    selectedId && previewRole ? state.dataModelDeliveryPreviews[deliveryPreviewKey(selectedId, previewRole)] : undefined,
  );

  const file = useMemo(() => preview?.files.find((item) => item.path === selectedPath), [preview, selectedPath]);
  const findings = useMemo(
    () => preview?.findings.filter((finding) => finding.path === selectedPath) ?? [],
    [preview, selectedPath],
  );

  if (!previewRole) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <span className={styles.title}>
          {previewStatus === 'loading'
            ? `Rendering ${previewRole} files…`
            : preview
              ? `${preview.repo_full_name} · base ${preview.base_branch} · ${preview.files.length} files · ${preview.findings.length} findings`
              : previewRole}
        </span>
        <button type="button" onClick={() => dispatch(DataModelDeliveryBuilderActions.closePreview())} className={styles.close}>
          Close
        </button>
      </div>
      {previewError ? <p className={styles.error}>{previewError}</p> : null}
      {preview && previewStatus !== 'loading' ? (
        <div className={styles.body}>
          <ul className={styles.files}>
            {preview.files.map((item) => {
              const count = preview.findings.filter((finding) => finding.path === item.path).length;
              return (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => dispatch(DataModelDeliveryBuilderActions.selectPath(item.path))}
                    className={item.path === selectedPath ? styles.fileActive : styles.file}
                  >
                    <span className={item.action === 'create' ? styles.add : styles.update}>
                      {item.action === 'create' ? 'A' : 'M'}
                    </span>
                    <span className={styles.path}>{item.path}</span>
                    {count > 0 ? <span className={styles.count}>{count}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className={styles.code}>
            {findings.map((finding, index) => (
              <p key={`${finding.convention_key}-${index}`} className={finding.severity === 'error' ? styles.findingError : styles.findingWarn}>
                {finding.severity}: {finding.message} <span className={styles.key}>{finding.convention_key}</span>
              </p>
            ))}
            <pre className={styles.pre}>{file?.content ?? ''}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  wrap: `border-t border-gray-200`,
  bar: `px-4 py-2 flex items-center justify-between gap-2 bg-gray-50 border-b border-gray-200`,
  title: `text-[11px] font-mono text-gray-700 truncate`,
  close: `text-xs text-gray-600 hover:text-gray-900 cursor-pointer`,
  error: `mx-4 my-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
  body: `grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] min-h-[320px]`,
  files: `border-r border-gray-200 py-1 max-h-[560px] overflow-y-auto`,
  file: `w-full text-left px-3 py-1 flex items-center gap-2 text-[11px] hover:bg-gray-50 cursor-pointer`,
  fileActive: `w-full text-left px-3 py-1 flex items-center gap-2 text-[11px] bg-blue-50 cursor-pointer`,
  add: `font-mono font-semibold text-green-700 w-3`,
  update: `font-mono font-semibold text-amber-700 w-3`,
  path: `font-mono text-gray-800 truncate`,
  count: `ml-auto text-[10px] font-semibold text-red-700`,
  code: `min-w-0 flex flex-col`,
  findingError: `mx-3 mt-2 text-[11px] text-red-800 bg-red-50 border border-red-200 rounded px-2 py-1`,
  findingWarn: `mx-3 mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1`,
  key: `font-mono text-[10px] opacity-70`,
  pre: `m-0 p-3 text-[11px] leading-relaxed font-mono text-gray-900 overflow-auto max-h-[560px] whitespace-pre`,
};
