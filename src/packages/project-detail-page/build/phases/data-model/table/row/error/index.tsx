'use client';

import { AlertCircle } from 'lucide-react';

type ErrorTabProps = {
  errorMessage: string;
};

export const ErrorTab = ({ errorMessage }: ErrorTabProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <AlertCircle className={styles.headerIcon} />
        <h4 className={styles.title}>Error Details</h4>
      </div>
      <div className={styles.errorBox}>
        <pre className={styles.errorContent}>{errorMessage}</pre>
      </div>
      <div className={styles.helpNote}>
        <span className={styles.noteIcon}>💡</span>
        <span className={styles.noteText}>
          Review the error message above to understand what went wrong. You can retry the generation after fixing any issues.
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: `
    space-y-3
  `,
  header: `
    flex items-center gap-2
  `,
  headerIcon: `
    h-4 w-4 text-destructive
  `,
  title: `
    text-sm font-semibold text-foreground
  `,
  errorBox: `
    bg-red-50 border border-red-200 rounded-md p-4
  `,
  errorContent: `
    text-xs font-mono text-red-900 whitespace-pre-wrap leading-relaxed
  `,
  helpNote: `
    flex items-start gap-2 text-xs text-muted-foreground bg-amber-50 border border-amber-200 
    rounded-md p-3
  `,
  noteIcon: `
    text-base shrink-0
  `,
  noteText: `
    leading-relaxed
  `,
};
