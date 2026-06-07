import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskCategory } from '@/model';

type CurrentTaskCategoryState = TaskCategory | null;

const initialState: CurrentTaskCategoryState = null;

export const currentTaskCategorySlice = createSlice({
  name: 'currentTaskCategory',
  initialState: null as CurrentTaskCategoryState,
  reducers: {
    setCurrentTaskCategory: (state, action: PayloadAction<TaskCategory | null>) => {
      return action.payload;
    },
    updateCurrentTaskCategoryField: (
      state,
      action: PayloadAction<{ field: keyof TaskCategory; value: any }>
    ) => {
      if (state) {
        (state as any)[action.payload.field] = action.payload.value;
      }
    },
    clearCurrentTaskCategory: (state, _action: PayloadAction<void>) => {
      return null;
    },
  },
});

export const CurrentTaskCategoryActions = currentTaskCategorySlice.actions;
export default currentTaskCategorySlice.reducer;
