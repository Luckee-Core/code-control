import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '@/model/project';

type ProjectsState = Record<string, Project>;

const initialState: ProjectsState = {};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (_state, action: PayloadAction<Project[]>) => {
      const next: ProjectsState = {};
      action.payload.forEach((project) => {
        next[project.id] = project;
      });
      return next;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state[action.payload.id] = action.payload;
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      state[action.payload.id] = action.payload;
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const ProjectsActions = projectsSlice.actions;
export const projectsReducer = projectsSlice.reducer;
