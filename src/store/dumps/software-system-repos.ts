import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SoftwareSystemRepo } from '@/model/software-system-repo';

type SoftwareSystemReposState = Record<string, SoftwareSystemRepo>;

const initialState: SoftwareSystemReposState = {};

export const softwareSystemReposSlice = createSlice({
  name: 'softwareSystemRepos',
  initialState,
  reducers: {
    setSoftwareSystemRepos: (_state, action: PayloadAction<SoftwareSystemRepo[]>) => {
      const next: SoftwareSystemReposState = {};
      action.payload.forEach((repo) => {
        next[repo.id] = repo;
      });
      return next;
    },
    replaceReposBySoftwareSystemId: (
      state,
      action: PayloadAction<{ softwareSystemId: string; repos: SoftwareSystemRepo[] }>,
    ) => {
      Object.keys(state).forEach((id) => {
        if (state[id].software_system_id === action.payload.softwareSystemId) {
          delete state[id];
        }
      });
      action.payload.repos.forEach((repo) => {
        state[repo.id] = repo;
      });
    },
    addSoftwareSystemRepo: (state, action: PayloadAction<SoftwareSystemRepo>) => {
      state[action.payload.id] = action.payload;
    },
    updateSoftwareSystemRepo: (state, action: PayloadAction<SoftwareSystemRepo>) => {
      state[action.payload.id] = action.payload;
    },
    removeSoftwareSystemRepo: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearSoftwareSystemRepos: () => initialState,
  },
});

export const SoftwareSystemReposActions = softwareSystemReposSlice.actions;
export const softwareSystemReposReducer = softwareSystemReposSlice.reducer;
