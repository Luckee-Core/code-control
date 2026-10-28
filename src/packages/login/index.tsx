'use client';

import { PROJECTS_PATH } from '@/config/routes';
import { detailPageStyles } from '@/components/detail-page-styles';

export const Login = () => {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={detailPageStyles.panelHeader}>
          <h1 className={detailPageStyles.panelTitle}>Code Control</h1>
        </div>
        <div className={detailPageStyles.panelBody}>
          <p className={styles.body}>
            No login required for local use. Open the workspace to manage customers, projects, and
            repositories.
          </p>
          <a href={PROJECTS_PATH} className={detailPageStyles.primaryButton}>
            Continue to Projects
          </a>
        </div>
      </div>
    </main>
  );
};

const styles = {
  main: `
    min-h-screen flex items-center justify-center p-8 bg-gray-50
  `,
  card: `
    max-w-md w-full rounded border border-gray-300 bg-white overflow-hidden
  `,
  body: `
    text-gray-600 text-sm mb-4
  `,
};
