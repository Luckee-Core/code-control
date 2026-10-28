export const STUDIO_SETUP_STORAGE_KEY = 'code-control-studio-setup-step-v1';

export type StudioSetupChecklistStep = {
  title: string;
  body: string;
};

export const STUDIO_SETUP_CHECKLIST_STEPS: StudioSetupChecklistStep[] = [
  {
    title: 'Postgres on the storage host',
    body: 'Install PostgreSQL 14+, then create an empty database: createdb code_control',
  },
  {
    title: 'Storage env',
    body: 'Copy code-generator-storage-server/.env.example — set PORT, DATABASE_URL, and STORAGE_DISPATCHER_SECRET.',
  },
  {
    title: 'Apply schema',
    body: 'In code-generator-storage-server: npm install && npm run db:apply-migrations',
  },
  {
    title: 'Express env',
    body: 'In code-control-express-server/.env set CODE_CONTROL_STORAGE_URL, CODE_CONTROL_STORAGE_SECRET, and PORT.',
  },
  {
    title: 'Start services',
    body: 'Run storage, then Express, then this web app (CODE_CONTROL_API_URL in .env.local).',
  },
  {
    title: 'Health check',
    body: 'Confirm GET /api/health reports canonical data and Postgres as connected.',
  },
];

export const STUDIO_STORAGE_ENV_EXAMPLE = `PORT=3080
STORAGE_BIND_HOST=0.0.0.0
DATABASE_URL=postgresql://127.0.0.1:5432/code_control
STORAGE_DISPATCHER_SECRET=<openssl rand -base64 32>`;

export const STUDIO_EXPRESS_ENV_EXAMPLE = `CODE_CONTROL_STORAGE_URL=http://127.0.0.1:3080
CODE_CONTROL_STORAGE_SECRET=<same as STORAGE_DISPATCHER_SECRET>
PORT=3012`;

export const STUDIO_WEB_ENV_EXAMPLE = `CODE_CONTROL_API_URL=http://127.0.0.1:3012`;

export const STUDIO_GATE_TITLE = 'Set up storage, API, and web';
export const STUDIO_GATE_SUB =
  'Code Control stores customers, projects, and repos in Postgres behind storage Express. This app calls the Code Control API at';

export const STUDIO_READY_LEAD =
  'Your local stack is connected. Open customers and projects from the sidebar or the shortcuts below.';
