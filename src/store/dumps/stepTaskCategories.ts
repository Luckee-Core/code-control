import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StepTaskCategory } from '@/model';

type StepTaskCategoriesState = Record<string, StepTaskCategory>;

const initialState: StepTaskCategoriesState = {};

export const stepTaskCategoriesSlice = createSlice({
  name: 'stepTaskCategories',
  initialState,
  reducers: {
    setStepTaskCategories: (state, action: PayloadAction<StepTaskCategory[]>) => {
      const newState: StepTaskCategoriesState = {};
      action.payload.forEach((mapping) => {
        newState[mapping.id] = mapping;
      });
      return newState;
    },
    addStepTaskCategory: (state, action: PayloadAction<StepTaskCategory>) => {
      state[action.payload.id] = action.payload;
    },
    removeStepTaskCategory: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const StepTaskCategoriesActions = stepTaskCategoriesSlice.actions;
export default stepTaskCategoriesSlice.reducer;
