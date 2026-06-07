import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskCategory } from '@/model';

type TaskCategoriesState = Record<string, TaskCategory>;

const initialState: TaskCategoriesState = {};

export const taskCategoriesSlice = createSlice({
  name: 'taskCategories',
  initialState,
  reducers: {
    setTaskCategories: (state, action: PayloadAction<TaskCategory[]>) => {
      const newState: TaskCategoriesState = {};
      action.payload.forEach((category) => {
        newState[category.id] = category;
      });
      return newState;
    },
    addTaskCategory: (state, action: PayloadAction<TaskCategory>) => {
      state[action.payload.id] = action.payload;
    },
    updateTaskCategory: (state, action: PayloadAction<TaskCategory>) => {
      state[action.payload.id] = action.payload;
    },
    removeTaskCategory: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const TaskCategoriesActions = taskCategoriesSlice.actions;
export default taskCategoriesSlice.reducer;
