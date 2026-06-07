export const styles = {
  container: `
    flex flex-col gap-4
  `,
  searchRow: `
    flex items-center gap-3
  `,
  searchWrapper: `
    relative flex-1
  `,
  searchInput: `
    w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background
    text-sm text-foreground placeholder:text-muted-foreground
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
  `,
  generateButton: `
    shrink-0 h-9 px-4 text-sm font-medium rounded-lg
    bg-primary text-primary-foreground hover:bg-primary/90
    disabled:opacity-50 disabled:cursor-not-allowed transition-colors
  `,
  refreshButton: `
    shrink-0 h-9 px-4 text-sm font-medium
    text-muted-foreground bg-background border border-input rounded-lg
    hover:bg-muted hover:text-foreground
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
  `,
  tableWrapper: `
    rounded-lg border border-border overflow-hidden
  `,
  table: `
    w-full text-sm
  `,
  emptyState: `
    flex flex-col items-center justify-center py-20 text-muted-foreground
  `,
  emptyStateIcon: `
    h-12 w-12 mb-4 opacity-30
  `,
  emptyStateText: `
    text-sm font-medium
  `,
  headerRow: `
    bg-muted/50 border-b border-border
  `,
  headerCellCheckbox: `
    w-10 px-4 py-2.5
  `,
  headerCell: `
    text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider
  `,
  headerCellStatus: `
    text-center px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider w-28
  `,
};
