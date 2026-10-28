# 038 – UI token appendix

## Status

Accepted

## Context

Product ADRs **031**, **033**, and **035** reference shared style tokens. This ADR indexes them for agents and cross-repo alignment.

## Decision

| Token | Path | ADR |
|-------|------|-----|
| `detailPageStyles` | `src/components/detail-page-styles.ts` | 033 |
| `listFilterBarStyles` | `src/components/list-filter-bar-styles.ts` | 035 |
List tables typically duplicate table wrapper classes locally (`border-gray-300`, `bg-gray-100` headers); prefer `overflow-visible` on panels with row action menus (033, 017).

## Consequences

- code-commit-summaries-web copies `detailPageStyles` and `listFilterBarStyles` verbatim for template parity.
