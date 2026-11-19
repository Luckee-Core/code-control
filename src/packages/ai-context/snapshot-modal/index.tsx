'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { AiContextBuilderActions } from '@/store/builders';
import { detailPageStyles } from '@/components/detail-page-styles';
import { copyText } from '../copy-text';

export const SnapshotModal = () => {
  const dispatch = useAppDispatch();
  const snapshot = useAppSelector((state) => state.aiContextBuilder.viewingSnapshot);
  if (!snapshot) return null;

  const handleClose = () => dispatch(AiContextBuilderActions.setViewingSnapshot(null));

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Snapshot</h2>
            <p className={styles.meta}>
              {snapshot.domain_key} · {snapshot.role_key} · {snapshot.convention_count} conventions · format v
              {snapshot.format_version}
            </p>
            <p className={styles.meta}>id {snapshot.id}</p>
            <p className={styles.meta}>sha256 {snapshot.content_hash}</p>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => void copyText(snapshot.text)} className={detailPageStyles.secondaryButton}>
              Copy
            </button>
            <button type="button" onClick={handleClose} className={styles.closeButton}>
              ×
            </button>
          </div>
        </div>
        <pre className={styles.text}>{snapshot.text}</pre>
      </div>
    </div>
  );
};

const styles = {
  overlay: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`,
  modal: `bg-white rounded-lg shadow-xl max-w-4xl w-full border border-gray-300 overflow-hidden text-gray-900 flex flex-col max-h-[90vh]`,
  header: `flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-300`,
  title: `text-lg font-semibold text-gray-900`,
  meta: `text-[11px] font-mono text-gray-500 break-all`,
  actions: `flex items-center gap-2`,
  closeButton: `text-2xl text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer`,
  text: `px-6 py-4 text-[11px] font-mono text-gray-800 whitespace-pre-wrap overflow-y-auto`,
};
