'use client';

type TemplateTabProps = {
  promptTemplate: string;
  conventionsCount: number;
};

export const TemplateTab = ({ promptTemplate, conventionsCount }: TemplateTabProps) => {
  return (
    <div className={styles.promptSection}>
      <div className={styles.promptHeader}>
        <h4 className={styles.promptTitle}>Prompt Template</h4>
      </div>
      <pre className={styles.promptContent}>{promptTemplate}</pre>
      <div className={styles.conventionsNote}>
        <span className={styles.noteIcon}>ℹ️</span>
        <span className={styles.noteText}>
          The <code className={styles.inlineCode}>{'{{conventions}}'}</code> placeholder will be replaced with all {conventionsCount} conventions from the build profile.
        </span>
      </div>
    </div>
  );
};

const styles = {
  promptSection: `
    space-y-3
  `,
  promptHeader: `
    flex items-center justify-between
  `,
  promptTitle: `
    text-sm font-semibold text-foreground
  `,
  promptContent: `
    text-xs font-mono text-muted-foreground bg-muted rounded-md p-4
    whitespace-pre-wrap break-words max-h-96 overflow-y-auto
  `,
  conventionsNote: `
    flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 border border-blue-200 
    rounded-md p-3
  `,
  noteIcon: `
    text-base shrink-0
  `,
  noteText: `
    leading-relaxed
  `,
  inlineCode: `
    bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono
  `,
};
