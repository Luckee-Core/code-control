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
          <h1 className={styles.title}>Studio setup — storage, API, and web</h1>
          <p className={styles.subtitle}>
            Code Control stores customers, projects, and repos in Postgres behind{' '}
            <code className={styles.inlineCode}>code-generator-storage-server</code>. The Express API
            calls storage over HTTP; this web app calls Express. Hub <strong>Run</strong> starts
            express and web only — start storage separately when you need data.
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
          Storage <strong>3080</strong>, Express <strong>3012</strong>, web <strong>3013</strong>.
          Standalone dev may use other ports — match{' '}
          <code className={styles.inlineCode}>PORT</code>,{' '}
          <code className={styles.inlineCode}>CODE_CONTROL_STORAGE_URL</code>, and{' '}
          <code className={styles.inlineCode}>CODE_CONTROL_API_URL</code>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Postgres on the storage host</h2>
        <p className={styles.body}>
          Install and start PostgreSQL (14+). Create an empty database once per machine:
        </p>
        <CopyBlock label="Create database" command="createdb code_control" />
        <CopyBlock label="Smoke test" command='psql -d code_control -c "SELECT 1"' />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Storage env</h2>
        <p className={styles.body}>
          In <code className={styles.inlineCode}>code-generator-storage-server/.env</code> (copy from{' '}
          <code className={styles.inlineCode}>.env.example</code>):
        </p>
        <CopyBlock
          label="Required"
          command={`PORT=3080\nSTORAGE_BIND_HOST=0.0.0.0\nDATABASE_URL=postgresql://127.0.0.1:5432/code_control\nSTORAGE_DISPATCHER_SECRET=<openssl rand -base64 32>`}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Schema (every new machine)</h2>
        <CopyBlock
          label="Install + migrations"
          command={`cd code-generator-storage-server\nnpm install\nnpm run db:apply-migrations`}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Optional — import from Supabase (one time)</h2>
        <p className={styles.body}>
          Add <code className={styles.inlineCode}>SUPABASE_URL</code> and{' '}
          <code className={styles.inlineCode}>SUPABASE_SERVICE_ROLE_KEY</code> to the{' '}
          <strong>storage</strong> <code className={styles.inlineCode}>.env</code>, then:
        </p>
        <CopyBlock
          label="Import CRM rows"
          command="cd code-generator-storage-server && npm run db:import-from-supabase"
        />
        <p className={styles.note}>
          Remove the two Supabase variables after a successful import. Re-running import is safe
          (upserts by id).
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Express API env</h2>
        <p className={styles.body}>
          In <code className={styles.inlineCode}>code-control-express-server/.env</code>:
        </p>
        <CopyBlock
          label="Storage + port"
          command={`CODE_CONTROL_STORAGE_URL=http://127.0.0.1:3080\nCODE_CONTROL_STORAGE_SECRET=<same as STORAGE_DISPATCHER_SECRET>\nPORT=3012`}
        />
        <p className={styles.body}>
          Add GitHub PAT and template vars if you use repo creation — see the express-server OSS
          quickstart. Express has no <code className={styles.inlineCode}>DATABASE_URL</code>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Start services</h2>
        <CopyBlock
          label="Storage (terminal 1)"
          command={`cd code-generator-storage-server\nnpm run dev`}
        />
        <CopyBlock
          label="Express (terminal 2)"
          command={`cd code-control-express-server\nnpm run dev`}
        />
        <CopyBlock
          label="Web (terminal 3)"
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
          Troubleshooting, Hub notes, and security:{' '}
          <code className={styles.inlineCode}>code-control-express-server/DEPLOYMENT.md</code> and{' '}
          <code className={styles.inlineCode}>
            code-control-express-server/docs/studio-local-postgres-setup.md
          </code>
          .
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
