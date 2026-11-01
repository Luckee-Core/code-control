import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type WorkspaceBuilderState = {
  isSoftwareSystemModalOpen: boolean;
  editingSoftwareSystemId: string | null;
};

const initialState: WorkspaceBuilderState = {
  isSoftwareSystemModalOpen: false,
  editingSoftwareSystemId: null,
};

const workspaceBuilderSlice = createSlice({
  name: 'workspaceBuilder',
  initialState,
  reducers: {
    openSoftwareSystemModal: (state, action: PayloadAction<string | null>) => {
      state.isSoftwareSystemModalOpen = true;
      state.editingSoftwareSystemId = action.payload;
    },
    closeSoftwareSystemModal: (state) => {
      state.isSoftwareSystemModalOpen = false;
      state.editingSoftwareSystemId = null;
    },
    reset: () => initialState,
  },
});

export const WorkspaceBuilderActions = workspaceBuilderSlice.actions;
export const workspaceBuilderReducer = workspaceBuilderSlice.reducer;
