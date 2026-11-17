'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../../../examples/form/input-styles';

export const ExcerptInput = () => {
  const dispatch = useAppDispatch();
  const excerpt = useAppSelector((state) => state.conventionsBuilder.sourceDraft.excerpt);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Excerpt</label>
      <textarea
        value={excerpt}
        onChange={(event) => dispatch(ConventionsBuilderActions.updateSourceDraft({ excerpt: event.target.value }))}
        placeholder="The sentence in the ADR that states the rule"
        className={inputStyles.textarea}
      />
    </div>
  );
};
