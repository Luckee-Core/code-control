'use client';

import type { ConventionExampleLanguage } from '@/model/convention-example';
import { useAppDispatch, useAppSelector } from '@/store';
import { ConventionsBuilderActions } from '@/store/builders';
import { inputStyles } from '../../input-styles';

const LANGUAGES: ConventionExampleLanguage[] = ['sql', 'ts', 'tsx', 'json', 'text'];

export const LanguageInput = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.conventionsBuilder.exampleDraft.language);
  return (
    <div className={inputStyles.field}>
      <label className={inputStyles.label}>Language</label>
      <select
        value={language}
        onChange={(event) =>
          dispatch(
            ConventionsBuilderActions.updateExampleDraft({ language: event.target.value as ConventionExampleLanguage }),
          )
        }
        className={inputStyles.select}
      >
        {LANGUAGES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};
