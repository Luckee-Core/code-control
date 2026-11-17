'use client';

import type { ConventionSeverity } from '@/model/convention';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentConventionActions } from '@/store/current';
import { fieldStyles } from '../../field-styles';

const OPTIONS: { value: ConventionSeverity; label: string }[] = [
  { value: 'must', label: 'MUST — hard rule' },
  { value: 'never', label: 'NEVER — hard prohibition' },
  { value: 'should', label: 'SHOULD — strong default' },
  { value: 'avoid', label: 'AVOID — discouraged' },
];

export const SeverityInput = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.currentConvention);

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label}>Severity</label>
      <select
        value={current.severity}
        onChange={(event) =>
          dispatch(CurrentConventionActions.updateFields({ severity: event.target.value as ConventionSeverity }))
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
