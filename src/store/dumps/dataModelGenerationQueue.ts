import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DataModelGenerationQueue } from '@/model';

const initialState: DataModelGenerationQueue[] = [];

export const dataModelGenerationQueueSlice = createSlice({
  name: 'dataModelGenerationQueue',
  initialState,
  reducers: {
    setDataModelQueue: (_state, action: PayloadAction<DataModelGenerationQueue[]>) => action.payload,
    addDataModelQueueItem: (state, action: PayloadAction<DataModelGenerationQueue>) => {
      state.push(action.payload);
    },
    updateDataModelQueueItem: (state, action: PayloadAction<Partial<DataModelGenerationQueue> & { id: string }>) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteDataModelQueueItem: (state, action: PayloadAction<string>) => {
      return state.filter(item => item.id !== action.payload);
    },
  },
});

export const DataModelQueueActions = dataModelGenerationQueueSlice.actions;
export default dataModelGenerationQueueSlice.reducer;
