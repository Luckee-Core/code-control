'use client';

import type { ConventionStatus } from '@/model/convention';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

const OPTIONS: { value: ConventionStatus; label: string }[] = [
  { value: 'draft', label: 'Draft — not sent to AI' },
  { value: 'active', label: 'Active — used by AI' },
  { value: 'deprecated', label: 'Deprecated' },
];

export const StatusInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Status</label>
      <select
        value={current.status}
        onChange={(event) =>
          dispatch(CurrentConventionActions.updateFields({ status: event.target.value as ConventionStatus }))
        }
        className={fieldStyles.select}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
