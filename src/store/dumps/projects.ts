import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '@/model/project';

const initialState: Project[] = [];

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (_state, action: PayloadAction<Project[]>) => action.payload,
    addProject: (state, action: PayloadAction<Project>) => {
      state.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const i = state.findIndex((p) => p.id === action.payload.id);
      if (i !== -1) state[i] = action.payload;
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      return state.filter((p) => p.id !== action.payload);
    },
    reset: () => initialState,
  },
});

export const ProjectsActions = projectsSlice.actions;
export const projectsReducer = projectsSlice.reducer;
export default projectsSlice.reducer;
