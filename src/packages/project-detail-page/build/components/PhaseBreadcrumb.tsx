type PhaseBreadcrumbProps = {
  repoName: string;
  phaseName: string;
};

export const PhaseBreadcrumb = ({ repoName, phaseName }: PhaseBreadcrumbProps) => (
  <div className={styles.breadcrumb}>
    <span>{repoName}</span>
    <svg className={styles.chevron} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
    <span className={styles.phaseName}>{phaseName}</span>
  </div>
);

const styles = {
  breadcrumb: `
    text-sm text-gray-600 mb-8 flex items-center gap-2 font-medium
  `,
  chevron: `
    h-3.5 w-3.5 text-gray-400
  `,
  phaseName: `
    text-gray-900 font-semibold
  `,
};
