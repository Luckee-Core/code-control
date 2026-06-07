'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { createDataEntityThunk } from '@/store/thunks/data-entities';

type AddEntityFormProps = {
  projectId: string;
};

const styles = {
  form: `
    flex gap-2 mb-6
  `,
  input: `
    flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500
  `,
  button: `
    inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
    hover:bg-blue-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors
  `,
  icon: `
    h-4 w-4
  `,
};

export const AddEntityForm = ({ projectId }: AddEntityFormProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    const code = await dispatch(
      createDataEntityThunk({
        project_id: projectId,
        name: trimmed,
        table_name: trimmed.toLowerCase().replace(/\s+/g, '_'),
      })
    );
    setSaving(false);
    if (code === 200) setName('');
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
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="Entity name (e.g. Product, Order)"
        className={styles.input}
      />
      <button
        type="submit"
        disabled={!name.trim() || saving}
        className={styles.button}
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {saving ? 'Adding…' : 'Add entity'}
      </button>
    </form>
  );
};
