import type { ConventionSeverity, ConventionStatus } from '@/model/convention';
import type { ConventionExampleKind, ConventionExampleLanguage } from '@/model/convention-example';

/** Allowed values from the conventions schema (097 CHECK constraints). */
export const CONVENTION_SEVERITIES: ConventionSeverity[] = ['must', 'should', 'avoid', 'never'];
export const CONVENTION_STATUSES: ConventionStatus[] = ['draft', 'active', 'deprecated'];
export const EXAMPLE_KINDS: ConventionExampleKind[] = ['correct', 'incorrect'];
export const EXAMPLE_LANGUAGES: ConventionExampleLanguage[] = ['sql', 'ts', 'tsx', 'json', 'text'];
