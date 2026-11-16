import type { ColumnType } from './column-type';
import type { Convention } from './convention';
import type { ConventionDomain } from './convention-domain';
import type { ConventionExample } from './convention-example';
import type { ConventionRole } from './convention-role';
import type { ConventionSnapshot } from './convention-snapshot';
import type { ConventionSnapshotUse } from './convention-snapshot-use';
import type { ConventionSource } from './convention-source';
import type { ConventionTopic } from './convention-topic';
import type { LifecycleOption } from './lifecycle-option';
import type { RepoRole } from './repo-role';
import type { StandardColumn } from './standard-column';
import type { TableArchetype } from './table-archetype';

/** GET /api/data/conventions/:id */
export type ConventionDetail = {
  convention: Convention;
  roles: ConventionRole[];
  examples: ConventionExample[];
  sources: ConventionSource[];
};

/** GET /api/data/conventions/options */
export type ConventionOptions = {
  domains: ConventionDomain[];
  topics: ConventionTopic[];
  repo_roles: RepoRole[];
};

/** GET /api/data/conventions/vocabulary */
export type ConventionVocabulary = {
  column_types: ColumnType[];
  standard_columns: StandardColumn[];
  lifecycle_options: LifecycleOption[];
  table_archetypes: TableArchetype[];
};

/** POST /api/data/conventions/ai-context/preview body */
export type AiContextRequest = {
  domain_key: string;
  role_key: string;
};

/** POST /api/data/conventions/ai-context/preview response */
export type AiContext = {
  domain_key: string;
  role_key: string;
  text: string;
  hash: string;
  convention_keys: string[];
  convention_count: number;
  format_version: number;
};

/** POST /api/data/conventions/ai-context/snapshots response */
export type AiContextSnapshotResult = {
  snapshot: ConventionSnapshot;
  use: ConventionSnapshotUse | null;
  reused: boolean;
};
