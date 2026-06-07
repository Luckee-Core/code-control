import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConventionTaskCategory } from '@/model';

type ConventionTaskCategoriesState = ConventionTaskCategory[];

const initialState: ConventionTaskCategoriesState = [];

export const conventionTaskCategoriesSlice = createSlice({
  name: 'conventionTaskCategories',
  initialState,
  reducers: {
    setConventionTaskCategories: (state, action: PayloadAction<ConventionTaskCategory[]>) => {
      return action.payload;
    },
    addConventionTaskCategory: (state, action: PayloadAction<ConventionTaskCategory>) => {
      state.push(action.payload);
    },
    removeConventionTaskCategory: (state, action: PayloadAction<string>) => {
      return state.filter((c) => c.id !== action.payload);
    },
  },
});

export const ConventionTaskCategoriesActions = conventionTaskCategoriesSlice.actions;
export default conventionTaskCategoriesSlice.reducer;
