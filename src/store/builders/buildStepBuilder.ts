import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BuildStepBuilderState = {
  selectedRepoType: 'express' | 'nextjs' | 'react-native' | null;
  isLoading: boolean;
  isModalOpen: boolean;
  editingStepId: string | null;
};

const initialState: BuildStepBuilderState = {
  selectedRepoType: null,
  isLoading: false,
  isModalOpen: false,
  editingStepId: null,
};

export const buildStepBuilderSlice = createSlice({
  name: 'buildStepBuilder',
  initialState,
  reducers: {
    setSelectedRepoType: (state, action: PayloadAction<'express' | 'nextjs' | 'react-native' | null>) => {
      state.selectedRepoType = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    openBuildStepModal: (state, action: PayloadAction<string | null>) => {
      state.isModalOpen = true;
      state.editingStepId = action.payload;
    },
    closeBuildStepModal: (state) => {
      state.isModalOpen = false;
      state.editingStepId = null;
    },
  },
});

export const BuildStepBuilderActions = buildStepBuilderSlice.actions;
export default buildStepBuilderSlice.reducer;
