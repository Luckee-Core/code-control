'use client';

import { PROJECTS_PATH } from '@/config/routes';

export const Login = () => {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Code Control</h1>
        <p className={styles.body}>
          No login required for local use. Open the workspace to manage customers, projects, and
          repositories.
        </p>
        <a href={PROJECTS_PATH} className={styles.link}>
          Continue to Projects
        </a>
      </div>
    </main>
  );
};

const styles = {
  main: `
    min-h-screen flex items-center justify-center p-8
  `,
  card: `
    max-w-md w-full space-y-4 text-center
  `,
  title: `
    text-2xl font-semibold
  `,
  body: `
    text-gray-600 text-sm
  `,
  link: `
    inline-block px-4 py-2 bg-blue-600 text-white rounded-lg
  `,
};
