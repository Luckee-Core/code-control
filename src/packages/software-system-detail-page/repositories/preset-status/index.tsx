'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import type { SetupPresetRepoResult } from '@/model/setup-preset';
import { useAppDispatch, useAppSelector } from '@/store';
import { applySetupPresetThunk } from '@/store/thunks/software-system-repos';
import { loadSetupPresetsThunk } from '@/store/thunks/software-systems';
import { repoRoleLabel } from '../../../software-systems/repo-role-labels';

const EMPTY: SetupPresetRepoResult[] = [];

const STATUS_TEXT: Record<SetupPresetRepoResult['status'], string> = {
  created: 'Created',
  already_done: 'Already there',
  template_missing: 'No template',
  failed: 'Failed',
};

/**
 * Project type banner: progress while its repos are created, per-role results, and a button
 * that creates any repo the type lists but the project is still missing.
 */
export const PresetStatus = () => {
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.currentSoftwareSystem);
  const presetsByKey = useAppSelector((state) => state.setupPresets);
  const repos = useAppSelector((state) => state.softwareSystemRepos);
  const results = useAppSelector((state) => state.setupPresetResults[project.id] ?? EMPTY);
  const presetStatus = useAppSelector((state) => state.repositoriesBuilder.presetStatus);
  const presetError = useAppSelector((state) => state.repositoriesBuilder.presetError);

  useEffect(() => {
    if (Object.keys(presetsByKey).length === 0) void dispatch(loadSetupPresetsThunk());
  }, [dispatch, presetsByKey]);

  const preset = project.setup_preset_key ? presetsByKey[project.setup_preset_key] : undefined;
  const missingRoles = useMemo(() => {
    if (!preset) return [];
    const roles = new Set(
      Object.values(repos)
        .filter((repo) => repo.software_system_id === project.id && repo.role)
        .map((repo) => repo.role as string),
    );
    return preset.role_keys.filter((role) => !roles.has(role));
  }, [preset, repos, project.id]);

  if (!preset || preset.role_keys.length === 0) return null;
  if (presetStatus !== 'applying' && results.length === 0 && missingRoles.length === 0) return null;

  const problems = results.filter((result) => result.status === 'template_missing' || result.status === 'failed');

  return (
    <div className={presetStatus === 'error' || problems.length > 0 ? styles.boxWarn : styles.box} role="status">
      <div className={styles.top}>
        <p className={styles.title}>
          {presetStatus === 'applying'
            ? `Creating the ${preset.name} repos… (about 5 seconds each)`
            : missingRoles.length > 0
              ? `${preset.name} type: ${missingRoles.length} of ${preset.role_keys.length} repos still missing (${missingRoles.map(repoRoleLabel).join(', ')})`
              : `${preset.name} type: all ${preset.role_keys.length} repos are set up`}
        </p>
        {presetStatus !== 'applying' && missingRoles.length > 0 ? (
          <button type="button" onClick={() => void dispatch(applySetupPresetThunk())} className={detailPageStyles.secondaryButton}>
            Create missing repos
          </button>
        ) : null}
      </div>
      {presetError ? <p className={styles.error}>{presetError}</p> : null}
      {results.length > 0 && presetStatus !== 'applying' ? (
        <ul className={styles.list}>
          {results.map((result) => (
            <li key={result.role} className={styles.item}>
              <span className={styles.role}>{repoRoleLabel(result.role)}</span>
              <span className={result.status === 'created' || result.status === 'already_done' ? styles.ok : styles.bad}>
                {STATUS_TEXT[result.status]}
              </span>
              {result.repo_url ? (
                <a href={result.repo_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {result.repo_name ?? result.repo_url.replace('https://github.com/', '')}
                </a>
              ) : null}
              {result.error ? <span className={styles.message}>{result.error}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const styles = {
  box: `mb-4 text-xs bg-blue-50 border border-blue-200 rounded px-4 py-3 flex flex-col gap-2`,
  boxWarn: `mb-4 text-xs bg-amber-50 border border-amber-200 rounded px-4 py-3 flex flex-col gap-2`,
  top: `flex flex-wrap items-center justify-between gap-2`,
  title: `font-semibold text-gray-900`,
  error: `text-red-700`,
  list: `flex flex-col gap-1`,
  item: `flex flex-wrap items-baseline gap-x-2 gap-y-0.5`,
  role: `font-medium text-gray-900 w-32`,
  ok: `text-green-700 font-medium w-24`,
  bad: `text-red-700 font-medium w-24`,
  link: `font-mono text-blue-600 hover:underline`,
  message: `text-gray-600`,
};
