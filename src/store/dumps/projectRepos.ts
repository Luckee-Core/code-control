import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProjectRepo } from '@/model/project-repo';

type ProjectReposState = Record<string, ProjectRepo>;

const initialState: ProjectReposState = {};

export const projectReposSlice = createSlice({
  name: 'projectRepos',
  initialState,
  reducers: {
    setProjectRepos: (_state, action: PayloadAction<ProjectRepo[]>) => {
      const next: ProjectReposState = {};
      action.payload.forEach((repo) => {
        next[repo.id] = repo;
      });
      return next;
    },
    replaceReposByProjectId: (
      state,
      action: PayloadAction<{ projectId: string; repos: ProjectRepo[] }>
    ) => {
      Object.keys(state).forEach((id) => {
        if (state[id].project_id === action.payload.projectId) {
          delete state[id];
        }
      });
      action.payload.repos.forEach((repo) => {
        state[repo.id] = repo;
      });
    },
    addProjectRepo: (state, action: PayloadAction<ProjectRepo>) => {
      state[action.payload.id] = action.payload;
    },
    updateProjectRepo: (state, action: PayloadAction<ProjectRepo>) => {
      state[action.payload.id] = action.payload;
    },
    removeProjectRepo: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearProjectRepos: () => initialState,
  },
});

export const ProjectReposActions = projectReposSlice.actions;
export const projectReposReducer = projectReposSlice.reducer;
