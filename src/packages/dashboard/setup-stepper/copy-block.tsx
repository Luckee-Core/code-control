'use client';

type CopyBlockProps = {
  label: string;
  command: string;
};

export const CopyBlock = ({ label, command }: CopyBlockProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // ignore — studio may block clipboard without permission
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <button type="button" onClick={handleCopy} className={styles.copyButton}>
          Copy
        </button>
      </div>
      <pre className={styles.pre}>{command}</pre>
    </div>
  );
};

const styles = {
  wrap: `
    rounded border border-gray-300 bg-gray-50 overflow-hidden
  `,
  labelRow: `
    flex items-center justify-between px-3 py-2 border-b border-gray-300 bg-white
  `,
  label: `
    text-xs font-medium text-gray-600 uppercase tracking-wide
  `,
  copyButton: `
    text-xs font-medium text-gray-700 hover:text-gray-900 cursor-pointer
    bg-transparent border-none
  `,
  pre: `
    text-xs text-gray-800 p-3 overflow-x-auto m-0 font-mono whitespace-pre-wrap
  `,
};
