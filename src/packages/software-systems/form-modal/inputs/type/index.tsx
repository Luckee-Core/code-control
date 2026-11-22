'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentSoftwareSystemActions } from '@/store/current';
import { loadSetupPresetsThunk } from '@/store/thunks/software-systems';
import { repoRoleLabel } from '../../../repo-role-labels';

/** Project type (setup preset): which repos are created right after the project. */
export const TypeInput = () => {
  const dispatch = useAppDispatch();
  const presetsByKey = useAppSelector((state) => state.setupPresets);
  const selectedKey = useAppSelector((state) => state.currentSoftwareSystem.setup_preset_key ?? 'none');
  const isEditing = useAppSelector((state) => Boolean(state.workspaceBuilder.editingSoftwareSystemId));

  useEffect(() => {
    void dispatch(loadSetupPresetsThunk());
  }, [dispatch]);

  const presets = useMemo(() => Object.values(presetsByKey).sort((a, b) => a.sort_order - b.sort_order), [presetsByKey]);
  const selected = presetsByKey[selectedKey];

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="software-system-type">
        Type *
      </label>
      <select
        id="software-system-type"
        value={selectedKey}
        onChange={(event) =>
          dispatch(CurrentSoftwareSystemActions.updateSoftwareSystemFields({ setup_preset_key: event.target.value }))
        }
        className={styles.select}
      >
        {presets.length === 0 ? <option value="none">None</option> : null}
        {presets.map((preset) => (
          <option key={preset.key} value={preset.key}>
            {preset.name}
          </option>
        ))}
      </select>
      {selected ? (
        <p className={styles.help}>
          {selected.description}
          {selected.role_keys.length > 0 ? (
            <>
              {' '}
              {isEditing ? 'Lists' : 'Creates'} {selected.role_keys.length} GitHub repos: {selected.role_keys.map(repoRoleLabel).join(', ')}.
              {isEditing ? ' Saving does not create repos; use Create missing repos on the Repositories tab.' : null}
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
};

const styles = {
  field: `
    mb-4
  `,
  label: `
    block text-sm font-medium text-gray-700 mb-1
  `,
  select: `
    w-full px-3 py-2 border border-gray-300 rounded text-gray-900 bg-white cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  help: `
    mt-1 text-xs text-gray-500 leading-relaxed
  `,
};
