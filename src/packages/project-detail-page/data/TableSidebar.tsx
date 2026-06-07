'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { createDataEntityThunk } from '@/store/thunks/data-entities';
import type { DataEntityWithFields } from '@/model/data-entity';

type TableSidebarProps = {
  selectedEntityId: string | null;
  onSelectEntity: (id: string) => void;
};

const styles = {
  aside: `
    w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col h-full
  `,
  header: `
    p-3 border-b border-gray-200
  `,
  headerRow: `
    flex items-center justify-between mb-2
  `,
  title: `
    text-xs font-semibold text-gray-500 uppercase tracking-wider
  `,
  plusButton: `
    p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  searchWrap: `
    relative
  `,
  searchIcon: `
    absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400
  `,
  searchInput: `
    w-full pl-7 pr-2 py-1.5 rounded-md border border-gray-300 bg-white text-xs text-gray-900
    placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  newForm: `
    p-3 border-b border-gray-200 bg-gray-50/50 space-y-2
  `,
  newInput: `
    w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900
    placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  newButtons: `
    flex gap-1.5
  `,
  newButtonPrimary: `
    flex-1 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
    border-none cursor-pointer
  `,
  newButtonSecondary: `
    rounded px-2 py-1 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100
    transition-colors border-none cursor-pointer
  `,
  nav: `
    flex-1 overflow-y-auto py-1
  `,
  emptyNav: `
    text-xs text-gray-500 px-3 py-4 text-center
  `,
  entityButton: `
    w-full flex items-center gap-2 px-3 py-2 text-left transition-colors
    border-none bg-transparent cursor-pointer
  `,
  entityButtonActive: `
    bg-blue-50 text-blue-700
  `,
  entityButtonInactive: `
    text-gray-900 hover:bg-gray-50
  `,
  tableIcon: `
    h-3.5 w-3.5 shrink-0
  `,
  entityName: `
    flex-1 min-w-0 text-xs font-medium truncate block
  `,
  fieldCount: `
    text-[10px] text-gray-500 tabular-nums
  `,
  footer: `
    px-3 py-2 border-t border-gray-200
  `,
  footerText: `
    text-[10px] text-gray-500
  `,
};

export const TableSidebar = ({
  selectedEntityId,
  onSelectEntity,
}: TableSidebarProps) => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.currentProject);
  const entities = useAppSelector((state) =>
    state.dataEntities.filter((e) => e.project_id === currentProject?.id)
  ) as DataEntityWithFields[];

  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = entities.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.table_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!currentProject) return;
    
    const trimmed = newName.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    const code = await dispatch(
      createDataEntityThunk({
        project_id: currentProject.id,
        name: trimmed,
        table_name: trimmed.toLowerCase().replace(/\s+/g, '_'),
      })
    );
    setSaving(false);
    if (code === 200) {
      setNewName('');
      setNewDesc('');
      setShowNewForm(false);
    }
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>Tables</h3>
          <button
            type="button"
            onClick={() => setShowNewForm(!showNewForm)}
            className={styles.plusButton}
            title="New table"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tables..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {showNewForm && (
        <div className={styles.newForm}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleAdd()}
            placeholder="Table name"
            autoFocus
            className={styles.newInput}
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className={styles.newInput}
          />
          <div className={styles.newButtons}>
            <button
              type="button"
              onClick={() => void handleAdd()}
              disabled={!newName.trim() || saving}
              className={styles.newButtonPrimary}
            >
              {saving ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setNewName('');
                setNewDesc('');
              }}
              className={styles.newButtonSecondary}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <nav className={styles.nav}>
        {filtered.length === 0 ? (
          <p className={styles.emptyNav}>
            {search ? 'No tables match your search' : 'No tables yet'}
          </p>
        ) : (
          filtered.map((entity) => {
            const fieldCount = (entity.fields ?? []).length;
            const isActive = selectedEntityId === entity.id;
            return (
              <button
                key={entity.id}
                type="button"
                onClick={() => onSelectEntity(entity.id)}
                className={`${styles.entityButton} ${
                  isActive ? styles.entityButtonActive : styles.entityButtonInactive
                }`}
              >
                <svg
                  className={`${styles.tableIcon} ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <div className={styles.entityName}>{entity.table_name ?? entity.name}</div>
                <span className={styles.fieldCount}>{fieldCount}</span>
              </button>
            );
          })
        )}
      </nav>

      <div className={styles.footer}>
        <span className={styles.footerText}>
          {entities.length} table{entities.length !== 1 ? 's' : ''}
          {search ? ` · ${filtered.length} shown` : ''}
        </span>
      </div>
    </aside>
  );
};
