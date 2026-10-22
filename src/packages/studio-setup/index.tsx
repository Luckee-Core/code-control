'use client';

import Link from 'next/link';
import { useBreadcrumbs } from '@/hooks';
import { PROJECTS_PATH } from '@/config/routes';
import { CopyBlock } from './copy-block';
import { StatusPanel } from './status-panel';

export const StudioSetup = () => {
  useBreadcrumbs([{ label: 'Studio setup' }]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Studio setup — local Postgres</h1>
          <p className={styles.subtitle}>
            Code Control stores customers, projects, and repos on your studio machine. There is no
            dashboard button that runs migrations for you — use the terminal steps below (or copy
            them). This page checks whether the API and database are wired correctly.
          </p>
        </div>
        <Link href={PROJECTS_PATH} className={styles.backLink}>
          Back to projects
        </Link>
      </header>

      <StatusPanel />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Luckee Hub ports (default)</h2>
        <p className={styles.body}>
          On the studio, Hub usually runs Express on <strong>3012</strong> and this app on{' '}
          <strong>3013</strong>. Standalone dev often uses 3010 / 3000 — match{' '}
          <code className={styles.inlineCode}>PORT</code> and{' '}
          <code className={styles.inlineCode}>CODE_CONTROL_API_URL</code> to whatever you use.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Postgres on the studio</h2>
        <p className={styles.body}>
          Install and start PostgreSQL (14+). Create an empty database once per machine:
        </p>
        <CopyBlock label="Create database" command="createdb code_control" />
        <CopyBlock label="Smoke test" command='psql -d code_control -c "SELECT 1"' />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Express API env</h2>
        <p className={styles.body}>
          In <code className={styles.inlineCode}>code-control-express-server/.env</code> (copy from{' '}
          <code className={styles.inlineCode}>.env.example</code>):
        </p>
        <CopyBlock
          label="Required"
          command={`DATABASE_URL=postgresql://127.0.0.1:5432/code_control\nPORT=3012`}
        />
        <p className={styles.body}>
          Add GitHub PAT and template vars if you use repo creation — see the express-server OSS
          quickstart.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Schema (every new machine)</h2>
        <CopyBlock
          label="Install + migrations"
          command={`cd code-control-express-server\nnpm install\nnpm run db:apply-migrations`}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Optional — import from Supabase (one time)</h2>
        <p className={styles.body}>
          Moving off cloud Postgres? Temporarily add{' '}
          <code className={styles.inlineCode}>SUPABASE_URL</code> and{' '}
          <code className={styles.inlineCode}>SUPABASE_SERVICE_ROLE_KEY</code> to Express{' '}
          <code className={styles.inlineCode}>.env</code>, then:
        </p>
        <CopyBlock label="Import CRM rows" command="npm run db:import-from-supabase" />
        <p className={styles.note}>
          Remove the two Supabase variables after a successful import. Re-running import is safe
          (upserts by id).
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Start services</h2>
        <CopyBlock
          label="Express (terminal 1)"
          command={`cd code-control-express-server\nnpm run dev`}
        />
        <CopyBlock
          label="Web (terminal 2)"
          command={`cd code-control\n# .env.local: CODE_CONTROL_API_URL=http://127.0.0.1:3012\nnpm run dev`}
        />
        <CopyBlock
          label="Health check"
          command="curl -s http://127.0.0.1:3012/api/health"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Full written guide</h2>
        <p className={styles.body}>
          Troubleshooting, Hub notes, and security: open{' '}
          <code className={styles.inlineCode}>
            code-control-express-server/docs/studio-local-postgres-setup.md
          </code>{' '}
          in your studio clone (full walkthrough beyond these copy-paste steps).
        </p>
      </section>
    </div>
  );
};

const styles = {
  page: `
    p-6 max-w-3xl flex flex-col gap-6 overflow-y-auto
  `,
  header: `
    flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600 mt-1 leading-relaxed
  `,
  backLink: `
    text-sm font-medium text-blue-600 hover:text-blue-800 shrink-0
  `,
  section: `
    flex flex-col gap-3
  `,
  sectionTitle: `
    text-base font-semibold text-gray-900
  `,
  body: `
    text-sm text-gray-700 leading-relaxed m-0
  `,
  note: `
    text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded-md p-3 m-0
  `,
  inlineCode: `
    font-mono text-xs bg-gray-100 px-1 rounded
  `,
};
