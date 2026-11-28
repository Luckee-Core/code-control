import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Conventions list filter bar. Lives in Redux (not component state) so the table shows the same
 * filters when the user leaves the page and comes back. '' means any.
 */
export type ConventionsFiltersState = {
  searchTerm: string;
  /** Topic name; several domains can share one (e.g. "Navigation"), so it matches all of them. */
  topicName: string;
  roleKey: string;
  severity: string;
  status: string;
};

const initialState: ConventionsFiltersState = {
  searchTerm: '',
  topicName: '',
  roleKey: '',
  severity: '',
  status: '',
};

const conventionsFiltersSlice = createSlice({
  name: 'conventionsFilters',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setTopicName: (state, action: PayloadAction<string>) => {
      state.topicName = action.payload;
    },
    setRoleKey: (state, action: PayloadAction<string>) => {
      state.roleKey = action.payload;
    },
    setSeverity: (state, action: PayloadAction<string>) => {
      state.severity = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    clearFilters: () => initialState,
  },
});

export const ConventionsFiltersActions = conventionsFiltersSlice.actions;
export const conventionsFiltersReducer = conventionsFiltersSlice.reducer;
