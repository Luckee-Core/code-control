'use client';

import { formFieldStyles } from '@/components/form-field-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionBuilderActions } from '@/store/builders';

export const TextInputs = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.conventionBuilder.createForm);

  return (
    <>
      <label className={formFieldStyles.field}>
        <span className={formFieldStyles.label}>Title</span>
        <input
          value={form.title}
          onChange={(event) => dispatch(ConventionBuilderActions.updateCreateForm({ title: event.target.value }))}
          className={formFieldStyles.input}
        />
      </label>
      <label className={formFieldStyles.field}>
        <span className={formFieldStyles.label}>Statement</span>
        <textarea
          value={form.statement}
          onChange={(event) => dispatch(ConventionBuilderActions.updateCreateForm({ statement: event.target.value }))}
          className={formFieldStyles.textarea}
        />
      </label>
      <label className={formFieldStyles.field}>
        <span className={formFieldStyles.label}>Rationale</span>
        <textarea
          value={form.rationale}
          onChange={(event) => dispatch(ConventionBuilderActions.updateCreateForm({ rationale: event.target.value }))}
          className={formFieldStyles.textarea}
        />
      </label>
    </>
  );
};
