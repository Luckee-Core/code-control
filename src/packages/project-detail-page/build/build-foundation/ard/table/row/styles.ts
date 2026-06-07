export const styles = {
  row: `
    bg-card hover:bg-muted/30 transition-colors
  `,
  checkboxButton: (isSelected: boolean) => `
    h-4 w-4 rounded border flex items-center justify-center transition-colors cursor-pointer
    ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input hover:border-primary/50'}
  `,
  nameCell: `
    flex items-center gap-2
  `,
  expandButton: `
    shrink-0 text-muted-foreground hover:text-foreground transition-colors
  `,
  fileCell: `
    font-mono text-sm font-medium text-foreground
  `,
  conventionCount: `
    text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full
  `,
  descriptionCell: `
    text-xs text-muted-foreground
  `,
  pathCell: `
    text-[11px] font-mono text-muted-foreground
  `,
  statusBadge: (status: string | null) => {
    const base = 'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full';
    const variants: Record<string, string> = {
      completed: 'bg-status-done/10 text-status-done',
      processing: 'bg-primary/10 text-primary',
      queued: 'bg-warning/10 text-warning',
      failed: 'bg-destructive/10 text-destructive',
    };
    return `${base} ${variants[status ?? ''] ?? 'bg-muted text-muted-foreground'}`;
  },
  statusCell: `
    flex items-center justify-center gap-2
  `,
  retryButton: `
    shrink-0 px-2 py-1 rounded text-xs font-medium
    bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors
  `,
  deleteButton: `
    shrink-0 px-2 py-1 rounded text-xs font-medium
    bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors
  `,
  expandedCell: `
    bg-muted/20 px-4 py-4 border-t border-border
  `,
  expandedContent: `
    max-w-4xl
  `,
  tabContainer: `
    flex gap-1 border-b border-border mb-4
  `,
  tab: (isActive: boolean) => `
    px-4 py-2 text-sm font-medium transition-colors
    ${isActive 
      ? 'text-primary border-b-2 border-primary' 
      : 'text-muted-foreground hover:text-foreground'
    }
  `,
  promptSection: `
    bg-card border border-border rounded-lg overflow-hidden
  `,
  promptHeader: `
    flex items-center justify-between gap-4 px-4 py-3 bg-muted/50 border-b border-border
  `,
  promptTitle: `
    text-sm font-semibold text-foreground
  `,
  tagsContainer: `
    flex items-center gap-2
  `,
  tagsLabel: `
    text-xs text-muted-foreground
  `,
  focusTag: `
    inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
    bg-primary/10 text-primary border border-primary/20
  `,
  promptContent: `
    px-4 py-3 text-xs font-mono text-foreground bg-background
    overflow-x-auto whitespace-pre-wrap leading-relaxed
    max-h-96 overflow-y-auto
  `,
  conventionsNote: `
    flex items-start gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border-t border-blue-200 dark:border-blue-800
  `,
  noteIcon: `
    text-base shrink-0
  `,
  noteText: `
    text-xs text-blue-700 dark:text-blue-300 leading-relaxed
  `,
  inlineCode: `
    px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-mono text-xs
  `,
};
