'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { detailPageStyles } from '@/components/detail-page-styles';

export const Roles = () => {
  const dispatch = useAppDispatch();
  const roleKeys = useAppSelector((state) => state.currentConvention.roleKeys);
  const repoRoles = useAppSelector((state) => state.conventionOptions.repo_roles);

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Applies to</h2>
          <p className={detailPageStyles.panelSubtitle}>Repo roles that get this convention in their AI context.</p>
        </div>
      </div>
      <div className={styles.body}>
        {repoRoles.map((role) => (
          <label key={role.key} className={styles.option}>
            <input
              type="checkbox"
              checked={roleKeys.includes(role.key)}
              onChange={() => dispatch(CurrentConventionActions.toggleRoleKey(role.key))}
            />
            <span className={styles.name}>{role.name}</span>
            <span className={styles.key}>{role.key}</span>
          </label>
        ))}
      </div>
    </section>
  );
};

const styles = {
  body: `px-4 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2`,
  option: `flex items-center gap-2 text-xs text-gray-900 cursor-pointer`,
  name: `font-medium`,
  key: `font-mono text-[11px] text-gray-500`,
};
