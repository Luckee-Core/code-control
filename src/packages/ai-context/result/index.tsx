'use client';

import { useAppSelector } from '@/store';
import { detailPageStyles } from '@/components/detail-page-styles';
import { copyText } from '../copy-text';

export const Result = () => {
  const builder = useAppSelector((state) => state.aiContextBuilder);
  const saved = builder.lastSnapshot?.snapshot;
  const text = saved?.text ?? builder.preview?.text;
  if (!text) return null;

  const hash = saved?.content_hash ?? builder.preview?.hash ?? '';
  const count = saved?.convention_count ?? builder.preview?.convention_count ?? 0;
  const label = saved
    ? builder.lastSnapshot?.reused
      ? 'Snapshot (identical one already existed, reused)'
      : 'Snapshot saved'
    : 'Preview (not saved)';

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>{label}</h2>
          <p className={detailPageStyles.panelSubtitle}>
            {count} conventions · sha256 <span className={styles.hash}>{hash.slice(0, 16)}</span>
            {saved ? (
              <>
                {' '}
                · id <span className={styles.hash}>{saved.id}</span>
              </>
            ) : null}
          </p>
        </div>
        <button type="button" onClick={() => void copyText(text)} className={detailPageStyles.secondaryButton}>
          Copy
        </button>
      </div>
      <pre className={styles.text}>{text}</pre>
    </section>
  );
};

const styles = {
  hash: `font-mono`,
  text: `px-4 py-4 text-[11px] font-mono text-gray-800 whitespace-pre-wrap max-h-[60vh] overflow-y-auto`,
};
