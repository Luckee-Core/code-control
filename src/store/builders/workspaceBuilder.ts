import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type WorkspaceBuilderState = {
  isProjectModalOpen: boolean;
  editingProjectId: string | null;
};

const initialState: WorkspaceBuilderState = {
  isProjectModalOpen: false,
  editingProjectId: null,
};

const workspaceBuilderSlice = createSlice({
  name: 'workspaceBuilder',
  initialState,
  reducers: {
    openProjectModal: (state, action: PayloadAction<string | null>) => {
      state.isProjectModalOpen = true;
      state.editingProjectId = action.payload;
    },
    closeProjectModal: (state) => {
      state.isProjectModalOpen = false;
      state.editingProjectId = null;
    },
    reset: () => initialState,
  },
});

export const WorkspaceBuilderActions = workspaceBuilderSlice.actions;
export default workspaceBuilderSlice.reducer;
