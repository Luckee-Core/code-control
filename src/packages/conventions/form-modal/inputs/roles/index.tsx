'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

export const RolesInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);
  const roles = useAppSelector((state) => state.conventionsCatalog.repo_roles);

  return (
    <div className={fieldStyles.field}>
      <span className={fieldStyles.label}>Applies to repo roles</span>
      <div className={styles.grid}>
        {roles.map((role) => (
          <label key={role.key} className={styles.option}>
            <input
              type="checkbox"
              checked={current.role_keys.includes(role.key)}
              onChange={() => dispatch(CurrentConventionActions.toggleRole(role.key))}
              className={styles.checkbox}
            />
            {role.name}
          </label>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: `grid grid-cols-2 gap-1.5`,
  option: `flex items-center gap-2 text-xs text-gray-800 cursor-pointer`,
  checkbox: `cursor-pointer`,
};
