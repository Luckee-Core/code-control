'use client';

import { useEffect } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { deliveryPreviewKey } from '@/store/dumps';
import { getDeliveryScreenshotThunk } from '@/store/thunks/data-model-deliveries';

type ScreenshotProps = { proposalId: string };

/**
 * Screenshot of the generated app shell: the template's preview page rendered with this
 * project's name and the list pages its web repo has today. The same image goes in the layout PR.
 */
export const Screenshot = ({ proposalId }: ScreenshotProps) => {
  const dispatch = useAppDispatch();
  const key = deliveryPreviewKey(proposalId, 'layout', 'web');
  const screenshot = useAppSelector((state) => state.dataModelDeliveryScreenshots[key]);
  const status = useAppSelector((state) => state.dataModelDeliveryBuilder.screenshotStatus);
  const error = useAppSelector((state) => state.dataModelDeliveryBuilder.screenshotError);

  useEffect(() => {
    // Load once per proposal (an error stops retries); Refresh re-renders on demand.
    if (proposalId && !screenshot && status === 'idle') void dispatch(getDeliveryScreenshotThunk(proposalId, 'layout', 'web'));
  }, [dispatch, proposalId, screenshot, status]);

  const isLoading = status === 'loading';

  // Only shown once there is an image: no section while the first render runs or when it fails.
  if (!screenshot?.png_base64) return null;

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Preview</h2>
          <p className={detailPageStyles.panelSubtitle}>
            How the shell looks with this project&apos;s name and the list pages the web repo has today. The same
            screenshot goes in the layout PR.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void dispatch(getDeliveryScreenshotThunk(proposalId, 'layout', 'web'))}
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
          alt="Generated app layout: sidebar, breadcrumb header and content area"
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
