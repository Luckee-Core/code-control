'use client';

import { useMemo } from 'react';
import { unifiedDiff } from '@/utils/text';

type DiffViewProps = {
  /** A unified patch (GitHub compare), or before/after text to diff here. */
  patch?: string | null;
  before?: string | null;
  after?: string | null;
  /** Show the full new content instead of the diff. */
  showFull?: boolean;
};

/** Unified diff with +/- coloring, or full content. */
export const DiffView = ({ patch, before, after, showFull }: DiffViewProps) => {
  const lines = useMemo(() => {
    if (showFull) return (after ?? '').split('\n').map((text) => ({ kind: ' ', text }));
    const text = patch ?? unifiedDiff(before ?? '', after ?? '');
    if (!text) return [];
    return text.split('\n').map((line) => ({ kind: line.startsWith('@@') ? '@' : line.charAt(0), text: line }));
  }, [patch, before, after, showFull]);

  if (lines.length === 0) return <p className={styles.empty}>No changes.</p>;
  return (
    <pre className={styles.pre}>
      {lines.map((line, index) => (
        <div key={index} className={line.kind === '+' ? styles.add : line.kind === '-' ? styles.remove : line.kind === '@' ? styles.hunk : styles.context}>
          {line.text || ' '}
        </div>
      ))}
    </pre>
  );
};

const styles = {
  empty: `text-xs text-gray-500 px-3 py-2`,
  pre: `text-[11px] leading-[1.45] font-mono bg-white border border-gray-200 rounded overflow-auto max-h-[36rem]`,
  add: `px-3 bg-green-50 text-green-900 whitespace-pre`,
  remove: `px-3 bg-red-50 text-red-900 whitespace-pre`,
  hunk: `px-3 bg-blue-50 text-blue-800 whitespace-pre`,
  context: `px-3 text-gray-800 whitespace-pre`,
};
