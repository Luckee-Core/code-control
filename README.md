# Code Control

Web app for managing **customers**, **projects**, and **GitHub repositories** (create from template or link existing).

Companion API: [code-control-express-server](https://github.com/Luckee-Core/code-control-express-server)

## Before you start

**You need:** a Supabase project, a GitHub PAT, and two template repos in **your** GitHub org.

See the companion [OSS quickstart](https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss-quickstart.md) → [Connect your GitHub org](https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss-quickstart.md#connect-github).

## Run locally

```bash
# Terminal 1 — Express API (port 3010)
cd ../code-control-express-server
cp .env.example .env   # Supabase + GitHub PAT + template repos
npm install && npm run dev

# Terminal 2 — Web app (port 3000)
cp .env.example .env.local
npm install && npm run dev
```

Open [http://localhost:3000/projects](http://localhost:3000/projects). No login is required for local use.

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `CODE_CONTROL_API_URL` | No (defaults to `http://127.0.0.1:3010`) | Express API for Next.js `/api/*` rewrites |
| `NEXT_PUBLIC_CODE_CONTROL_API_URL` | No | Optional browser-visible API base |
| `NEXT_PUBLIC_GITHUB_ALLOWED_ORGS` | No | Comma-separated orgs for Repositories org picker |
| `NEXT_PUBLIC_GITHUB_DEFAULT_ORG` | No | Default org when picker is shown |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Auth scaffold only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Auth scaffold only |

GitHub PAT and template repos are configured on the **Express** server, not in this repo. See [oss-quickstart](https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss-quickstart.md).

## Product flow

1. **Customers** — `/customers`
2. **Projects** — `/projects` (linked to a customer)
3. **Repositories** — open a project → create Express / web repos from GitHub templates or link an existing repo

## Docs

- [OSS quickstart](https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss-quickstart.md) — full setup walkthrough
- [Wire contract](https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss/wire-contract.md) — env vars and API routes
- [SECURITY.md](SECURITY.md) — threat model

Architecture ADRs: `.cursor/architecture/`
