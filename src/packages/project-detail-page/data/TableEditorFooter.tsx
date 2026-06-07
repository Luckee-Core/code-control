'use client';

import type { ProjectRepo } from '@/api/project-setup';

type TableEditorFooterProps = {
  fieldCount: number;
  assignedRepos: ProjectRepo[];
};

const styles = {
  footer: `
    px-5 py-2.5 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs text-gray-600 shrink-0
  `,
  footerLeft: `
    flex items-center gap-2
  `,
  footerRight: `
    flex items-center gap-1
  `,
  repoBadge: `
    inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700
  `,
};

export const TableEditorFooter = ({ fieldCount, assignedRepos }: TableEditorFooterProps) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <span>
          {fieldCount} {fieldCount === 1 ? 'column' : 'columns'}
        </span>
      </div>
      <div className={styles.footerRight}>
        {assignedRepos.length > 0 && (
          <>
            <span>Assigned to:</span>
            {assignedRepos.map((r) => (
              <span key={r.id} className={styles.repoBadge}>
                {r.name}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
