import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConventionRole } from '@/model/convention-role';
import type { ConventionsCatalog } from '@/api/conventions/types';

const initialState: ConventionsCatalog = {
  domains: [],
  topics: [],
  repo_roles: [],
  convention_roles: [],
  column_types: [],
  standard_columns: [],
  lifecycle_options: [],
  table_archetypes: [],
};

export const conventionsCatalogSlice = createSlice({
  name: 'conventionsCatalog',
  initialState,
  reducers: {
    setCatalog: (_state, action: PayloadAction<ConventionsCatalog>) => action.payload,
    /** Replaces the role links for one convention after a save. */
    setConventionRoleLinks: (
      state,
      action: PayloadAction<{ conventionId: string; links: ConventionRole[] }>,
    ) => {
      state.convention_roles = [
        ...state.convention_roles.filter((link) => link.convention_id !== action.payload.conventionId),
        ...action.payload.links,
      ];
    },
    reset: () => initialState,
  },
});

export const ConventionsCatalogActions = conventionsCatalogSlice.actions;
export const conventionsCatalogReducer = conventionsCatalogSlice.reducer;
