import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionVocabulary } from '@/model/convention-responses';

const initialState: ConventionVocabulary = {
  column_types: [],
  standard_columns: [],
  lifecycle_options: [],
  table_archetypes: [],
};

export const conventionVocabularySlice = createSlice({
  name: 'conventionVocabulary',
  initialState,
  reducers: {
    setConventionVocabulary: (_state, action: PayloadAction<ConventionVocabulary>) => action.payload,
    reset: () => initialState,
  },
});

export const ConventionVocabularyActions = conventionVocabularySlice.actions;
export const conventionVocabularyReducer = conventionVocabularySlice.reducer;
