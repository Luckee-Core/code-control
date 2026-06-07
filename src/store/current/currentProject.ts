import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '@/model/project';

const initialState: Project = {
  id: '',
  workspace_id: '',
  name: '',
  description: null,
  app_type: 'custom',
  created_at: '',
  updated_at: '',
};

export const currentProjectSlice = createSlice({
  name: 'currentProject',
  initialState,
  reducers: {
    setProject: (_state, action: PayloadAction<Project>) => action.payload,
    updateProjectFields: (state, action: PayloadAction<Partial<Project>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentProjectActions = currentProjectSlice.actions;
export default currentProjectSlice.reducer;
