'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';

/** Tables the AI deliberately left out, and questions it wants answered. */
export const Notes = () => {
  const selectedId = useAppSelector((state) => state.dataModelBuilder.selectedProposalId);
  const content = useAppSelector((state) =>
    selectedId ? state.dataModelProposals[selectedId]?.proposal ?? null : null,
  );

  if (!content || (content.excluded.length === 0 && content.open_questions.length === 0)) return null;

  return (
    <section className={detailPageStyles.panel}>
      <div className={`${detailPageStyles.panelBody} ${styles.grid}`}>
        {content.open_questions.length > 0 ? (
          <div>
            <h3 className={detailPageStyles.sectionTitle}>Open questions</h3>
            <ul className={styles.list}>
              {content.open_questions.map((question, index) => (
                <li key={index} className={styles.item}>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {content.excluded.length > 0 ? (
          <div>
            <h3 className={detailPageStyles.sectionTitle}>Left out on purpose</h3>
            <ul className={styles.list}>
              {content.excluded.map((item) => (
                <li key={item.name} className={styles.item}>
                  <span className={styles.name}>{item.name}</span> — {item.reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  grid: `grid grid-cols-1 md:grid-cols-2 gap-5`,
  list: `mt-2 flex flex-col gap-1.5 list-disc pl-4`,
  item: `text-xs text-gray-700 leading-relaxed`,
  name: `font-mono text-gray-900`,
};
