'use client';

const styles = {
  header: `
    mb-6
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  description: `
    text-sm text-gray-500 mt-1
  `,
};

export const BackendOnboardingHeader = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>Backend Schema</h2>
      <p className={styles.description}>
        Define your data entities and fields. Each entity maps to a database table.
      </p>
    </header>
  );
};
