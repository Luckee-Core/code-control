# Code Control

Standalone project workspace for TroutHouseTech — define schema, conventions, and drive guided codegen into customer repos.

## Run

```bash
# Terminal 1 — Express API (port 3010)
cd ../code-control-express-server
cp .env.example .env   # add Supabase, Cursor, GitHub keys
npm install && npm run dev

# Terminal 2 — Web app (port 3000)
cp .env.example .env
npm install && npm run dev
```

Open [http://localhost:3000/projects](http://localhost:3000/projects).

## Env

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CODE_CONTROL_API_URL` | Express API (default `http://localhost:3010`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth (scaffold at `/login`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth |

THT panel links here via `NEXT_PUBLIC_CODE_CONTROL_URL`.

## Layout

- `src/packages/project-detail-page` — Details / Data / Build workspace
- `src/store` — Redux (projects, entities, queues, builders)
- `src/api` — Express `/api/data` clients

Architecture ADRs: `.cursor/architecture/`
