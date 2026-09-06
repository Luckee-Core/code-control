# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| Latest on `main` | Best-effort |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities. Use GitHub Security Advisories on this repository or contact the maintainers privately.

## Scope

Code Control is a **self-hosted project workspace web app** that proxies API calls to the companion Express server.

### In scope

- Exposure of `SUPABASE_SERVICE_ROLE_KEY` or `GITHUB_PERSONAL_ACCESS_TOKEN` in client bundles or logs
- Accidental inclusion of server secrets in `NEXT_PUBLIC_*` environment variables
- XSS or CSRF issues in the web UI when deployed beyond localhost

### Known limitations (by design)

- **No login required** for local use — the app opens `/projects` without authentication.
- **No API authentication** on the companion Express `/api/data` routes. Intended for local or trusted-network use only.
- Supabase vars in `.env.local` are an optional auth scaffold at `/login` only.

## Threat model

| Trust boundary | Default |
|----------------|---------|
| Operator machine | Trusted — localhost dev |
| Browser | Calls Express via Next.js `/api/*` proxy; no service-role key in the web bundle |
| Express API | Holds Supabase service key and GitHub PAT (server only) |
| Internet | **Not supported** without auth, HTTPS, and CORS hardening on Express |

## Environment secrets

| Variable | Never in `NEXT_PUBLIC_*` |
|----------|--------------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (Express only) |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Yes (Express only) |
| `GITHUB_TEMPLATE_*` | Yes (Express only) |

The web app may use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the optional auth scaffold — these are designed to be public.

## Best practices for operators

1. Run Express bound to `127.0.0.1` or behind a firewall when developing locally.
2. Never commit `.env.local` or paste tokens into issues.
3. Use a dedicated Supabase project for Code Control data.
4. Configure GitHub PAT and templates on the Express server, not in the web `.env.local`.

See the companion [Express SECURITY.md](https://github.com/Luckee-Core/code-control-express-server/blob/main/SECURITY.md) for API-side details.
