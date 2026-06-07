'use client';

import { styles } from './styles';

export const ARDTableHeader = () => {
  return (
    <thead>
      <tr className={styles.headerRow}>
        <th className={styles.headerCellCheckbox} />
        <th className={styles.headerCell}>File</th>
        <th className={styles.headerCell}>Description</th>
        <th className={styles.headerCell}>Output Path</th>
        <th className={styles.headerCellStatus}>Status</th>
      </tr>
    </thead>
  );
};
