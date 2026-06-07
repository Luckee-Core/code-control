import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RepoTypeFilter = 'express' | 'nextjs' | 'react-native' | 'shared' | null;

type TaskCategoryBuilderState = {
  selectedRepoType: RepoTypeFilter;
  isLoading: boolean;
  isModalOpen: boolean;
  editingCategoryId: string | null;
};

const initialState: TaskCategoryBuilderState = {
  selectedRepoType: null,
  isLoading: false,
  isModalOpen: false,
  editingCategoryId: null,
};

export const taskCategoryBuilderSlice = createSlice({
  name: 'taskCategoryBuilder',
  initialState,
  reducers: {
    setSelectedRepoType: (state, action: PayloadAction<RepoTypeFilter>) => {
      state.selectedRepoType = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    openTaskCategoryModal: (state, action: PayloadAction<string | null>) => {
      state.isModalOpen = true;
      state.editingCategoryId = action.payload;
    },
    closeTaskCategoryModal: (state) => {
      state.isModalOpen = false;
      state.editingCategoryId = null;
    },
  },
});

export const TaskCategoryBuilderActions = taskCategoryBuilderSlice.actions;
export default taskCategoryBuilderSlice.reducer;
