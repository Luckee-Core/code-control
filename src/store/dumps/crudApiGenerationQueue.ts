import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CrudApiGenerationQueue } from '@/model/crud-api-generation-queue';

const initialState: CrudApiGenerationQueue[] = [];

export const crudApiGenerationQueueSlice = createSlice({
  name: 'crudApiGenerationQueue',
  initialState,
  reducers: {
    setCrudApiQueue: (_state, action: PayloadAction<CrudApiGenerationQueue[]>) =>
      action.payload,
    addCrudApiQueueItems: (state, action: PayloadAction<CrudApiGenerationQueue[]>) => {
      state.push(...action.payload);
    },
    updateCrudApiQueueItem: (state, action: PayloadAction<CrudApiGenerationQueue>) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCrudApiQueueItem: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    reset: () => initialState,
  },
});

export const CrudApiQueueActions = crudApiGenerationQueueSlice.actions;
export const crudApiGenerationQueueReducer = crudApiGenerationQueueSlice.reducer;
export default crudApiGenerationQueueSlice.reducer;
