# 014 – Software systems naming

Code Control **software systems** are studio workspaces (linked GitHub repos, setup flows) stored in Postgres tables `software_systems` and `software_system_repos`. They are keyed by **My Ops CRM customer UUID** (`customer_id`) with no FK to the Ops database.

This is intentionally **not** the same as **Ops CRM projects** (customer engagements in my-ops-tracker), which Code Control does not surface in v1.

API routes:

- `/api/data/software-systems`
- `/api/data/software-system-repos`
- `/api/data/software-systems/:id/software-system-setup/*`

Customers are read via `/api/crm/*` (hybrid CRM ADR 010).
