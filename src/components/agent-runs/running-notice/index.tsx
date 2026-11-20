import { detailPageStyles } from '@/components/detail-page-styles';

type RunningNoticeProps = { text: string };

/** Shown while a run is executing (the page polls until it finishes). */
export const RunningNotice = ({ text }: RunningNoticeProps) => (
  <section className={detailPageStyles.panel}>
    <div className={styles.body}>
      <span className={styles.dot} aria-hidden />
      <p className={styles.text}>{text}</p>
    </div>
  </section>
);

const styles = {
  body: `px-4 py-4 flex items-center gap-3`,
  dot: `h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse`,
  text: `text-xs text-gray-700`,
};
