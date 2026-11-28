'use client';

type BarProps = {
  /** 0–1. */
  fraction: number;
  fill: string;
  /** Pulse the fill while work is happening. */
  isActive: boolean;
  size: 'sm' | 'lg';
};

/** A progress bar whose fill eases to each new value between polls. */
export const Bar = ({ fraction, fill, isActive, size }: BarProps) => {
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  return (
    <div className={size === 'lg' ? styles.trackLg : styles.trackSm} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className={`${styles.fill} ${fill} ${isActive ? styles.active : ''}`} style={{ width: `${percent}%` }} />
    </div>
  );
};

const styles = {
  trackLg: `h-3 w-full rounded-full bg-gray-200 overflow-hidden`,
  trackSm: `h-1.5 w-full rounded-full bg-gray-100 overflow-hidden`,
  fill: `h-full rounded-full transition-[width] duration-700 ease-out`,
  active: `animate-pulse`,
};
