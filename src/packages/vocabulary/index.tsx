'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { getConventionVocabularyThunk } from '@/store/thunks/conventions';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { ColumnType } from '@/model/column-type';
import type { LifecycleOption } from '@/model/lifecycle-option';
import type { StandardColumn } from '@/model/standard-column';
import type { TableArchetype } from '@/model/table-archetype';
import { VocabTable } from './vocab-table';

export const Vocabulary = () => {
  const dispatch = useAppDispatch();
  const vocabulary = useAppSelector((state) => state.conventionVocabulary);

  useBreadcrumbs([{ label: 'Vocabulary' }]);

  useEffect(() => {
    void dispatch(getConventionVocabularyThunk());
  }, [dispatch]);

  return (
    <div className={detailPageStyles.page}>
      <VocabTable<ColumnType>
        title="Column types"
        subtitle="Allowed column types and when to use each."
        rows={vocabulary.column_types}
        rowKey={(row) => row.key}
        columns={[
          { label: 'Key', render: (row) => row.key, mono: true },
          { label: 'SQL', render: (row) => row.sql_type, mono: true },
          { label: 'TS', render: (row) => row.ts_type, mono: true },
          { label: 'Use when', render: (row) => row.when_to_use },
          { label: 'Avoid when', render: (row) => row.avoid_when },
          { label: 'Active', render: (row) => (row.is_active ? 'Yes' : 'No') },
        ]}
      />
      <VocabTable<StandardColumn>
        title="Standard columns"
        subtitle="Columns every table gets."
        rows={vocabulary.standard_columns}
        rowKey={(row) => row.name}
        columns={[
          { label: 'Name', render: (row) => row.name, mono: true },
          { label: 'SQL', render: (row) => row.sql_definition, mono: true },
          { label: 'TS', render: (row) => row.ts_type, mono: true },
          { label: 'Set by', render: (row) => row.set_by },
          { label: 'Description', render: (row) => row.description },
        ]}
      />
      <VocabTable<LifecycleOption>
        title="Lifecycle options"
        subtitle="How a table handles delete and archive."
        rows={vocabulary.lifecycle_options}
        rowKey={(row) => row.key}
        columns={[
          { label: 'Key', render: (row) => row.key, mono: true },
          { label: 'Name', render: (row) => row.name },
          { label: 'Columns', render: (row) => row.columns_sql, mono: true },
          { label: 'Read filter', render: (row) => row.read_filter, mono: true },
          { label: 'Use when', render: (row) => row.when_to_use },
        ]}
      />
      <VocabTable<TableArchetype>
        title="Table archetypes"
        subtitle="Recurring table shapes."
        rows={vocabulary.table_archetypes}
        rowKey={(row) => row.key}
        columns={[
          { label: 'Key', render: (row) => row.key, mono: true },
          { label: 'Name', render: (row) => row.name },
          { label: 'Naming', render: (row) => row.naming_pattern, mono: true },
          { label: 'Description', render: (row) => row.description },
          { label: 'Examples', render: (row) => row.example_tables.join(', ') },
        ]}
      />
    </div>
  );
};
