# Contributing to Code Control (Web)

Thank you for contributing to the Code Control open-source pair.

## Repositories

| Repo | Role |
|------|------|
| [code-control](https://github.com/Luckee-Core/code-control) | Next.js web app — customers, projects, repositories |
| [code-control-express-server](https://github.com/Luckee-Core/code-control-express-server) | Express API backed by Supabase |

Changes that touch API contracts should be coordinated across both repos. See the [wire contract](https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss/wire-contract.md) in the Express repo.

## Before you code

1. Read [.cursor/architecture/README.md](./.cursor/architecture/README.md).
2. Read [.cursor/rules/AGENTS.md](./.cursor/rules/AGENTS.md).
3. Follow existing patterns in `src/packages/`, `src/store/`, and `src/api/`.

## Development setup

1. Run the Express API with Supabase migrations applied (see companion repo [OSS quickstart](https://github.com/Luckee-Core/code-control-express-server/blob/main/docs/oss-quickstart.md)).
2. Copy `.env.example` to `.env.local`.
3. `npm install` then `npm run dev`.

## Pull requests

- Keep PRs focused; one feature or fix per PR when possible.
- Run `npm run build` and `npm run lint` before opening a PR.
- Update README or docs when behavior, env vars, or setup steps change.
- Do not commit secrets, `.env` files, or real Supabase or GitHub tokens.

## Questions

Open a GitHub issue for bugs or feature discussion.
