'use client';

import { formFieldStyles } from '@/components/form-field-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionBuilderActions } from '@/store/builders';
import type { ConventionSeverity, ConventionStatus } from '@/model/convention';
import { CONVENTION_SEVERITIES, CONVENTION_STATUSES } from '../../../convention-enums';

export const FlagInputs = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.conventionBuilder.createForm);

  return (
    <div className={formFieldStyles.row}>
      <label className={formFieldStyles.field}>
        <span className={formFieldStyles.label}>Severity</span>
        <select
          value={form.severity}
          onChange={(event) =>
            dispatch(ConventionBuilderActions.updateCreateForm({ severity: event.target.value as ConventionSeverity }))
          }
          className={formFieldStyles.select}
        >
          {CONVENTION_SEVERITIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className={formFieldStyles.field}>
        <span className={formFieldStyles.label}>Status</span>
        <select
          value={form.status}
          onChange={(event) =>
            dispatch(ConventionBuilderActions.updateCreateForm({ status: event.target.value as ConventionStatus }))
          }
          className={formFieldStyles.select}
        >
          {CONVENTION_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
