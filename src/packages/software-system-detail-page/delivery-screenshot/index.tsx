'use client';

import { useEffect, useRef } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { deliveryPreviewKey } from '@/store/dumps';
import type { DataModelDeliveryKind } from '@/model/data-model-delivery';
import { getDeliveryScreenshotThunk } from '@/store/thunks/data-model-deliveries';

type DeliveryScreenshotProps = { proposalId: string; kind: DataModelDeliveryKind; subtitle: string; alt: string };

/**
 * Screenshot of what a web delivery generates: the template's preview page for `kind`, rendered
 * with this project's data and its web repo as it is today. The same image goes in the PR.
 * Hidden until there is an image.
 */
export const DeliveryScreenshot = ({ proposalId, kind, subtitle, alt }: DeliveryScreenshotProps) => {
  const dispatch = useAppDispatch();
  const key = deliveryPreviewKey(proposalId, kind, 'web');
  const screenshot = useAppSelector((state) => state.dataModelDeliveryScreenshots[key]);
  const status = useAppSelector((state) => state.dataModelDeliveryBuilder.screenshotStatus);
  const error = useAppSelector((state) => state.dataModelDeliveryBuilder.screenshotError);

  // Try once per mounted panel and key (an error stops retries; the status is shared across tabs).
  const triedKey = useRef('');
  useEffect(() => {
    if (!proposalId || screenshot || triedKey.current === key) return;
    triedKey.current = key;
    void dispatch(getDeliveryScreenshotThunk(proposalId, kind, 'web'));
  }, [dispatch, proposalId, kind, key, screenshot]);

  const isLoading = status === 'loading';

  // Only shown once there is an image: no section while the first render runs or when it fails.
  if (!screenshot?.png_base64) return null;

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Preview</h2>
          <p className={detailPageStyles.panelSubtitle}>{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => void dispatch(getDeliveryScreenshotThunk(proposalId, kind, 'web'))}
          disabled={isLoading}
          className={`${detailPageStyles.secondaryButton} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Rendering…' : 'Refresh'}
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <figure className={styles.figure}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a data URL, nothing for next/image to optimize */}
        <img
          src={`data:image/png;base64,${screenshot.png_base64}`}
          width={screenshot.width}
          height={screenshot.height}
          alt={alt}
          className={`${styles.image} ${isLoading ? 'opacity-60' : ''}`}
        />
        <figcaption className={styles.caption}>
          {screenshot.repo_full_name} @ {screenshot.base_branch} · template {screenshot.template.repo}@
          {screenshot.template.sha.slice(0, 7)}
        </figcaption>
      </figure>
    </section>
  );
};

const styles = {
  figure: `px-4 py-3 flex flex-col gap-2`,
  image: `w-full h-auto rounded border border-gray-300 shadow-sm transition-opacity`,
  caption: `text-[11px] text-gray-500 font-mono`,
  error: `mx-4 mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 whitespace-pre-wrap`,
};
