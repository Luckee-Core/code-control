import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProjectRepo } from '@/api/project-setup';

type InitialState = ProjectRepo[];

const initialState: InitialState = [];

export const projectReposSlice = createSlice({
  name: 'projectRepos',
  initialState,
  reducers: {
    setProjectRepos: (state, action: PayloadAction<ProjectRepo[]>) => action.payload,
    addProjectRepo: (state, action: PayloadAction<ProjectRepo>) => {
      state.push(action.payload);
    },
    updateProjectRepo: (state, action: PayloadAction<ProjectRepo>) => {
      const index = state.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeProjectRepo: (state, action: PayloadAction<string>) => {
      return state.filter((r) => r.id !== action.payload);
    },
    clearProjectRepos: () => [],
  },
});

export const ProjectReposActions = projectReposSlice.actions;
export const projectReposReducer = projectReposSlice.reducer;
