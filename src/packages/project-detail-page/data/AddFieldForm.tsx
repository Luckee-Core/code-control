'use client';

import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { createDataEntityFieldThunk } from '@/store/thunks/data-entity-fields';
import { FIELD_TYPES } from './FIELD_TYPES';

type AddFieldFormProps = {
  entityId: string;
  existingCount: number;
};

const styles = {
  form: `
    flex flex-wrap gap-2 items-end
  `,
  input: `
    w-32 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900
    placeholder:text-gray-400
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  select: `
    rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  checkboxLabel: `
    inline-flex items-center gap-1 text-xs text-gray-500
  `,
  checkbox: `
    rounded border-gray-300
  `,
  inputDefault: `
    w-24 rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900
    placeholder:text-gray-400
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  button: `
    inline-flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white
    hover:bg-blue-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
  icon: `
    h-3 w-3
  `,
};

export const AddFieldForm = ({
  entityId,
  existingCount,
}: AddFieldFormProps) => {
  const dispatch = useAppDispatch();
  const entities = useAppSelector((state) => state.dataEntities);
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [nullable, setNullable] = useState(true);
  const [defaultValue, setDefaultValue] = useState('');
  const [referencesEntityId, setReferencesEntityId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const referenceableEntities = useMemo(
    () => entities.filter((e) => e.id !== entityId),
    [entities, entityId]
  );

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    const code = await dispatch(
      createDataEntityFieldThunk({
        entity_id: entityId,
        name: trimmed,
        type,
        nullable,
        default_value: defaultValue.trim() || null,
        sort_order: existingCount,
        references_entity_id: referencesEntityId || null,
      })
    );
    setSaving(false);
    if (code === 200) {
      setName('');
      setDefaultValue('');
      setReferencesEntityId(null);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        void handleAdd();
      }}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Field name"
        className={styles.input}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={styles.select}
      >
        {FIELD_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <select
        value={referencesEntityId ?? ''}
        onChange={(e) =>
          setReferencesEntityId(e.target.value ? e.target.value : null)
        }
        className={styles.select}
      >
        <option value="">No reference</option>
        {referenceableEntities.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={nullable}
          onChange={(e) => setNullable(e.target.checked)}
          className={styles.checkbox}
        />
        Nullable
      </label>
      <input
        type="text"
        value={defaultValue}
        onChange={(e) => setDefaultValue(e.target.value)}
        placeholder="Default"
        className={styles.inputDefault}
      />
      <button
        type="submit"
        disabled={!name.trim() || saving}
        className={styles.button}
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {saving ? 'Adding…' : 'Add field'}
      </button>
    </form>
  );
};
