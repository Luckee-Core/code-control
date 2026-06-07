import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BuildFoundationBuilderState = {
  selectedProfileId: string | null;
  selectedConventionIds: string[];
  isCreatingPR: boolean;
  selectedARDTaskIds: string[];
  isGeneratingARDs: boolean;
};

const initialState: BuildFoundationBuilderState = {
  selectedProfileId: null,
  selectedConventionIds: [],
  isCreatingPR: false,
  selectedARDTaskIds: [],
  isGeneratingARDs: false,
};

export const buildFoundationBuilderSlice = createSlice({
  name: 'buildFoundationBuilder',
  initialState,
  reducers: {
    setSelectedProfileId: (state, action: PayloadAction<string | null>) => {
      state.selectedProfileId = action.payload;
    },
    setSelectedConventionIds: (state, action: PayloadAction<string[]>) => {
      state.selectedConventionIds = action.payload;
    },
    toggleConvention: (state, action: PayloadAction<string>) => {
      const index = state.selectedConventionIds.indexOf(action.payload);
      if (index !== -1) {
        state.selectedConventionIds.splice(index, 1);
      } else {
        state.selectedConventionIds.push(action.payload);
      }
    },
    setIsCreatingPR: (state, action: PayloadAction<boolean>) => {
      state.isCreatingPR = action.payload;
    },
    toggleARDTask: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const i = state.selectedARDTaskIds.indexOf(id);
      if (i === -1) state.selectedARDTaskIds.push(id);
      else state.selectedARDTaskIds.splice(i, 1);
    },
    setSelectedARDTaskIds: (state, action: PayloadAction<string[]>) => {
      state.selectedARDTaskIds = action.payload;
    },
    setIsGeneratingARDs: (state, action: PayloadAction<boolean>) => {
      state.isGeneratingARDs = action.payload;
    },
    resetBuildFoundationBuilder: () => {
      return initialState;
    },
  },
});

export const BuildFoundationBuilderActions = buildFoundationBuilderSlice.actions;
export const buildFoundationBuilderReducer = buildFoundationBuilderSlice.reducer;
