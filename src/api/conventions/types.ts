import type { ColumnType } from '@/model/column-type';
import type {
  Convention,
  ConventionCheckKind,
  ConventionSeverity,
  ConventionStatus,
} from '@/model/convention';
import type { ConventionDomain } from '@/model/convention-domain';
import type {
  ConventionExample,
  ConventionExampleKind,
  ConventionExampleLanguage,
} from '@/model/convention-example';
import type { ConventionRole } from '@/model/convention-role';
import type { ConventionSource } from '@/model/convention-source';
import type { ConventionTopic } from '@/model/convention-topic';
import type { LifecycleOption } from '@/model/lifecycle-option';
import type { RepoRole } from '@/model/repo-role';
import type { StandardColumn } from '@/model/standard-column';
import type { TableArchetype } from '@/model/table-archetype';

export type ConventionDetail = {
  convention: Convention;
  role_keys: string[];
  examples: ConventionExample[];
  sources: ConventionSource[];
};

export type ConventionsCatalog = {
  domains: ConventionDomain[];
  topics: ConventionTopic[];
  repo_roles: RepoRole[];
  convention_roles: ConventionRole[];
  column_types: ColumnType[];
  standard_columns: StandardColumn[];
  lifecycle_options: LifecycleOption[];
  table_archetypes: TableArchetype[];
};

export type ConventionsContext = {
  domain_key: string;
  role_key: string | null;
  text: string;
  hash: string;
  convention_count: number;
};

export type SaveConventionPayload = {
  key?: string;
  domain_key?: string;
  topic_key: string;
  title: string;
  statement: string;
  rationale: string;
  severity: ConventionSeverity;
  status: ConventionStatus;
  check_kind: ConventionCheckKind;
  check_config: Record<string, unknown> | null;
  sort_order: number;
  role_keys: string[];
};

export type CreateConventionExamplePayload = {
  title: string;
  kind: ConventionExampleKind;
  language: ConventionExampleLanguage;
  path_hint: string | null;
  code: string;
  note: string;
};

export type CreateConventionSourcePayload = {
  repo: string;
  adr_path: string;
  excerpt: string;
};
